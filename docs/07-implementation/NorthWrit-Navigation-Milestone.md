# NorthWrit navigation milestone

Date: November 16, 2026

## Scope

Before Phase 4, organize the existing web and Electron experience around four primary destinations. This is a navigation and terminology milestone, not a new matter data model or a change to authorization.

| Destination | Available sections | Existing routes retained |
| --- | --- | --- |
| Assistant | Chat and recent conversations; existing drafting and review interactions | `/assistant`, `/assistant/chat/:id` |
| Matters | Documents, Conversations, Reviews | `/projects` and all nested routes |
| Library | Files, Templates, Playbooks | `/library`, `/library/templates`, `/playbooks` |
| Workflows | Saved workflows, Reviews | `/workflows`, `/tabular-reviews` |

Settings and Account remain at the bottom. Administration is shown there only for the active organization's owners and administrators. Members retain their existing organization settings access through Account and Settings. IDE remains available through Settings → Advanced and its existing `/ide` URL.

The recent activity section includes conversations, reviews and playbook runs, so it is labelled Recent activity. Recent Projects becomes Recent Matters. Existing matter work opens on Documents; an Overview page is deferred until it has useful content. Do not add empty Research or Draft tabs or imply unverified AI capabilities.

## Implementation sequence

1. Record navigation ownership and update the implementation plan and user guide.
2. Reduce the primary sidebar to Assistant, Matters, Library and Workflows; preserve nested-route selection and collapsed accessible names.
3. Group Library and Workflows with shared section navigation; retain deep links, filters and existing feature access.
4. Apply matter terminology to the project workspace's visible copy without changing API contracts, stored identifiers or permission logic.
5. Move IDE discovery into Settings → Advanced; expose role-aware Administration at the sidebar bottom.
6. Review the diff and run navigation, permission and affected component tests, web type checking/lint, repository checks and browser smoke checks where the local environment permits.

## Acceptance and boundaries

- All four primary destinations work with expanded, collapsed and mobile navigation.
- Existing document, conversation, review, template, playbook and workflow links remain usable.
- Active destinations stay correctly selected on nested and legacy routes.
- Keyboard focus, accessible names and current-page state are preserved.
- No new API, database migration, permission grant or deployment is part of this milestone.
- Electron loads the shared web UI; native packaging and release are outside this change.
- Phase 4 remains not started. Its matter metadata and access acceptance criteria still apply.

## Verification

Implemented in the local working tree on November 16, 2026. The sidebar, grouped section navigation, matter workspace copy, role-aware Administration and Settings → Advanced entry are complete. The user guide and implementation plan now describe this milestone.

Verification:

- 281 affected tests passed across 30 files, including route grouping, nested selection, collapsed names, owner/admin/member visibility, workspace switching, matter creation/sharing, memory conflict recovery and Library behavior.
- Web type checking and production build passed. The build retains the existing CSS `::highlight` optimization warning.
- Web lint passed with zero errors and 29 existing warnings.
- Repository checks passed with nine workspace entries and 244 local links; branding and whitespace checks passed.
- Playwright checked the production UI at `/projects`, `/library`, `/library/templates`, `/playbooks`, `/workflows`, `/tabular-reviews` and `/settings/advanced`; mobile sidebar access passed at 390 × 844. Desktop captures used 1440 × 1000.
- The actual Linux Electron window loaded the updated Library navigation. This verifies the shared UI, not a new desktop installer or native release.
- Screenshots were visually inspected after animations settled. Private browser state and local screenshots remain outside Git.

No AI execution, deployment or Phase 4 implementation was performed. Existing competitor-research documentation in the working tree was preserved.

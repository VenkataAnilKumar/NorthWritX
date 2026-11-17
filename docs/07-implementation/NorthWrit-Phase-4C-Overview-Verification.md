# Phase 4C — Matter Overview and settings verification

Prepared November 17, 2026 on baseline `ba2a87e`. Status: implemented Overview/settings subset; the complete Phase 4C source journey and overall Phase 4 acceptance remain pending. No deployment, publication, model execution or migration of the running demo database is part of this increment.

## Plan and implementation

Expose the [4B metadata contract](NorthWrit-Phase-4B-Metadata-Verification.md) through a useful Matter Overview and the existing details modal. Reuse project IDs, detail loading, workspace placement and effective-role checks. The [4A contract](NorthWrit-Phase-4A-Matter-Contracts-Fixtures.md), [navigation direction](../05-design/NorthWrit-Feature-Navigation.md) and existing design-system primitives govern this subset.

- Add `/projects/:id/overview` alongside Documents, Conversations and Reviews. Existing `/projects/:id` and folder/document URLs retain their meaning. No primary destination or placeholder section is added.
- Show client name, reference, practice, jurisdiction, business status and workspace from authorized project detail. Missing legacy values read “Not specified”; show loading placeholders and an unavailable state without inventing metadata. Long values wrap within the reading surface.
- Extend the existing details modal with client name, jurisdiction and status. Editing requires current `access.manage`; viewer/editor controls remain read-only and the API independently enforces the same rule. The Overview editing action is owner-only, with a directly visible, wrapping action on narrow screens.
- Validate the 200/100 Unicode code-point limits, preserve failed-save drafts, support explicit null clearing and send new metadata only when changed. Update the loaded detail after saving; a response for a departed matter cannot overwrite another matter's state.
- Preserve explicit separation of status from archive/legal hold. Reuse the opaque glass card, form fields, modal/select controls, focus indicators and responsive toolbar. Matter tabs scroll within their available width rather than overlap the mobile actions control.

## Review and tests

The real-browser owner flow caught a success announcement disappearing when the saved response refreshed parent state. Fixed initialization so “Updated” survives that refresh; a component regression test now exercises the parent update. Screenshots also informed the narrow-width toolbar adjustment. A nested mobile-menu/modal interaction intercepted Escape; the Overview edit action now sits directly in its wrapping heading rather than inside that menu.

Verification includes component tests for legacy blanks, full long values, read-only controls, sparse clearing, validation, successful refresh, loading and unavailable states; existing workspace/memory suites remain relevant. Run the focused suites plus web architecture checks with the standard generated Next type references restored after isolated runtime testing.

The [synthetic browser spec](../../tests/browser/e2e/matter-overview.spec.ts) runs the actual Next/React renderer with all `/api` requests intercepted. Owner and viewer journeys cover keyboard opening, editing/clearing and visible saved feedback, no viewer write action, mobile editing access, 390-pixel layout, explicit dark theme, reduced-motion media, forced-colour rendering and navigation back to the existing Documents URL. It rejects uncaught page errors and captures synthetic screenshots. It belongs to Playwright's existing `synthetic` project and needs no account, backend or AI model.

Local runtime: separate source server on port 3002; system Chromium via a temporary Playwright configuration. The older preview on port 3000 lacks this route and was left unchanged. Disk pressure required a task-owned RAM build directory and temporary local config/module links; restore configuration/type references and stop/remove only that test runtime afterward. No dependency installation or unrelated resource/volume cleanup is required.

## Recorded results

| Check | Result |
| --- | --- |
| Focused Overview/details/workspace/memory component suites | 31 tests passed across six files |
| Web architecture boundaries | 5 tests passed after restoring standard generated Next type references |
| Synthetic Chromium owner/viewer journeys | 2 passed, including narrow-width direct editing, keyboard opening/closing and Documents navigation |
| Web type check | Passed |
| Web lint | Zero errors; 29 existing warnings |
| Repository, branding, whitespace and local document links | Passed |

## Evidence boundaries and remaining work

Browser stubs establish rendering and client behaviour, not backend authorization, database persistence or actual tenancy isolation. The separate 4B record owns its API/SQL evidence; these browser cases do not substitute for a real two-user/two-organization runtime journey. Automated focus/viewport checks and screenshots do not establish full WCAG conformance or screen-reader acceptance. Production build, real Office host and desktop packaging are not tested here.

Upload/processing recovery, authorized source selection/search and the broader source-to-work-product journey remain the rest of 4C–4E. Named reviewers, selected ethical-wall policy and other unresolved Phase 2/4A decisions remain open. Keep live AI deferred; do not declare the entire increment accepted from this UI subset or a commit.

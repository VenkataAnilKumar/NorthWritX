# NorthWrit feature navigation

Updated: November 17, 2026

Status: approved naming and navigation direction. This document defines the proposed information architecture; it does not establish implementation or approve every feature extension. The running application currently has four primary destinations. Agents becomes the fifth when its usable, governed experience is implemented.

## Primary navigation

**Assistant · Matters · Library · Workflows · Agents**

| Destination | Purpose | Availability |
| --- | --- | --- |
| Assistant | Interactive questions, research and drafting | Existing Assistant; expanded research remains planned |
| Matters | Context and deliverables for a specific legal engagement | Existing project-backed workspace; fuller matter model is Phase 4 |
| Library | Reusable files, templates, playbooks and firm knowledge | Existing files/templates/playbooks; governed firm knowledge remains planned |
| Workflows | Repeatable review and drafting processes | Existing saved workflows and reviews; expanded capabilities remain planned |
| Agents | Configure delegated work and monitor execution | Proposed separate primary tab; governed execution is Phase 6 work |

Settings, role-restricted Administration and Account remain at the bottom. In the target design, workflows may invoke agents, and runs can be linked to the relevant matter. These interactions require implementation and acceptance. A workflow defines a repeatable process; an agent is an execution capability with its own access, lifecycle and review controls.

## Proposed sections

| Parent | Section names | Boundary |
| --- | --- | --- |
| Assistant | Chat; Research | Research may expose CiteCheck and Beacon when implemented |
| Matters | Overview; Documents; Conversations; Reviews; Drafts & Approvals; Tasks; Facts & Timeline; Requests | Overview/settings is implemented locally in the [4C subset](../07-implementation/NorthWrit-Phase-4C-Overview-Verification.md); existing Documents/Conversations/Reviews stay available. Other sections and full journey acceptance remain pending |
| Library | Files; Templates; Playbooks; Firm Knowledge | Firm Knowledge means curated, permission-aware content, not unrestricted access to private matters |
| Workflows | Saved Workflows; Review Grid; **Contract Intelligence** | Review Grid builds on existing tabular review; Contract Intelligence groups contract-focused workflows |
| Agents | My Agents; Runs; Schedules; Approvals | Each section is shown only when functional; no empty navigation placeholders |
| Settings | Account; Models & Provider Keys; Memory; Connectors; Appearance; Security; Advanced | Proposed grouping; current settings labels/routes remain authoritative until changed |
| Administration | Members & Access; Shield Policies; Audit; Insights | Shield and Insights are planned; access follows actual roles and policies |

Folio names the planned version-bound draft/approval capability. CiteCheck names citation verification; Beacon names monitoring; Shield names policy enforcement. Use plain-language labels for navigation and show these capability names where their specific behavior is available.

## Navigation ownership and scope

These are views of shared resources, not duplicate stores or new permission grants:

- **Matter Reviews** lists reviews associated with the selected matter. **Workflows → Review Grid** is the cross-matter entry for review setup and authorized review results. Opening the same review from either place retains its ID, evidence, version and access checks.
- **Library → Playbooks** owns reusable rule definitions. **Workflows → Contract Intelligence** selects approved rules and sources for a contract workflow; it does not create a second playbook library.
- **Workflows → Saved Workflows** owns reusable process definitions. **Agents → Runs** owns the execution view. A workflow invocation should link to the same run, not duplicate its history.
- **Matter Drafts & Approvals / Folio** reviews a work-product version. **Agents → Approvals** reviews an executable plan/action/payload. One approval does not automatically authorize the other.
- Matter-scoped runs must preserve the selected matter and authorized resources. Any supported run outside a matter needs an explicit workspace/resource scope; it cannot silently inherit broader access. Schedules recheck scope at execution time and account for owner offboarding.

Do not introduce Tasks, Requests, Facts & Timeline, Firm Knowledge or Insights solely to fill the navigation. Each needs a separately defined functional increment. Settings labels above are group proposals, not instructions to remove current settings or change existing routes.

## Contract Intelligence

The approved product/section name is **Contract Intelligence**, replacing the proposed navigation label “Contract Review.” Ordinary descriptions of reviewing a contract remain valid.

Its proposed scope includes:

- Contract review and playbook checks.
- Source-backed deviations and proposed redlines.
- Comparison across negotiation rounds.
- Obligation and key-date extraction.
- Portfolio insights and precedent comparisons.

These are not all delivered today. Existing playbook, tabular review, document-version and Word editing building blocks need model/client acceptance. Integrated contract review belongs with Phase 5 evidence-backed legal work. Negotiation intelligence, operational obligation tracking and portfolio analytics are extensions needing separate scope decisions. The section name alone does not establish a contract lifecycle management product.

## Agents

In the approved target design, Agents is a separate main destination rather than a subsection of Workflows. It is not yet part of the running navigation.

- **My Agents:** owned and shared definitions the user is authorized to use, with instructions, permitted tools and access.
- **Runs:** progress, outputs, failure states and cancellation for authorized runs.
- **Schedules:** recurring execution with explicit scope, ownership and revocation behavior.
- **Approvals:** plans/actions that require human authorization under actual policy.

Schedule creation and execution must recheck current permissions. Approval must correspond to the actual plan/action/payload, and retries must avoid duplicate external effects. A dedicated Approvals section does not replace approval at the point of action or imply every operation universally requires approval.

## Platform comparison

These are functional counterparts, not claims about each vendor's exact sidebar or NorthWrit feature parity.

| NorthWrit destination/feature | Harvey counterpart | Filevine / LOIS counterpart | Clio counterpart |
| --- | --- | --- | --- |
| Assistant | Assistant/Threads, Knowledge | LOIS analysis, research and drafting | AI research, analysis and drafting |
| Matters | Spaces and client matters | Case/matter workspace | Matter management |
| Library | Vault and Knowledge Bases | Documents and reusable firm resources | Documents and templates |
| Workflows | Workflows and Review Tables | Case workflows and Routines | Intake/document/practice automation |
| Agents | Agents and Agent Builder | LOIS agents, Skills and Routines | AI-assisted operations; equivalent standalone builder not verified |
| Contract Intelligence | Contract Intelligence | LOIS contract work and document workflows | Contract/document drafting and practice workflows; portfolio intelligence parity not established |
| Connectors | Connector Library/Ecosystem | Integrations | App integrations/APIs |
| Administration / Insights | Command Center and access controls | Administration/reporting | Firm administration/reporting |

See the [current implementation map](../03-market/NorthWrit-Harvey-Implementation-Map.md) for detailed evidence and gaps, and the [three-platform comparison](../03-market/NorthWrit-Harvey-Filevine-Clio-Comparison.md) for vendor research boundaries.

## Delivery rules

Preserve existing routes, stored IDs, permissions, data and package boundaries during implementation. Show only functioning sections; do not rename a source requirement ID or treat a naming decision as a completed feature. Web/Desktop share navigation; Word remains its own client with documented scope limits. [The implementation plan](../07-implementation/NorthWrit-Implementation-Plan.md) governs delivery order.

# Phase 2A — Pilot scope proposal

Prepared November 16, 2026 from roadmap commit `f3a9809`. Status: reviewable scope recommendation, not a completed Phase 2 gate or release authorization. This document does not replace the historical commercial pilot charter or establish a signed evaluation agreement.

## Target and outcomes

Target users are lawyers/reviewers and firm administrators in Canadian firms and in-house legal teams. Initial validation uses synthetic documents and isolated accounts. Actual pilot participants, named product/legal reviewers, permitted real data and commercial terms remain undecided.

Two connected legal journeys are proposed:

1. **Contract journey:** matter → authorized source versions → cited Review Grid/playbook findings → proposed draft/redlines → lawyer approval of the exact version → DOCX export.
2. **Research journey:** matter facts and research scope → permitted Canadian authorities → cited memo and CiteCheck states → reviewed output → governed run trail/checkpoints → approved export.

Both journeys require negative access, policy, changed-evidence, approval and failure cases. Generic model output or a polished screenshot cannot establish completion.

## Scope baseline

Retain all **38 P0 requirements** from the existing disposition. Recommend seven P1 requirements to support the selected contract/Overview experience. This is a recommendation for product review, not a silent change to priorities, phase allocations or acceptance status.

| Recommended P1 | Requirement | Reason | Existing allocation |
| --- | --- | --- | --- |
| RV03 | Review Grid | Cited structured contract findings | 5 |
| DR01 | Draft from Precedent | Draft from approved precedent/context | 5 |
| DR02 | Playbooks | Reusable contract positions and fallbacks | 5 |
| DR03 | Playbook Check and Redline | Review deviations and propose redlines | 5 |
| DR04 | Redline Report | Reviewable change report | 5 |
| MT06 | Matter Dashboard | Useful matter Overview and work status | 4 |
| SA11 | Ethical Walls | Explicit boundary decisions for sensitive matter access; external wall-provider sync is separate | 4 |

SA12 Canadian Residency is a **conditional requirement**: if the selected pilot promises or needs Canadian processing, select it and require deployment/processor evidence before any corresponding real-data use. No current residency guarantee is established. Other client/data-handling constraints can similarly make a control necessary regardless of its priority label.

The proposal is therefore **38 P0 + 7 recommended P1**, with additional conditional controls only after the actual data/deployment profile is chosen. Remaining P1/P2 features are not selected by this proposal; existing after-pilot allocations remain unchanged. This is not a claim that all 45 items are already implemented.

## First-pilot exclusions and boundaries

Do not assume inclusion of rich Agent Studio, recurring schedules, new intake channels/Requests, a client self-service portal, portfolio benchmarking, full fact graphs, Beacon, native mobile, Outlook, a visual Flow Builder, billing or a public marketplace. They remain in the candidate backlog or existing deferred allocation. The P0 governed run contract still requires AG01–AG03; excluding a rich agent builder does not exclude execution controls.

Baseline clients are web and Electron, with native packaging/signing validated separately before distribution. Word remains a selected client extension, not implied by passing its build. Existing Word Personal-only/context/history limits remain documented until actual client scope changes are accepted.

## Acceptance evidence

| Concern | Required evidence |
| --- | --- |
| Access and scope | Isolated users, organizations and private/shared matters; allowed and denied UI/API/search/jobs/download/export cases; revocation while queued and before publication |
| Ingestion and versions | PDF and DOCX fixtures, processing failures, replacement/version continuity and downloaded-byte verification |
| Contract output | Findings and proposed changes checked against exact source passages/versions and selected playbook rules; missing/failed extraction remains visible |
| Research and CiteCheck | Permitted-source coverage and a versioned legal evaluation set covering supported, unsupported, contradicted and unavailable claims; no invented authority/citator entitlement |
| Approval and policy | Editing output/evidence invalidates dependent review; approval binds the actual payload; blocked routes fail closed; retries do not duplicate external effects |
| Execution | Run trail, checkpoints, cancellation/failure/recovery behavior and authorization at execution boundaries |
| User experience | Accessible focus/keyboard/contrast, mobile bounds, loading/error/empty states, stable context and usable exports |
| Operations | Measured capacity/cost targets, upgrade/rollback and restore evidence; no unsupported performance or security guarantee |

Numeric quality, latency, cost and capacity thresholds must be set before their acceptance run with the named legal/operations reviewers. They are not invented in this scope document. No unresolved critical security or data-loss defect is acceptable at pilot acceptance.

## Open decisions

| Decision | Current state | Gate |
| --- | --- | --- |
| Participant/use-case and named reviewers | Unassigned | Confirm before final scope acceptance |
| Seven recommended P1 inclusions | Proposed | Product/domain scope review |
| Real-data classification, residency and processor terms | Not selected | Before real-data/provider or deployment acceptance |
| Model/provider and legal-source access | AI verification deliberately deferred | Before model-dependent legal acceptance; model-free 2B/4A planning can proceed |
| Supported client/installer profile | Web/Electron recommendation; native distribution unresolved | Before client/release acceptance |
| Named owners and effort estimates | Role ownership exists; people/estimates pending | Before each implementation increment |

## Requirement register

This register is generated from the existing disposition. It lists P0 baseline requirements and recommended P1 additions without changing the specification or allocation. See the [phased delivery plan](NorthWrit-Phased-Delivery-Plan.md) and [implementation plan](NorthWrit-Implementation-Plan.md) for dependencies and phase gates.

| ID | Requirement | Priority | Allocation | Scope decision |
| --- | --- | --- | --- | --- |
| AS01 | Pinpoint Cites | P0 | 4 | Baseline target |
| AS02 | Model Picker | P0 | 4 | Baseline target |
| AS03 | Save to Matter | P0 | 4 | Baseline target |
| RS01 | Answer Engine | P0 | 5 | Baseline target |
| RS02 | Bearings | P0 | 5 | Baseline target |
| RS03 | Source Filters | P0 | 5 | Baseline target |
| RS04 | Source Labels and Synthesis | P0 | 5 | Baseline target |
| RS05 | CiteCheck | P0 | 5 | Baseline target |
| RS06 | Research Memo | P0 | 5 | Baseline target |
| RV01 | Smart Upload | P0 | 4 | Baseline target |
| RV02 | Document Versions | P0 | 4 | Baseline target |
| RV03 | Review Grid | P1 | 5 | Recommended; not yet accepted |
| DR01 | Draft from Precedent | P1 | 5 | Recommended; not yet accepted |
| DR02 | Playbooks | P1 | 5 | Recommended; not yet accepted |
| DR03 | Playbook Check and Redline | P1 | 5 | Recommended; not yet accepted |
| DR04 | Redline Report | P1 | 5 | Recommended; not yet accepted |
| MT01 | Matter Workspace | P0 | 4 | Baseline target |
| MT02 | Matter Instructions | P0 | 4 | Baseline target |
| MT03 | Privacy Setting | P0 | 5 | Baseline target |
| MT06 | Matter Dashboard | P1 | 4 | Recommended; not yet accepted |
| SO01 | Northwrit Search | P0 | 4 | Baseline target |
| SO02 | Folios | P0 | 4 | Baseline target |
| SO03 | Review States | P0 | 5 | Baseline target |
| SO04 | Folio History | P0 | 4 | Baseline target |
| SO05 | Export (DOCX) | P0 | 4 | Baseline target |
| AG01 | Research-to-Memo Workflow | P0 | 6 | Baseline target |
| AG02 | Run Trail | P0 | 6 | Baseline target |
| AG03 | Checkpoints | P0 | 6 | Baseline target |
| CN01 | Provider Adapters | P0 | 5 | Baseline target |
| SH01 | Processing Policy | P0 | 5 | Baseline target |
| SH02 | Model Gateway | P0 | 5 | Baseline target |
| SH03 | Shield Log | P0 | 5 | Baseline target |
| SH04 | Outbound Boundary | P0 | 5 | Baseline target |
| SA01 | Tenant Isolation and Authorization | P0 | 4 | Baseline target |
| SA02 | Encryption | P0 | 5 | Baseline target |
| SA03 | Multi-Factor Sign-in | P0 | 4 | Baseline target |
| SA04 | No Training | P0 | 5 | Baseline target |
| SA05 | Retention and Deletion | P0 | 5 | Baseline target |
| SA06 | Rate Limits and Budgets | P0 | 4 | Baseline target |
| SA07 | Users and Roles | P0 | 4 | Baseline target |
| SA08 | Model Policy | P0 | 4 | Baseline target |
| SA09 | Audit Trail | P0 | 5 | Baseline target |
| SA11 | Ethical Walls | P1 | 4 | Recommended; not yet accepted |
| CU01 | Preferences | P0 | 4 | Baseline target |
| QA01 | Northwrit Bench | P0 | 7 | Baseline target |

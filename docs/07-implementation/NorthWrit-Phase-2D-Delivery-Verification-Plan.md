# Phase 2D — Delivery and verification plan

Prepared November 16, 2026 against committed planning baseline `67ac004` and the local Phase 2C draft. Status: proposed delivery controls and verification strategy; named assignees, scope decisions and acceptance remain pending. This document completes the draft set of Phase 2 planning outputs, not Phase 2 sign-off. It does not start Phase 4, run live AI or authorize deployment/publication.

## Authority and delivery order

The [implementation plan](NorthWrit-Implementation-Plan.md) owns the roadmap. The [phased delivery plan](NorthWrit-Phased-Delivery-Plan.md) owns increment sequencing and the unchanged 105-requirement allocation. The [Phase 2A proposal](NorthWrit-Phase-2A-Pilot-Scope.md), [2B architecture assessment](NorthWrit-Phase-2B-Architecture-Principles.md) and [2C experience contracts](NorthWrit-Phase-2C-Experience-AI-Evidence-Contracts.md) supply scope and design decisions. P0/P1/P2 are priorities, not phase numbers.

Preserve completed Phase 1/3 and repository/UI work. Prepare 4A first, then deliver the dependent Phase 4, 5 and 6 increments in their recorded order and complete Phase 7 consolidated acceptance. Some independent planning can overlap; implementation cannot bypass its prerequisite decisions or checks. Phases 8–11 remain conditional proposals. No requirement is moved into Phase 2 or silently selected by this plan.

## Work-package record

Use one reviewable record per increment, linked from its PR and the roadmap. The following fields are mandatory before implementation; an unresolved field needs an explicit effect and resolution gate rather than an invented value.

| Field | Required content |
| --- | --- |
| Identity and baseline | Increment, branch/commit, application/schema baseline and linked decisions |
| User outcome and scope | Concrete journey, requirement IDs, selected P1/P2 inclusions, exclusions and observable before/after behaviour |
| Ownership | Named implementer and reviewer; product/legal/security/operations review where affected; role labels alone do not close assignment |
| Design impact | Existing modules/packages reused, API producer/consumer changes, UI/client boundaries, authorization and source/version implications |
| Data change | Schema/migration/backfill and legacy mapping if applicable; explicit “none” otherwise; supported upgrade baselines and rollback/forward-repair approach |
| Dependencies | Decisions needed before design/code versus configuration needed before acceptance; provider/source rights and deployment profile where applicable |
| Fixtures and assertions | Synthetic inputs, actor/resource matrix, expected permitted/denied results and relevant failure/concurrency cases |
| Verification | Exact commands/environment, expected outcomes, required integration/client evidence, legal rubric and limits of mocks |
| Recovery and operations | Retry/idempotency, cancellation, safe failure, monitoring, data compatibility and rollback/recovery evidence |
| Effort and disposition | Assumption-based effort range after technical assessment, unresolved risks, reviewer outcomes and evidence links |

Do not estimate dates or assign people from inference. Record changes to scope and decisions in the package and update the authoritative requirement/disposition documents when an approved change affects them.

## Evidence record and status rules

Each acceptance record identifies requirement IDs and scenario, exact tested commit, command/test case, environment/runtime/client versions, fixture revision, expected and observed result, safe evidence link, date and named reviewer. Record migrations, provider/model/policy version and permitted source configuration where relevant. Keep credentials, signed URLs, authenticated browser state and real client data out of committed evidence.

Use these reporting categories consistently; they are planning/reporting labels, not application run states:

- **Planned:** assertion and evidence collection are defined but not executed.
- **Blocked:** required configuration, decision or environment is unavailable; name the dependency and resolution gate.
- **Passed / Failed:** the recorded assertion was executed on the stated baseline and matched / did not match its expected result.
- **Not selected:** the feature is explicitly outside the agreed package; give the scope decision. This cannot remove a P0 pilot requirement by implication.
- **Accepted:** required assertions have passed and the named reviewers recorded acceptance with remaining non-blocking limits. A successful command alone does not establish this status.

Document checks prove documentation consistency. Unit tests prove their scoped assertions. Mocks prove simulated transport/state behaviour. Screenshots illustrate the tested view. None alone proves isolation, legal quality, deployment residency or actual Office/native release behaviour. A changed implementation or fixture requires rechecking affected evidence; historical results remain attributed to their original baseline.

## Verification layers and CI gaps

Use existing root aliases and the [CI inventory](NorthWrit-CI-Inventory.md). Follow [application instructions](../../apps/AGENTS.md) for changed code. This is a selection guide, not an instruction to run every suite for documentation.

| Change or acceptance boundary | Required verification | Current automation / missing evidence |
| --- | --- | --- |
| Documentation/repository rules | `npm run check:repo`, `npm run check:branding`, `npm run check:whitespace`; check new-document links and scope/state claims | Root repository job covers repository guards; manual source/contract review still needed |
| API/shared contracts | Affected API tests, production/test/contract type checks and build; producer/consumer compatibility | Root API job provides ordinary checks; service/database guarantees need integration evidence |
| Web experience | Affected tests, lint, type check/build and scoped browser assertions; accessible focus/status/error handling | Root web job covers ordinary checks; no complete legal journey is established by unit/build CI |
| Worker/runtime | Affected API/worker tests and build; authorization at execution, retry/cancellation and restart cases | Existing worker process tests are useful; future governed-run durability needs its own tests |
| Schema/access | Fresh and supported-upgrade databases, migration ledger/drift, RLS and direct API/job/download/export denial cases | Stack/schema-drift gates need adaptation with isolated services before migration acceptance |
| Container inputs | Build affected images when Dockerfiles, build context, tsconfig or cross-app imports change | Root container workflow builds images without pushing; host build success is insufficient |
| Word/Electron | Relevant host/desktop tests plus real Office-host or native package tests for selected promises | Word build/HTTP host tests and shared web tests do not establish real-client parity, signing or distribution |
| AI/legal/source rights | Approved provider/route and permitted sources, fixed evaluation set, legal rubric and measured outcomes | Live AI remains deferred; stubs cannot satisfy this layer |
| Operations/security | Selected threat/revocation tests, numerical performance budgets, restore/upgrade/recovery exercises and reviewed provider/region evidence | Additional adopted gates/evidence required; certification and commercial guarantees are not inferred |

Adapt missing gates in the increment that needs them, preserving required-check names and nonzero exit statuses. Do not disable checks or treat skipped/absent jobs as proof of their assertions. Investigate relevant failures and distinguish inherited issues with evidence; unresolved critical security/data-loss defects prevent pilot acceptance.

## Synthetic fixture and isolation contract

Use a separately identified test environment and synthetic data with at least two users, two organizations and multiple matters, including two matters within one organization. Cover Personal scope, direct sharing, private/organization resources, distinct organization/item roles, owner/admin exceptions, membership changes and revoked users. Expected access must follow the reviewed policy rather than an assumed universal owner rule.

Include authorized and denied UI/direct API/search/job/download/export paths; queue a job before revocation and recheck at execution/publication. Record signed-download capability lifetime separately from application authorization. Cover an older supported schema and legacy resource mappings, valid/corrupt PDF/DOCX, processing failure, exact source versions, unrelated uploads, evidence replacement and concurrent edits.

For selected AI work, include supported, unsupported, contradicted and unavailable evidence; unavailable/denied model routes; version/payload changes between approval and delivery; failed/retried external actions. Agree legal thresholds, units/denominators and source coverage before evaluation. Assert policy denial without sending content to a forbidden provider. Measure model quality only after approved configuration is available.

Name test-owned services/resources and retain safe logs for failures. Never restart the archived standalone cloud baseline, run cleanup sweeps, remove unrelated volumes or migrate an existing user database incidentally. Do not treat a broad stack lifecycle command as safe without reviewing its actual configuration and ownership. Live AI remains deferred; no configuration or inference is part of Phase 2D.

## Responsibility and unresolved gates

All named assignees are pending. These role assignments identify who must review, not who has already agreed or approved. The linked 2A/2B/2C registers retain their individual decision states.

| Ref | Deliverable / decision | Responsible roles | Resolution gate and current state |
| --- | --- | --- | --- |
| D01 | Confirm pilot journeys, seven recommended P1 inclusions and exclusions | Product and legal | Before scope acceptance; 2A proposal remains unaccepted |
| D02 | Assign named package owner/reviewer and scope-dependent specialist review | Engineering/product leads | Before each implementation increment; unassigned |
| D03 | Resolve Matter concepts, legacy mapping and access/wall precedence needed for 4A | Domain/API, product and access/security | Before affected 4A design acceptance; 2B B02–B05 open |
| D04 | Specify an isolated database/browser environment and adapt missing gates | QA, API/database and CI engineering | Before database/browser acceptance; inventory identifies gaps, no adaptation executed here |
| D05 | Agree model/provider routes, source rights and legal evaluation protocol | Security/operations and legal/source owner | Before dependent AI acceptance; 2C C03/C04/C06 pending and live AI deferred |
| D06 | Resolve evidence, approval/export and signed-link contracts by increment | Domain/security and legal | Before affected 4A/4D/5C/5E acceptance; 2B/2C target decisions remain pending |
| D07 | Define governed-run persistence, cancellation and retry contracts | API/worker and integrations | Before 6A design/acceptance respectively; no durable-run guarantee accepted |
| D08 | Select supported browser/Word/desktop and any local/offline profile | Product, client engineering and QA | Before client acceptance; current client limits remain in force |
| D09 | Agree measurable capacity/cost/recovery targets and release responsibilities | Operations, engineering and product | Before corresponding evaluation/release acceptance; no estimates or commitments invented |
| D10 | Record reviewer outcomes and affected-gate closure | Named reviewers once assigned | Before declaring Phase 2 or any implementation package accepted; pending |

## Next package: prepare 4A, without implementing it

After the relevant Phase 2 decisions are reviewed, prepare the Matter contracts/fixtures package using the template above. Audit existing project fields and resource access, identify selected Phase 4 requirement IDs, define proposed legal client/reference/jurisdiction/practice/status/team semantics, and compare reuse with the smallest necessary additions. Include old-record examples, fresh/upgrade test design and explicit owner/admin/wall decisions. Detailed field types, migration and wire-contract proposals belong to that package, not an assumed new table or route rename in Phase 2.

Model-free design can proceed independently of deferred model setup. Its AI acceptance remains blocked until configuration and evaluation requirements are met. Before moving to code, record product/domain review, named ownership, affected decision closure and the implementation package. This document does not authorize starting Phase 4.

## Phase 2 handoff and closure

The draft foundation set now covers scope (2A), architecture (2B), experience/AI/evidence (2C) and delivery/verification (2D). Final scope, named ownership and reviewer decisions are still pending. Do not mark Phase 2 complete merely because all four documents exist.

To close the foundation, record accepted outcomes and explicitly deferred decisions with their effect on later gates, trace selected journeys to requirement IDs and owners, and identify the next reviewed package. A later-phase implementation or model test need not be performed during Phase 2; its acceptance dependency must remain visible. No application, schema, CI workflow, deployment or publication is changed by this planning document.

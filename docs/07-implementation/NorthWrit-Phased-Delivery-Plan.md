# NorthWrit phased delivery plan

Reviewed November 16, 2026 against the merged application/UI baseline `38da785` and documentation baseline `8a6ae5c`. This is a planning review, not implementation or acceptance of future features. The [implementation plan](NorthWrit-Implementation-Plan.md) remains the roadmap authority; this document supplies delivery increments, dependencies and gates.

## Review findings and resolutions

| Finding | Resolution |
| --- | --- |
| Model access was listed as a Phase 7 dependency even though earlier journeys require AI | Move initial model validation before AI-dependent acceptance in Phases 4–6. Model-free matter work can proceed; the user's deferred AI verification remains deferred and must not be marked passed |
| Unit/build CI could be mistaken for data/access acceptance | Require scoped real-database, migration and browser evidence in Phase 4; the [CI inventory](NorthWrit-CI-Inventory.md) identifies gates still needing adaptation |
| Broad phase descriptions lacked reviewable work packages | Introduce the ordered increments below, each with explicit entry/exit evidence |
| Naming decisions could imply all proposed tabs/features were committed | Keep Agents separate and Contract Intelligence under Workflows, but show only functional sections and record the accepted subset per increment |
| Phase prose overlapped the 105-feature allocation | Preserve every allocation. Phase 5 prepares legal content; installable Firm Packs CN03 belong to Phase 6. Basic selected fact/timeline/client-room requirements are distinct from a full fact graph, guest delivery or orchestration suite |
| Post-pilot ideas lacked selection gates | Retain 27 deferred requirements and treat Phases 8–11 as conditional proposals, not active delivery commitments |

## Baseline and delivery controls

- Phase 1 audit, Phase 3 integration, repository/workspace preparation, the four-tab navigation, visual identity and floating workspace are complete within their recorded scope.
- Phase 2 is restored as Product and Architecture Foundation. Existing foundation evidence is available; unresolved scope/ownership decisions and reviewer sign-off remain pending. Phase 4 has local metadata, Overview/settings and saved-draft backend/UI implementation subsets; complete journey acceptance is pending. Phases 5–7 remain planned.
- The current application has Assistant, Matters, Library and Workflows. Agents is the approved future fifth tab. Contract Intelligence is the approved proposed contract-focused section under Workflows.
- Source-supported AI, Word and connector paths are not automatically accepted. The synthetic demo verified document/project handling, versions/downloads, workflow configuration and web/Electron views; no live model output was evaluated.
- The [capability matrix](../04-specs/NorthWrit-Capability-Matrix.md) and [feature disposition](NorthWrit-Feature-Disposition.md) retain all 105 IDs and priorities. P0/P1/P2 are not implementation phase numbers.
- All 38 P0 requirements form the baseline pilot target. Each P1/P2 requirement needs a documented pilot inclusion or deferred decision; phase allocation alone does not select it. A control needed for the actual chosen workflow cannot be omitted just because its priority is P1/P2.
- The initial planning task did not authorize implementation. Subsequent user instructions authorized local phased implementation, review, tests and commits; the 4B record states its scope. Credential configuration, live AI tests, deployment, publication and existing user-database migration remain outside this increment.

## Cross-platform feature candidates

The [cross-platform feature backlog](NorthWrit-Cross-Platform-Feature-Backlog.md) maps 32 discussion items from Harvey, Filevine/LOIS and Clio to existing requirement IDs, delivery increments and explicit extensions. It covers Contract Intelligence, Agents, intake, tasks, deadlines, facts/timelines, knowledge, clients and commercial operations. Existing allocations and deferred decisions remain authoritative; the vendor comparison is not a mandate to implement every counterpart.

## Entry package for the next implementation increment

Before code changes, record the selected requirement IDs, named owner, reviewer, API/schema/UI impact, dependencies, synthetic fixtures, acceptance checks, rollback approach and estimated effort range. Role ownership below is provisional; no named assignee or calendar estimate is invented.

Prepare separate synthetic users, organizations and matters, including private/shared resources, role changes and revoked access. Preserve current user data, IDs, package boundaries, source notices and signed-link compatibility. Adapt isolated test services; never restart the archived standalone cloud baseline or clean unrelated resources.

For a model-dependent increment, an approved provider/model, scoped credentials, allowed data route and usage limit are entry evidence. Use synthetic content for initial evaluation. If unavailable, record the blocked acceptance checks and complete only independent work. A stub can test transport/error behavior but cannot satisfy legal-quality or live-inference acceptance.

## Phase 1 — Audit and reconcile (completed baseline)

**Outcome:** source-backed capability/disposition map and known limitations.

Existing evidence: source audit, product catalogue, 105-feature matrix and verification records. Reopen only the affected audit entries when source or requirements change. The newer 94-row [Harvey implementation map](../03-market/NorthWrit-Harvey-Implementation-Map.md) is research input, not a new list of mandatory pilot features.

**Owner:** domain engineering with product/legal review. **Gate:** each selected requirement has code evidence or a stated gap; no source-supported path is called accepted without execution evidence.

## Phase 2 — Product and Architecture Foundation (restored)

The [Phase 2A pilot scope proposal](NorthWrit-Phase-2A-Pilot-Scope.md), [Phase 2B architecture principles](NorthWrit-Phase-2B-Architecture-Principles.md) and [Phase 2C experience, AI and evidence contracts](NorthWrit-Phase-2C-Experience-AI-Evidence-Contracts.md) provide reviewable scope, architecture and behaviour decision registers. The [Phase 2D delivery and verification plan](NorthWrit-Phase-2D-Delivery-Verification-Plan.md) adds work-package templates, evidence rules, test selection and ownership gates. The four draft outputs do not mark Phase 2 complete.

**Entry:** Phase 1 audit evidence and the existing architecture, requirements, design and verification records. This phase is restored to consolidate decisions; it does not invalidate completed Phase 3 integration or move any of the 105 feature IDs into Phase 2.

| Work package | Output | Closure evidence |
| --- | --- | --- |
| 2A — Product and scope | Target users, pilot journeys, selected IDs, exclusions and competitor-inspired extensions | Explicit inclusion/deferred register and success measures; no automatic inclusion of all vendor features |
| 2B — Architecture and domain principles | Existing app/package ownership, high-level firm/matter/resource model and access rules | Evidence-linked blueprint and unresolved-decision register; detailed Matter schema/API remains 4A |
| 2C — Experience and AI contracts | Approved navigation, design system, source/citation/version/approval expectations and provider-routing decisions | Clear current-versus-planned UI, client boundaries and conditional model/source dependencies |
| 2D — Delivery and verification | Requirement-linked work packages, role ownership, test strategy and entry/exit gates | Named reviewers/owners and resolution gates for blockers; no fabricated acceptance or effort/date commitments |

**Owners:** product/domain engineering with legal, design and access/security review. Named assignees remain to be assigned. **Status:** foundation documents exist; final scope decisions and review closure are not established.

**Exit:** selected journeys trace to requirements, domain owners and acceptance evidence. Decisions required by a work package are closed before it starts; unrelated deferred extensions stay out of its gate. Existing repository organization, branding and UI work is reused rather than repeated. Deferred live AI validation is recorded explicitly and is required before dependent AI acceptance, not silently treated as Phase 2 completion evidence.

## Phase 3 — Application integration and maintenance (completed baseline)

**Outcome:** maintainable applications, shared packages, runtime configuration, root workspace and active CI.

Preserve the existing module facades, authoritative root lockfile and backend-owned worker handlers. Repository preparation and UI milestones are completed unnumbered work; do not reopen them as new phases.

**Owner:** repository/application engineering. **Gate:** affected builds/types/tests and existing CI pass. Packaging, legal quality and deployment guarantees remain distinct from build success.

## Phase 4 — Matter foundation and complete source journey (in progress locally)

The [4A Matter contracts and fixtures proposal](NorthWrit-Phase-4A-Matter-Contracts-Fixtures.md) provides the first concrete design package. The [4B metadata verification record](NorthWrit-Phase-4B-Metadata-Verification.md) records local schema/API work and tests; named review and full 4B acceptance remain pending. The [4C Overview/settings record](NorthWrit-Phase-4C-Overview-Verification.md) tracks the local UI and synthetic-browser subset, not the complete source journey. The [source-context verification record](NorthWrit-Phase-4C-Source-Context-Verification.md) adds asynchronous state/version safeguards and scoped regression evidence. The [isolated source journey](NorthWrit-Phase-4-Source-Journey-Verification.md) records fresh-stack model-free integration evidence without closing the full 4E gate. The [4D backend record](NorthWrit-Phase-4D-Backend-Verification.md) adds draft/version/export endpoints and fresh/upgrade evidence; the [4D UI record](NorthWrit-Phase-4D-UI-Verification.md) adds the manual editor, immutable history/restore and selected-revision export UI. The [4E acceptance record](NorthWrit-Phase-4E-Acceptance-Verification.md) tracks the connected model-free journey and the queued-upload authorization fix. Visual comparison, remaining policy/security/legal decisions and full Phase 4 acceptance remain pending.

**Entry:** reviewed work package, selected Phase 4 IDs, isolated database/browser fixtures and the [extension map](NorthWrit-Phase-4-Extension-Map.md). Live AI acceptance additionally requires the model entry package.

| Increment | Deliverable | Dependency and exit evidence |
| --- | --- | --- |
| 4A — Contracts and fixtures | Define matter/client/reference/jurisdiction/practice/status/team fields for the selected scope; audit existing project fields; specify legacy-record mapping and API contracts | Product/domain approval of the data contract, role matrix and positive/negative fixtures before a migration |
| 4B — Matter identity and access | Incremental schema/API changes where required; reuse project IDs/URLs and current role helpers; add selected matter settings | Fresh and supported-upgrade database tests, schema ledger/RLS checks and denied cross-organization/matter access |
| 4C — Overview and source context | Useful Overview, current matter indicator, Documents/Conversations/Reviews, upload/processing states and authorized search | Browser navigation/switching/back links; failure/retry/empty states; sources and versions remain bound to the selected matter |
| 4D — Work product and export | Save outputs, revisions and evidence references; draft/Folio history and DOCX export for the selected Phase 4 contract | Correct source/version links, download/export authorization and documented signed-URL lifetime; editing/history does not imply Phase 5 approval |
| 4E — Matter acceptance | Complete authorized synthetic journey and adversarial two-user/two-matter paths | UI, direct API, search, job, download and export tests; revoke access after queueing and before result publication; record AI-blocked checks separately |

Basic fact sheet, matter templates/dashboard, client rooms and ethical walls have Phase 4 P1 allocations. Select them explicitly. Basic factual context is not an automatically maintained litigation fact graph; authorized shared rooms are not a complete guest self-service product. External ethical-wall-provider synchronization is a separate integration extension. If client sharing is selected, its access and wall acceptance is required before exposure.

**Owners:** API/domain and web engineering; database/access reviewer; product workflow reviewer. **Exit:** the selected matter-to-source-to-draft/export journey works without context loss; unauthorized retrieval and writes are denied, including background and download paths. AI-dependent acceptance stays open until live execution is evidenced.

## Phase 5 — Evidence-backed Canadian legal work (planned)

**Entry:** accepted Phase 4 boundaries, permitted source-access decisions and model evaluation configuration. Plan the legal evaluation rubric before implementation.

| Increment | Deliverable | Exit evidence |
| --- | --- | --- |
| 5A — Policy before sends | Shield routing hooks, permitted providers/tools, audit and selected data handling/region requirements | Disallowed routes and cross-matter data are blocked at execution boundaries; no silent unauthorized fallback |
| 5B — Canadian research | Permitted source adapters, Bearings, filters/provenance and research memo schema | Source-by-source coverage/limitations, failure states and lawyer-reviewed synthetic questions; no inferred CanLII/publisher entitlement |
| 5C — CiteCheck and evidence continuity | Four claim-support states, exact passage/version references and stale-evidence handling | Evaluation cases distinguish Verified, Unverified, Contradicted and Unavailable; a URL alone never satisfies verification; authority treatment is separate |
| 5D — Review Grid and Contract Intelligence | Selected cited extraction, precedents, playbook checks, proposed redlines and output comparison | Generated findings match inspected source evidence; missing/OCR/processing failures are visible; human changes remain distinguishable |
| 5E — Folio approval | Review states bound to exact output versions, evidence and outbound payloads | Output/evidence changes invalidate dependent approval; approval cannot be reused for a different action or version |
| 5F — Legal acceptance | Complete researched/reviewed/drafted/approved work-product journey | Product/legal rubric, named reviewer findings, false-support/error cases and unresolved limits recorded; all selected policy checks pass |

Use reusable legal workflow content here; installable Firm Packs and their distribution/governance belong to Phase 6 CN03/CN06. Timeline SO09 is selected Phase 5 work if included in pilot scope; a full Facts & Timeline graph, negotiation intelligence or obligation-management product needs separate extension acceptance. Portfolio Compare RV07, Beacon RS08 and authority-treatment RS10 remain deferred under the existing disposition unless explicitly re-scoped.

**Owners:** research/document/domain engineering, legal evaluators and policy/security reviewers. **Exit:** source-grounded outputs, meaningful citation states, enforceable routing and durable approval pass the selected rubric. Data residency and no-training claims require deployment/provider evidence, not only code settings.

## Phase 6 — Governed Agents and integrations (planned)

**Entry:** accepted evidence/policy/approval boundaries and selected integrations with verified APIs and credential ownership.

| Increment | Deliverable | Exit evidence |
| --- | --- | --- |
| 6A — Run contract | Actor/workspace/matter/resource scope, versioned inputs, run states, trail, checkpoints, cancellation and bounds | P0 AG01–AG03 journey, permission rechecks, restart/failure behavior, and no duplicate external effects on retry |
| 6B — Agents destination | Functional entry for available agent definitions and Runs; expose Approvals where its reviewed actions work | One execution record shared with workflow/matter entry points; role-aware visibility; no empty placeholder features or duplicate history |
| 6C — Selected document connector | Explicit read/search/import/export or synchronization subset, scoped secrets, revocation and deletion propagation | Authorized, denied, expired/revoked and queued-after-revocation cases; scope is connector-specific |
| 6D — Packs, Word and enterprise scope | Selected prompt/agent library, Firm Packs/governance and Word work; SSO/SCIM or enterprise APIs only if selected | Producer/consumer contracts, real Office-host tests and context boundaries; installation/update/revocation tests for selected Packs |
| 6E — Conditional automation | Schedules, triggers, intake/triage, deadlines and self-service only for included IDs | Schedule identity/time zone/owner changes, authorization at execution, duplicate prevention, escalation and action approval |

The separate Agents tab is approved naming. My Agents, Runs, Schedules and Approvals do not all become mandatory simultaneously; each increment states the functional subset. A visual Agent Studio or no-code Flow Builder is not a prerequisite for the P0 run contract. Existing connectors can execute permitted writes directly when approval is disabled; that is baseline behavior, not proof of the stronger target approval policy. Define and test the selected pilot policy before enabling its integrations.

**Owners:** execution/domain, integration and client engineers with access/security review. **Exit:** selected integrations and agent journeys pass authorization, revocation, approval, cancellation, audit and recovery checks. Rich intake, guest portals and additional DMS adapters are extensions unless included explicitly.

## Phase 7 — Pilot validation and release preparation (planned)

**Entry:** all selected Phase 4–6 gates accepted, requirement traceability complete, pilot capacity/client/deployment profile agreed.

| Increment | Deliverable | Exit evidence |
| --- | --- | --- |
| 7A — Consolidated regression | End-to-end matter/research/review/draft/approval/export/agent journeys | Bench QA01, negative cases and source/model quality results on fixed versioned fixtures |
| 7B — Operations and resilience | Performance baseline, budgets, retries, backup/restore, upgrade/rollback and incident/monitoring procedures | Measured numerical targets and recovery drills; fresh/upgrade schema checks were already required before Phase 4 migration acceptance |
| 7C — Client/accessibility/security | Supported browser matrix, keyboard/contrast/mobile checks, Word host and desktop package tests | Real client evidence; threat/access/data-handling tests; no unresolved critical security/data-loss issue |
| 7D — Release dossier | Pilot scope, excluded features, support owners, processor/region decisions, user/admin guides and release/rollback instructions | Product/legal and security/operations acceptance with known limitations and evidence links |

Preparing a release does not authorize publishing it. Deployment, application distribution, public URLs and production database changes need the separately agreed release action and target. Certification or contractual assurances cannot be inferred from passing CI.

**Owners:** workflow QA, release/operations, client engineering and product/legal/security approvers. **Exit:** selected pilot journeys and operating commitments accepted; no unresolved critical defect; release dossier is reviewable before any deployment decision.

## Conditional post-pilot proposals — Phases 8–11

These numbers are planning labels for the previously discussed future direction. They are not an approved extension of the active Phases 1/2/3/4/5/6/7 roadmap. Pilot feedback and product decisions may reorder or remove them.

| Proposed phase | Candidate scope | Entry / exit decision |
| --- | --- | --- |
| 8 — Pilot learning | Adoption/quality/support feedback, usability improvements and highest-value deferred requirements | Needs authorized pilot evidence; choose measurable user problems and demonstrate improvement |
| 9 — Commercial readiness | Firm onboarding, seats/billing integrations, support and service commitments | Needs validated product demand, operations ownership and legal/commercial terms; no billing platform assumed |
| 10 — Product expansion | Selected native mobile/Outlook, Beacon, advanced facts/chronologies, portfolio intelligence, guest requests or specialist integrations | Requires source/integration rights, customer demand and a separate feature acceptance plan; this list is not a blanket commitment |
| 11 — Scale and assurance | Capacity/concurrency, independent worker scaling, enterprise administration and justified assurance programs | Requires measured load or ownership pressure; record architectural decisions before service/repository extraction; no automatic certification promise |

## Work-package definition of done

Each increment records requirement IDs, selected scope, owner/reviewer, evidence links, migrations/contracts/configuration changes, positive/negative tests, legal-model evaluation when applicable, failure/rollback evidence and unresolved limits. A “complete” label applies to this evidence, not to a tab name or component render. Builds/types/lint and relevant regression checks use existing root commands; broaden tests for changed boundaries, not for cosmetic repetition.

## Next implementation package to prepare

First close Phase 2 decisions required by **4A: Matter contracts and acceptance fixtures**, then prepare that implementation package. Audit existing fields and access code, propose the smallest compatible schema/API/UI change, identify selected Phase 4 IDs and obtain product/domain review of the work package before coding. Do not block this model-free assessment on the deferred model setup; mark its dependent AI journey as blocked until configured. No feature implementation is started by this plan.

## Allocation reconciliation: all 105 requirements

This preserves the current disposition, not a new acceptance claim. Phase 7 validation applies to every selected feature, even though only QA01 is allocated directly to Phase 7. Deferred requirements are not silently promoted into proposed Phases 8–11.

| Allocation | P0 | P1 | P2 | Total | Requirement IDs |
| --- | ---: | ---: | ---: | ---: | --- |
| 4 | 17 | 6 | 0 | 23 | AS01, AS02, AS03, RV01, RV02, MT01, MT02, MT04, MT05, MT06, MT07, SO01, SO02, SO04, SO05, SA01, SA03, SA06, SA07, SA08, SA11, CU01, CU03 |
| 5 | 17 | 14 | 0 | 31 | RS01, RS02, RS03, RS04, RS05, RS06, RS07, RV03, RV04, RV05, RV06, DR01, DR02, DR03, DR04, MT03, SO03, SO06, SO09, CN01, SH01, SH02, SH03, SH04, SH06, SH07, SA02, SA04, SA05, SA09, SA12 |
| 6 | 3 | 13 | 7 | 23 | AS04, AS05, AS06, DR05, AG01, AG02, AG03, AG04, AG05, AG06, AG07, AG08, AG09, AG10, AG12, AG13, CN02, CN03, CN04, CN05, CN06, SA10, CU04 |
| 7 | 1 | 0 | 0 | 1 | QA01 |
| After pilot | 0 | 6 | 21 | 27 | AS07, RS08, RS09, RS10, RS11, RV07, DR06, DR07, MT08, SO07, SO08, SO10, SO11, SO12, AG11, AG14, CN07, CN08, SH05, SH08, SA13, SA14, SA15, CU02, CU05, CU06, CU07 |
| **Total** | **38** | **39** | **28** | **105** | All original IDs retained |

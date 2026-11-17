# NorthWrit implementation plan

Updated: November 16, 2026

Status: Phase 1 audit and Phase 3 application integration are complete. Phase 2 is restored as Product and Architecture Foundation; existing evidence is available, but scope/ownership decisions and review closure remain pending. Repository organization, the expanded layout and the root npm workspace are merged. [PR #4](https://github.com/VenkataAnilKumar/NorthWritX/pull/4) verified the application baseline with all seven PR checks passing; merge commit `d7e899526a389cbbe684b18618b32df98ccea237` was verified on remote `main`. See the [configuration record](NorthWrit-Configuration-Verification.md) for compatibility exceptions and release limits. Phase 4 has locally implemented metadata, Overview/settings, source-context safeguards, saved-draft backend/UI, connected model-free acceptance, source-link revocation and private draft recovery; live AI, Office-host and reviewer acceptance remain pending. No deployment or pilot release is established by these merges.

Application baseline: subsequent GitHub changes through `7c08dba` include [PR #5](https://github.com/VenkataAnilKumar/NorthWritX/pull/5) (configuration/documentation alignment) and [PR #6](https://github.com/VenkataAnilKumar/NorthWritX/pull/6) (reference archive retirement). [ADR 0004](../decisions/0004-retire-source-reference-archive.md) and the [source provenance record](../06-technical/NorthWrit-Source-Provenance.md) govern the retained source history. Earlier verification statements refer to their own revisions.

Latest merged UI/documentation baseline: [PR #11](https://github.com/VenkataAnilKumar/NorthWritX/pull/11), merge `38da785246ab4d7357461ff2fc6558cff22396dd`, includes the four-destination navigation, NorthWrit visual identity, floating workspace and refreshed demo. All seven PR checks passed. This establishes the recorded UI/build baseline, not live AI acceptance or Phase 4 completion. The proposed fifth Agents tab and Contract Intelligence section remain unimplemented.

Latest merged planning baseline: [PR #12](https://github.com/VenkataAnilKumar/NorthWritX/pull/12), merge `8a6ae5c8262bf95bd8ce58a3773acd81d9fd1445`, records the Harvey implementation map and approved feature navigation; all four docs-triggered CI checks passed. It adds no application capability.

## Current capability documentation

The [product catalogue](../02-product/NorthWrit-Product-Catalogue.md), [current architecture](../06-technical/NorthWrit-Current-Implementation.md), [system flows](../06-technical/NorthWrit-System-Flows.md), [user guide](../guides/user-guide.md) and [administrator guide](../guides/administrator.md) describe the existing application. The [capability matrix](../04-specs/NorthWrit-Capability-Matrix.md) accounts for all 105 requirements without treating building blocks as acceptance. The [documentation coverage map](NorthWrit-Documentation-Coverage.md) records source/guide evidence and remaining checks. This documentation work does not implement Phase 4.

## Navigation milestone before Phase 4

Delivered **Assistant · Matters · Library · Workflows** across the shared web and desktop UI, grouped existing sections, and moved IDE discovery into Settings → Advanced while retaining existing routes, data and authorization. See the [navigation milestone](NorthWrit-Navigation-Milestone.md) for the implementation sequence, acceptance criteria and verification. This work precedes Phase 4 and does not start its matter data model.

## Floating glass UI milestone

Delivered the approved floating workspace surfaces through the shared web shell, navigation, headers, Assistant composer and document/chat reading surfaces. See the [floating glass plan](NorthWrit-Floating-Glass-Plan.md) for scope, acceptance and verification. This UI milestone precedes Phase 4.

## Approved feature navigation

The [feature navigation design](../05-design/NorthWrit-Feature-Navigation.md) defines **Assistant · Matters · Library · Workflows · Agents** as the target navigation. Agents is a separate proposed main tab; the running baseline still has four. **Contract Intelligence** is the approved name for the proposed contract-focused section under Workflows. Naming approval does not establish delivery or expand phase acceptance.

## Objective and scope

Build NorthWrit as a Harvey-style legal AI workspace for Canadian law firms using **the imported application as its sole foundation**. Integrate and configure the pinned source, then deliver matter-based workflows, Canadian research, evidence-backed review and drafting, governed AI execution, and integrations.

This is the current implementation roadmap. It replaces the older implementation phases, sprint plan, implementation checklist, reuse execution plan, agent prompts, and v3 roadmap. Existing product specifications remain requirements inputs; their release labels and architecture proposals must be reconciled with the NorthWrit audit rather than treated as verified implementation.

The active application spans root `apps/` and `packages/`, with [recorded provenance](../06-technical/NorthWrit-Source-Provenance.md), imported from the upstream revision `a5c147d6587ca465f301e8479f6c50fbc5731c45`.

## Delivery sequence

| Phase | Outcome | Depends on | Status |
|---|---|---|---|
| 1. Audit the original application | Source-backed capability map and implementation backlog | Pinned source | Complete |
| 2. Product and Architecture Foundation | Reviewed product blueprint, domain boundaries and implementation backlog | Phase 1 evidence | Restored; existing foundation evidence, gap closure and reviewer sign-off pending |
| 3. Integrate and configure | Maintainable NorthWrit application baseline | Phase 1 | Complete; PR #4 merged with all seven checks passing |
| Repository organization | Clear entry points, ownership, documentation and verification commands | Phase 3 | Complete; PR #1 merged |
| Repository structure migration | Separate application surfaces, worker entry point, shared packages and infrastructure | Initial repository organization | Complete; PR #2 merged with all seven checks passing |
| Root npm workspace | One frozen install graph and NorthWrit package names | Repository structure migration | Complete; PR #3 merged with all seven checks passing |
| 4. Build the legal workspace | Complete matter-based user journeys | Merged baseline plus Phase 2 decisions needed by the selected increment | Not started |
| 5. Add NorthWrit capabilities | Canadian legal workflows and enforceable governance | Phase 4 | Planned |
| 6. Extend integrations | Governed agents, connectors, plugins, and MCP | Phase 5 | Planned |
| 7. Validate and release | Evidence-backed pilot release and operating procedures | Phase 6 | Planned |

Each phase closes with a demonstration, recorded checks, known limitations, and an updated backlog. Engineering owns implementation; product/legal reviewers assess legal workflow quality; security/operations reviewers assess access, data handling, and deployment. Named owners and effort estimates remain to be assigned before implementation of the next phase. These are delivery gates, not calendar commitments.

## Detailed phase delivery and review

Use the [phased delivery plan](NorthWrit-Phased-Delivery-Plan.md) for ordered increments 4A–7D, entry/exit gates, role ownership, dependency decisions and an exact reconciliation of all 105 requirement IDs. It preserves 23 allocations to Phase 4, 31 to Phase 5, 23 to Phase 6, one to Phase 7 and 27 deferred after the pilot. P1/P2 inclusion remains explicit; Phase 7 validates every selected feature rather than only its directly allocated QA01.

Initial model validation must precede AI-dependent acceptance, not wait until Phase 7. The user's deferred AI verification remains pending; independent model-free matter assessment can proceed. Real database/access/migration/browser evidence is required in Phase 4; ordinary CI does not replace those gates. Conditional post-pilot proposals 8–11 are documented separately and are not approved active phases.

The [cross-platform feature backlog](NorthWrit-Cross-Platform-Feature-Backlog.md) explicitly places the discussed Harvey, Filevine/LOIS and Clio features without duplicating existing requirements or silently promoting deferred features into the pilot.

## Completed repository preparation

Repository preparation is complete and is not a new numbered phase. Phase 2 is restored as Product and Architecture Foundation; it consolidates existing decisions and unresolved gaps without renumbering completed work or changing feature allocations. Product priority labels P0/P1/P2 in the specifications do not map to implementation phase numbers.

| Milestone | Delivery evidence | Current authority |
|---|---|---|
| Initial entry points and ownership | PR #1; [repository verification](NorthWrit-Repository-Verification.md) | [Ownership map](../06-technical/NorthWrit-Repository-Ownership.md) |
| Expanded repository layout | PR #2; [migration verification](NorthWrit-Migration-Verification.md) | [ADR 0002](../decisions/0002-expanded-repository-structure.md) |
| Nine private npm workspaces and one root lockfile | [PR #3](https://github.com/VenkataAnilKumar/NorthWritX/pull/3); [workspace verification](NorthWrit-Workspace-Verification.md) | [ADR 0003](../decisions/0003-npm-root-workspace.md) |
| Configuration and compatibility verification | [PR #4](https://github.com/VenkataAnilKumar/NorthWritX/pull/4); [configuration verification](NorthWrit-Configuration-Verification.md) | [Configuration and compatibility policy](NorthWrit-Configuration-Verification.md#compatibility-and-attribution) |

Current structure:

```text
NorthWritX/
├── apps/                 # web, api, worker, word-addin, desktop
├── packages/             # contracts, client, ui; shared fixture directories
├── infra/                # Compose, Docker support and Supabase gateway
├── tests/                # browser and load tests
├── docs/                 # requirements, current guides and historical evidence
├── scripts/              # repository and application tooling
├── .github/workflows/    # active CI
├── package.json          # nine private npm workspaces and root commands
└── package-lock.json     # authoritative install graph
```

Use the [current implementation](../06-technical/NorthWrit-Current-Implementation.md) and [developer guide](../guides/developer.md) for current paths and commands. The [path map](NorthWrit-Migration-Paths.json) preserves old-to-new provenance. Earlier verification records describe their original check scope; later merges do not rewrite those observations. The [older v3 blueprint](../06-technical/Northwrit_Repo-Structure.md) remains historical context.

### Gate for Phase 4

The merged repository baseline is ready for Phase 4 planning. Review the [extension map](NorthWrit-Phase-4-Extension-Map.md), assign owners, and define synthetic two-user/two-matter acceptance fixtures before implementing the legal workspace. Keep package boundaries, migration history, attribution and existing stored-format compatibility. macOS packaging, Office-host acceptance, real database/browser journeys and production URL/policy checks remain release work; CI unit/build success does not establish those outcomes.

### Conditional growth

Further service extraction, additional repositories and affected-only CI require measured maintenance cost, operating load or ownership needs and a recorded decision. Independent worker scaling needs queue/latency targets, bounded concurrency, retries, cancellation, idempotency, recovery and authorization rechecks. Directory organization alone does not establish runtime scalability.

## Phase 1 — Audit the original application

**Goal:** Establish exactly what the pinned source provides and what NorthWrit must build.

Work:

- Inventory routes, navigation, settings, APIs, services, database schema, migrations, storage, authentication, model providers, background jobs, and deployment configuration.
- Trace Projects, Assistant, Library, Tabular Reviews, Workflows, connectors, and the Word add-in through source and documentation. Record agents, plugins, and MCP as supported, partial, absent, or unverified based on evidence.
- Map the existing NorthWrit feature IDs and user journeys to reuse, adapt, build, or defer decisions. Record permission boundaries and failure paths, not just visible screens.
- Identify differences between NorthWrit and existing NorthWrit architecture documents. Prefer the working foundation unless a documented requirement justifies a change.
- Record upstream revision, dependency notices, update strategy, runtime prerequisites, required secrets by name, and likely cloud resource requirements.

Deliverables: Capability matrix with source paths; architecture and data-flow inventory; requirements gap backlog; cloud startup runbook; decision log.

Results: [Source audit and gap backlog](NorthWrit-Source-Audit.md), [105-feature disposition](NorthWrit-Feature-Disposition.md), and [cloud startup runbook](NorthWrit-Cloud-Runbook.md).

**Acceptance:** Every major UI surface and NorthWrit requirement has an explicit disposition. Unknowns have a verification task. Runtime prerequisites are recorded by name.

## Phase 2 — Product and Architecture Foundation

Start with the [Phase 2A pilot scope proposal](NorthWrit-Phase-2A-Pilot-Scope.md): 38 P0 baseline requirements, seven recommended P1 additions and explicit pending decisions. The [Phase 2B architecture assessment](NorthWrit-Phase-2B-Architecture-Principles.md) maps current domain/access code to recommended principles and unresolved design gates. The [Phase 2C experience, AI and evidence contracts](NorthWrit-Phase-2C-Experience-AI-Evidence-Contracts.md) consolidate navigation, client limits, model routing, citation support and distinct output/action approval requirements; implementation and live AI acceptance remain pending. The [Phase 2D delivery and verification plan](NorthWrit-Phase-2D-Delivery-Verification-Plan.md) defines work-package records, evidence categories, test boundaries and unresolved ownership/gates; Phase 2 sign-off remains pending.

**Goal:** Connect the source audit to a reviewed product blueprint and implementation backlog. This restored phase consolidates evidence already produced across the project; it is not a new application implementation program or a claim that the historical Phase 3 work occurred after this restoration.

| Foundation area | Evidence already available | Remaining decision / boundary |
| --- | --- | --- |
| Product scope and pilot journeys | Product catalogue, feature specification, 105-feature matrix and cross-platform backlog | Confirm selected pilot P1/P2 scope, exclusions and success measures |
| Feature mapping | Source audit and Harvey/Filevine/Clio comparisons | Keep demonstrated behavior separate from proposed extensions and unverified vendor claims |
| Navigation | Approved five-destination target and implemented four-destination baseline | Agents remains future; Contract Intelligence is under Workflows; activate sections only when functional |
| Architecture and repository ownership | Existing app/package layout, ADRs and ownership map | Preserve current boundaries; record new decisions only where a selected feature requires them |
| Matter and access concepts | Project/access implementation and Phase 4 extension map | Define high-level firm/user/matter/document/work-product relationships; detailed schema/API design remains Phase 4A |
| Design system | NorthWrit identity, floating workspace, responsive and accessibility rules | Carry design/accessibility acceptance into actual feature increments |
| AI and evidence rules | Provider configuration, workflow contracts, planned CiteCheck/Shield/Folio | Confirm allowed routes, source/evidence rules and approval boundaries; live model verification remains deferred |
| Verification and delivery | CI inventory, phased gates and synthetic fixture strategy | Assign named owners/reviewers and identify missing database, browser, model and real-client evidence |

**Deliverables:** consolidated blueprint with evidence links; selected-scope and deferred-decision register; domain/access principles; navigation/design rules; dependency and verification strategy; requirement-linked implementation backlog.

**Acceptance:** reviewers can trace selected journeys to requirements, architecture owners, evidence and tests. Unresolved decisions have an owner, a resolution gate and a stated effect on implementation; existing documentation alone does not mark them resolved. Named reviewers and remaining scope decisions are still pending. Phase 3's historical integration acceptance is preserved; Phase 2 decisions needed by the next increment must be closed before that increment proceeds.

Use the [detailed Phase 2 work packages](NorthWrit-Phased-Delivery-Plan.md#phase-2--product-and-architecture-foundation-restored) for consolidation and gap closure. Do not repeat completed branding, workspace migration or UI work. Do not build new Matter fields, agent execution or legal research functionality in this planning phase.

## Phase 3 — Integrate and configure

**Goal:** Create a versioned NorthWrit baseline that can receive upstream fixes.

Work:

- The verified snapshot is already tracked across `apps/` and `packages/`, with recorded provenance and update guidance. This completed integration history does not propose another import directory or a new repository migration.
- Preserve applicable licenses and attribution. Record imported paths and subsequent local changes.
- Configure product metadata, emails, navigation, help links and environment defaults for NorthWrit.
- Review technical identifiers individually; preserve migration history and compatibility-sensitive names unless there is a tested migration.
- Replace obsolete deployment guidance with NorthWrit-based setup instructions. Establish formatting, build, type-check, and relevant test commands in CI.

Deliverables: Tracked NorthWrit application; verified configuration; provenance record; developer setup; baseline CI.

Earlier verification: Local Windows builds passed for the web, backend and Word add-in. Web lint and type checking, Word server tests and 197 focused application tests passed. The full frontend run flagged two test files. The telemetry assertions now reflect NorthWrit's default, and the template checksum test handles Windows paths. Both files passed all 22 tests on rerun. Correcting the imported line endings resolved 49 backend test failures. The remaining 25 Windows failures reproduced with identical test names in the unmodified upstream revision under the same test setup. Subsequently, Linux GitHub CI passed all four jobs for organization PR #1. macOS packaging remains unverified.

Latest verification: PR #4 merged on November 14, 2026 with repository, backend, frontend, Word and all three image checks passing. The [configuration verification record](NorthWrit-Configuration-Verification.md) records the follow-up fixes. Attribution, stored formats, existing sessions and protected technical identifiers remain explicitly documented compatibility exceptions.

**Acceptance:** The web, backend and Word builds pass, relevant automated checks are recorded, and the repository CI workflow covers the imported application. Phase 4 requires real database/browser acceptance for matter and schema changes; Phase 7 adds consolidated release validation. Upstream notices remain intact and no credentials enter source control.

## Phase 4 — Build the legal workspace

**Goal:** Make daily legal work coherent around matters and their evidence.

The [4A Matter contracts and acceptance fixtures proposal](NorthWrit-Phase-4A-Matter-Contracts-Fixtures.md) inventories existing fields/access, proposes compatible metadata and defines downstream fixture assertions. The [4B metadata verification record](NorthWrit-Phase-4B-Metadata-Verification.md) records the additive schema/API subset and isolated database evidence. The [4C Overview/settings verification record](NorthWrit-Phase-4C-Overview-Verification.md) records the local UI subset. The [4C source-context record](NorthWrit-Phase-4C-Source-Context-Verification.md) records guarded document/folder refreshes and conversion-version continuity. The [isolated source-journey record](NorthWrit-Phase-4-Source-Journey-Verification.md) adds eight passed model-free Auth/API/worker/storage/database integration checks; browser and full acceptance limits remain explicit. The [4D backend record](NorthWrit-Phase-4D-Backend-Verification.md) adds saved drafts, immutable history and authenticated draft DOCX export. Broader journey acceptance remains pending; unresolved Phase 2 and M-register reviews are not marked closed.

### Features in this phase

| NorthWrit feature | Benchmark pattern | Scope |
| --- | --- | --- |
| Matter Overview, client/reference fields, instructions and team context | Filevine/Clio matters; Harvey Spaces | Matter foundation; MT01–MT02, selected MT04–MT06 |
| Matter-aware Assistant, source context and saved conversations | Harvey Assistant; Filevine LOIS | AS01–AS03; model execution must be validated before AI acceptance |
| Documents, folders, uploads, source versions and search | Harvey Vault; Filevine/Clio documents | RV01–RV02, SO01; preserve IDs and exact source/version references |
| Draft/Folio history and DOCX export | Harvey work products and Word workflows | SO02, SO04–SO05; approval state enforcement is Phase 5 |
| Scoped sharing, client rooms and matter/ethical boundaries | Harvey Spaces; Clio collaboration | Existing role foundation; MT07/SA11 require explicit P1 inclusion and access acceptance; full guest portal is later scope |

**Prerequisite:** Use the merged repository/workspace/application baseline and the current Phase 4 extension map. Define the acceptance fixtures and ownership described above before implementation.

Work:

1. Extend the existing project-backed Matters with selected legal metadata and workflows while preserving records, identifiers and links. The visual Projects-to-Matters naming change is already delivered; use migrations only for actual schema changes.
2. Enforce firm and matter membership, roles, document ownership and matter-scoped retrieval. Apply the same scope to documents, search, Assistant context, background jobs, signed downloads, review results, drafts and exports. Reuse existing access helpers and domain services.
3. Preserve the four implemented destinations: Assistant, Matters, Library and Workflows. Add useful selected matter sections and keep matter context visible across surfaces. Follow the approved five-destination target without exposing the Agents tab before its Phase 6 capability is ready. Research and Contract Intelligence remain Phase 5 work; Documents, Reviews and Drafts are contextual sections rather than extra primary tabs. Keep reusable resources and execution/review records under their documented owners, and retain role-aware settings.
4. Connect matter creation, document upload, extraction, question answering, review, drafting, revision, and export into one traceable journey. Intake/Requests routing is selected Phase 6 work, not an implicit Phase 4 deliverable. Preserve the source document and version behind each evidence link. Add evidence navigation, processing/error states, version tracking, and clear empty states.
5. Verify the journey with synthetic contracts, two users and two matters. Test authorized access and denied UI, direct API and download requests. Run relevant builds, type checks and regressions without restarting the standalone cloud baseline test.

Canadian source integrations, CiteCheck, Shield and approval workflows remain in their planned later phases.

Deliverables: Workspace UI; matter/access model and migrations; settings map; working matter-to-draft journey.

**Acceptance:** An authorized user completes the journey without losing matter context. An unauthorized user cannot retrieve another matter's documents, answers, source passages, or exports. Draft revisions remain associated with their evidence and document versions.

## Phase 5 — Add NorthWrit capabilities

**Goal:** Deliver the Canadian legal and governance capabilities that distinguish NorthWrit.

### Features in this phase

| NorthWrit feature | Benchmark pattern | Scope |
| --- | --- | --- |
| Research, Bearings, Canadian source filters and cited research memos | Harvey Knowledge; LOIS/Clio legal research | RS01–RS07 as allocated; P1 inclusion explicit and source rights verified |
| CiteCheck and passage/version evidence | Harvey/LOIS cited research | RS05 four claim-support states; licensed authority treatment remains deferred RS10 |
| Review Grid and bulk document extraction | Harvey Review Tables | Selected RV03; evaluate cited cells and failure states |
| Contract Intelligence: playbook checks, proposed redlines and reports | Harvey Contract Intelligence; LOIS contract work | Selected DR02–DR04; broader portfolio/obligation products are not implied |
| Precedent Bank, drafting from precedents and curated firm content | Harvey institutional knowledge | Selected RV06/DR01; installable Firm Packs are Phase 6 |
| Fact/source timelines | Harvey chronology patterns | Selected SO09; a complete litigation fact graph/witness workspace is an extension |
| Folio review, lawyer approval and evidence invalidation | Reviewed legal-work-product workflows | SO03 approval bound to exact version/evidence/payload |
| Shield, provider routing and selected privacy/residency controls | Enterprise legal AI governance | Existing Phase 5 SH/SA/CN allocations; deployment assurances need evidence |

Multi-round negotiation intelligence and cell-level assignments/comments/locks are candidate extensions to this phase, not automatic pilot commitments. Portfolio intelligence and Beacon retain their deferred allocations.

Work:

- Integrate permitted Canadian research sources with jurisdiction, court, date, source provenance, and access limitations recorded. Validate source access before promising coverage.
- Implement Bearings for research scope and four-state CiteCheck: Verified, Unverified, Contradicted, and Unavailable. Define the evidence needed for each state; a working URL alone does not establish validity.
- Group contract-focused review/playbook workflows under **Workflows → Contract Intelligence**, using the [approved navigation design](../05-design/NorthWrit-Feature-Navigation.md). Broader negotiation, obligation-tracking and portfolio capabilities require separate extension scope.
- Build cited Review Grids, reusable legal workflow content and playbooks. Prepare reusable firm content here; installable Firm Packs and their governance remain Phase 6 CN03/CN06. Link findings to exact source passages and versions; mark findings stale when source documents change.
- Implement Folio review and approval bound to a specific output version and outbound payload. Editing content invalidates the prior approval.
- Enforce Shield policies at model and tool boundaries: allowed providers/routes, data handling, redaction where required, audit records, and blocked actions. Never silently switch to an unauthorized route.
- Evaluate retention, deletion, backup, and deployment-region behaviour against the selected pilot requirements.

Deliverables: Canadian research pipeline; citation evaluation set; Review Grid and Folio workflow; Shield policy enforcement; reusable workflow catalogue.

**Acceptance:** Representative synthetic Canadian legal tasks produce traceable evidence and accurate citation states under a defined evaluation rubric. Changed evidence or output invalidates dependent review/approval. Forbidden data routes and cross-matter access are blocked in executable tests. Legal workflow evaluation records reviewer findings and unresolved limitations.

## Phase 6 — Extend integrations

**Goal:** Add useful integrations while preserving matter scope and approval controls.

### Features in this phase

| NorthWrit feature | Benchmark pattern | Scope |
| --- | --- | --- |
| Separate Agents tab, governed runs, run trail and checkpoints | Harvey Agents; Filevine LOIS | P0 AG01–AG03; available definitions and Runs first; show accepted sections only |
| My Agents, agent library/studio and versioning | Harvey Agent Builder; LOIS Skills | Selected AG04–AG05/AG09; rich Studio is not required for the P0 run contract |
| Schedules, triggers and recurring tasks | Harvey scheduled agents; Filevine Routines | Selected AG06/AG12; scope, time zones, revocation and duplicate prevention |
| Requests, intake, triage and business self-service | Harvey Intake; Filevine/Clio intake | Selected AG08/AG13; richer guest/channel portal requires explicit extension scope |
| Deadline Watch, digests and confirmed obligations | Filevine/Clio deadlines; Harvey contract obligations | Selected AG07; full contract obligation lifecycle is an extension |
| Selected document/DMS connectors, MCP and enterprise APIs | Harvey Connector Library; Filevine/Clio integrations | CN02/CN04–CN05; select actual adapters and permitted operations |
| Email/calendar matter workflows | Harvey Ecosystem; Filevine/Clio communications | Selected connector operations; dedicated Outlook client remains deferred DR06 |
| Word legal review/drafting and client scope | Harvey/LOIS Word | Selected DR05; real Word-host acceptance and current context limits |
| Firm Packs, agent/workflow library, style and memory integration | Harvey reusable expertise; Filevine Skills | Selected AS04–AS06, CN03/CN06 and CU04 |
| Enterprise identity/provisioning | Enterprise legal AI administration | Selected SA10; SSO building blocks do not establish SCIM acceptance |

Full matter task boards, cross-organization guest collaboration and broader orchestration are candidate extensions to Phase 6. They require selected scope; a visual Flow Builder AG14 remains deferred.

Work:

- Use the Phase 1 inventory to distinguish existing NorthWrit functionality from new implementation.
- Use **Agents** as a separate primary destination when its governed experience is ready. The approved section names are My Agents, Runs, Schedules and Approvals; define the delivered subset and acceptance criteria for each increment rather than assuming all four ship together. Keep matter-scoped runs matter-linked, define explicit scope for any supported non-matter run, and apply access, revocation and action-approval requirements.
- Define agents as governed task runners, connectors as external data access/synchronization, plugins as packaged capabilities, and MCP as a tool/resource protocol. Define configuration, permissions, and lifecycle for each.
- Add only the integrations needed for the pilot; select initial systems based on firm requirements and verified API access.
- Implement credential storage, scopes, synchronization status, retries, revocation, and deletion propagation for connectors.
- Add agent run history, cancellation, budgets, tool permissions, and explicit approval for external writes. Apply the same controls to MCP tools and plugin-provided actions.
- Validate Word drafting/review workflows and other required document integrations against the NorthWrit evidence and version model.

Deliverables: Capability registry; prioritized integration adapters; agent run history; connector administration; plugin/MCP configuration and audit records.

**Acceptance:** Each enabled integration has a working authorized flow and a denied/revoked flow. Agents cannot exceed their matter, tool, or data permissions. External writes require valid approval for the actual payload; retries do not create duplicate side effects. Unsupported capabilities are clearly labelled.

## Phase 7 — Validate and release

**Goal:** Release a reproducible pilot with demonstrated user workflows and operating support.

### Features and journeys to accept

Validate the selected Matter workspace, Assistant, Research/CiteCheck, Review Grid, Contract Intelligence, Folio/Shield, Agents and integration journeys together. This is where their combined pilot acceptance is established, not where all AI testing first begins.

Also validate supported clients, accessibility, capacity, recovery, security/data boundaries and operating procedures. Benchmark QA01 applies across the selected product. No deployment or release publication is authorized by this planning document.

Work:

- Execute regression journeys for lawyers, reviewers, knowledge managers, and administrators, including upload, research, review, drafting, approval, export, and integration failures.
- Test tenant/matter isolation, authentication/session behaviour, prompt-injection handling, restricted outbound data, secret handling, and audit completeness.
- Measure ingestion and response performance using agreed pilot document sizes and concurrency. Set numerical targets from baseline evidence before release approval.
- Validate accessibility, supported browsers, backup restoration, migrations, rollback, monitoring, and incident procedures.
- Prepare release notes, deployment configuration, user/admin guides, known limitations, pilot scope, and support ownership. Commit reviewed changes, run CI, and publish through the agreed release process.

Deliverables: Release candidate; acceptance report; deployment and rollback runbooks; pilot documentation; release tag and change record.

**Acceptance:** Required pilot journeys pass, no unresolved critical security or data-loss defects remain, recovery has been demonstrated, and product/legal and operations reviewers accept the recorded pilot scope and limitations. Excluded features are visibly deferred rather than represented as delivered.

## Conditional future phases — proposed, not approved active scope

The following phases make the discussed post-pilot features visible in this implementation plan. They do not move deferred requirements into the pilot or commit every vendor counterpart. Their order and included subset require pilot evidence and scope decisions.

| Proposed phase | NorthWrit features / work | Requirement relationship and gate |
| --- | --- | --- |
| **8 — Pilot learning and refinement** | Customer feedback, legal-output evaluation, usability improvements, adoption measurement and a selected Insights increment | SA14 remains deferred; define metrics/privacy and measurable user problems before building an analytics product |
| **9 — Commercial readiness** | Firm onboarding, seats/subscriptions, product billing, support and service commitments; selected timekeeping/client-billing integrations | SA13 deferred; legal client invoicing/payments is a separate practice-management extension, not automatically covered by subscription billing |
| **10 — Product expansion** | Beacon/regulatory monitoring, Dispatch, portfolio comparison and clause benchmarking, advanced Contract Intelligence, full Facts & Timeline, guest client portal, Outlook, native mobile/scanning/dictation and visual Flow Builder | RS08/RS11/RV07/DR06/CU05/AS07/AG14 retain deferred status; richer fact graphs, negotiation/obligation analytics and guest delivery are separately scoped extensions. Source rights, demand and acceptance determine selection |
| **11 — Scale and enterprise assurance** | Measured worker/capacity scaling, advanced enterprise analytics/governance, justified SDK/Pack ecosystem expansion and independent assurance programs | CN07–CN08/SA15 remain deferred; require load/ownership evidence and architectural decisions before extraction. No automatic marketplace or certification commitment |

Selected authority treatment RS10, multi-model comparison RS09, legal hold MT08, additional exports/utilities, house style and other deferred IDs remain visible in the [full allocation reconciliation](NorthWrit-Phased-Delivery-Plan.md#allocation-reconciliation-all-105-requirements). Assigning one to a future increment requires a decision; none is dropped because it is absent from a tab label.

## Definition of done

- Requirements map to an implemented change, a test result, or an explicit deferred decision.
- Changes include applicable migrations, configuration examples, and user/developer documentation.
- Builds and relevant automated checks pass; manual workflow evidence covers behaviour automated checks do not establish.
- Permission, evidence, version, and approval boundaries hold across UI, APIs, jobs, and integrations.
- Secrets remain outside Git; upstream provenance and notices are preserved.
- Failures and limitations are visible, and deployment changes include recovery instructions.

## Dependencies and decisions to close

| Dependency or uncertainty | Resolution phase | Required evidence |
|---|---|---|
| NorthWrit feature coverage and fit with existing specifications | 1 | Source-backed matrix and reconciled backlog |
| Model access and operating cost | Before AI-dependent acceptance in 4–6; revalidate in 7 | Approved provider/route, successful synthetic AI journey, usage limits and recorded quality/cost; remains pending while configuration is deferred |
| Import layout and upstream update process | 3 | Tracked source and repeatable update procedure |
| Repository entry points, ownership and documentation authority | Before 4 | Verified root commands, active CI inventory and recorded decisions |
| Firm and matter isolation | 4 | Real database/browser positive and negative access tests, including revocation, queued execution, downloads and exports |
| Fresh/upgrade schema and isolated browser gates | Before accepting Phase 4 schema/access changes | Disposable fresh and supported-upgrade databases, ledger/RLS evidence and authorized/denied journeys; adapt gates listed in the CI inventory |
| Expanded application/package/infrastructure layout and worker entry point | Before 4 | Complete path/provenance mapping, updated commands/CI, affected builds and verified startup/job checks |
| Independent worker scaling and further service extraction | When operating evidence justifies it | Measured baseline and targets, extraction decision, access/recovery tests and affected build checks |
| Canadian source access and citation quality | 5 | Permitted retrieval and evaluated research examples |
| Pilot integrations and external credentials | 6 | Configured adapters and revocation tests |
| Pilot scale, deployment region, recovery and support | 7 | Measured targets and accepted operating runbooks |

## Product inputs

- [Open-source references and platform decision](../03-market/Northwrit_Open-Source-References.md)
- [Feature specification](../04-specs/Northwrit_Feature-Spec.md)
- [User journeys](../04-specs/Northwrit_User-Journeys.md)
- [Workflow contracts](../04-specs/Northwrit_Workflow-Contracts.md)
- [UI specification](../05-design/Northwrit_UI-Spec.md)
- [NorthWrit and Harvey feature comparison](../03-market/Northwrit_vs_Harvey_Feature-Comparison.md)

**Immediate next action:** Close the outstanding Phase 2 decisions and Phase 4 review gates, then verify the deferred AI-dependent matter journey and Office-host behavior when configuration and host access are available. The model-free 4A–4E increments already have implementation and isolated verification records in the [phased delivery plan](NorthWrit-Phased-Delivery-Plan.md); do not repeat those increments. No deployment or publication is authorized by this roadmap.

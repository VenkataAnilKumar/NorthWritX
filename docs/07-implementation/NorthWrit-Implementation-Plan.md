# NorthWrit implementation plan

Updated: November 11, 2026

Status: Phase 1 source audit, Phase 3 integration and rebrand, and the initial repository organization are complete. Organization PR #1 merged as `624268de88697d31dee4603548bad25042fdad15`; all four GitHub CI jobs passed. The expanded repository migration is implemented and locally validated, with inherited limitations recorded; [PR #2](https://github.com/VenkataAnilKumar/NorthWritX/pull/2) records GitHub CI/review and merge status for closing the migration gate before Phase 4. Phase 4 has not started; see the migration verification record for current results and limitations.

## Objective and scope

Build NorthWrit as a Harvey-style legal AI workspace for Canadian law firms using **Mike OSS as the sole application foundation**. Integrate and rebrand the pinned source, then deliver matter-based workflows, Canadian research, evidence-backed review and drafting, governed AI execution, and integrations.

This is the current implementation roadmap. It replaces the older implementation phases, sprint plan, implementation checklist, reuse execution plan, agent prompts, and v3 roadmap. Existing product specifications remain requirements inputs; their release labels and architecture proposals must be reconciled with the Mike audit rather than treated as verified implementation.

The active application spans root `apps/` and `packages/`, with [recorded provenance](../upstream/mike/NORTHWRIT.md), imported from the upstream revision `a5c147d6587ca465f301e8479f6c50fbc5731c45`. [Upstream source](https://github.com/Open-Legal-Products/mike)

## Delivery sequence

| Phase | Outcome | Depends on | Status |
|---|---|---|---|
| 1. Audit Mike OSS | Source-backed capability map and implementation backlog | Pinned source | Complete |
| 3. Integrate and rebrand | Maintainable NorthWrit application baseline | Phase 1 | Complete |
| Repository organization | Clear entry points, ownership, documentation and verification commands | Phase 3 | Complete; local verification recorded |
| Repository structure migration | Separate application surfaces, worker entry point, shared packages and infrastructure | Initial repository organization | Complete; PR #2 merged with all seven checks passing |
| Root npm workspace | One frozen install graph and NorthWrit package names | Repository structure migration | Implemented locally; checks and inherited host limits recorded |
| 4. Build the legal workspace | Complete matter-based user journeys | Root workspace verification | Planned |
| 5. Add NorthWrit capabilities | Canadian legal workflows and enforceable governance | Phase 4 | Planned |
| 6. Extend integrations | Governed agents, connectors, plugins, and MCP | Phase 5 | Planned |
| 7. Validate and release | Evidence-backed pilot release and operating procedures | Phase 6 | Planned |

Each phase closes with a demonstration, recorded checks, known limitations, and an updated backlog. Engineering owns implementation; product/legal reviewers assess legal workflow quality; security/operations reviewers assess access, data handling, and deployment. Named owners and effort estimates will be assigned after Phase 1. These are delivery gates, not calendar commitments.

## Repository organization before Phase 4

**Decision:** Keep one repository and migrate to the expanded structure below before Phase 4. The user selected this sequencing on November 11, 2026. The expanded layout is merged in PR #2. Root npm workspace conversion is separately authorized under ADR 0003. Preserve domain and package boundaries while relocating source; independent worker deployment and further service extraction still require operating evidence. See [ADR 0002](../decisions/0002-expanded-repository-structure.md).

This is preparatory work, not a new numbered phase. Phase 2 remains removed from the roadmap. The older [v3 repository blueprint](../06-technical/Northwrit_Repo-Structure.md) is historical context; its proposed services, package managers and platforms are not implementation requirements.

### Completed initial repository organization

```text
NorthWritX/
├── README.md                 # Setup entry point, commands and roadmap
├── AGENTS.md                 # Repository-wide development instructions
├── package.json              # Root command wrappers
├── LICENSE
├── NOTICE.md
├── .github/workflows/        # Active NorthWrit CI
├── apps/northwrit/
│   ├── frontend/             # Web portal
│   ├── backend/              # API, authorization, processing and jobs
│   ├── word-addin/
│   ├── desktop/
│   ├── packages/
│   │   ├── contracts/        # Shared serialized API contracts
│   │   ├── client/           # Shared client behaviour
│   │   └── ui/               # Shared interface components
│   ├── e2e/
│   ├── loadtest/
│   ├── docker/
│   ├── supabase/
│   ├── docker-compose.yml
│   ├── scripts/              # Application-specific tools
│   ├── docs/                 # Application engineering and operations
│   └── NORTHWRIT.md          # Source provenance and upgrade procedure
├── docs/                     # Existing numbered product/delivery sections
│   ├── decisions/            # Accepted architecture decisions
│   └── guides/
└── scripts/                  # Repository-wide maintenance and branding
```

This tree describes the completed PR #1 layout before the expanded migration. Root entry points and decision records were delivered in PR #1. Preserve the existing numbered documentation sections and their links during the next migration.

Completed work:

1. Add the root README, repository instructions and command wrappers. Point setup, development, formatting, type checks, tests and builds to the active application. Keep existing package manifests and lockfiles; wrappers do not introduce a new workspace or package manager.
2. Document ownership and dependency rules. Backend domains use the existing service facades; authorization stays in shared access helpers. Shared contracts, client behaviour and UI retain their existing package boundaries. Document how API and worker entry points invoke the same domain services.
3. Clarify documentation authority. Root `docs/` holds NorthWrit requirements, decisions and delivery evidence. Application `docs/` describes implemented engineering and operating behaviour. Identify historical proposals and reconcile conflicting setup guidance without deleting provenance or applicable notices.
4. Review imported workflows under `docs/upstream/mike/.github/`. Record which checks NorthWrit runs from root `.github/workflows/`; nested workflow files do not execute automatically. Update active CI paths, build contexts and command documentation together when required.
5. Record the Phase 4 extension map: the existing Projects implementation provides the Matter compatibility layer; document access, source versions, review, drafting and export remain in their existing domains where they fit. Identify shared policy seams and test ownership before adding parallel implementations.
6. Verify root commands from their documented working directory, internal documentation links, CI paths and affected builds/type checks/regressions. Record failures and inherited limitations. Do not restart the archived standalone cloud baseline test; use the checks required for the repository changes.

Deliverables: Root entry points; documented ownership and dependency rules; documentation authority map; active CI inventory; Phase 4 extension map; recorded verification.

Implementation: [root entry point](../../README.md), [repository instructions](../../AGENTS.md), [ownership map](../06-technical/NorthWrit-Repository-Ownership.md), [accepted repository decision](../decisions/0001-repository-structure.md), [CI inventory](NorthWrit-CI-Inventory.md), [Phase 4 extension map](NorthWrit-Phase-4-Extension-Map.md) and [verification record](NorthWrit-Repository-Verification.md). Application directories and migration history remain in place.

**Acceptance:** A developer can locate the active application, set it up and run its documented checks from the repository root. Relevant checks retain their underlying exit status. Existing package imports, Docker build contexts, migration history and upstream provenance remain valid. Required checks pass or have an explicitly recorded blocker before starting Phase 4.

### Planned repository structure migration — before Phase 4

Target structure (implemented locally; verification status is recorded separately):

```text
NorthWritX/
├── apps/
│   ├── web/
│   ├── api/
│   ├── worker/
│   ├── word-addin/
│   └── desktop/
├── packages/
│   ├── contracts/
│   ├── client/
│   └── ui/
├── infra/
├── docs/
├── scripts/
└── .github/workflows/
```

Root entry points, manifests, license and notices remain. The tree highlights boundaries, not an exhaustive file inventory. Preserve existing fixture directories such as `byok-validation` and `pdf-text-order`; do not drop them because the abbreviated tree omits them.

Work, in order:

1. **Inventory and mapping.** Record all current source, fixture, test, configuration and provenance paths and their destinations. Include ignored local configuration, imported workflows, Docker contexts, deployment scripts and upstream update mappings. Preserve user changes. Establish the rollback commit and the checks required for each affected surface.
2. **Move application surfaces.** Map `apps/web` to `apps/web`, `backend` to `apps/api`, and Word/desktop surfaces to their corresponding root `apps/` directories. Preserve package names, independent manifests/lockfiles, technical identifiers, database schema and migration history. A workspace or package-manager conversion requires a separate decision.
3. **Promote shared packages.** Move contracts, client behaviour and UI into root `packages/`; map fixture directories and all consumers explicitly. Update TypeScript aliases, test resolvers and dependency resolution while retaining framework-free client code and the existing dependency direction.
4. **Define the worker boundary.** Inventory existing worker entry points, then provide `apps/worker` as the process/build composition that invokes existing domain services. Record a supported dependency/build boundary so API and worker logic are not copied or coupled through ad hoc source imports. Domain services, database ownership and shared access rules remain with their existing owners. Recheck authorization at execution and before publishing results. Separate production deployment is outside the directory migration.
5. **Consolidate infrastructure and tooling.** Map Compose, Docker support, Supabase configuration and deployment configuration into `infra/` where appropriate; package-specific Dockerfiles may stay with their apps. Give E2E/load tests, scripts, engineering docs, credits and `NORTHWRIT.md` explicit destinations. Update root commands, repository validation, active CI paths/cache keys, build contexts, mounts, service commands and operating instructions together. Retain upstream notices and an old-to-new provenance map.
6. **Verify and record.** Run repository/link and whitespace checks, API/web/Word tests and type checks, lint, production builds, and affected Docker image/Compose configuration checks. Verify worker startup, a representative synthetic job, cancellation/retry/recovery behaviour and denied/revoked access with isolated services. Check desktop configuration/packaging on supported platforms and record unavailable platform checks as blockers where required. Verify fresh installation and documented startup from the new directories. Preserve command exit status and compare failures against the recorded baseline.

Deliverables: Migrated application/shared/infrastructure paths; dependency and provenance maps; working worker entry point; updated root commands, CI, documentation and extension map; verification and rollback records.

**Acceptance gate before Phase 4:** Every retained file has an owner and destination, package boundaries and attribution are preserved, required checks pass, root commands and affected container builds resolve the new paths, and the documented startup and worker checks succeed. Investigate failures and resolve required blockers before declaring the migration complete. Do not claim that directory moves establish runtime scalability. Do not restart the archived standalone cloud baseline test, deploy/publish, or remove unrelated services or volumes during this work.

### Growth after migration

The expanded paths are required before Phase 4. Root npm workspace tooling is now approved under ADR 0003. Further service extraction, additional repositories and affected-only CI remain conditional on measured maintenance cost, operating load or ownership needs. Record each decision before implementation. Independent worker scaling requires measured queue/latency targets, bounded concurrency, retries, cancellation, idempotency, recovery and authorization rechecks. Phase 4 remains responsible for completing and verifying firm/matter isolation and the legal workflow; the directory migration must preserve existing access controls.

### Root npm workspace follow-up — before Phase 4

The user requested a root workspace after the directory migration. [ADR 0003](../decisions/0003-npm-root-workspace.md) supersedes the earlier independent-lockfile decision for current installation. Keep nine private workspaces, one root lockfile and the existing package boundaries. Rename active package names and imports to `@northwrit/*`; preserve upstream attribution, database identifiers and compatibility-sensitive settings.

Consolidate overrides and frozen installs; adapt Docker contexts, CI cache keys, shared type/runtime resolution, desktop staging and scoped audit tooling. Verify repository checks, clean installation, affected tests/types/lint, host and container builds. Record results and limitations in the [workspace verification record](NorthWrit-Workspace-Verification.md). This work introduces no Phase 4 features and performs no deployment or publication.

## Phase 1 — Audit Mike OSS

**Goal:** Establish exactly what the pinned source provides and what NorthWrit must build.

Work:

- Inventory routes, navigation, settings, APIs, services, database schema, migrations, storage, authentication, model providers, background jobs, and deployment configuration.
- Trace Projects, Assistant, Library, Tabular Reviews, Workflows, connectors, and the Word add-in through source and documentation. Record agents, plugins, and MCP as supported, partial, absent, or unverified based on evidence.
- Map the existing NorthWrit feature IDs and user journeys to reuse, adapt, build, or defer decisions. Record permission boundaries and failure paths, not just visible screens.
- Identify differences between Mike and existing NorthWrit architecture documents. Prefer the working foundation unless a documented requirement justifies a change.
- Record upstream revision, dependency notices, update strategy, runtime prerequisites, required secrets by name, and likely cloud resource requirements.

Deliverables: Capability matrix with source paths; architecture and data-flow inventory; requirements gap backlog; cloud startup runbook; decision log.

Results: [Source audit and gap backlog](NorthWrit-Source-Audit.md), [105-feature disposition](NorthWrit-Feature-Disposition.md), and [cloud startup runbook](NorthWrit-Cloud-Runbook.md).

**Acceptance:** Every major UI surface and NorthWrit requirement has an explicit disposition. Unknowns have a verification task. Runtime prerequisites are recorded by name.

## Phase 3 — Integrate and rebrand

**Goal:** Create a versioned NorthWrit baseline that can receive upstream fixes.

Work:

- Import the verified Mike snapshot into a tracked application directory, proposed as `apps/northwrit/`, with source provenance and an upstream update procedure. Avoid accidentally committing the nested checkout as a Git link.
- Preserve applicable licenses and attribution. Record imported paths and subsequent local changes.
- Apply NorthWrit branding to user-visible names, logos, page metadata, emails, navigation, help text, and configuration defaults.
- Review technical identifiers individually; preserve migration history and compatibility-sensitive names unless there is a tested migration.
- Replace obsolete deployment guidance with Mike-based setup instructions. Establish formatting, build, type-check, and relevant test commands in CI.

Deliverables: Tracked NorthWrit application; brand/configuration changes; provenance record; developer setup; baseline CI.

Verification: Local Windows builds passed for the web, backend and Word add-in. Web lint and type checking, Word server tests and 197 focused rebrand tests passed. The full frontend run flagged two test files. The telemetry assertions now reflect NorthWrit's default, and the template checksum test handles Windows paths. Both files passed all 22 tests on rerun. Correcting the imported line endings resolved 49 backend test failures. The remaining 25 Windows failures reproduced with identical test names in the unmodified upstream revision under the same test setup. Subsequently, Linux GitHub CI passed all four jobs for organization PR #1. macOS packaging remains unverified.

**Acceptance:** The web, backend and Word builds pass, relevant automated checks are recorded, and the repository CI workflow covers the imported application. Browser journeys are part of release validation. Upstream notices remain intact and no credentials enter source control.

## Phase 4 — Build the legal workspace

**Goal:** Make daily legal work coherent around matters and their evidence.

**Prerequisite:** Complete and verify the repository structure migration above. Remap the existing Phase 4 extension points to their new paths before implementation.

Work:

1. Adapt Projects into Matters while preserving existing records, identifiers and links through explicit migrations or compatibility mapping.
2. Enforce firm and matter membership, roles, document ownership and matter-scoped retrieval. Apply the same scope to documents, search, Assistant context, background jobs, signed downloads, review results, drafts and exports. Reuse existing access helpers and domain services.
3. Implement the proposed navigation: Assistant, Matters, Documents, Research, Review, and Drafting. Keep matter context visible across surfaces. Map existing product terms such as Evidence and Folios to their relevant workflows instead of creating duplicate destinations. Group settings into personal preferences, workspace administration, AI/provider configuration, and capabilities according to role.
4. Connect intake, document upload, extraction, question answering, review, drafting, revision, and export into one traceable journey. Preserve the source document and version behind each evidence link. Add evidence navigation, processing/error states, version tracking, and clear empty states.
5. Verify the journey with synthetic contracts, two users and two matters. Test authorized access and denied UI, direct API and download requests. Run relevant builds, type checks and regressions without restarting the standalone cloud baseline test.

Canadian source integrations, CiteCheck, Shield and approval workflows remain in their planned later phases.

Deliverables: Workspace UI; matter/access model and migrations; settings map; working matter-to-draft journey.

**Acceptance:** An authorized user completes the journey without losing matter context. An unauthorized user cannot retrieve another matter's documents, answers, source passages, or exports. Draft revisions remain associated with their evidence and document versions.

## Phase 5 — Add NorthWrit capabilities

**Goal:** Deliver the Canadian legal and governance capabilities that distinguish NorthWrit.

Work:

- Integrate permitted Canadian research sources with jurisdiction, court, date, source provenance, and access limitations recorded. Validate source access before promising coverage.
- Implement Bearings for research scope and four-state CiteCheck: Verified, Unverified, Contradicted, and Unavailable. Define the evidence needed for each state; a working URL alone does not establish validity.
- Build cited Review Grids, reusable legal workflows, playbooks, and Firm Packs. Link findings to exact source passages and versions; mark findings stale when source documents change.
- Implement Folio review and approval bound to a specific output version and outbound payload. Editing content invalidates the prior approval.
- Enforce Shield policies at model and tool boundaries: allowed providers/routes, data handling, redaction where required, audit records, and blocked actions. Never silently switch to an unauthorized route.
- Evaluate retention, deletion, backup, and deployment-region behaviour against the selected pilot requirements.

Deliverables: Canadian research pipeline; citation evaluation set; Review Grid and Folio workflow; Shield policy enforcement; reusable workflow catalogue.

**Acceptance:** Representative synthetic Canadian legal tasks produce traceable evidence and accurate citation states under a defined evaluation rubric. Changed evidence or output invalidates dependent review/approval. Forbidden data routes and cross-matter access are blocked in executable tests. Legal workflow evaluation records reviewer findings and unresolved limitations.

## Phase 6 — Extend integrations

**Goal:** Add useful integrations while preserving matter scope and approval controls.

Work:

- Use the Phase 1 inventory to distinguish existing Mike functionality from new implementation.
- Define agents as governed task runners, connectors as external data access/synchronization, plugins as packaged capabilities, and MCP as a tool/resource protocol. Define configuration, permissions, and lifecycle for each.
- Add only the integrations needed for the pilot; select initial systems based on firm requirements and verified API access.
- Implement credential storage, scopes, synchronization status, retries, revocation, and deletion propagation for connectors.
- Add agent run history, cancellation, budgets, tool permissions, and explicit approval for external writes. Apply the same controls to MCP tools and plugin-provided actions.
- Validate Word drafting/review workflows and other required document integrations against the NorthWrit evidence and version model.

Deliverables: Capability registry; prioritized integration adapters; agent run history; connector administration; plugin/MCP configuration and audit records.

**Acceptance:** Each enabled integration has a working authorized flow and a denied/revoked flow. Agents cannot exceed their matter, tool, or data permissions. External writes require valid approval for the actual payload; retries do not create duplicate side effects. Unsupported capabilities are clearly labelled.

## Phase 7 — Validate and release

**Goal:** Release a reproducible pilot with demonstrated user workflows and operating support.

Work:

- Execute regression journeys for lawyers, reviewers, knowledge managers, and administrators, including upload, research, review, drafting, approval, export, and integration failures.
- Test tenant/matter isolation, authentication/session behaviour, prompt-injection handling, restricted outbound data, secret handling, and audit completeness.
- Measure ingestion and response performance using agreed pilot document sizes and concurrency. Set numerical targets from baseline evidence before release approval.
- Validate accessibility, supported browsers, backup restoration, migrations, rollback, monitoring, and incident procedures.
- Prepare release notes, deployment configuration, user/admin guides, known limitations, pilot scope, and support ownership. Commit reviewed changes, run CI, and publish through the agreed release process.

Deliverables: Release candidate; acceptance report; deployment and rollback runbooks; pilot documentation; release tag and change record.

**Acceptance:** Required pilot journeys pass, no unresolved critical security or data-loss defects remain, recovery has been demonstrated, and product/legal and operations reviewers accept the recorded pilot scope and limitations. Excluded features are visibly deferred rather than represented as delivered.

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
| Mike feature coverage and fit with existing specifications | 1 | Source-backed matrix and reconciled backlog |
| Model access and operating cost | 7 | Successful synthetic AI journey and usage record |
| Import layout and upstream update process | 3 | Tracked source and repeatable update procedure |
| Repository entry points, ownership and documentation authority | Before 4 | Verified root commands, active CI inventory and recorded decisions |
| Firm and matter isolation | 4 | Positive and negative access tests |
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

**Immediate next action:** Review the [migration verification](NorthWrit-Migration-Verification.md), address the recorded baseline limits as appropriate, then require successful GitHub CI and merge of PR #2 before closing the repository migration gate and beginning Phase 4. PR #1 and its CI verification are complete. This migration introduces no Phase 4 features and does not deploy or publish anything.

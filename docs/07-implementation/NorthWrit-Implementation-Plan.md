# NorthWrit implementation plan

Updated: November 16, 2026

Status: Phase 1 audit and Phase 3 application integration are complete. Repository organization, the expanded layout and the root npm workspace are merged. [PR #4](https://github.com/VenkataAnilKumar/NorthWritX/pull/4) verified the application baseline with all seven PR checks passing; merge commit `d7e899526a389cbbe684b18618b32df98ccea237` was verified on remote `main`. See the [configuration record](NorthWrit-Configuration-Verification.md) for compatibility exceptions and release limits. Phase 4 has not started. No deployment or pilot release is established by these merges.

Latest baseline: subsequent GitHub changes through `7c08dba` include [PR #5](https://github.com/VenkataAnilKumar/NorthWritX/pull/5) (configuration/documentation alignment) and [PR #6](https://github.com/VenkataAnilKumar/NorthWritX/pull/6) (reference archive retirement). [ADR 0004](../decisions/0004-retire-source-reference-archive.md) and the [source provenance record](../06-technical/NorthWrit-Source-Provenance.md) govern the retained source history. Earlier verification statements refer to their own revisions.

## Current capability documentation

The [product catalogue](../02-product/NorthWrit-Product-Catalogue.md), [current architecture](../06-technical/NorthWrit-Current-Implementation.md), [system flows](../06-technical/NorthWrit-System-Flows.md), [user guide](../guides/user-guide.md) and [administrator guide](../guides/administrator.md) describe the existing application. The [capability matrix](../04-specs/NorthWrit-Capability-Matrix.md) accounts for all 105 requirements without treating building blocks as acceptance. The [documentation coverage map](NorthWrit-Documentation-Coverage.md) records source/guide evidence and remaining checks. This documentation work does not implement Phase 4.

## Navigation milestone before Phase 4

Implement **Assistant · Matters · Library · Workflows** across the shared web and desktop UI. Group existing sections, move IDE discovery into Settings → Advanced and retain existing routes, data and authorization. See the [navigation milestone](NorthWrit-Navigation-Milestone.md) for the implementation sequence, acceptance criteria and verification. This work precedes Phase 4 and does not start its matter data model.

## Objective and scope

Build NorthWrit as a Harvey-style legal AI workspace for Canadian law firms using **the imported application as its sole foundation**. Integrate and configure the pinned source, then deliver matter-based workflows, Canadian research, evidence-backed review and drafting, governed AI execution, and integrations.

This is the current implementation roadmap. It replaces the older implementation phases, sprint plan, implementation checklist, reuse execution plan, agent prompts, and v3 roadmap. Existing product specifications remain requirements inputs; their release labels and architecture proposals must be reconciled with the NorthWrit audit rather than treated as verified implementation.

The active application spans root `apps/` and `packages/`, with [recorded provenance](../06-technical/NorthWrit-Source-Provenance.md), imported from the upstream revision `a5c147d6587ca465f301e8479f6c50fbc5731c45`.

## Delivery sequence

| Phase | Outcome | Depends on | Status |
|---|---|---|---|
| 1. Audit the original application | Source-backed capability map and implementation backlog | Pinned source | Complete |
| 3. Integrate and configure | Maintainable NorthWrit application baseline | Phase 1 | Complete; PR #4 merged with all seven checks passing |
| Repository organization | Clear entry points, ownership, documentation and verification commands | Phase 3 | Complete; PR #1 merged |
| Repository structure migration | Separate application surfaces, worker entry point, shared packages and infrastructure | Initial repository organization | Complete; PR #2 merged with all seven checks passing |
| Root npm workspace | One frozen install graph and NorthWrit package names | Repository structure migration | Complete; PR #3 merged with all seven checks passing |
| 4. Build the legal workspace | Complete matter-based user journeys | Merged workspace and application baseline | Not started |
| 5. Add NorthWrit capabilities | Canadian legal workflows and enforceable governance | Phase 4 | Planned |
| 6. Extend integrations | Governed agents, connectors, plugins, and MCP | Phase 5 | Planned |
| 7. Validate and release | Evidence-backed pilot release and operating procedures | Phase 6 | Planned |

Each phase closes with a demonstration, recorded checks, known limitations, and an updated backlog. Engineering owns implementation; product/legal reviewers assess legal workflow quality; security/operations reviewers assess access, data handling, and deployment. Named owners and effort estimates remain to be assigned before implementation of the next phase. These are delivery gates, not calendar commitments.

## Completed repository preparation

Repository preparation is complete and is not a new numbered phase. Phase 2 remains removed from this roadmap. Product priority labels P0/P1/P2 in the specifications do not map to implementation phase numbers.

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

## Phase 3 — Integrate and configure

**Goal:** Create a versioned NorthWrit baseline that can receive upstream fixes.

Work:

- Import the verified NorthWrit snapshot into a tracked application directory, proposed as `apps/northwrit/`, with source provenance and an upstream update procedure. Avoid accidentally committing the nested checkout as a Git link.
- Preserve applicable licenses and attribution. Record imported paths and subsequent local changes.
- Configure product metadata, emails, navigation, help links and environment defaults for NorthWrit.
- Review technical identifiers individually; preserve migration history and compatibility-sensitive names unless there is a tested migration.
- Replace obsolete deployment guidance with NorthWrit-based setup instructions. Establish formatting, build, type-check, and relevant test commands in CI.

Deliverables: Tracked NorthWrit application; verified configuration; provenance record; developer setup; baseline CI.

Earlier verification: Local Windows builds passed for the web, backend and Word add-in. Web lint and type checking, Word server tests and 197 focused application tests passed. The full frontend run flagged two test files. The telemetry assertions now reflect NorthWrit's default, and the template checksum test handles Windows paths. Both files passed all 22 tests on rerun. Correcting the imported line endings resolved 49 backend test failures. The remaining 25 Windows failures reproduced with identical test names in the unmodified upstream revision under the same test setup. Subsequently, Linux GitHub CI passed all four jobs for organization PR #1. macOS packaging remains unverified.

Latest verification: PR #4 merged on November 14, 2026 with repository, backend, frontend, Word and all three image checks passing. The [configuration verification record](NorthWrit-Configuration-Verification.md) records the follow-up fixes. Attribution, stored formats, existing sessions and protected technical identifiers remain explicitly documented compatibility exceptions.

**Acceptance:** The web, backend and Word builds pass, relevant automated checks are recorded, and the repository CI workflow covers the imported application. Browser journeys are part of release validation. Upstream notices remain intact and no credentials enter source control.

## Phase 4 — Build the legal workspace

**Goal:** Make daily legal work coherent around matters and their evidence.

**Prerequisite:** Use the merged repository/workspace/application baseline and the current Phase 4 extension map. Define the acceptance fixtures and ownership described above before implementation.

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

- Use the Phase 1 inventory to distinguish existing NorthWrit functionality from new implementation.
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
| NorthWrit feature coverage and fit with existing specifications | 1 | Source-backed matrix and reconciled backlog |
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

**Immediate next action:** Begin the planned Phase 4 matter-foundation assessment using the merged application baseline. Define ownership and synthetic acceptance fixtures before implementation. No Phase 4 feature, deployment or publication is included in this documentation update.

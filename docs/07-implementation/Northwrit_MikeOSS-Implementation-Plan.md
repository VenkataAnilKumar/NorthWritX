# NorthWrit implementation plan — Mike OSS

Updated: November 10, 2026

Status: Phase 1 source audit and Phase 3 integration and rebrand complete. Phase 4 is next.

## Objective and scope

Build NorthWrit as a Harvey-style legal AI workspace for Canadian law firms using **Mike OSS as the sole application foundation**. Integrate and rebrand the pinned source, then deliver matter-based workflows, Canadian research, evidence-backed review and drafting, governed AI execution, and integrations.

This is the current implementation roadmap. It replaces the older implementation phases, sprint plan, implementation checklist, reuse execution plan, agent prompts, and v3 roadmap. Existing product specifications remain requirements inputs; their release labels and architecture proposals must be reconciled with the Mike audit rather than treated as verified implementation.

The active application is [`apps/northwrit/`](../../apps/northwrit/NORTHWRIT.md), imported from the upstream revision `a5c147d6587ca465f301e8479f6c50fbc5731c45`. [Upstream source](https://github.com/Open-Legal-Products/mike)

## Delivery sequence

| Phase | Outcome | Depends on | Status |
|---|---|---|---|
| 1. Audit Mike OSS | Source-backed capability map and implementation backlog | Pinned source | Complete |
| 3. Integrate and rebrand | Maintainable NorthWrit application baseline | Phase 1 | Complete |
| 4. Build the legal workspace | Complete matter-based user journeys | Phase 3 | Planned |
| 5. Add NorthWrit capabilities | Canadian legal workflows and enforceable governance | Phase 4 | Planned |
| 6. Extend integrations | Governed agents, connectors, plugins, and MCP | Phase 5 | Planned |
| 7. Validate and release | Evidence-backed pilot release and operating procedures | Phase 6 | Planned |

Each phase closes with a demonstration, recorded checks, known limitations, and an updated backlog. Engineering owns implementation; product/legal reviewers assess legal workflow quality; security/operations reviewers assess access, data handling, and deployment. Named owners and effort estimates will be assigned after Phase 1. These are delivery gates, not calendar commitments.

## Phase 1 — Audit Mike OSS

**Goal:** Establish exactly what the pinned source provides and what NorthWrit must build.

Work:

- Inventory routes, navigation, settings, APIs, services, database schema, migrations, storage, authentication, model providers, background jobs, and deployment configuration.
- Trace Projects, Assistant, Library, Tabular Reviews, Workflows, connectors, and the Word add-in through source and documentation. Record agents, plugins, and MCP as supported, partial, absent, or unverified based on evidence.
- Map the existing NorthWrit feature IDs and user journeys to reuse, adapt, build, or defer decisions. Record permission boundaries and failure paths, not just visible screens.
- Identify differences between Mike and existing NorthWrit architecture documents. Prefer the working foundation unless a documented requirement justifies a change.
- Record upstream revision, dependency notices, update strategy, runtime prerequisites, required secrets by name, and likely cloud resource requirements.

Deliverables: Capability matrix with source paths; architecture and data-flow inventory; requirements gap backlog; cloud startup runbook; decision log.

Results: [Source audit and gap backlog](Northwrit_MikeOSS-Source-Audit.md), [105-feature disposition](Northwrit_MikeOSS-Feature-Disposition.md), and [cloud startup runbook](Northwrit_MikeOSS-Cloud-Runbook.md).

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

Verification: Local Windows builds passed for the web, backend and Word add-in. Web lint and type checking, Word server tests and 197 focused rebrand tests passed. The full frontend run flagged two test files. The telemetry assertions now reflect NorthWrit's default, and the template checksum test handles Windows paths. Both files passed all 22 tests on rerun. Correcting the imported line endings resolved 49 backend test failures. The remaining 25 Windows failures reproduced with identical test names in the unmodified upstream revision under the same test setup. Linux GitHub CI and macOS packaging have yet to run.

**Acceptance:** The web, backend and Word builds pass, relevant automated checks are recorded, and the repository CI workflow covers the imported application. Browser journeys are part of release validation. Upstream notices remain intact and no credentials enter source control.

## Phase 4 — Build the legal workspace

**Goal:** Make daily legal work coherent around matters and their evidence.

Work:

- Implement the proposed navigation: Assistant, Matters, Documents, Research, Review, and Drafting. Map existing product terms such as Evidence and Folios to their relevant workflows instead of creating duplicate destinations.
- Adapt Projects into Matters with firm membership, matter membership, roles, document ownership, and matter-scoped retrieval. Enforce access in APIs, database queries, storage downloads, and background jobs.
- Group settings into personal preferences, workspace administration, AI/provider configuration, and capabilities according to role.
- Connect intake, document upload, extraction, question answering, review, drafting, revision, and export into one traceable journey.
- Add evidence navigation, processing/error states, version tracking, and clear empty states. Make persisted data migrations explicit.

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
| Firm and matter isolation | 4 | Positive and negative access tests |
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

**Immediate next action:** Start Phase 4 against the [NorthWrit application](../../apps/northwrit/NORTHWRIT.md).

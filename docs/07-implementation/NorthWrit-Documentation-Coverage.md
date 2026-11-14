# NorthWrit documentation coverage

Reviewed November 14, 2026 against baseline `7c08dba`. This record maps current product documentation to application areas and engineering references. It is a static documentation/source review; no application services, provider calls or browser/Office acceptance journeys were run for this pass.

## Documentation responsibilities

| Document | Purpose |
|---|---|
| [Product catalogue](../02-product/NorthWrit-Product-Catalogue.md) | Current capabilities, user surfaces, configuration and limits |
| [Current implementation](../06-technical/NorthWrit-Current-Implementation.md) | Working stack, runtime topology, state ownership and dependency/trust boundaries |
| [System flows](../06-technical/NorthWrit-System-Flows.md) | Authentication, upload/processing, generation, approvals, export and offboarding |
| [Capability matrix](../04-specs/NorthWrit-Capability-Matrix.md) | All 105 feature IDs mapped to candidate capabilities, building blocks, planned or deferred work |
| [User guide](../guides/user-guide.md) | Current user tasks and client limitations |
| [Administrator guide](../guides/administrator.md) | Instance configuration, roles, credentials, worker operations and lifecycle checks |
| [Implementation plan](NorthWrit-Implementation-Plan.md) | Delivery phases and acceptance gates |

Current feature documentation uses the actual Projects, Assistant, Library and Tabular Reviews surfaces. Proposed Matter, Bearings, CiteCheck, Shield and Folio requirements remain labelled as planned work. Product priority labels are distinct from implementation phases.

## Application and evidence map

Test links below identify available automated coverage; their presence is not a claim that this review executed them or that every requirement is covered.

| Capability area | Current implementation | Detailed reference or representative tests |
|---|---|---|
| Authentication and session | [Auth module](../../apps/api/src/modules/auth/), [session](../../apps/api/src/lib/authSession.ts) | [Auth refresh tests](../../apps/api/src/__tests__/integration/authRefreshFanOut.routes.test.ts), [local email/auth setup](../engineering/local-development.md) |
| Projects and access | [Project module](../../apps/api/src/modules/projects/), [project access](../../apps/api/src/lib/projectAccess.ts) | [Project routes](../../apps/api/src/__tests__/integration/projects.routes.test.ts), [shared access](../../apps/api/src/lib/access.ts) |
| Assistant and project chat | [Chat](../../apps/api/src/modules/chat/), [project chat](../../apps/api/src/modules/project-chat/) | [Run contracts](../engineering/backend-architecture.md#server-owned-runs), [project-chat tests](../../apps/api/src/__tests__/integration/projectChat.routes.test.ts) |
| Library and templates | [Library module](../../apps/api/src/modules/library/) | [Preset templates](../engineering/preset-templates.md) |
| Uploads and processing | [Upload module](../../apps/api/src/modules/uploads/) | [Completion tests](../../apps/api/src/__tests__/integration/uploadSessions.complete.routes.test.ts), [processing tests](../../apps/api/src/modules/uploads/__tests__/uploads.processing.test.ts) |
| Versions and derived text | [Documents](../../apps/api/src/modules/documents/), [source documents](../../apps/api/src/modules/source-documents/) | [Text/search lifecycle](../engineering/document-text-search.md) |
| Tabular Reviews | [Tabular module](../../apps/api/src/modules/tabular/) | [Tabular route tests](../../apps/api/src/__tests__/integration/tabular.routes.test.ts), [generation contract](../engineering/backend-architecture.md#tabular-review-generation) |
| Playbooks and drafting | [Playbook module](../../apps/api/src/modules/playbooks/) | [Playbook operations](../engineering/playbooks.md), [preview engines](../engineering/docx-preview-engines.md) |
| Workflows and add-ons | [Workflow module](../../apps/api/src/modules/workflows/) | [Catalogue source](../../apps/api/src/lib/workflowCatalogSource.ts), [delegated tasks](../engineering/subagents.md) |
| Memory | [Memory module](../../apps/api/src/modules/memory/) | [Scope, learning and deletion](../engineering/memory.md) |
| Models | [Models module](../../apps/api/src/modules/models/), [provider layer](../../apps/api/src/lib/llm/) | [Configured endpoints](../engineering/configured-models.md), [provider setup](../engineering/direct-provider-models.md) |
| External connectors and approval | [User module](../../apps/api/src/modules/user/) | [MCP controls](../engineering/connectors.md), [Google consent/actions](../engineering/google-workspace.md), [connector route tests](../../apps/api/src/__tests__/integration/connectors.routes.test.ts) |
| Research tools | [Provider/tool layer](../../apps/api/src/lib/llm/) | [Web search](../engineering/web-search.md), [US case-law tools](../engineering/courtlistener.md) |
| Organization lifecycle and audit | [Organizations](../../apps/api/src/modules/orgs/), [audit](../../apps/api/src/modules/audit/) | [Offboarding](../engineering/organization-offboarding.md), [organization route tests](../../apps/api/src/__tests__/integration/orgs.routes.test.ts) |
| Artifact access and export | [Downloads](../../apps/api/src/modules/downloads/), [export orchestration](../../apps/api/src/application/exports/) | [Integrity format](../engineering/tamper-evident-exports.md), [export access tests](../../apps/api/src/application/exports/__tests__/buildJsonExport.access.test.ts) |
| Word | [Word client](../../apps/word-addin/), [Word chat](../../apps/api/src/modules/word-chat/) | [Word guide](../../apps/word-addin/README.md), [Word route tests](../../apps/api/src/__tests__/integration/wordChat.routes.test.ts) |
| Desktop | [Electron client](../../apps/desktop/) | [Desktop guide](../../apps/desktop/README.md) |
| Workers and infrastructure | [Worker launcher](../../apps/worker/), [API worker runtime](../../apps/api/src/workerRuntime.ts), [Compose](../../infra/docker-compose.yml) | [Worker lifecycle checks](../../apps/worker/README.md), [CI inventory](NorthWrit-CI-Inventory.md) |
| Architecture boundaries | [Domain/application/kernel organization](../engineering/backend-architecture.md) | [Architecture tests](../../apps/api/src/__tests__/architecture.test.ts), [cycle tests](../../apps/api/src/__tests__/dependencyCycles.test.ts) |

## Known documentation and acceptance gaps

- Current code and detailed guides must be checked together; older investigation and measurement records retain their original revision/date and are not current acceptance evidence.
- Newer document-validation guidance cannot be treated as current behaviour without the corresponding implementation and tests. This pass adds no new parser or upload guarantees.
- Live browser/database journeys, actual provider/connector permissions, queued-work revocation, source-version invalidation, signed macOS packaging and Office-host acceptance remain separate checks.
- No full Canadian research coverage, certified residency, comprehensive zero-egress mode, full legal-hold system or complete version-bound Folio approval is established by this documentation.
- The 105-feature matrix retains the existing delivery allocation. Requirement completion needs explicit evidence and a recorded status change rather than an automatic promotion from related code.

## Maintaining this map

When changing a capability, update its catalogue description, relevant flow and user/admin guidance together. Link evidence to the current paths and state whether it is code inspection, mocked tests, a live service check or pilot acceptance. Preserve historical observations; update their surrounding navigation when a newer guide becomes authoritative. Run repository, naming and whitespace checks and verify edited links/fragments before review.

## Detailed engineering document inventory

The table accounts for the 41 existing engineering Markdown references. Historical records and templates are kept distinct from current operating guidance; file presence does not establish runtime verification.

| Reference | Role |
|---|---|
| [NorthWrit engineering documentation](../engineering/README.md) | Engineering navigation |
| [Backend architecture](../engineering/backend-architecture.md) | Implementation or operating reference; verify current configuration and paths |
| [Declaring OpenAI-compatible models](../engineering/configured-models.md) | Implementation or operating reference; verify current configuration and paths |
| [MCP connectors](../engineering/connectors.md) | Implementation or operating reference; verify current configuration and paths |
| [CourtListener integration](../engineering/courtlistener.md) | Implementation or operating reference; verify current configuration and paths |
| [Manual and production deployment](../engineering/deployment.md) | Implementation or operating reference; verify current configuration and paths |
| [Design system](../engineering/design-system.md) | Implementation or operating reference; verify current configuration and paths |
| [Direct provider models](../engineering/direct-provider-models.md) | Implementation or operating reference; verify current configuration and paths |
| [Stored document text and agent search](../engineering/document-text-search.md) | Implementation or operating reference; verify current configuration and paths |
| [DOCX editor](../engineering/docx-preview-engines.md) | Implementation or operating reference; verify current configuration and paths |
| [End-to-end tests in CI](../engineering/e2e-ci.md) | Implementation or operating reference; verify current configuration and paths |
| [Frontend unit-test coverage](../engineering/frontend-testing.md) | Implementation or operating reference; verify current configuration and paths |
| [Google Drive](../engineering/google-drive.md) | Implementation or operating reference; verify current configuration and paths |
| [Google Workspace: Drive, Gmail, and Calendar](../engineering/google-workspace.md) | Implementation or operating reference; verify current configuration and paths |
| [Assistant streaming: maximum update depth](../engineering/incidents/2026-09-29-assistant-update-depth.md) | Historical investigation or test evidence; use its recorded scope/date |
| [Streaming effect audit, 2026-09-29](../engineering/incidents/2026-09-29-streaming-effects-audit.md) | Historical investigation or test evidence; use its recorded scope/date |
| [Local development](../engineering/local-development.md) | Implementation or operating reference; verify current configuration and paths |
| [Scoped memory](../engineering/memory.md) | Implementation or operating reference; verify current configuration and paths |
| [Error tracking with Sentry](../engineering/observability.md) | Implementation or operating reference; verify current configuration and paths |
| [Organization offboarding](../engineering/organization-offboarding.md) | Implementation or operating reference; verify current configuration and paths |
| [Playbooks](../engineering/playbooks.md) | Implementation or operating reference; verify current configuration and paths |
| [Preset contract templates](../engineering/preset-templates.md) | Implementation or operating reference; verify current configuration and paths |
| [Safe Local Testing](../engineering/safe-local-testing.md) | Implementation or operating reference; verify current configuration and paths |
| [> Historical imported upstream evidence. This record is not a NorthWrit acceptance result.](../engineering/sentry-data-audit.md) | Historical investigation or test evidence; use its recorded scope/date |
| [> Historical imported upstream evidence. This record is not a NorthWrit acceptance result.](../engineering/sentry-issue-review-2026-09-23.md) | Historical investigation or test evidence; use its recorded scope/date |
| [Service boundaries: ownership and workflow orchestration](../engineering/service-boundaries.md) | Implementation or operating reference; verify current configuration and paths |
| [Subagents](../engineering/subagents.md) | Implementation or operating reference; verify current configuration and paths |
| [Archived: Legal Workflows — Design Spec](../engineering/superpowers/specs/2026-06-29-legal-workflows-design.md) | Design proposal/history; not current product acceptance |
| [Tamper-evident exports](../engineering/tamper-evident-exports.md) | Implementation or operating reference; verify current configuration and paths |
| [PRD: <title>](../engineering/templates/PRD.md) | Document template |
| [Test Depth: Mutation Testing and the SSE Load Harness](../engineering/test-depth.md) | Implementation or operating reference; verify current configuration and paths |
| [> Historical imported upstream evidence. This record is not a NorthWrit acceptance result.](../engineering/test-evidence/google-discover-2026-09-24.md) | Historical investigation or test evidence; use its recorded scope/date |
| [> Historical imported upstream evidence. This record is not a NorthWrit acceptance result.](../engineering/test-evidence/google-integrations-2026-09-23.md) | Historical investigation or test evidence; use its recorded scope/date |
| [> Historical imported upstream evidence. This record is not a NorthWrit acceptance result.](../engineering/test-evidence/google-integrations-screenshot-walkthrough.md) | Historical investigation or test evidence; use its recorded scope/date |
| [> Historical imported upstream evidence. This record is not a NorthWrit acceptance result.](../engineering/test-evidence/google-workspace-live-2026-09-22.md) | Historical investigation or test evidence; use its recorded scope/date |
| [> Historical imported upstream evidence. This record is not a NorthWrit acceptance result.](../engineering/test-evidence/streaming-effects-2026-09-29/README.md) | Historical investigation or test evidence; use its recorded scope/date |
| [Backend unit-test coverage](../engineering/testing-coverage.md) | Implementation or operating reference; verify current configuration and paths |
| [Troubleshooting](../engineering/troubleshooting.md) | Implementation or operating reference; verify current configuration and paths |
| [Web search](../engineering/web-search.md) | Implementation or operating reference; verify current configuration and paths |
| [Archived: Word add-in assistant scroll-jump report](../engineering/word-addin-chat-scroll-report.md) | Historical investigation or test evidence; use its recorded scope/date |
| [Word add-in development and deployment](../engineering/word-addin-development.md) | Implementation or operating reference; verify current configuration and paths |

## Verification for this documentation pass

- Repository entry-point, workspace and CI inventory checks passed.
- Naming/compatibility checks passed; protected snapshot entries remain validated.
- Git whitespace checks passed.
- All 685 local links and heading fragments across 46 changed/new Markdown documents resolved at the end of this pass.
- The capability matrix contains exactly 105 unique IDs with names/priorities matching the specification: 38 P0, 39 P1 and 28 P2.
- Every one of the 41 engineering Markdown references appears in the inventory.
- The renamed configuration helper parses as Python; no helper, application stack, provider integration, deployment or publication was executed for this documentation pass.

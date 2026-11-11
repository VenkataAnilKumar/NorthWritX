# Phase 1 — Mike OSS source audit

Reviewed November 10, 2026 at `a5c147d6587ca465f301e8479f6c50fbc5731c45` (source version `2.1.0`). Evidence below refers to paths within the pinned checkout. This is a static review. Live behaviour, deployment reachability and NorthWrit security guarantees require implementation and release validation.

## Product and architecture inventory

| Surface | Source evidence and behaviour | NorthWrit disposition |
|---|---|---|
| Sign-in and onboarding | `frontend/src/app` has sign-up, verification, SSO, MFA, reset and onboarding routes. `backend/src/modules/auth` integrates with Supabase Auth. Local confirmation uses Mailpit. | Reuse for smoke test. Verify enforceable firm MFA and tenant provisioning. |
| Assistant and history | `frontend/src/app/(pages)/assistant`, `history`, `backend/src/modules/chat` and `project-chat`. Streaming chat, model selection, document tools, saved conversations and project context. | Adapt to Assist, evidence navigation and saving outputs to a matter. Verify citation accuracy and history isolation. |
| Projects | Project list/detail, folders, project chat and tabular review routes. `backend/src/modules/projects`, `memory` and `docs/organization-offboarding.md` document workspace and access concepts. | Adapt to Matters. Validate membership and sharing at ingestion, retrieval, jobs, signed downloads and exports. Add firm roles and ethical walls. |
| Library and documents | Library files, folders, templates and presets. `backend/src/modules/uploads`, `documents`, `source-documents`, `downloads` and `docs/document-text-search.md`. Upload sessions sign staging PUT URLs and workers verify and process files. | Reuse upload and source-viewing paths. Verify PDF/DOCX, source version binding, permissions and deleted or replaced document behaviour. |
| Tabular Reviews | Standalone and project review routes, `backend/src/modules/tabular`, `e2e/tabular-reviews.spec.ts`. Asynchronous extraction and cited evidence. | Adapt to Review Grid. Verify cell-to-passage links, empty fields, extraction failures, reruns and exports. Add stale evidence rules. |
| Draft and playbooks | Playbooks list/detail, `backend/src/modules/playbooks`, `docs/playbooks.md`, `docs/docx-preview-engines.md`, `word-addin/`. Playbook authoring/import, contract checks, draft tools and Word. | Adapt for precedents, redlines and Folios. Validate export fidelity and version-bound reviewer approval separately. |
| Legal and web research | `docs/courtlistener.md` and `docs/web-search.md`. CourtListener provides U.S. case-law tools. Web and legal integrations have separate configuration. | Reuse tool and citation patterns. Build Canadian source adapters, Bearings, coverage filters and CiteCheck. |
| Workflows, subagents and packs | `frontend/src/app/(pages)/workflows` includes Assistant and tabular workflows and add-on pack screens. `backend/src/modules/workflows`, `backend/src/lib/workflowCatalogSource.ts`, `docs/subagents.md`. Subagents can request questions or approvals through the parent run. | Reuse catalogues and execution building blocks. Verify persistence, budgets, cancellation and trace depth. Adapt packs to firm installation and version policy. General plugin sandbox and marketplace coverage are unverified. |
| Connectors and MCP | `docs/connectors.md`, `docs/google-workspace.md`, `docs/google-drive.md` and `e2e/connector-approval.spec.ts`. MCP OAuth and tool controls, native Google connections, Slack MCP setup and approvals using stored arguments. Upstream documents limitations in Word and tabular approval surfaces. | Adapt before adding integrations. Verify revoke, expired approval, retries and connector-side permissions. Extend exact-payload approval to NorthWrit external writes across surfaces. |
| Personal settings | `frontend/src/app/(pages)/settings` includes Appearance, Personalisation, Security, Privacy/Data, Memory, My Activity, Models, BYOK, Connectors, Features and Organizations. | Group existing screens by user task. Add Canadian preferences and explain policy inherited from firm and matter. |
| Firm administration | Organization settings routes cover members, providers, privacy/data, private content and audit. `backend/src/modules/orgs`, `audit`, `docs/configured-models.md`, `docs/organization-offboarding.md`. | Adapt for NorthWrit Control Centre. Validate authority and offboarding across all surfaces. Build missing Shield controls and audit coverage. |
| Desktop and auxiliary surfaces | `desktop/`, `word-addin/`, IDE route, support route. | Track separately. The web pilot is first. Validate Word when its required flows are in scope. Defer desktop/offline guarantees. |
| Runtime, storage and jobs | `docker-compose.yml`, `backend/src/app.ts`, `index.ts`, `jobs/`, `workers/`, `docs/backend-architecture.md`, `docs/deployment.md`. Next.js forwards API calls to Express. Supabase supplies Postgres, Auth and REST. RustFS serves S3-compatible objects. Redis/BullMQ handles queues in Compose. Backend starts background workers. | Keep the existing topology for baseline. Record schema/migration ownership, storage and queue recovery before changing deployment. |
| CI, diagnostics and security | `.github/workflows/` includes CI, E2E, image publishing, schema drift, stack tests and security workflows. `e2e/` covers auth, projects, chat, tabular, connectors and settings. `docs/observability.md` documents Sentry settings. | Reuse tests and pin build provenance. Disable community telemetry in baseline, use synthetic data and add NorthWrit policy and legal evaluation cases. |

### Trust and data boundaries

The browser talks to the Next.js API gateway for application traffic and uses a browser-reachable signed storage URL for direct uploads. Auth confirmation separately uses the Supabase gateway. The backend owns authenticated requests and job dispatch. Postgres holds application records, while storage holds documents and staging objects. The job worker verifies staged files before conversion and processing. Model calls, web search and connector tools have distinct outbound paths. Enforcing Shield at the chat endpoint alone would leave worker and connector paths outside the policy. Sources: `docker-compose.yml`, `backend/src/app.ts`, `backend/src/lib/storage/s3.ts`, `docs/deployment.md`.

## Gap backlog and journey decisions

| Order | Work and phase | Acceptance evidence |
|---|---|---|
| 2 | Integrate with preserved source notices, update history and repeatable builds in Phase 3. | Recorded source SHA and notices, CI plus baseline regression. |
| 3 | Establish Matter as the authorization boundary in Phase 4. | Two users and two matters. Positive and denied tests for direct reads, signed downloads, jobs, search, assistants and exports. |
| 4 | Research lawyer memo and admin audit in Phase 5. | Canadian source access decision, Bearings intake, exact passages, all four citation states, reviewed memo, no unauthorized egress, complete policy log. |
| 5 | Contract counsel and knowledge manager in Phase 5. | Versioned playbook/precedent, cited comparison, redline and Folio review. Replacing a source marks findings stale. Changing an approved output requires fresh approval. |
| 6 | Legal operations intake and triage in Phase 6, subject to pilot scope. | Approved intake channel, matter routing, ownership, escalation, run trail and explicit approval for external writes. |
| 7 | Pilot evidence and operating readiness in Phase 7. | NorthWrit Bench, accessibility, isolation and recovery tests, measured performance and release scope. |

## Decisions and unresolved checks

- Keep Mike’s existing schema and services as the imported baseline. Treat architecture proposals in NorthWrit’s older design documents as requirements to reconcile during implementation.
- Preserve Mike’s license, credits and source revision. Review package manifests, lockfiles, image inputs and the separate workflow catalogue before importing upstream code or content. The nested checkout remains separate.
- Reuse existing model adapters, provider settings, connector controls and stored write approvals where verified. NorthWrit’s matter scope, policy precedence, run provenance and exact-payload requirements still need executable tests.
- Build Canadian research coverage after confirming usable sources and access terms. Legal accuracy, treatment checks and Canadian data residency have no baseline sign-off.
- Before deployment, verify capacity, workflow catalogue availability and model access. Browser routing must cover application, confirmation links and signed uploads.
- Verify streaming, denied access, source positioning, approval replay, Word exports and offboarding with real test cases. Existing upstream tests serve as pointers, not NorthWrit test results.

[Archived cloud startup notes](Northwrit_MikeOSS-Cloud-Runbook.md) · [Feature disposition](Northwrit_MikeOSS-Feature-Disposition.md) · [Implementation plan](Northwrit_MikeOSS-Implementation-Plan.md)

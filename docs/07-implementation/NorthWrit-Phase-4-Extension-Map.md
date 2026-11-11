# Phase 4 extension map

Status: implementation map, not a completed feature. Paths below are relative to `apps/northwrit/`. The [Phase 4 plan](NorthWrit-Implementation-Plan.md#phase-4--build-the-legal-workspace) defines the ordered scope and acceptance criteria. Canadian source adapters, CiteCheck, Shield and approval workflows remain later-phase work.

| Phase 4 concern | Existing owner and extension point | Verification required |
|---|---|---|
| Projects presented as Matters | `backend/src/modules/projects/`, `lib/projectAccess.ts`; web `src/app/(pages)/projects/` and project components | Preserve IDs, existing records and project URLs. Define any Matter route/API aliases or migration explicitly; test old links and new navigation. |
| Firm and matter roles | `backend/src/lib/access.ts`, `permissions.ts`, `projectAccess.ts`, `orgAccessOverrides.ts`; `modules/orgs/` | Reuse current organization/grant semantics where valid. Test current membership, role restrictions, revocation and denied direct access. A display-name change is not a new authorization model. |
| Schema and compatibility | `backend/schema.sql`, `backend/migrations/`, `modules/projects/` | Add incremental migrations only where required; update the fresh schema and ledger together. Preserve historic migrations and legacy personal/project data. |
| Upload and ownership | `modules/uploads/`, `modules/documents/`, `modules/projects/`; shared client upload sessions | Validate the destination matter, verify staged objects, retain source/version identity, and refuse cross-matter IDs. Test PDF/DOCX, processing and failure states. |
| Documents and retrieval | `modules/documents/`, `modules/source-documents/`, `lib/documentWorkspace.ts`, `lib/documentVersions.ts` | Apply current scope to text/search/source reads and exact evidence versions. Replacing a source must not redirect an old evidence link silently. |
| Assistant context | `modules/chat/`, `modules/project-chat/`; project Assistant web routes | Bound selected sources and saved answers to the selected matter. Test cross-matter inputs and history access; preserve context across surfaces. |
| Review results | `modules/tabular/`, project tabular-review web routes | Inherit the matter boundary, preserve cited document/version identity and show failed/unresolved processing. Do not claim later approval/staleness governance is delivered. |
| Drafts, revisions and export | Existing document edit/version/export paths; `modules/playbooks/`, `modules/downloads/`, `backend/src/application/exports/` | Trace output revisions to the matter and evidence snapshot. Recheck current access when finalizing exports and redeeming application download links. Record version and draft limitations. |
| Signed downloads | `modules/downloads/`, document download helpers, storage capability/signing helpers in `backend/src/lib/` | Test copied URLs, version substitution, revoked membership and another user's requests. Document capability lifetime; an issued storage signature does not itself recheck membership. |
| Background execution | `backend/src/jobs/registry.ts`, `workers/`, `workerRuntime.ts`, module job implementations and application orchestration | Carry actor/matter scope, recheck authorization before execution and before publishing results, and test revocation after queuing. Preserve retry/idempotency contracts. |
| Workspace navigation | `frontend/src/app/components/shared/AppSidebar.tsx`, app contexts and page layouts | Organize Assistant, Matters, Documents, Research, Review and Drafting using existing primitives. Show active matter consistently; test switches, empty states and denied links. |
| User and firm settings | Web settings and organization-settings routes; `modules/user/`, `modules/orgs/`, model configuration | Distinguish personal preferences from administrator operations. Enforce server roles; hiding a settings link is insufficient. |

## Test ownership

- Backend domain suites cover permission decisions, route admission, jobs, evidence/version binding, downloads and export finalization. Reuse the existing fake-DB and route-integration patterns where appropriate.
- Real database tests verify migration compatibility, grants/RLS and the distinction between authorized and unauthorized accounts. Mocks cannot establish those guarantees.
- Web component/hook tests cover navigation, visible context, role-based controls and processing/empty/error states.
- Browser journeys use synthetic contracts, two users and two matters. Test authorized creation through evidence review, drafting and export, then deny UI, direct API and download access from the unshared account. Distinguish real inference from stubs.
- Relevant build, type, lint and regression checks are reached through root aliases. Read the [CI inventory](NorthWrit-CI-Inventory.md) for current gaps. Do not restart the archived standalone cloud baseline to satisfy these checks.

This map assigns work to existing owners. It does not create new services, rename database tables or promote packages to the repository root.

# Phase 4A — Matter contracts and acceptance fixtures

Prepared November 16, 2026 against `ef36828`. Status: proposed design package, source-reviewed and subject to the unresolved decisions below. No schema/API/UI implementation or database acceptance is claimed. Phase 2 reviewer closure remains pending; this package makes the next design concrete without marking those decisions resolved.

Subsequent implementation: see the [4B metadata verification record](NorthWrit-Phase-4B-Metadata-Verification.md) for selected technical choices, delivered schema/API behaviour and remaining review gates. The original proposal below remains a design record, not proof that every fixture or feature is accepted.

## Plan and scope

Deliver a compatible Matter metadata contract and reproducible acceptance-fixture specification before 4B changes storage or application behaviour. Use the [implementation plan](NorthWrit-Implementation-Plan.md), [delivery increments](NorthWrit-Phased-Delivery-Plan.md), [2A scope](NorthWrit-Phase-2A-Pilot-Scope.md), [2B principles](NorthWrit-Phase-2B-Architecture-Principles.md), [2C experience contracts](NorthWrit-Phase-2C-Experience-AI-Evidence-Contracts.md) and [2D verification rules](NorthWrit-Phase-2D-Delivery-Verification-Plan.md). No requirement allocation changes.

Primary design coverage: MT01 Matter Workspace, SA01 Tenant Isolation and Authorization and SA07 Users and Roles. Downstream compatibility fixtures support RV01/RV02 ingestion/versioning and SO01/SO02/SO04/SO05 search/work-product/history/export. MT06 Matter Dashboard and SA11 Ethical Walls remain recommended P1 inclusions pending scope review. Other Phase 4 P0 requirements remain required in the pilot baseline; this package does not claim to accept them all.

Named implementer, product/domain reviewer and access/database reviewer remain unassigned. Role responsibilities: API/domain engineering owns contract/storage changes; web engineering owns presentation; database/access review owns migration/RLS assertions; product/legal review owns legal metadata semantics. Effort estimates follow resolution of the data and policy choices below.

## Existing implementation inventory

Evidence: [fresh schema](../../apps/api/schema.sql), [project routes](../../apps/api/src/modules/projects/projects.routes.ts), [CRUD service](../../apps/api/src/modules/projects/projects.crud.ts), [shared project helpers](../../apps/api/src/modules/projects/projects.shared.ts), [access resolution](../../apps/api/src/lib/access.ts), [capabilities](../../apps/api/src/lib/permissions.ts) and [direct grants](../../apps/api/src/lib/projectAccess.ts).

| Existing property | Observed storage/behaviour | Proposed treatment |
| --- | --- | --- |
| `id` | UUID primary key | Matter identity remains this project ID; preserve `/projects` links and foreign keys |
| `name` | Required text; service rejects blank names | Matter name; retain trim/non-blank behaviour |
| `cm_number` | Nullable text | Display as Matter reference; preserve existing values, do not infer a legal-client identity from this field |
| `practice` | Nullable text, optional-string normalization | Preserve existing vocabulary; do not impose a new enum/backfill |
| `org_id` | Nullable organization FK with restricted deletion | Workspace placement, not the legal client; preserve Personal/direct-shared records |
| `user_id` | Nullable creator FK, set null on deletion | Provenance; never use as the sole access predicate |
| `visibility` | `private` or `organization`; Personal cannot be organization-visible | Preserve current scope constraints and access helpers |
| `archived_at` | Nullable timestamp used by lifecycle/access paths | Administrative archive state; do not reinterpret as legal closure or hold |
| `created_at`, `updated_at` | Timestamps | Preserve existing semantics; not a version/concurrency token by implication |
| `memory_enabled` | Response/create setting backed by project-scope `memory_files`, not a `projects` column | Preserve current memory preference and legacy fallback; not source authority, matter instructions or a permission grant |

Schema comments are not the full access policy. Current organization private-content access includes an audited path and role/ownership exceptions in the access helpers. Do not derive administrator rights from older comments or equate organization role with item role.

## Proposed metadata contract

These are candidate additions to the existing project resource, not implemented fields. Prefer nullable additive columns for the selected simple metadata; do not create a shared client catalogue or duplicate Matter table in this increment. Names/limits below are recommendations for review, not current endpoint validation.

| Candidate field | Proposed wire/storage semantics | Compatibility and decision |
| --- | --- | --- |
| `client_name` | Nullable trimmed string, maximum 200 characters; blank becomes null | Matter-local legal-client display label only; no contact database, uniqueness, membership or sharing effect |
| `jurisdiction` | Nullable trimmed string, maximum 100 characters; blank becomes null | Explicit user-entered label; do not infer from organization or default legacy records to Ontario; structured court/source filters remain research work |
| `matter_status` | Nullable enum `open`, `on_hold`, `closed` | Null means “Not specified”, preserving legacy uncertainty; business status alone does not archive, delete, grant access or implement legal hold |

Do not rename `cm_number`, change existing `practice` values or tighten existing reference validation as an incidental metadata change. A later requirement for multiple clients/parties, conflict checking, reusable contacts or structured jurisdiction taxonomy needs a separate approved contract. `on_hold` is a business label, never an MT08 preservation guarantee.

For new fields, create with omitted values produces null. PATCH omission leaves a value unchanged; explicit null clears it; blank text normalizes to null. Reject non-string text values, over-limit strings and unsupported status values with a validation response before mutation. Preserve existing validation/mapping of old fields unless an explicitly tested compatibility fix is required. Specify the character-count rule consistently in producer and consumer tests before implementing the proposed limits.

Business status transitions between the three values are owner-managed metadata changes under the existing `access.manage` capability. They do not yet trigger scheduled-run, retention or connector lifecycle side effects. If the selected pilot needs operational closure from the workflow contracts, define and implement that separate lifecycle command and its effects before offering closure as an operational promise. Do not label a simple metadata update as complete lifecycle governance.

## API and UI compatibility proposal

Extend existing `POST /projects`, `GET /projects/:projectId` and `PATCH /projects/:projectId` contracts additively after review. Retain existing response fields, including memory settings and resource role metadata. Confirm response shapes across list/detail/create/update and shared consumers before adding types to `packages/contracts`; do not import application internals into shared packages. No new `/matters` API alias or physical table rename is proposed.

Create retains current workspace admission. Settings edits use current access resolution and `access.manage`; an item viewer/editor cannot update metadata simply because they can read/edit content. Follow existing 404 handling for inaccessible resources and 403 for visible resources with insufficient role; validation and authorization ordering must not expose hidden resource data. Do not broaden the existing PATCH body to change creator, organization placement or grants.

Display Matter reference, practice and optional new metadata in the later 4C Overview/settings using existing primitives. Empty legacy fields show “Not specified”, not invented values. Keep Documents, Conversations and Reviews reachable; preserve old project links and selected context. A Matter team view derives current access people/roles; do not store a second membership list or use a “responsible lawyer” label as permission. A separately assigned responsible professional needs an explicit later field/validation decision.

## Authorization fixture matrix

Use synthetic accounts and separate test resources. Assign expected effective roles through the real access resolver; the table describes capability assertions after role resolution, not a substitute organization-role algorithm.

| Fixture | Expected result |
| --- | --- |
| Personal project creator and normalized-email direct owner/editor/viewer grants | Stable ID and grants preserved; owner settings allowed; editor/viewer settings denied; content capabilities follow existing matrix |
| Organization-visible project, ordinary member and owner/admin variants | Membership/defaults/overrides determine item role; test read and settings rights independently |
| Private organization matter owned by another member | No assumed blanket administrative read/write; test ordinary access, explicit overrides and audited private-content path separately |
| Two matters in one organization | Membership or readable source in one matter does not authorize arbitrary source mixing; preserve selected-resource scope |
| Two organizations plus Personal scope | Direct resource IDs, search, jobs, downloads and exports enforce their actual scope; selecting a workspace does not grant access |
| Revoked member/direct grant and creator-null organization row | Preserve organization resource; deny subsequent unauthorized operations and recheck queued execution/publication |
| Selected ethical-wall deny case | Pending explicit SA11 policy/precedence decision; cannot mark isolation accepted using a guessed owner bypass or deny rule |

## Acceptance-fixture specification

These scenarios are specified, not executed application tests. Build isolated fixtures and executable assertions in the increments that implement the behaviour; attach records using the 2D evidence format.

| Case | Input/action | Expected assertion and delivery gate |
| --- | --- | --- |
| F01 — Legacy Personal | Existing project with null optional values and direct grants | Same ID, reference, practice, permissions and links before/after upgrade; absent new values remain null; 4B |
| F02 — Legacy organization | Private/organization rows, creator-null row, explicit item overrides | Same resolved access and placement before/after upgrade; no silent default expansion; 4B |
| F03 — Metadata round trip | Create, get/list, patch one new field, clear another | Correct normalization and consistent additive response; omitted PATCH fields unchanged; 4B |
| F04 — Rejected input | Non-string text, oversized text, unknown status and attempted role/workspace mutation | Reviewed validation contract, no partial write or privilege change; 4B |
| F05 — Capability boundaries | Owner, editor, viewer and inaccessible caller against settings | Owner-only update; correct visible-forbidden versus inaccessible response; no hidden metadata leak; 4B |
| F06 — Source continuity | Synthetic PDF/DOCX, failed extraction, new source version | Distinct ingestion state; original evidence version retained; deny substituted cross-matter version; 4C–4E |
| F07 — Lifecycle distinction | Change business status, archive separately | Metadata does not imply archive/hold/retention enforcement; actual archive access follows existing lifecycle; 4B/4C |
| F08 — Queued revocation | Queue work/export, then remove required access | Recheck before execution/finalization/publication; record issued storage capability limits; 4D/4E |
| F09 — Navigation/accessibility | Old project URL, matter switch, Overview/back links, keyboard/narrow/dark/forced-colour modes | Stable context and readable fields, correct denied/empty/error states; 4C/4E |
| F10 — Database evolution | Fresh schema and a pinned supported pre-change schema with legacy data | Same final columns/constraints/ledger, preserved records, grants and RLS; migration safely applied once; 4B |
| F11 — Recovery compatibility | Old client ignores extra fields; older app against additive schema; deploy rollback simulation | Existing fields remain usable; do not drop newly stored metadata; 4B |
| F12 — Concurrent settings | Two authorized writers change the same/different fields | Document current last-writer behaviour and select conflict policy before promising protection; versioned work-product concurrency is a different contract; 4B review gate |

Database fixtures must pin an actual supported starting revision and migration ledger before execution. Include direct SQL/RLS assertions using realistic roles as well as API tests; mocked service tests cannot prove tenant isolation. Browser/source tests use synthetic documents and no live AI. Preserve unrelated services/data and do not restart the archived standalone baseline.

## Migration and recovery proposal

If the three additions are selected, add one new incremental migration and update the fresh schema and applicable ledger under existing instructions. Nullable fields avoid fabricated client/jurisdiction/status backfills; preserve all existing IDs, provenance, grants, document/version relationships and memory settings. No destructive migration or new dependency/service is proposed.

Review database privileges/RLS for the new fields and ensure all privileged API updates pass existing capability checks. Verify old/new application compatibility and transactional failure behaviour. Prefer rolling back application code while retaining additive nullable columns; dropping populated columns is not a routine rollback. A later incompatible constraint/backfill needs its own recovery plan and tests. No migration is executed by this document.

## Review register and implementation entry

| Ref | Proposed resolution | Remaining review/gate |
| --- | --- | --- |
| M01 | Reuse project identity/routes and existing reference/practice/access/memory models | Compatibility review before 4B |
| M02 | Use nullable matter-local `client_name` rather than a shared client entity | Product/legal semantics and 200-character rule before storage/wire implementation |
| M03 | Use nullable `jurisdiction`, with no inferred legacy jurisdiction | Product/legal scope and 100-character rule before implementation |
| M04 | Separate nullable business status from archive, hold and operational closure | Confirm enum and closure UX/side-effect scope before exposing status |
| M05 | Derive team from current access; preserve audited private-content and role rules | Access reviewer confirms expected matrix; selected SA11 precedence remains open |
| M06 | Preserve existing update semantics unless concurrency protection is explicitly selected | Decide settings conflict contract and fixture F12 before 4B acceptance |
| M07 | Pin supported upgrade baseline and isolated database/browser configuration | Database/QA owner and real test environment before migration acceptance |
| M08 | Assign named owners/reviewers and estimate effort from selected scope | Unassigned; before implementation package acceptance |

Plan → deliver contract/fixture specification → source/compatibility review → documentation checks → commit is the 4A proposal workflow. Code increments repeat plan → implement → review → relevant tests → commit, with evidence recorded for each increment. Commit creation is not product/legal acceptance, push/merge, deployment or publication.

Next is 4B implementation after the affected Phase 2 and M-register decisions are recorded. Source inspection and documentation checks can validate this proposal; database, application, browser and legal acceptance remain unexecuted. The proposed metadata names/types and fixture expectations must not be reported as delivered product features.

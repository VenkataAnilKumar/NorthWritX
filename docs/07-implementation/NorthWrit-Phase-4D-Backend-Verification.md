# Phase 4D — Saved draft backend verification

Verified November 17, 2026 against `cd2178a` plus this implementation. Status: first backend increment implemented and locally verified. The draft UI, visual comparison and full Phase 4 acceptance remain pending; this does not establish Phase 5 approval or legal quality.

## Delivered contract

The [4D contract](NorthWrit-Phase-4D-Draft-Contract.md) and [ADR 0005](../decisions/0005-matter-work-products.md) define matter-bound work products separately from uploaded source files. The API uses current project permissions, immutable revisions, explicit request identities, optimistic concurrency, exact source versions/hashes and actor attribution. No model call is needed to create/edit/export a manual draft.

| Endpoint under `/projects/:projectId/work-products` | Behaviour |
| --- | --- |
| `GET /` | Matter-authorized catalogue; `limit` 1–50, `offset` 0–10000 |
| `POST /` | Create a work product and first draft revision; editor/owner only |
| `GET /:workProductId` | Read the current saved draft and its evidence status |
| `GET /:workProductId/versions` | Paginated immutable revision summaries/current pointer |
| `GET /:workProductId/versions/:versionId` | Read a selected historical draft and its evidence status |
| `POST /:workProductId/versions` | Save another immutable revision using the expected current version |
| `POST /:workProductId/versions/:versionId/export` | Stream selected draft DOCX after source/matter checks before and after rendering |

Save payloads use `WorkProductDraftInput` from [shared contracts](../../packages/contracts/index.d.ts): a new UUID `request_id`, `expected_version_id` (null for create), title/body, scope, assumptions and source references. A repeated successful request retains its revision and cannot reactivate it after later saves. A conflicting base/request or unavailable/changed source produces 409. To restore historical content, read it and save a new request against the current revision; the historical record remains unchanged.

Sources require exact document/version IDs, a recorded SHA-256 and optional locator. The server resolves the actual source metadata and rejects foreign-matter or inaccessible versions. Readers may inspect historical draft text even when evidence has changed; export remains blocked until the selected references are usable. `current` evidence means only that the recorded source identity/access checks passed, not that any legal claim is verified.

Text limits count Unicode code points; unsupported XML control characters/unpaired surrogates are rejected in draft input. The DOCX renderer escapes text and normalizes unsupported metadata characters. Exports include a repeated “DRAFT — NOT APPROVED” warning, selected draft identity/revision, author/time, scope, assumptions, exact source references and limitations. Responses are `private, no-store`; no signed download capability or external delivery approval is issued.

## Persistence and rollout

The [migration](../../apps/api/migrations/20261117_01_work_products.sql) and fresh schema add two RLS-enabled backend-only tables and actor-checked RPCs. Direct service-role table mutation is denied; revision writes occur through the compare-and-save transaction. Product/current-version foreign keys prevent cross-product pointers. Matter deletion cascades draft records; author deletion preserves content and attribution text with a null actor ID. No existing migration is edited.

Apply the new migration before rolling out these endpoints to an existing installation. No migration of the running preview or a production database was executed. Older application features retain their existing schema/functions; the isolated upgrade test preserved a pre-change matter fixture. Broader rollout/backup/retention and named review remain release gates.

## Verification evidence

| Check | Result |
| --- | --- |
| Draft service/DOCX unit tests plus migration/schema/architecture/cycle checks | 65 tests passed across six files |
| Existing document status/access regressions | Passed as part of the earlier targeted API run |
| API production/test and shared-contract type checks | Passed |
| Fresh disposable stack | 13 integration checks passed: eight source-journey checks plus five draft/export groups |
| Upgrade from committed `cd2178a` schema | Same 13 checks passed after applying only pending migrations; legacy fixture preserved |
| Migration rerun and immutable history | Passed on both paths, including history after rerun and denied direct revision rewrite |
| Repository, branding, whitespace, script syntax and local links | Passed |

Raw safe outcomes: [fresh](evidence/phase-4d-work-products-fresh.json), [upgrade](evidence/phase-4d-work-products-upgrade.json). They record the pre-change Git baseline and a dirty working tree because the candidate implementation was tested before its commit.

The isolated tests exercised real Auth, PostgREST, API, workers and filesystem storage with synthetic users/documents. Draft groups cover idempotency without pointer rollback, compare-and-save conflict, restoration with immutable history, current/historical source snapshots, DOCX XML contents, changed-evidence rejection, cross-matter source denial, viewer read/export versus write denial, grant revocation, direct table/RPC restrictions and matter-delete cascades. Unit tests additionally withhold export bytes when final authorization fails after rendering.

Reproduce from the repository root using the [isolated runner](../../apps/api/scripts/verify-source-journey.cjs):

```bash
node apps/api/scripts/verify-source-journey.cjs --work-products \
  --evidence /tmp/northwrit-work-products-fresh.json
node apps/api/scripts/verify-source-journey.cjs --work-products \
  --schema-baseline cd2178a --evidence /tmp/northwrit-work-products-upgrade.json
```

No image pull, stack sweep, environment rewrite, publication or unrelated resource deletion is performed. Run-owned containers/network/files were removed after each test. The running preview database and services were preserved.

## Remaining scope

Next is a functional draft editor/history/export UI consuming these endpoints, with browser/accessibility evidence. Visual comparison, rich text/tables, broader permitted Library sources, reviewer workflow, approval invalidation and external delivery remain separate work. Retention/redaction and legal-source/provider requirements still need their named reviews. No AI execution, production build, native-client acceptance or complete legal-workflow acceptance is claimed here.

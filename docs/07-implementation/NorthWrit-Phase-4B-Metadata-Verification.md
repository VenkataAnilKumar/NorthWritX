# Phase 4B — Matter metadata implementation and verification

Implementation baseline: `c14bc0c` plus this change. Reviewed November 16, 2026. Status: implemented metadata subset with local automated verification; full 4B, Phase 2 reviewer closure and the complete Phase 4 journey are not accepted. No deployment, publication, push/merge or migration of the running demo database is part of this change.

## Plan and contract decisions

Following the [4A proposal](NorthWrit-Phase-4A-Matter-Contracts-Fixtures.md), implement optional matter-local `client_name`, `jurisdiction` and `matter_status` on the existing project identity. Retain all existing role/access paths and Personal/organization placement. The user's instruction to plan, implement, review, test and commit each phase authorizes this local increment; it does not establish named product/legal/security reviewer sign-off.

Technical choices for this increment: nullable text metadata with no inferred backfill; 200/100 Unicode code-point limits after application trimming; status `open`/`on_hold`/`closed` or null; omitted PATCH fields unchanged and explicit null clears. Business status changes no archive, legal-hold, retention, schedule or access behaviour. Existing settings remain last-writer updates; no concurrency guarantee is introduced. Team/access membership, shared client catalogues, ethical-wall precedence and operational matter closure are not redesigned here. Their unresolved reviews remain visible in 4A and Phase 2 registers.

## Implemented changes

- [Migration](../../apps/api/migrations/20261116_01_matter_metadata.sql) and [fresh schema](../../apps/api/schema.sql): nullable fields, database constraints, ledger entry and an atomic nine-argument creation overload. The existing six-argument RPC remains callable; failed new metadata creation rolls back the project and memory row together. Only `service_role` can execute the new actor-parameterized overload.
- Project service/routes validate create and owner-only PATCH inputs. Settings use existing `checkProjectAccess` and `access.manage`; inaccessible projects remain hidden. No client-provided creator, organization or archive field is added to the update allowlist.
- Shared declarations and web API helpers support the additive metadata. Create/detail/update return stored fields; paginated overview/list RPC projections remain unchanged and may omit them. Shared client fields are optional for these projections and older servers. The later Overview UI must load detail rather than assume list metadata is present.
- No UI form or Overview, new runtime dependency, existing migration rewrite, API rename or new table is introduced. API rollout requires the new migration first; older applications retain the six-argument function and can operate against the additive schema. Ordinary rollback retains populated nullable columns rather than dropping data.

## Review findings

The source uses separate project memory settings; this change preserves explicit memory opt-out and legacy behaviour. Direct-grant emails and organization/item roles retain existing resolution. New fields are validated after current access checks on PATCH, and a sparse update cannot mutate placement or lifecycle.

Fresh-schema inspection found that `projects` itself does not have RLS enabled on this baseline; direct `anon`/`authenticated` table privileges are revoked. The isolated verification preserves the original RLS/ACL state and asserts real direct-role denial and server-only RPC privileges. It does not claim a new RLS policy or comprehensive tenant-isolation proof. Broader two-organization, audited private-content, ethical-wall, queue and signed-download acceptance remain required for their selected increments.

The active fresh schema had a whole-file historical branding exception despite containing no matching legacy references. Removed only that obsolete exception so the updated schema receives normal strict scanning; historical migration snapshots and source notices remain protected.

## Local verification

Executed with Node.js 22 and the existing PostgreSQL 17 container, using synthetic accounts and separately created disposable databases. No provider/model call or real client document was used.

| Check | Result / scope |
| --- | --- |
| Metadata, project routes, migration ledger and schema-order suites | 145 tests passed across four files |
| Project domain, architecture, dependency cycles and memory SQL suites | 160 tests passed across 15 files; includes metadata suite overlap with the previous run |
| Web API wrapper suite | 368 tests passed; includes new metadata create/update payload cases and existing caller compatibility |
| API production/test types, shared contracts and web types | Passed; no production build or browser journey claimed |
| Web lint | Zero errors; 29 existing warnings in unchanged files |
| Repository, branding and whitespace guards | Passed; new documentation links checked |
| Fresh/upgrade database verification | Full fresh schema and pinned pre-change `ef36828` schema plus migration converge on project columns/constraints and the new function; migration rerun passes |
| SQL fixtures | Legacy values/grants, old/new creation, null clearing, Unicode limits, invalid-input atomicity, memory opt-out, status/archive separation and denied direct roles/RPC privileges pass |

Reproduce database verification from the repository root:

```bash
python apps/api/scripts/verify-matter-metadata.py --container <explicit-test-postgres-container> --baseline ef36828
```

The [runner](../../apps/api/scripts/verify-matter-metadata.py) requires existing Supabase role names in the selected local container and uses a minimal synthetic `auth.users` prerequisite, not the Auth service. It creates a unique test database for each fresh/upgrade run and removes only those databases on exit; it never migrates or reads application rows from the container's existing databases. The [SQL fixtures](../../apps/api/src/__tests__/sql/matter-metadata.sql) are not a live Auth, PostgREST, browser or provider test. Database fingerprints are scoped to project columns/constraints and the metadata function, not all schema objects.

## Remaining acceptance and next work

Record named reviewer outcomes, remaining 4A/Phase 2 decisions and the selected broader access fixtures before declaring 4B accepted. Prepare the 4C Overview/settings UI using these detail contracts, with real browser/accessibility evidence and a reviewed isolated runtime. Live AI remains deferred. Keep migration/release actions separate from committing this increment.

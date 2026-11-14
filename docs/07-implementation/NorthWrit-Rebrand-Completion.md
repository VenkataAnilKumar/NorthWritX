# NorthWrit rebrand completion

Updated November 14, 2026. Branch: `chore/complete-northwrit-rebrand`. Local implementation and verification; no deployment or publication is part of this change.

## Current names and defaults

| Area | NorthWrit behavior |
|---|---|
| Source API clients | `northwritApi.ts`, `NorthWritApiError`, `configureNorthWritApiClient` |
| Shared icon | `NorthWritIconUI.tsx`, `NorthWritIcon`, `NorthWritIconTint` |
| Desktop bridge | `northwritDesktop`, `northwrit:*` IPC channels |
| Runtime configuration | `NORTHWRIT_*`; explicit new values take precedence over temporary legacy environment aliases |
| Diagnostic identity | `northwrit@<version>+<sha12>` and NorthWrit service names |
| Development application | `http://localhost:3000` |
| Legal-link examples | `http://northwrit.local/terms` and `http://northwrit.local/privacy`, overridden by `NEXT_PUBLIC_NORTHWRIT_TERMS_URL` / `NEXT_PUBLIC_NORTHWRIT_PRIVACY_URL` |
| Local email examples | `admin@northwrit.local`, `guest@northwrit.local`, `support@northwrit.local`, `noreply@northwrit.local` |
| Images | `northwrit/northwrit-api` and `northwrit/northwrit-web`, with configurable registry prefix/tag |
| New local storage configuration | Explicit `R2_BUCKET_NAME=northwrit` |
| Export filenames | NorthWrit prefixes; signed format/version and verification context stay compatible |

The `.local` addresses are local examples, not published production destinations. Configure DNS/routing, served legal policies, actual support and production URLs before release. This change does not author legal policies or provision a registry. Local images are built from source; no prebuilt NorthWrit image publication is claimed.

## Compatibility and attribution

Existing authentication sessions retain their cookie namespace until sign-out. New sessions use `northwrit-session` (with `__Host-` in production), and sign-out clears old and new chunks and PKCE state. A new session takes precedence when both namespaces are present.

Existing desktop bridge names/channels remain aliases to the same protected handlers. New code uses the NorthWrit names. Existing local guest identities, passwords, secrets, database state and volumes are retained.

Word preference reads prefer the new keys, copy old stored values and preserve privacy-safe behavior on storage failures. Existing document IDs, edit bookmarks, citation markers and OAuth handoff formats remain readable without rewriting documents or interrupting authentication. Web workspace selections and completed quick-action migrations remain readable under their old keys.

Database schemas, shipped migrations, workflow source identifiers, signed-manifest formats, legacy object metadata and storage paths are not renamed blindly. Existing stacks without an explicit bucket setting retain their old bucket; new example configuration sets `northwrit` explicitly. No stored objects, running services or volumes are moved or removed. Unused validation images and identified cache created for this repository were reclaimed to provide build space.

Upstream licenses, credits, source origins, historical decisions and verification records retain accurate attribution. The desktop distribution source notice identifies this fork's source revision and the pinned upstream origin separately. Unused source artwork and dated telemetry-account guidance were retired to Git history under ADR 0004.

`npm run check:branding` rejects unexpected old-brand text or filenames. `scripts/branding-compatibility.json` records exact reviewed line hashes with reasons and frozen historical snapshots. Removing a legacy reference also requires removing its stale exception; the guard never regenerates exceptions automatically.

## Telemetry

API, server and Word reporting are off without an explicitly configured DSN. No upstream Sentry destination is embedded as a runtime fallback. The browser uses a local carrier DSN and same-origin monitoring tunnel; the server discards reports when unconfigured and forwards only to its configured project. Existing privacy filtering, throttling and explicit disable settings remain in force.

## Verification

Local verification completed:

| Check | Result |
|---|---|
| Branding guard | Passed; only reviewed compatibility/provenance occurrences remain, with 43 frozen historical snapshots and 378 exact line exceptions |
| Repository/whitespace | Passed: nine workspace lock entries, 130 local links and CI inventory |
| Types | API production/test/contracts, web and Word app/E2E checks passed |
| Lint | Passed with zero errors and the existing 29 warnings |
| Images | API, web and Word production builds passed; no images pushed |
| API authentication/telemetry/version checks | 107 tests passed |
| API architecture, dependency cycles, diagnostics and export routes | 265 tests passed |
| Client API, login, shared icon and preference migration | 388 tests passed |
| Telemetry and monitoring tunnel | 69 tests passed; updated boot-log behavior also passed the later targeted run |
| Final UI namespace/preference regressions | 46 tests passed across five files |
| Workspace/boot-log transition recheck | 76 tests passed |
| Registry/planner unit tests | 42 passed with synthetic registry/planning fixtures; no publication or cleanup sweep executed |
| Branding/audit guard tests | 46 passed |
| Desktop | 20 passed, one native PostgreSQL check skipped |
| Worker | API build and both source/compiled lifecycle tests passed |
| Word HTTP host | Three tests passed |
| Shell/Compose | Changed shell scripts passed syntax checks; Compose configuration parsed without resolving application env files |

The full API/web suites were not repeated locally in this pass; focused regressions, types, lint and affected images provide local evidence. GitHub CI remains a gate for any subsequent PR/merge. Existing raster-icon files were not regenerated. The archived standalone cloud baseline and real cleanup sweeps are not run. Signed macOS packaging, Office-host acceptance and production policy/URL validation remain separate release checks.

## PR CI follow-up

The first PR run exposed two test-fixture mistakes in the bulk rename: references to an unchanged upstream archive path and an explicit bucket name inconsistent with the expected presigned URL. The archive references were restored and the bucket fixture now explicitly uses NorthWrit. Both affected files passed all 29 tests locally, followed by branding, repository and whitespace checks. No runtime compatibility behavior or assertions were weakened.

Frontend CI also exposed three stale expectations: the preserved upstream connector documentation URL and telemetry defaults. The URL assertion was restored; telemetry tests now verify reporting stays off without an operator DSN and still forwards with an explicitly configured synthetic DSN. All 74 tests across the three affected frontend files passed locally.

The next CI run passed the full API and web test suites and web lint. Its frontend type check caught a missing required `NODE_ENV` field in the newly added telemetry test fixture. The fixture now supplies a production environment directly; the web type check and all 15 tunnel tests passed locally before the follow-up push.

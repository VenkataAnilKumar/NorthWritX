# Expanded repository migration verification

Date: November 11, 2026. Status: implementation and local validation complete, with inherited limitations below; GitHub CI/review remain pending. Phase 4 has not started. Changes are local and have not been pushed or merged.

## Scope and preservation

The migration maps the imported Mike application into root `apps/`, `packages/` and `infra/`. The [path map](NorthWrit-Migration-Paths.json) records all moved roots, including fixture packages, browser tests, shared scripts, engineering guides, provenance and archived upstream workflows. All 2,586 imported tracked files have destinations. All 246 imported SQL files and package lockfiles are byte-identical to the rollback baseline. Existing package names, dependency declarations, migration history, source notices and shared service boundaries are preserved. A new dependency-free worker package invokes the API-owned worker entry point.

API-owned schema, migrations and Supabase CLI settings remain in `apps/api/`; shared Compose, gateway and Docker support live in `infra/`. Tests use the existing independent Playwright package under `tests/browser/`. Imported workflows are archived under `docs/upstream/mike/.github/`; only root workflows execute.

The rollback baseline is main merge commit `624268de88697d31dee4603548bad25042fdad15`. Preserve the separate plan changes: rollback should revert the migration change, never reset user work. Translate upstream patches through the path map. If a local stack has been started, stop only its explicitly named Compose project before reverting paths and retain its data volumes. This migration changes no database schema.

## Local checks

Host checks used Linux with Node.js 24.22.1 and Node.js 22.23.4; the comprehensive API rerun and live DB checks used Node 22, matching CI and the Node 22 container images.

| Check | Result |
|---|---|
| Source conservation | All imported files mapped; SQL and original package lockfiles unchanged |
| Frozen installations | API, Word, desktop and browser package installs passed; web container frozen install passed; no package-manager/workspace conversion |
| Root validation | Six package lock targets, command paths, documentation links, migration destinations and CI inventory passed |
| Whitespace, shell syntax, workflow YAML and Compose config | Passed; CI cache/package targets resolve and existing backend/frontend/word-addin check names are preserved |
| API build and API/test/contracts types | Passed |
| Web production build | Passed compilation, build types and 43 static pages; inherited CSS optimizer warning |
| Web types and lint | Passed; zero lint errors, 29 inherited warnings |
| Word types and production build | Passed with reserved validation URLs; three inherited webpack bundle/performance warnings |
| Word host tests | Three passed |
| Worker source/compiled launcher tests | Two passed: lifecycle probe, polling, correct API working directory and graceful SIGTERM |
| Desktop unit tests | 18 passed; one native Postgres upgrade test skipped because its bundled binary is not fetched |
| Branding checker | All migrated paths resolve; seven unchanged baseline raster icons differ from Pillow 13 regeneration and were not rewritten |
| Shared script tests | 63 audit/publication-protocol tests and 20 pure volume-planner tests passed; local-secret helper checks passed. No real publication or cleanup sweep ran |
| Chromium production-login smoke | Passed email/password/action rendering with no page errors; local requests only |
| Live local DB/access tests | Seven passed across the existing DB-job and access suites |
| Live API/worker startup | API health passed; new worker launcher completed a synthetic DB job and shut down gracefully |
| API, Word and worker container builds | Passed from root contexts; worker derives from the API artifact |
| Web container build | Passed; the resulting container also passed the Chromium login smoke |

## Comprehensive suite outcomes and corrections

The full Node 22 API run executed 376 files: 361 passed, 14 skipped and one failed. It reported 5,143 passing tests, 102 skipped tests and one failure. The remaining `processLimits.test.ts` failure expects a fake LibreOffice descendant PID file within a short cold-start deadline. A focused run against the original source at the rollback commit reproduces the same failure (`expected [] to have a length of 2`). Its other three tests pass. No extraction implementation, test assertion or timeout was changed to hide this inherited environment-sensitive failure. The initial Node 24 run additionally hit native parser memory-budget startup failures; Node 22 removes those additional failures.

The full web run executed 422 files: 418 passed and four failed, with 4,320 passing tests, two failed tests and two suite import errors. The failures identified moved design-token/source-scan paths, a mirrored telemetry block and a timing-sensitive Docx interaction. After correcting the paths and synchronizing telemetry, all four affected files passed focused reruns. Selected reruns passed 22 tests across architecture/design-token/Docx files and 55 tests across shared telemetry/source-code drift files. Additional regression cases cover new app paths without retaining machine prefixes; the final shared telemetry rerun passed all 53 tests in its two files. The entire web suite was not repeated after these focused corrections.

## Infrastructure corrections and resource scope

The pinned Supabase image demotes `postgres` before ordinary trailing init scripts run. The unchanged role-password script now mounts at its supported `/etc/postgresql.schema.sql` hook, which runs as `supabase_admin` after the image migrations. This was verified with a fresh, isolated database. `npm run infra:prepare` makes only the three public bind-mounted configuration files readable when cloud checkout permissions are restrictive; it never changes credential-file modes. The gateway's loopback health check explicitly disables wget's proxy use so container proxy defaults cannot send that local check to the egress proxy.

Live checks used the dedicated `northwrit-migration-check` Compose project, loopback ports, synthetic users/jobs and locally generated signing secrets. Google OAuth was disabled only in a temporary test override. The test containers/network were stopped and removed afterwards; the two test database volumes were retained. Disk pressure during VFS image builds was resolved by pruning only enumerated cache IDs from this migration and releasing this task's superseded API image and temporary Postgres image. No unrelated image, service or volume was removed.

## Remaining gates

The inherited extraction timeout failure remains visible for a separate focused fix. The branding checker also reports seven raster-icon regeneration differences with Pillow 13.0.0; every flagged asset is byte-identical to the baseline, and no branding assets were regenerated. Investigate a reproducible asset-generation toolchain separately. GitHub CI has not run for these uncommitted changes; require its checks before merging. macOS signing/packaging and the native desktop database upgrade remain unverified on this Linux host and are release gates when that distribution is in scope. Office-host sideloading, all browser acceptance journeys, external model execution and the archived standalone cloud baseline are not claimed by these checks. No Phase 4 feature, deployment, image push or environment publication occurred.

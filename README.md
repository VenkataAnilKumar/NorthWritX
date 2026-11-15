# NorthWrit

NorthWrit is a legal workspace being developed for Canadian law firms. The active application spans `apps/` and `packages/`; the [provenance record](docs/06-technical/NorthWrit-Source-Provenance.md) identifies its original application source snapshot. See the [implementation plan](docs/07-implementation/NorthWrit-Implementation-Plan.md) for delivery status. Matter workflows and the later Canadian research and governance capabilities are planned work, not release guarantees.

## Current status

The application baseline, expanded repository layout, root npm workspace are merged. [PR #4](https://github.com/VenkataAnilKumar/NorthWritX/pull/4) passed all seven PR checks and merged as `d7e899526a389cbbe684b18618b32df98ccea237`. Subsequent [PR #5](https://github.com/VenkataAnilKumar/NorthWritX/pull/5) aligned configuration and [PR #6](https://github.com/VenkataAnilKumar/NorthWritX/pull/6) retired the duplicate reference archive. Phase 4, the legal workspace, is next and has not started. This is a development baseline; pilot and production acceptance remain separate work.

The working stack is TypeScript, Next.js/React, an Express API, Supabase PostgreSQL/Auth, S3-compatible storage, Office.js and Electron. Existing Projects, Assistant, document processing, review and integration services provide the foundation. See the [current implementation](docs/06-technical/NorthWrit-Current-Implementation.md) for source references and the boundary between existing building blocks and planned NorthWrit capabilities.

## Start here

- [Product catalogue](docs/02-product/NorthWrit-Product-Catalogue.md): current capabilities, configuration and limitations.
- [Architecture and system flows](docs/06-technical/NorthWrit-Current-Implementation.md): runtime, state and trust boundaries.
- [User guide](docs/guides/user-guide.md) and [administrator guide](docs/guides/administrator.md): everyday tasks and operating controls.
- [Capability matrix](docs/04-specs/NorthWrit-Capability-Matrix.md): all 105 requirements and remaining delivery work.

- [Developer guide](docs/guides/developer.md): setup and verification.
- [Repository ownership](docs/06-technical/NorthWrit-Repository-Ownership.md): where code and documentation belong.
- [Configuration verification](docs/07-implementation/NorthWrit-Configuration-Verification.md): current names, local defaults and compatibility policy.
- [CI inventory](docs/07-implementation/NorthWrit-CI-Inventory.md): active checks and gaps.
- [Phase 4 extension map](docs/07-implementation/NorthWrit-Phase-4-Extension-Map.md): existing matter workflow building blocks.
- [Application provenance](docs/06-technical/NorthWrit-Source-Provenance.md): source revision, attribution and upstream updates.

## Repository layout

The expanded layout is merged. Migration checks and remaining limits are recorded in the [migration verification](docs/07-implementation/NorthWrit-Migration-Verification.md).

```text
package.json             Nine private npm workspaces and root commands
package-lock.json        Shared frozen dependency graph
.npmrc                   Nested app installs with shared root peers
apps/
  web/                   Next.js web portal
  api/                   API, domain services, database schema and jobs
  worker/                Standalone launcher using the API worker runtime
  word-addin/            Microsoft Word integration
  desktop/               Electron shell
packages/
  contracts/             Shared serialized API contracts
  client/                Framework-free client behaviour
  ui/                    Shared interface components
  byok-validation/       Shared test fixtures; not an npm workspace
  pdf-text-order/        Shared test fixtures; not an npm workspace
infra/                   Compose, Docker support and Supabase gateway
  docker-compose.yml
tests/browser/           Existing Playwright package and tests
tests/loadtest/          Performance tooling
docs/engineering/        Application engineering and operating guides
scripts/application/     Shared application maintenance tools
docs/                    Product requirements, decisions and delivery evidence
.github/workflows/       Active application and container-build CI
```

## Install and run

Use Node.js 22 or later and npm (the lockfile was generated with npm 11.9.0). The root manifest defines nine private npm workspaces, with one root `package-lock.json`. See [ADR 0003](docs/decisions/0003-npm-root-workspace.md). Package identities and shared imports use `@northwrit/*`; upstream credits and compatibility-sensitive identifiers retain their provenance.

Run commands from the repository root:

```bash
npm run check:repo
npm run setup
```

`setup` runs one frozen `npm ci` for all workspaces, including desktop and browser tooling. Targeted installs use `npm run setup:api`, `setup:web`, `setup:word`, `setup:worker`, `setup:desktop` or `setup:e2e`, all from the same root lock. A targeted `npm ci` replaces the installation tree, so install all required workspaces together with `npm ci --workspace apps/api --workspace apps/web`, or use full `setup`. Do not generate child lockfiles. Electron downloads require access to GitHub release assets. Installation does not start infrastructure or services.

When switching an existing checkout from independent installs, delete the generated `apps/web/tsconfig.tsbuildinfo` cache once if TypeScript retains old dependency-resolution errors. Fresh checkouts do not have this cache.

Follow [application local development](docs/engineering/local-development.md) to configure the database, auth, storage, local email and separate signing/encryption secrets. Keep email confirmation enabled. Use synthetic documents and disposable accounts for validation. The [safe testing guide](docs/engineering/safe-local-testing.md) describes these boundaries.

For a fresh local stack, copy `infra/.env.example` to `infra/.env` and `apps/api/.env.example` to `apps/api/.env`, then follow the local development guide. Preserve existing `.env` files when updating a checkout. Run `npm run infra:prepare` to make the three public bind-mounted configuration files readable, then start it from the repository root with `docker compose -f infra/docker-compose.yml up --build`. The `stack:up` helper performs an automatic cleanup sweep by default; read the [lifecycle and cleanup behaviour](docs/engineering/local-development.md#stop-and-clean-up) before using it. Starting Compose does not publish images.

With the required infrastructure configured, start each process in its own terminal:

```bash
npm run dev:api
npm run dev:web
```

For a separate worker process, run `npm run build:worker` and `npm run start:worker`, and set `WORKERS_MODE=none` on the API. See [worker instructions](apps/worker/README.md).

The commands above are separate terminal commands. They do not start the full Compose stack. `npm run dev:word` serves the Word development client; use the [Word guide](apps/word-addin/README.md) for HTTPS and sideloading requirements. A cloud process listening on localhost is not automatically reachable from your own computer; interactive testing needs a working cloud Desktop, platform forwarding or a local deployment.

## Verify changes

| Command | Scope |
|---|---|
| `npm run check:repo` | Repository entry points, package commands, local links and CI paths; no dependencies or services required |
| `npm run check:branding` | Active naming, exact reviewed compatibility references and frozen historical snapshots |
| `npm run check:whitespace` | Git whitespace validation for tracked changes; does not format source |
| `npm run test:api -- --maxWorkers=2` | Backend unit and route integration tests |
| `npm run test:web -- --maxWorkers=2` | Web/shared component and hook tests |
| `npm run test:word` | Word HTTP host tests |
| `npm run typecheck` | API, API test types, contracts, web and Word types |
| `npm run lint` | Existing web ESLint rules |
| `npm run build` | API, web and Word production builds; Word build URLs must be configured |

Use `:api`, `:web` or `:word` commands to run checks for one package. `typecheck:api` passes `--noEmit` to the existing API compiler script. For package-specific run/test commands, arguments after `--` reach the underlying command, and its exit status is preserved. `test` and `build` run packages sequentially and stop on failure. Use existing package lint/style conventions; this setup adds no formatter dependency.

For a local Word build check, set the build URLs in the shell running the command. These reserved addresses validate a build and do not deploy anything:

```bash
# Bash
WORD_ADDIN_PUBLIC_URL=https://northwrit.invalid REACT_APP_WEB_APP_URL=https://app.northwrit.invalid npm run build:word
```

```powershell
# PowerShell
$env:WORD_ADDIN_PUBLIC_URL = 'https://northwrit.invalid'
$env:REACT_APP_WEB_APP_URL = 'https://app.northwrit.invalid'
npm run build:word
```

Use real deployment URLs when producing a release. Use the [observability guide](docs/engineering/observability.md) for current telemetry configuration. Reporting requires an explicitly configured destination; the [configuration record](docs/07-implementation/NorthWrit-Configuration-Verification.md) explains namespace and compatibility rules.

Browser and database suites require additional services. Read the [E2E guide](docs/engineering/e2e-ci.md) before `npm run setup:e2e` and `npm run test:e2e`. They are not part of `npm test`. Do not restart the archived standalone cloud baseline test as part of repository organization.

See the [workspace verification record](docs/07-implementation/NorthWrit-Workspace-Verification.md) for workspace checks and limits; earlier repository and layout records remain historical.

## Delivery phases

| Phase | Status |
|---|---|
| 1 — Source audit | Complete |
| 3 — Application integration | Complete; repository layout and npm workspace also merged |
| 4 — Legal workspace | Next; not started |
| 5 — Canadian legal capabilities and governance | Planned |
| 6 — Governed integrations | Planned |
| 7 — Validation and pilot release | Planned |

Phase 2 was removed. P0/P1/P2 in the product specifications are priority tiers, not these implementation phases. Read the [implementation plan](docs/07-implementation/NorthWrit-Implementation-Plan.md) for scope and acceptance gates.

## Documentation and licensing

The [documentation index](docs/README.md) separates product requirements from implementation evidence. The current implementation plan and accepted [repository decision](docs/decisions/0002-expanded-repository-structure.md) govern the layout; older blueprints are historical proposals.

Preserve the [license](LICENSE), [notice](NOTICE.md), application [credits](Credit.md) and upstream provenance when changing or distributing the application. Do not commit credentials, local environment files, generated outputs or test documents containing real client information.

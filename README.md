# NorthWrit

NorthWrit is a legal workspace being developed for Canadian law firms. The active application spans `apps/` and `packages/`; the [provenance record](docs/upstream/mike/NORTHWRIT.md) identifies its Mike OSS source snapshot. See the [implementation plan](docs/07-implementation/NorthWrit-Implementation-Plan.md) for delivery status. Matter workflows and the later Canadian research and governance capabilities are planned work, not release guarantees.

## Start here

- [Developer guide](docs/guides/developer.md): setup and verification.
- [Repository ownership](docs/06-technical/NorthWrit-Repository-Ownership.md): where code and documentation belong.
- [CI inventory](docs/07-implementation/NorthWrit-CI-Inventory.md): active checks and gaps.
- [Phase 4 extension map](docs/07-implementation/NorthWrit-Phase-4-Extension-Map.md): existing matter workflow building blocks.
- [Application provenance](docs/upstream/mike/NORTHWRIT.md): source revision, attribution and upstream updates.

## Repository layout

The application has moved to the expanded layout. Migration checks and remaining limits are recorded in the [migration verification](docs/07-implementation/NorthWrit-Migration-Verification.md).

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
packages/                Contracts, client, UI and shared fixtures
infra/                   Compose, Docker support and Supabase gateway
  docker-compose.yml
tests/browser/           Existing Playwright package and tests
tests/loadtest/          Performance tooling
docs/engineering/        Application engineering and operating guides
docs/upstream/mike/      Provenance, attribution and archived workflows
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

For the local stack, copy `infra/.env.example` to `infra/.env` and `apps/api/.env.example` to `apps/api/.env`, then follow the local development guide. Run `npm run infra:prepare` to make the three public bind-mounted configuration files readable, then start Compose from `infra/` with `docker compose up --build`, or use `npm run stack:up` from the root. These commands do not publish images.

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

Use real deployment URLs when producing a release. Telemetry configuration and build requirements are documented in [NORTHWRIT.md](docs/upstream/mike/NORTHWRIT.md#build-checks).

Browser and database suites require additional services. Read the [E2E guide](docs/engineering/e2e-ci.md) before `npm run setup:e2e` and `npm run test:e2e`. They are not part of `npm test`. Do not restart the archived standalone cloud baseline test as part of repository organization.

See the [workspace verification record](docs/07-implementation/NorthWrit-Workspace-Verification.md) for workspace checks and limits; earlier repository and layout records remain historical.

## Documentation and licensing

The [documentation index](docs/README.md) separates product requirements from implementation evidence. The current implementation plan and accepted [repository decision](docs/decisions/0002-expanded-repository-structure.md) govern the layout; older blueprints are historical proposals.

Preserve the [license](LICENSE), [notice](NOTICE.md), application [credits](docs/upstream/mike/CREDITS.md) and upstream provenance when changing or distributing the application. Do not commit credentials, local environment files, generated outputs or test documents containing real client information.

# NorthWrit

NorthWrit is a legal workspace being developed for Canadian law firms. The active application is [apps/northwrit](apps/northwrit/NORTHWRIT.md), based on the recorded Mike OSS source snapshot. See the [implementation plan](docs/07-implementation/NorthWrit-Implementation-Plan.md) for delivery status. Matter workflows and the later Canadian research and governance capabilities are planned work, not release guarantees.

## Start here

- [Developer guide](docs/guides/developer.md): setup and verification.
- [Repository ownership](docs/06-technical/NorthWrit-Repository-Ownership.md): where code and documentation belong.
- [CI inventory](docs/07-implementation/NorthWrit-CI-Inventory.md): active checks and gaps.
- [Phase 4 extension map](docs/07-implementation/NorthWrit-Phase-4-Extension-Map.md): existing matter workflow building blocks.
- [Application provenance](apps/northwrit/NORTHWRIT.md): source revision, attribution and upstream updates.

## Repository layout

```text
.github/workflows/        Active NorthWrit workflows
apps/northwrit/
  frontend/              Web portal
  backend/               API, access rules, document processing and jobs
  word-addin/            Word integration
  desktop/               Electron shell
  packages/              Shared contracts, client, UI and fixture data
  e2e/                   Browser workflow tests
  loadtest/              Performance tooling
  docker/                Container support files
  supabase/              Local auth/database configuration
  docs/                  Application engineering and operating guides
  scripts/               Application-specific tooling
docs/                    NorthWrit product requirements and delivery records
scripts/                 Repository checks and branding tooling
```

## Install and run

Use Node.js 22 or later and npm. Existing package lockfiles remain independent. The root manifest contains command aliases only; there is no new workspace or package manager, and no root dependency installation is required.

Run commands from the repository root:

```bash
npm run check:repo
npm run setup
```

`setup` runs frozen `npm ci` installs for the API, web and Word packages. For web-only development, use `npm run setup:api` and `npm run setup:web`. Installation does not start infrastructure or services.

Follow [application local development](apps/northwrit/docs/local-development.md) to configure the database, auth, storage, local email and separate signing/encryption secrets. Keep email confirmation enabled. Use synthetic documents and disposable accounts for validation. The [safe testing guide](apps/northwrit/docs/safe-local-testing.md) describes these boundaries.

With the required infrastructure configured, start each process in its own terminal:

```bash
npm run dev:api
npm run dev:web
```

The commands above are separate terminal commands. They do not start the full Compose stack. `npm run dev:word` serves the Word development client; use the [Word guide](apps/northwrit/word-addin/README.md) for HTTPS and sideloading requirements. A cloud process listening on localhost is not automatically reachable from your own computer; interactive testing needs a working cloud Desktop, platform forwarding or a local deployment.

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

Use real deployment URLs when producing a release. Telemetry configuration and build requirements are documented in [NORTHWRIT.md](apps/northwrit/NORTHWRIT.md#build-checks).

Browser and database suites require additional services. Read the [E2E guide](apps/northwrit/docs/e2e-ci.md) before `npm run setup:e2e` and `npm run test:e2e`. They are not part of `npm test`. Do not restart the archived standalone cloud baseline test as part of repository organization.

See the [repository verification record](docs/07-implementation/NorthWrit-Repository-Verification.md) for checks performed on this change, inherited warnings and checks not run.

## Documentation and licensing

The [documentation index](docs/README.md) separates product requirements from implementation evidence. The current implementation plan and accepted [repository decision](docs/decisions/0001-repository-structure.md) govern the layout; older blueprints are historical proposals.

Preserve the [license](LICENSE), [notice](NOTICE.md), application [credits](apps/northwrit/CREDITS.md) and upstream provenance when changing or distributing the application. Do not commit credentials, local environment files, generated outputs or test documents containing real client information.

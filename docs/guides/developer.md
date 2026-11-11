# NorthWrit developer guide

The application lives in [apps/northwrit](../../apps/northwrit/NORTHWRIT.md) and is based on a pinned Mike OSS source snapshot. Use the [implementation plan](../07-implementation/NorthWrit-Implementation-Plan.md) for delivery status and the [source audit](../07-implementation/NorthWrit-Source-Audit.md) for the current architecture. Older architecture proposals describe requirements for future phases.

## Source layout

| Directory in the application | Contents |
|---|---|
| `frontend/` | Next.js workspace, authentication screens and same-origin API gateway |
| `backend/` | Express API, document processing, model and tool calls, database schema and migrations |
| `word-addin/` | Office.js task pane, manifest and Word build |
| `desktop/` | Electron desktop shell |
| `packages/` | Shared TypeScript contracts, client and UI |

## Build and validation

Use Node.js 22 or later. The [root README](../../README.md#install-and-run) documents root npm aliases and package installation. Run `npm run check:repo`, then `npm run setup` from the repository root, or install an individual target with `setup:api`, `setup:web` or `setup:word`. No root dependencies or new workspace are introduced.

Run `npm run dev:api` and `npm run dev:web` in separate terminals after configuring the documented infrastructure. Follow the [application local-development procedure](../../apps/northwrit/docs/local-development.md) for auth, storage and local email. Shell commands inside that application guide assume the working directory is `apps/northwrit/`, unless a step says otherwise.

Use `test:api`, `test:web`, `test:word`, `typecheck`, `lint` and `build` from the repository root as appropriate. Targeted test arguments are forwarded, for example `npm run test:api -- src/__tests__/architecture.test.ts --maxWorkers=2`. The [application build instructions](../../apps/northwrit/NORTHWRIT.md#build-checks) and root README describe required Word build URLs. A localhost cloud service needs a working Desktop or forwarding route for interactive use on another computer.

The [repository workflow](../../.github/workflows/northwrit-ci.yml) validates these aliases and runs package builds and checks. The [CI inventory](../07-implementation/NorthWrit-CI-Inventory.md) distinguishes those active checks from imported, inactive workflows. Do not restart the archived standalone cloud baseline test as part of repository organization. A passing unit suite does not establish database, browser or model acceptance.

Run the [Python branding script](../../scripts/rebrand_northwrit.py) with `--check` after applying an upstream update. Preserve license notices, review all changes to build and migration inputs, and verify that authentication and deployment settings point to the intended NorthWrit environment.

## Ownership and Phase 4

Read the [ownership map](../06-technical/NorthWrit-Repository-Ownership.md), [accepted repository decision](../decisions/0001-repository-structure.md) and [Phase 4 extension map](../07-implementation/NorthWrit-Phase-4-Extension-Map.md) before adding new modules. Keep shared packages and compatibility-sensitive Projects data in their current locations until a verified change requires otherwise. Matter implementation and future directory extraction are separate from the repository entry-point work.

## Product requirements

Track requirements by ID in the [feature specification](../04-specs/Northwrit_Feature-Spec.md). Use the [workflow contracts](../04-specs/Northwrit_Workflow-Contracts.md) for authorization, evidence links, data handling and version-bound approvals. These requirements need executable tests before pilot release.

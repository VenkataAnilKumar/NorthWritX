# NorthWrit developer guide

The application lives in [apps/northwrit](../../apps/northwrit/NORTHWRIT.md) and is based on a pinned Mike OSS source snapshot. Use the [implementation plan](../07-implementation/Northwrit_MikeOSS-Implementation-Plan.md) for delivery status and the [source audit](../07-implementation/Northwrit_MikeOSS-Source-Audit.md) for the current architecture. Older architecture proposals describe requirements for future phases.

## Source layout

| Directory in the application | Contents |
|---|---|
| `frontend/` | Next.js workspace, authentication screens and same-origin API gateway |
| `backend/` | Express API, document processing, model and tool calls, database schema and migrations |
| `word-addin/` | Office.js task pane, manifest and Word build |
| `desktop/` | Electron desktop shell |
| `packages/` | Shared TypeScript contracts, client and UI |

## Build and validation

Use Node.js 22 or later. Install from the lockfile for each package and follow the [application build instructions](../../apps/northwrit/NORTHWRIT.md#build-checks). The [repository workflow](../../.github/workflows/northwrit-ci.yml) runs package builds and checks on app changes. Use the application deployment notes for environment-specific settings.

Run the [Python branding script](../../scripts/rebrand_northwrit.py) with `--check` after applying an upstream update. Preserve license notices, review all changes to build and migration inputs, and verify that authentication and deployment settings point to the intended NorthWrit environment.

## Product requirements

Track requirements by ID in the [feature specification](../04-specs/Northwrit_Feature-Spec.md). Use the [workflow contracts](../04-specs/Northwrit_Workflow-Contracts.md) for authorization, evidence links, data handling and version-bound approvals. These requirements need executable tests before pilot release.

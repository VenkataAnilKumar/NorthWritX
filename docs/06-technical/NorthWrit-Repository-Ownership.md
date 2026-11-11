# Repository ownership and documentation authority

This is the current layout of the Mike-based NorthWrit application. The [repository decision](../decisions/0001-repository-structure.md) and [implementation plan](../07-implementation/NorthWrit-Implementation-Plan.md) govern changes. Assign named maintainers when the team is established; the responsibilities below define ownership meanwhile.

## Responsibility map

| Area | Owner responsibility | Boundary |
|---|---|---|
| Root README, instructions, npm aliases and `scripts/` | Repository maintenance | Setup entry points, topology/link checks, branding tooling; application tasks delegate to existing packages |
| Root `.github/workflows/` | Build and release engineering | Active CI only; review the [CI inventory](../07-implementation/NorthWrit-CI-Inventory.md) before claiming coverage |
| `docs/01-brand` through `docs/08-gtm`, `docs/guides`, `docs/decisions` | Product, engineering and delivery | Requirements, decisions, roadmap, user/developer entry points and verification evidence; planned features are labelled |
| `apps/northwrit/frontend/` | Web application engineering | Routes, feature composition, same-origin API gateway and browser state |
| `apps/northwrit/backend/` | Backend/domain engineering | API, shared access rules, database schema/migrations, processing and job execution |
| `apps/northwrit/word-addin/` | Word integration engineering | Office client, HTTPS host, build and sideloading |
| `apps/northwrit/desktop/` | Desktop integration engineering | Electron packaging and connection to the application |
| `apps/northwrit/packages/contracts/` | API/domain engineering with client reviewers | Serialized shared contracts; update producers and consumers together |
| `apps/northwrit/packages/client/` | Shared client engineering | Framework-free client behaviour; no imports from applications |
| `apps/northwrit/packages/ui/` | Shared interface engineering | Shared components and tokens; use the documented dependency rules |
| `packages/byok-validation/`, `packages/pdf-text-order/` within the application | Domain/test maintainers | Shared fixture data and their existing consumers; these directories are not independently installed npm packages |
| Application `e2e/` and `loadtest/` | Workflow and performance verification | Real browser journeys and measured load; distinguish mocks, live model execution and skipped tests |
| Application `docker/`, `supabase/`, Compose and Dockerfiles | Operations with domain maintainers | Runtime configuration, auth/storage boundaries and migration ordering |
| Application `scripts/` and `docs/` | Relevant application maintainers | Engineering automation and implemented operating procedures |
| `NORTHWRIT.md`, license, credits and notices | Repository maintenance with release reviewers | Imported source identity, local changes and upstream update compatibility |

## Dependency rules

The authoritative backend structure is [backend architecture](../../apps/northwrit/docs/backend-architecture.md). HTTP handlers parse and authorize requests, then invoke domain services. A module is reached through its service facade. Cross-domain orchestration belongs in `backend/src/application/`; middleware and the shared kernel do not import domain modules. Job registries and worker entry points compose those services.

Use shared access helpers in `backend/src/lib/`, including `access.ts`, `permissions.ts` and `projectAccess.ts`. API admission alone is insufficient for queued work or a later download. Phase 4 must test authorization at those later execution points as well.

The web/Word shared UI and client rules live in the [application instructions](../../apps/northwrit/AGENTS.md) and [design system](../../apps/northwrit/docs/design-system.md). Shared packages must not reach into application internals. Serialized API contracts live in `packages/contracts/`; interface-only display state remains in the relevant client. Preserve existing fixture-package paths and consumers.

## Which documentation governs a change?

1. The current NorthWrit implementation plan governs delivery order and scope. The source audit describes the reviewed baseline; it is not runtime validation.
2. Accepted records in `docs/decisions/` govern structural decisions. Historical architecture proposals do not override them.
3. Product specifications and workflow contracts define target behaviour. If the implementation differs, record the gap rather than claiming the target is delivered.
4. Application source, tests and application engineering guides describe existing interfaces and operating procedures. Verify an operating command in the documented working directory.
5. `apps/northwrit/NORTHWRIT.md` records import provenance and upgrade constraints. Retain upstream attribution when adapting technical material.

Review documentation links and command examples when changing paths. Keep the numbered product sections intact. Do not introduce another competing setup guide when a root entry point can link to the application procedure.

## Layout changes

Current organization adds root entry points and inventories; it moves no application directories, changes no lockfiles inside the application, and changes no database history. For future moves, record the old-to-new path mapping, update all imports/build contexts/CI/deployment paths, run affected image builds, and retain a rollback procedure. See the staged growth criteria in the implementation plan.

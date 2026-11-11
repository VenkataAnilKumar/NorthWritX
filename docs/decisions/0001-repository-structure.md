# ADR 0001: One repository with an application import boundary

Status: Accepted for repository organization; future extractions remain conditional.

## Context

Phase 3 imported and rebranded Mike OSS under `apps/northwrit/`. The existing web, API, Word and desktop surfaces share contracts and supporting packages. Their Docker build contexts, TypeScript paths, migrations and upstream update instructions depend on that layout. The older v3 blueprint proposed a different stack and many services; it is not evidence that those components exist.

## Decision

Keep one repository and the `apps/northwrit/` boundary through Phase 4. Add root instructions, dependency-free command aliases, documentation ownership and CI validation. Keep independent package manifests and lockfiles. The root manifest introduces neither npm workspaces nor a package-manager migration.

Application code retains its current layout and technical identifiers. The existing Projects implementation is the starting point for Matters, with explicit compatibility and authorization work in Phase 4. Repository organization changes no application permissions, database schema or product routes.

Root `docs/` owns NorthWrit requirements and delivery decisions. Application `docs/` owns engineering and operating procedures. Root `.github/workflows/` owns active CI. Imported nested workflows remain reference material until deliberately adapted and validated.

## Growth criteria

Use domain boundaries, shared serialized contracts and the existing worker entry points to prepare for independent deployment. Consider root `apps/{web,api,worker,word-addin,desktop}`, `packages/` and `infra/` when measured load, release cadence or sustained ownership justifies the change. Record targets and an extraction decision first. Source layout alone does not establish runtime scalability or security.

Each future extraction must preserve firm/matter authorization at execution, source/version provenance, stable client contracts, and upstream path mapping. Update imports, Docker contexts, CI, deployment and rollback instructions together; build affected images and exercise failure/recovery paths.

## Consequences

Developers can start from one root README and command list. CI can validate those same aliases. Existing imports, lockfiles and migrations remain stable. Some command and documentation maintenance spans both repository and application boundaries; the [ownership map](../06-technical/NorthWrit-Repository-Ownership.md) assigns that responsibility.

The [implementation plan](../07-implementation/NorthWrit-Implementation-Plan.md#repository-organization-before-phase-4) governs sequencing. Phase 4 and future extraction are separate implementation work. The archived standalone cloud baseline test is not a gate for this organization change.

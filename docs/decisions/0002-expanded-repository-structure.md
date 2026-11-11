# ADR 0002: Expanded repository structure before Phase 4

Status: Accepted as the migration target on November 11, 2026; implemented locally; validation is recorded separately. Supersedes ADR 0001's decision to retain the import boundary through Phase 4 and defer these directory moves.

## Context

The initial organization work is complete and merged in PR #1 with passing CI. The user selected separate root application, shared package and infrastructure directories, and requested a plan update first. The previous source and runtime paths used `apps/northwrit/`; the migration path map retains that provenance.

## Decision

Keep one repository. Before Phase 4, migrate application surfaces to `apps/web`, `apps/api`, `apps/word-addin` and `apps/desktop`; introduce `apps/worker` for existing worker process composition; promote shared contracts, client and UI to root `packages/`; consolidate shared infrastructure under `infra/`. Preserve fixture data and all supporting files through an explicit path inventory.

Worker entry points must reuse domain services and access rules through a documented build/dependency boundary. The move does not introduce new product features or require production worker deployment. Preserve independent manifests and lockfiles; workspace tooling and package-manager changes require a separate decision.

## Implementation and acceptance

The [implementation plan](../07-implementation/NorthWrit-Implementation-Plan.md#planned-repository-structure-migration--before-phase-4) defines the ordered work and verification gate. Update imports, aliases, tests, commands, CI, Docker contexts, deployment paths and documentation together. Preserve migration history, compatibility-sensitive identifiers, upstream notices and an old-to-new provenance map. Record rollback and verify affected builds, installation, startup and worker behaviour before Phase 4.

The layout is implemented locally. The [migration verification record](../07-implementation/NorthWrit-Migration-Verification.md) distinguishes completed checks from pending or unsupported acceptance checks. Further service extraction and independent scaling remain subject to operating evidence. Do not restart the archived standalone baseline test, deploy/publish, or remove unrelated resources during migration validation.

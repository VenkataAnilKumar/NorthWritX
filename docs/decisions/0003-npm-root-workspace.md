# ADR 0003: npm root workspace and NorthWrit package identities

Status: Accepted on November 11, 2026 at the user's request. Supersedes ADR 0002 only for independent lockfiles and deferred workspace tooling.

## Decision

Use npm workspaces for the five applications, three shared packages and browser test package. Keep fixture directories outside workspace membership. One root package-lock.json controls frozen installation; each package retains its manifest, scripts and ownership. Root .npmrc selects nested installation to preserve app-specific toolchains while npm shares required peers at the root. Consolidate existing security overrides at the root.

Use private @northwrit/* identities and declared local shared dependencies. Preserve upstream credits, notices, migration bytes, persisted identifiers and compatibility-sensitive environment names. Worker domain services remain owned by the API.

## Consequences and verification

Run npm ci at the root for all packages, or select explicit workspace paths. Targeted ci replaces the installation tree; install all needed targets together. Update Docker manifest inputs, CI caches, shared runtime/type resolution, desktop staging and scoped audit selection together. Root peer dependencies require root type resolution. Do not hide failures or weaken branch protection.

The [workspace verification record](../07-implementation/NorthWrit-Workspace-Verification.md) records actual checks and limits. This does not implement Phase 4 or authorize deployment/publication. Rollback reverts the workspace change as a unit, restoring prior manifests, locks, imports, containers and scripts.

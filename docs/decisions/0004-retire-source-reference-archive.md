# ADR 0004: Retire the source-reference archive

Status: Accepted on November 14, 2026 at the user's request. Supersedes earlier decisions only for retaining a duplicate source-reference directory in the working tree.

## Decision

Remove the inactive source-reference archive after the application layout and root workspace migrations have merged. Keep current contribution and security policies at the repository root, source provenance under `docs/06-technical/`, credits in `Credit.md`, and license text in `LICENSE`.

The previous archive remains recoverable from Git revision `bca9d136480a4cca23c7a7d0fc53516d7233c814`. Record retired destinations separately in the migration map rather than inventing live destinations for removed files.

## Consequences and verification

Update links, ownership guidance, and repository checks to use the current documents. Retire tests that execute an inactive publication workflow; retain product-version, image-tag, deployment-documentation, and environment-file contracts. Root workflows remain the active CI authority; publication is still a separate implementation and release decision.

Verify repository links, whitespace, branding checks, and affected release-version tests. Preserve the root and component license text and existing source attribution. This cleanup changes no application permissions, migration files, dependencies, or running services.

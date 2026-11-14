# NorthWrit source provenance

NorthWrit incorporates and modifies application source version 2.1.0 from Open Legal Products, imported at revision `a5c147d6587ca465f301e8479f6c50fbc5731c45`.

The application and local modifications use AGPL-3.0-only. The retained [root license](../../LICENSE) contains the same license text as the former duplicate source license. [Credit.md](../../Credit.md) records source attribution and third-party acknowledgments; [NOTICE.md](../../NOTICE.md) records licensing notices. Component-specific licenses remain with the bundled components.

## Current ownership

Application surfaces live under `apps/`, shared code under `packages/`, and infrastructure under `infra/`. The worker invokes the API-owned runtime. See the [ownership map](NorthWrit-Repository-Ownership.md) and [migration path map](../07-implementation/NorthWrit-Migration-Paths.json).

Use the [root README](../../README.md#verify-changes) and [developer guide](../guides/developer.md) for current installation, build, and verification commands. Use one root npm workspace lockfile. Historical setup documents do not override these commands.

## Source changes

The local application includes NorthWrit product naming, configuration, package identities, repository layout, and supporting documentation. Compare revisions and local changes before importing source updates. Preserve applicable licenses, copyright notices, database migration history, and authorization boundaries.

Exporting a source snapshot with `git -c core.autocrlf=false -c core.eol=lf archive` avoids line-ending conversion. Preserve executable modes when staging imported scripts on Windows. Translate source paths through the migration map before applying patches.

## Retired reference archive

The duplicate source guides, inactive workflow definitions, templates, and unused artwork were removed from the working tree after migration. Their last retained revision is `bca9d136480a4cca23c7a7d0fc53516d7233c814`; Git history preserves the files and their earlier changes. The migration map distinguishes current destinations from retired reference paths.

Active contribution and disclosure guidance now lives in [CONTRIBUTING.md](../../CONTRIBUTING.md) and [SECURITY.md](../../SECURITY.md). Only root `.github/workflows/` owns active automation. Removing archived workflow examples does not enable publishing, deployment, code scanning, or browser/database acceptance tests. See [ADR 0004](../decisions/0004-retire-source-reference-archive.md) and the [CI inventory](../07-implementation/NorthWrit-CI-Inventory.md).

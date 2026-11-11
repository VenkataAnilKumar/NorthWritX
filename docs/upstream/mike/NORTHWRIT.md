# NorthWrit application

This repository imports the full source snapshot of Mike OSS version 2.1.0 at commit `a5c147d6587ca465f301e8479f6c50fbc5731c45` from [Open-Legal-Products/mike](https://github.com/Open-Legal-Products/mike). The original [license](LICENSE) and [credits](CREDITS.md) are included. The separate upstream workflow catalogue continues to be loaded at startup as described in Mike's documentation.

From the NorthWritX root, install Pillow in a Python environment and run `python scripts/rebrand_northwrit.py --check` to check branding. Run the command without `--check` to regenerate the logos and icons. The social preview is stored as a 1200×630 JPEG. To replace it from a new artwork file, use `python scripts/rebrand_northwrit.py --social-source PATH`.

Branding covers web and Word interface copy, sign-in and MFA, the Assistant identity, auth email sender, document export metadata, logos, browser and desktop icons, and social artwork. Set the public `FRONTEND_URL` at web build time for social metadata. Set `REACT_APP_WEB_APP_URL` to the deployed web origin and `WORD_ADDIN_PUBLIC_URL` to the deployed add-in HTTPS origin when building Word.

## Build checks

From the NorthWritX repository root, the [root README](../../../README.md#verify-changes) provides setup, development and verification aliases. They delegate to the package commands below without changing application package boundaries or lockfiles. See the [ownership map](../../06-technical/NorthWrit-Repository-Ownership.md) and [CI inventory](../../07-implementation/NorthWrit-CI-Inventory.md) for current responsibilities and active checks.

Use Node.js 22 or later and run `npm ci` separately in `apps/api`, `apps/web` and `apps/word-addin`. From each directory, run `npm run build`. Use `npm test` for backend and web, `npm run typecheck` and `npm run lint` for web, and `npm run test:server` for Word. For a Word build check without deploying it, set `WORD_ADDIN_PUBLIC_URL=https://northwrit.invalid` and `REACT_APP_WEB_APP_URL=https://app.northwrit.invalid`. The repository's [CI workflow](../../../.github/workflows/northwrit-ci.yml) runs these checks against the imported source.

The provided environment examples disable telemetry. Set NEXT_PUBLIC_NORTHWRIT_SUPPORT_EMAIL at web and Word build time to route support drafts to your firm. With no configured address, the draft has no recipient. The desktop app uses the NorthWrit macOS bundle identity and defaults to the local web port. Set MIKE_SERVER_URL or choose your firm server in the connection screen. Existing Mike installations use a separate app identity.

For future upgrades, compare the pinned revision against the proposed upstream commit and reconcile local changes before importing it. Export the snapshot with `git -c core.autocrlf=false -c core.eol=lf archive` so Windows does not change the source bytes. Re-run the branding script and review each change. When staging on Windows, preserve the original executable modes for upstream scripts by checking the upstream tree for `100755` entries and applying those modes to the matching imported paths in the Git index.

See the [implementation plan](../../07-implementation/NorthWrit-Implementation-Plan.md) for verification status. Release validation covers portal workflows and deployment.

## Expanded layout provenance

The import originally lived under `apps/northwrit/`. The [path map](../../07-implementation/NorthWrit-Migration-Paths.json) records every moved directory and supporting file, including archived upstream workflows. Shared fixture packages and all SQL migration files are preserved. `apps/worker` is new composition code around the existing API-owned runtime. Follow the [migration record](../../07-implementation/NorthWrit-Migration-Verification.md) when applying upstream patches; upstream-relative paths must be translated through that map. Licenses and credits remain alongside this provenance document.

# NorthWrit source rebranding

Run from the NorthWritX workspace with Python 3.11 or newer.

```powershell
python scripts/rebrand_northwrit.py
python scripts/rebrand_northwrit.py --apply
python scripts/test_rebrand_northwrit.py
```

The first command previews changes. Apply backs up every original file before writing source changes. Each backup has a manifest with before and after SHA-256 hashes. The source tree has no Git metadata, so retain these backups.

To restore a run, provide its actual backup directory.

```powershell
python scripts/rebrand_northwrit.py --restore .rebrand-backups/<run-directory>
```

Restore refuses to overwrite files edited after the rebrand. Resolve those edits before restoring. Do not run apply or restore concurrently with another writer.

## Scope

The script changes standalone Onyx product text to NorthWrit throughout supported text files. This includes display defaults, locale catalogs, prompts, documentation, and test expectations. It installs a simple N monogram and NorthWrit wordmark in the shared vector components, preserving their exported names.

Internal module names, imports, environment keys, database identifiers, package names, image registries, and external URLs remain compatible with upstream. Ownership and license notices, migration history, lockfiles, and agent instructions are retained.

The script also generates native launcher, tray, and splash icons and sets the web favicon to the NorthWrit SVG. Desktop and mobile ask for the server URL on first launch. Their package identifiers use `app.northwrit`, and mobile SSO uses `northwrit://auth/callback`. Set that callback in any deployment that overrides `MOBILE_ALLOWED_REDIRECT_URIS`.

Changing the app identifiers gives the native apps a separate installation identity. The desktop client also uses a new configuration directory. Enter your server URL again after switching builds. Upstream support links, screenshots, and signing credentials need a release-specific review.

The monogram is provisional. Replace it with approved brand artwork before release. Rebranding does not establish NorthWrit feature implementation or transfer upstream service, certification, or support commitments.

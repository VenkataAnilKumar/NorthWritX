# Private draft recovery verification

Verified November 17, 2026 on `fd26fb9` plus this candidate. See the [increment plan](NorthWrit-Draft-Recovery-Plan.md).

Matter Drafts now checkpoint unsaved edits after 800 ms idle. Recovery copies require current editor access, belong to one user and matter, and expire after 24 hours. The UI offers explicit Recover edits and Discard copy actions. Browser persistent storage is not used. Explicit Save remains the only action creating a canonical immutable revision; recovered edits retain their original compare-and-save base and cannot silently overwrite a newer revision.

Each view has its own identifier and increasing sequence. Discard clears content and retains a tombstone for the recovery window, blocking delayed writes. Expected-account validation rejects old callbacks after an account switch. A maximum of 50 active copies per user/matter bounds accumulation. The jobs worker removes up to 500 expired records every 15 minutes; expiry immediately hides content even before physical cleanup. Backup retention is separate.

| Verification | Outcome |
| --- | --- |
| Draft editor and recovery controller | 22 tests passed |
| API architecture, dependency cycles, migration ledger and worker roles | 49 tests passed |
| Compiled/source standalone worker launch and graceful shutdown | Two tests passed after API build |
| API production/tests, shared contracts, web and Word type checks | Passed |
| Web lint | Zero errors; 29 existing warnings |
| Isolated fresh database, real Auth/API/worker/storage and connected Chromium | 18 acceptance groups passed |
| Upgrade from `fd26fb9`, including connected Chromium | Same 18 acceptance groups passed |
| Repository, branding, whitespace and five root regression tests | Passed |

The connected browser journey reloads an acknowledged unsaved checkpoint, explicitly recovers it, advances the canonical revision through a separate real API request, verifies a visible save conflict with local text retained, then discards and confirms the copy is gone. Real API/database checks cover actor isolation, account mismatch, stale sequences, discard-before-write tombstones, revoked editor access, expiry, bounded cleanup and denied direct table access. Controller tests cover serialized discard, no resurrection on unmount, checkpoint rearming after Save, account-bound callbacks and failure/read-only states.

Apply `20261117_03_draft_recovery.sql` through the existing migration runner before using recovery or starting the updated jobs worker. Fresh installs include its final schema and ledger entry. No deployment or existing preview database was changed during verification.

Safe evidence: [fresh](evidence/draft-recovery-fresh.json), [upgrade](evidence/draft-recovery-upgrade.json). The record describes a pre-commit candidate. Reproduce with `node apps/api/scripts/verify-source-journey.cjs --acceptance`; supported upgrade verification uses `--schema-baseline fd26fb9`. Disposable fixtures use no AI provider and remove only their own infrastructure and private temporary files.

Only acknowledged checkpoints are guaranteed recoverable. Sudden closure, offline operation, failed requests or edits within the idle window can lose the latest uncheckpointed text; the native unsaved-change warning remains. Navigation flushing is best effort. A canonical save and recovery cleanup are separate requests: interrupted cleanup can leave an older private copy, so review revision history before recovering after an uncertain save. Recovery is not an approval, export, offline editing or live AI acceptance feature. Phase 4 still has AI, Office-host and named review gates.

PR CI exposed an outdated standalone worker fixture reporting lifecycle contract 2 after the upload-publication migration introduced contract 3. The fixture now reports 3; production schema validation and startup guards remain enabled. Both compiled and source worker launch/shutdown checks passed locally.

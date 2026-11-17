# Phase 4C — Source context and conversion continuity

Prepared November 17, 2026 against `cc81470`. Status: implemented client-state safeguards with targeted automated verification. This extends the [Overview/settings subset](NorthWrit-Phase-4C-Overview-Verification.md); it does not establish acceptance of the complete Phase 4 source journey, database isolation, legal quality or live AI.

## Plan and review findings

Reuse the existing upload, processing, document table and version-retry paths. Review matter switching and asynchronous source updates before adding another ingestion UI. Preserve existing routes, stored source/version IDs, package boundaries and API authorization.

Review found two concrete gaps:

1. `ProjectDocumentsView` passed unscoped document/folder setters and a refresh callback to asynchronous table operations. A response or retained callback from Matter A could update the shared layout after navigation to Matter B. Multiple refreshes could also overwrite newer data in response-arrival order.
2. Conversion polling keyed pending work only by document ID. A document replacement can retain that ID; an in-place edit can even retain its version ID. A delayed conversion response could restore older bytes/version metadata and status. Regression tests against the previous implementation reproduced a version-2 row reverting to version 1 and a queued stale updater overwriting the newer row.

## Implemented safeguards

- [Matter-bound document state](../../apps/web/src/app/components/projects/useProjectDocumentState.ts) owns guarded document/folder setters and collection refresh. A committed view has a distinct identity; A → B → A does not reactivate the first A's callbacks. Cleanup invalidates pending work, including unmount and StrictMode effect replay.
- Retained callbacks from a departed view do not start another refresh or update its successor. Queued state updaters recheck scope when React applies them. Refresh responses must match the requested matter ID, and only the latest refresh can publish its project/folder results.
- Current refresh failures propagate to the existing retry/reporting flow without clearing loaded data. Departed or superseded failures do not surface an obsolete error in the new view. This does not cancel or roll back an already authorized server-side upload to its original matter.
- [Conversion polling](../../apps/web/src/app/hooks/useDocumentConversionPolling.ts) now includes current version ID and content hash in its pending identity. A known replacement or in-place byte change aborts the obsolete poll. The queued updater rechecks those values before merging a response. Missing hashes/version IDs retain legacy compatibility through explicit null normalization.
- Existing conversion batching, bounded concurrency, failure retry, ready/error states and role-based upload controls remain in their current owners. There is no new state enum, migration, provider call, API permission rule or evidence-approval implementation.

## Verification scope

The new [matter state tests](../../apps/web/src/app/components/projects/useProjectDocumentState.test.ts) exercise navigation, retained upload/folder callbacks, A → B → A, response ordering, current error/retry, mismatched response IDs, unmount, queued updaters and successful current mutations with React state under StrictMode.

The [polling tests](../../apps/web/src/app/hooks/useDocumentConversionPolling.test.tsx) cover version replacement, in-place content changes, queued updates, batching, overlap prevention, retry and unmount. Existing document-table recovery, version retry, upload-role controls and metadata-refresh suites provide regression coverage for the reused UI paths.

Targeted API suites exercise source resolution, document access/status/version/text-search, upload processing/admission and upload-session completion with their documented mocks. No API implementation changed. These assertions do not substitute for real storage, authentication, database/RLS or concurrent two-organization browser acceptance.

## Recorded results

| Check | Result |
| --- | --- |
| Web state/polling, document recovery/gating/version retry, metadata refresh and architecture | 41 tests passed across eight files |
| API source/access/status/version/search and upload processing/admission/completion | 120 tests passed across eight files |
| Web type check | Passed |
| ESLint on the five changed/new application and test files | Passed with zero warnings/errors |
| Repository, branding, whitespace and local document links | Passed |

## Remaining gates

No new browser build, database migration, provider configuration, model execution or deployment is performed for this client-state increment. The earlier Overview record retains its own browser evidence. Existing model-free full-stack source/upload/search and authorization scenarios still need an explicitly isolated runtime and review outcomes before declaring all of 4C–4E accepted.

This protects the document workspace's current state; it does not implement immutable legal-evidence snapshots, CiteCheck or Folio approval invalidation. Those remain their selected later-phase contracts. Named reviewer closure and unresolved Phase 2/4A decisions remain pending.

Subsequent verification: the [isolated model-free source journey](NorthWrit-Phase-4-Source-Journey-Verification.md) passed eight real Auth/API/worker/storage/database checks. Its limits and remaining browser, revocation, upgrade and review gates remain explicit.

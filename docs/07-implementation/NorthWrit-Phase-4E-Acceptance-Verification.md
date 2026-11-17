# Phase 4E — Connected matter acceptance verification

Prepared November 17, 2026 on `7fb51fe` plus this candidate. The [acceptance plan](NorthWrit-Phase-4E-Acceptance-Plan.md) selects a model-free matter/source/draft/export journey and adversarial access checks. This record does not close all Phase 4 allocations or establish legal/citation quality.

## Finding and correction

The first real queued-upload check reproduced an authorization failure: an editor opened and sealed an upload, the worker was paused, the owner revoked the editor, and the normal worker subsequently completed/published the document. Admission-time access was being reused after queueing.

The additive `20261117_02_upload_publication_access.sql` migration rechecks the captured session actor's current matter role at document publication, exact upload-version/replacement writes and completed-result publication. It reuses the current project access function, including organization membership/overrides and archival state. Viewer downgrades and revoked access fail closed. Replacement matching uses that upload's resource identity, so a different queued replacement does not veto unrelated edits. Existing migrations, ownership and source/package boundaries remain intact.

The worker treats this refusal as terminal `upload_access_revoked`, preserves it across retries and handles final result-publication refusals through the same terminal path. The shared web/Word upload client explains the permission change and avoids a blind retry. The lifecycle startup contract advances to version 3 and requires all three enabled publication triggers; updated API/worker processes refuse a database that has not applied the migration. The pre-existing lifecycle override is not used in verification.

These new database barriers cover matter-bound uploads. Other upload scopes and wider queued legal/AI execution require their own selected acceptance; this increment does not claim a universal background-work authorization proof.

## Verification boundaries

Use real local Auth, PostgREST, API, filesystem storage and the existing standalone worker. The API runs with its supported `WORKERS_MODE=none` topology. Only this run's worker is paused for deterministic queue checks. The database tests also place an upload at specific publication boundaries, then revoke/downgrade its actor and attempt real persistence operations. These controlled persistence fixtures complement normal-worker execution; they are not a replacement for it.

The connected Chromium test uses two independent cookie sessions, real sign-in, an actual UI upload and processing, exact source selection, draft creation/edit/history/restore, real DOCX ZIP/XML verification, viewer write denial, valid foreign-source substitution denial and post-revocation matter/source/history/export refusal. It mocks no API response. Browser state, passwords, logs and raw artifacts remain private temporary data. Safe JSON outcomes are the reviewable evidence.

The web harness copies candidate source into a run-owned temporary layout, reuses installed dependencies and the candidate configuration, preserves relative aliases and uses a local build directory. Config-loader release metadata and disk cache are adapted only in that copy. It loads no real application `.env`, modifies no tracked config and performs no deployment. PostgreSQL readiness waits for its final TCP server, avoiding the image's transient bootstrap socket.

## Results

| Check | Outcome |
| --- | --- |
| Fresh disposable database | 17 acceptance groups passed, including the connected Chromium owner/viewer journey |
| Upgrade from committed `7fb51fe` schema | Same 17 groups passed after applying the new migration; legacy matter metadata preserved |
| Migration repeat | Publication migration replayed successfully in the upgrade run |
| API worker/lifecycle, migration ledger, boot ordering, architecture and dependency cycles | 109 tests passed across six files |
| Shared client/upload/error regressions and diagnostic vocabulary | 98 tests passed across four files |
| Web architecture and emitted-code vocabulary | Seven checks passed across two files |
| API production/test, web, Word and browser-spec type checks | Passed |
| Web lint | Zero errors; 29 existing warnings |
| Repository, branding, whitespace and staged review | Passed |

Safe outcome records: [fresh](evidence/phase-4e-connected-fresh.json),
[upgrade](evidence/phase-4e-connected-upgrade.json). Both record the tested Git
baseline and dirty candidate tree because verification preceded the commit.
Only run-owned containers, network, private browser data and temporary files
were removed. The seven existing preview containers were preserved.

The connected test refreshes the matter source list after processing and
supplies the actual web origin on direct cookie-authenticated mutations.
Existing source-detail denials use 403; hidden matter/draft and source-URL
issuance denials use 404. The negative checks preserve these route contracts
and verify editor permission separately from origin protection.

## Reproduction

From the repository root with Node 22+, local Docker, the three cached images named by the runner, installed dependencies, LibreOffice and Chromium:

```bash
node apps/api/scripts/verify-source-journey.cjs --acceptance \
  --evidence /tmp/northwrit-phase4e-fresh.json
node apps/api/scripts/verify-source-journey.cjs --acceptance \
  --schema-baseline 7fb51fe --evidence /tmp/northwrit-phase4e-upgrade.json
```

`--api-port`, `--gateway-port` and `--web-port` select unused unprivileged ports. `NORTHWRIT_CHROMIUM_PATH` selects an installed browser; the default is `/usr/bin/chromium`. The opt-in Playwright project is `isolated-matter`, provisioned only by the runner's private fixture. It is excluded from ordinary account-backed/synthetic projects. This remains manual acceptance evidence, not an adopted required GitHub job.

## Limits and rollout

Existing source-file URLs are bearer capabilities valid for up to 3,600 seconds. The test distinguishes successful redemption of a previously issued URL from current permission: revocation denies new URL issuance and authenticated draft exports, while the issued source capability remains usable until expiry. It does not claim an hour-long wait/expiry test. This policy needs release/security review; changing it is separate from the demonstrated queued-publication defect.

Apply the new migration before updated API/worker rollout. No migration was applied to the existing preview or a production database. Run-owned infrastructure is labelled and removed by the runner, with cleanup recorded in evidence; unrelated containers/volumes are preserved.

Live AI remains unconfigured and untested. Legal/citation quality, visual comparison, durable unsaved recovery/universal navigation blocking, Word/Electron acceptance, full cross-service/job coverage, active required-CI integration and named product/legal/security sign-off remain open. Complete Phase 4 acceptance must not be inferred from this selected local journey.

Subsequent [source-link revocation work](NorthWrit-Source-Download-Revocation-Verification.md) replaces newly issued storage links with revocation-checked links. The one-hour direct-storage behaviour above records the earlier candidate; legacy already-issued links retain their original expiry.

# Phase 4E — Connected matter acceptance plan

Prepared November 17, 2026 on `7fb51fe`. Execute the model-free matter/source/draft/export subset against disposable infrastructure. This package adds acceptance evidence; it does not declare all Phase 4 requirements or legal quality accepted.

## Selected checks

1. Run real Auth, PostgREST, API, filesystem storage and the existing worker entry point against fresh and supported-upgrade databases. Preserve source/version/hash identity, immutable revisions, conflict handling and checked DOCX contents.
2. Connect Chromium to a candidate web server and that same API without mocked responses. Use independent owner/viewer cookie sessions, real sign-in, a matter/source upload, draft create/edit/history/restore and selected-revision DOCX download. Inspect the downloaded ZIP/XML for actual saved text and provenance.
3. Check a foreign matter/source cannot be substituted, viewers cannot write, and revocation denies subsequent matter, source, search, history and export access. Verify both browser UI and direct requests using current authorization.
4. Pause only the disposable worker process, enqueue a source upload under an editor's grant, revoke that grant, then restart the normal worker. Require a denied terminal result and no document/result publication. Previously issued download capabilities must obey their recorded revocation/lifetime contract.
5. Record outcomes, failures/fixes and cleanup. Keep raw browser state/passwords/tokens and private logs in run-owned temporary files. Record safe JSON outcomes only. Remove only run-labelled resources; preserve the preview database, services, application build and environment configuration.

## Implementation approach

Extend the existing isolated source runner with an opt-in acceptance mode and a connected Playwright project. Use installed dependencies, cached local container images and system Chromium. Start the standalone worker with the API's documented `WORKERS_MODE=none` topology so queue admission/revocation can be tested deterministically without a test-only authorization bypass. Build a disposable web harness from the current source and configuration; do not edit the tracked config or load real local environment files.

Use the existing work-product/source checks on both fresh and upgrade paths. Add only failures/fixes discovered by these checks. Preserve package boundaries, migration history, attribution and commit-email privacy. No application deployment, environment publication, live model call, push or merge is included.

## Remaining gates

Live AI execution, legal/citation quality, visual comparison, durable unsaved recovery/universal navigation blocking, native clients, broader integrations, named product/legal/security approval and active required-CI adaptation remain separate. Close only checks demonstrated by actual evidence. The [phased plan](NorthWrit-Phased-Delivery-Plan.md) remains authoritative for unselected Phase 4 allocations and later phases.

## Discovered work

The real queued-revocation check exposed publication under an editor grant that had already been revoked. This increment therefore adds current-role database publication barriers and a terminal worker/client refusal, plus a version-3 startup contract. Apply the additive migration before updated API/worker rollout. Findings, scope and verification are tracked in the [acceptance record](NorthWrit-Phase-4E-Acceptance-Verification.md).

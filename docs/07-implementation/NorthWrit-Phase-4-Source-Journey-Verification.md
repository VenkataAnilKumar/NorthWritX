# Phase 4 — Isolated model-free source journey

Verified November 17, 2026 against application baseline `a1b9b4059939350f1413a46a2d231e0403bee950`. Status: eight model-free integration checks passed on a fresh disposable stack. This is scoped API/storage/database evidence, not complete Phase 4 acceptance, a browser journey or legal-quality evaluation.

## Plan and isolated runtime

Exercise the implemented Matter metadata and source pipeline through actual Auth, API, workers, file storage and PostgREST. Use synthetic accounts/documents and preserve the running preview. Reuse existing application services; do not bypass authentication, lifecycle migration checks or authorization.

The [verification runner](../../apps/api/scripts/verify-source-journey.cjs) creates a uniquely named Docker network and PostgreSQL 17, GoTrue and PostgREST containers from already installed images (`--pull=never`). Database files use a container-owned temporary memory mount. It loads the current fresh schema once after Auth creates its real schema; historical migrations are not replayed over the fresh schema. The source API runs with normal boot checks and inline workers, isolated filesystem storage and newly generated throwaway secrets. Application `.env` files and model-provider settings are not loaded.

Only loopback ports are bound. The runner checks that ports are free, requires a local Docker Unix socket, confirms images exist and requires at least 2 GiB of available disk before creating resources. No reusable environment is published, no image is pushed, and no existing database or storage volume is migrated.

## Executed checks

| Check | Observed result |
| --- | --- |
| Real sign-in and Matter metadata | Two synthetic users signed in through Auth and created separate organizations/matters. Metadata creation, owner updates, null clearing and persisted reads passed; cross-organization Matter access/updates were denied |
| DOCX ingestion | Staged capability upload, sealing and actual worker processing completed; project memory remained explicitly disabled |
| Download admission and bytes | The owner downloaded identical source DOCX bytes; unrelated-user document/download requests and upload admission to the other organization were denied |
| Source version continuity | A second DOCX version became current; both original and current version downloads retained their expected distinct bytes |
| Valid PDF and matter binding | A valid synthetic PDF processed in a second matter in the same organization and downloaded unchanged. Attempting to rename it through the first matter's route was denied without changing its name |
| Indexed text search | Real indexed search returned the current source version and explicitly requested historical version. Another matter's phrase did not appear; the unrelated actor saw no matches. Direct authenticated access to the server-only search RPC was denied |
| Failed processing | Invalid PDF bytes produced an explicit `invalid_pdf_file` result with no published document result |
| Model configuration | The configured-model catalogue was empty. No inference or legal-quality evaluation was executed |

All eight checks passed. The [safe JSON evidence](evidence/phase-4-source-journey.json) records baseline, outcomes, runtime and cleanup. Node syntax, repository, branding, whitespace and local-link checks accompany this verification change; no application code or dependency changed.

## Reproduce

From the repository root with Node.js 22+, Docker, installed API workspace dependencies, LibreOffice and the three cached images:

```bash
node apps/api/scripts/verify-source-journey.cjs \
  --evidence /tmp/northwrit-source-journey-evidence.json
```

Default loopback ports: API 3013; gateway/Auth/PostgREST 55431–55433. Set `--api-port` and `--gateway-port` to select another available range. `--repo` selects a checkout; `--work-root` selects a permitted temporary parent. No installation, image pull or broad stack lifecycle command runs automatically.

Credentials remain in memory or private temporary files and are redacted from errors. Cancellation enters the same cleanup path. Cleanup verifies container ownership labels and removes only this run's containers, network and temporary files; cleanup failures are recorded rather than reported as success. The completed run left no test containers/network, and existing preview services, images and volumes were preserved.

The optional `--work-products` and `--schema-baseline <ref>` modes add saved-draft and supported-upgrade checks; see the [4D backend record](NorthWrit-Phase-4D-Backend-Verification.md) for those separate results. The eight-check evidence above retains its original scope.

## Storage prerequisite and review

The initial attempt could not start Docker with a full disk. After the user's explicit cache-cleanup instruction, verified Next.js/npm/Electron caches and a specific unused, unshared Docker build-cache dependency chain were removed. About 9.8 GiB became available; Docker image/container/volume inventories were checked unchanged. This cleanup was a session operation, not functionality added to the verification runner. The runner never prunes caches, images or volumes, and it fails its space preflight before attempting a new stack on a full disk.

Harness review corrected the upload-session response shape and used each endpoint's existing 403/404 denial contract. No application permission checks were disabled or relaxed to make the run pass.

## Evidence limits and remaining acceptance

Text-search assertions call the actual server-only PostgREST RPC with explicit synthetic actor/workspace scope. They prove the tested database boundary, not a new browser search screen. Storage here uses the supported filesystem adapter; S3-specific behaviour still needs its own integration evidence. Source DOCX download is not generated Folio/work-product export or approval acceptance.

Already issued signed links retain their defined bearer-capability lifetime; unrelated-user denial before minting does not establish immediate revocation of every issued URL. Queued-after-revocation cases, broader role/ethical-wall fixtures, complete browser upload/search/export, supported-upgrade full-stack acceptance and named reviewer closure remain open. The earlier [4B database record](NorthWrit-Phase-4B-Metadata-Verification.md), [4C Overview/browser record](NorthWrit-Phase-4C-Overview-Verification.md) and [source-context regression record](NorthWrit-Phase-4C-Source-Context-Verification.md) retain their separate scopes.

Live AI, Canadian legal-source rights, CiteCheck, Shield/Folio governance, Office/native distribution and release/deployment acceptance remain deferred or subject to their recorded phase gates. These eight checks do not close those requirements.

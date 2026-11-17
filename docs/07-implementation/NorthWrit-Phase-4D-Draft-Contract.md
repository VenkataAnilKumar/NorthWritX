# Phase 4D — Saved draft and export contract

Prepared November 17, 2026 on `cd2178a`. This defines the first backend increment, not the complete Folio UI or Phase 5 approval system.

## Selected increment

Implement matter-bound text drafts with immutable revisions and exact source-version references, plus an authenticated DOCX draft export. SO02/SO04/SO05 remain the existing requirement IDs. Interactive editing beside chat, visual compare, approval states, tables and external delivery remain later work; no new navigation placeholder is introduced.

Keep work products separate from source documents: a saved text draft is not an uploaded source file, and its export must not bypass evidence checks through an ordinary source-download URL. Use a new API-owned work-products module and backend-only tables linked to existing project IDs. Reuse document access/source-version checks and existing shared contracts. No framework, separately deployed service, package dependency or deployment change is proposed.

## Contract

- A work product belongs to one existing matter. Viewer access permits reads/export; content editors may create revisions. Organization roles still resolve through existing item access. Archived/inaccessible matters cannot be used.
- Text, title, scope, assumptions and source references form a revision. Each save creates a new immutable revision with actor attribution and timestamp. Updates require the expected current revision; concurrent saves fail with 409 rather than overwrite. Restoring old content means saving a new revision using the same contract.
- Sources must be authorized versions within that matter, with recorded content hashes. Save resolves actual version filename/number/hash rather than accepting client-supplied provenance. Missing, deleted, changed, foreign-matter or inaccessible evidence fails. Legacy unhashed sources can still be read through existing document features but cannot become a hash-bound draft reference until their identity is recorded.
- Reading saved text/history requires current matter access. Historical text retains its original references; this does not establish current claim support. Export additionally checks every included source/version/hash before rendering and again before returning bytes. It never follows an old reference to the active replacement silently.
- Export the selected immutable revision directly as DOCX, prominently labelled “DRAFT — NOT APPROVED”. Include matter identity, revision/author/time, scope, assumptions, source locators and limitations. Source references are not CiteCheck verification. No signed storage URL or external delivery approval is minted by this endpoint.
- Body limit: 100,000 characters; title 200; scope/assumptions 10,000 each; at most 50 source references with short user-entered locators. Initial content is plain text, not arbitrary HTML. Server-owned actor/provenance fields cannot be supplied by the client.

## Persistence and verification

Use additive tables and one actor-checked, compare-and-save transaction. Preserve project/document IDs and all historical migrations. The fresh schema and migration ledger must match the supported upgrade baseline. Backend roles may read these tables; mutations occur through the server-only transaction. Existing account/matter lifecycle foreign keys preserve or remove related records under their recorded ownership semantics.

Test role denial, cross-matter source substitution, stale source hashes, compare-and-save conflicts, immutable history, source checks around rendering and DOCX contents. Run fresh and pinned-upgrade isolated integration checks with synthetic data and no model credentials. Record actual evidence and remaining limits before calling the increment accepted.

The user authorized phased implementation/review/tests/commits. This contract records technical choices for this backend increment; named product/legal/security reviewer closure and full Phase 4 acceptance remain pending. Deployment, publication, pushes/merges and live AI are outside this increment.

Implementation evidence and endpoint details: [4D backend verification](NorthWrit-Phase-4D-Backend-Verification.md). The storage/ownership decision is recorded in [ADR 0005](../decisions/0005-matter-work-products.md).

# ADR 0005: Matter work products and immutable draft revisions

Status: implemented for the local Phase 4D backend increment on November 17, 2026 under the user's phased implementation instruction. Wider product/legal/security acceptance remains pending.

## Decision and ownership

Store editable work-product text and revision metadata in `work_products` and `work_product_versions`, linked to the existing project identity. The API-owned work-products module owns save, history and draft export. The documents module resolves authorized source versions through its facade. Shared serialized types remain in `packages/contracts`; there is no new package dependency, separately deployed service or repository boundary.

Source documents already have file/version lifecycle and ordinary download capabilities. Work products require a selected text revision, source snapshots and evidence checks around DOCX rendering. A separate authenticated export path provides those checks without adding hidden work-product semantics to every ordinary source-file download.

## Invariants

- Reuse current project roles and archive/organization rules. Matter readers may read/export; content editors may save. Each transaction rechecks the actor at the database boundary.
- Create immutable, numbered revisions with actor attribution, timestamp and the prior version ID. Compare-and-save prevents lost updates. A stable request ID supports retries without restoring an older current pointer. Restore means creating another revision.
- Source references select exact versions and recorded hashes within the same matter. The documents module/database resolver supplies filename and version metadata. Unavailable or changed evidence blocks save/export; historical draft text remains readable to authorized matter readers for review and repair.
- Export only the selected revision, mark it unapproved, include scope/assumptions/provenance, and recheck matter/source authority and hashes after rendering. No reusable storage capability or external delivery is created.
- Backend-only tables use RLS; service-role direct access is read-only. The actor-checked server-only RPC owns writes. Foreign keys bind the current pointer to its own product and cascade matter deletion; author account removal nulls the actor ID while preserving historical attribution text.

## Consequences and limits

The initial API supports plain text and manual sources. Rich Folio editing/compare UI, Library/cross-matter source selection, approval/invalidation events, external delivery and retention/redaction policy extensions need their own reviewed increments. An evidence status is an integrity/access check, not CiteCheck support or legal approval. Existing source files and historical migrations retain their semantics.

See the [4D contract](../07-implementation/NorthWrit-Phase-4D-Draft-Contract.md) and [verification record](../07-implementation/NorthWrit-Phase-4D-Backend-Verification.md) for API, tests and remaining gates. No production database or deployment is changed by this local decision.

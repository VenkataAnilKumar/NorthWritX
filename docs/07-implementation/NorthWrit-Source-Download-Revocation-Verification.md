# Source download revocation verification

Verified November 17, 2026 on `0729ae7` plus this candidate. The [plan](NorthWrit-Source-Download-Revocation-Plan.md) and [ADR 0006](../decisions/0006-revocation-checked-source-links.md) define the new issuance/redemption contract.

New source URLs use `/download/source/:token`. The API re-resolves the issuing account's current email/status and exact source identity, checks current access, performs object HEAD, then rechecks before admitting an attachment stream. Streaming uses backpressure. Issuance and redemption responses use `private, no-store`; storage redirects are not returned. Web and Word keep their existing `{url, filename}` contract. Anonymous positive redemption verifies that the external browser need not inherit a Word session; Office-host UI acceptance remains separate.

| Check | Outcome |
| --- | --- |
| Source admission, purpose-separated tokens, active-version metadata, source ZIP/file routes, architecture and cycles | 84 API tests passed |
| API production/test and browser-spec type checks | Passed |
| Fresh real backend and connected browser | 17 acceptance groups passed |
| Upgrade from `0729ae7` schema and connected browser | Same 17 groups passed |
| Repository, branding, whitespace and staged review | Passed |

The connected test redeems the exact issued link without cookies before revocation, then requires 404 for the same link afterward, including when an owner supplies its own browser cookies. The owner can issue a separate valid link. Source state/hash changes, inactive accounts and revocation during object admission are covered by service tests. Signatures are purpose-separated from legacy history/storage/upload tokens; malformed Unicode signatures fail safely. Public API configuration errors do not echo configured URL credentials.

Safe outcomes: [fresh](evidence/source-revocation-fresh.json), [upgrade](evidence/source-revocation-upgrade.json). These record the pre-commit candidate and dirty tree. Reproduce with the existing `--acceptance` runner; use `--schema-baseline 0729ae7` for the upgrade path. No source schema migration is needed. Only run-owned infrastructure/private temporary files were removed; the seven preview services were preserved.

A source link remains a bearer credential while its issuer retains access and the link is unexpired. Current source-rights revocation, account ban/deletion, source deletion/archive or identity change prevent new admission. Sign-out alone does not remove a matter grant. Already delivered bytes and an admitted transfer cannot be recalled. Direct storage links issued before rollout keep their original expiry; no signing-key rotation or object relocation was performed. Native-client, production capacity/range behaviour and named security/legal acceptance remain open. Nothing was pushed, deployed or published by this increment.

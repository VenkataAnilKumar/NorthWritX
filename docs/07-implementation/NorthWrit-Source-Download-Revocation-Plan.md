# Source download revocation increment

Prepared November 17, 2026 on `0729ae7`. Replace newly issued anonymous storage URLs with expiring, revocation-checked source links while preserving web and Word download actions.

## Contract and approach

The authenticated source-URL endpoint will issue an HMAC link bound to the issuing user, exact document/version, storage identity/hash and expiry. Redemption re-resolves the issuer's current account identity and source access; deleted/archived/inaccessible sources, changed bytes, expired/tampered links and revoked/banned/deleted issuers are denied. Use the current account email rather than the email captured when a link was issued. All responses use `private, no-store`. Do not expose a redirect or a new object-store URL.

The link remains a bearer credential for its one source while the issuer retains access. This preserves Word's existing external-browser downloads without transferring a Word session to that browser. Revoking the issuing user's source rights invalidates that link. Sign-out does not itself remove a matter grant. Already delivered bytes cannot be recalled, and an admitted in-flight transfer is not a new request.

Keep the existing one-hour maximum expiry, token-domain separation and legacy download/history/upload token formats. Previously issued object-store URLs cannot be retroactively revoked by this application change; they age out under their original expiry. No signing-key rotation, object relocation, deployment or preview migration is included.

## Verification and delivery

Test signature/expiry/type separation, current account/email lookup, access revocation before and during admission, source identity changes and no-store responses. Update the isolated real browser/backend acceptance matrix to require positive redemption before revocation and denied redemption afterward. Verify source/version downloads, native-compatible anonymous redemption, cross-matter isolation and fresh/upgrade runs. Record policy/transition limits and commit this increment separately from unsaved-draft recovery.

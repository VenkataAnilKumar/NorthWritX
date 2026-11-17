# ADR 0006: Revocation-checked source download links

Status: implemented locally; deployment and operating acceptance remain pending.
Date: November 17, 2026.

Source links must stop admitting new transfers when their issuing user loses access. Web anchors and Word's external-browser action already consume a URL; the external browser does not inherit the Word session.

New links are one-hour HMAC capabilities scoped to an issuer, document, immutable version ID, storage path and recorded hash. The API resolves the issuer's current Auth account/email and current document/matter rights at redemption. It checks source state again after object HEAD and before admitting the stream. No anonymous storage redirect is returned. Replies use `private, no-store`, and streaming preserves backpressure for large sources.

A holder can use the link while its issuer remains authorized. Sharing the link delegates that bounded capability; sign-out does not remove a matter grant. Deleting/banning the issuer, revoking its current source access, source deletion/archive, source identity change and expiry deny new admission. Stable legacy versions with null hashes retain path/version checks. Already received bytes and admitted in-flight transfers cannot be recalled.

Existing storage, upload and authenticated history tokens keep their formats and purpose separation. New source tokens cannot be substituted for those tokens. Direct object-store links issued before rollout age out under their original expiry; this code change does not rotate signing credentials or relocate objects. Source transfer traffic now passes through the API; production capacity/range behaviour and native-client acceptance require operating verification.

Implementation and tests follow the [source-download plan](../07-implementation/NorthWrit-Source-Download-Revocation-Plan.md). No new dependency, schema migration, deployment or environment publication is part of this increment.

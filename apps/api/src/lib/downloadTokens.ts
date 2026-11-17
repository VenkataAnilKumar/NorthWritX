import crypto from "crypto";

/**
 * HMAC-signed, non-expiring download tokens.
 *
 * The token encodes the R2 storage path + filename; the backend route
 * `/download/:token` validates the signature and streams the file. This
 * gives persistent links safe to store in chat history without signed-URL
 * expiry or R2 CORS headaches.
 */

function getSecret(): string {
    const secret = process.env.DOWNLOAD_SIGNING_SECRET;
    if (!secret) {
        throw new Error(
            "DOWNLOAD_SIGNING_SECRET must be set. " +
                "Generate a strong random value (e.g. `openssl rand -hex 32`) and set it in the environment.",
        );
    }
    return secret;
}

function b64urlEncode(buf: Buffer): string {
    return buf.toString("base64url");
}

function b64urlDecode(s: string): Buffer {
    return Buffer.from(s, "base64url");
}

function timingSafeEqStr(a: string, b: string): boolean {
    const left = Buffer.from(a), right = Buffer.from(b);
    if (left.length !== right.length) return false;
    return crypto.timingSafeEqual(left, right);
}

export function signDownload(path: string, filename: string): string {
    const payload = JSON.stringify({ p: path, f: filename });
    const enc = b64urlEncode(Buffer.from(payload, "utf8"));
    const sig = crypto
        .createHmac("sha256", getSecret())
        .update(enc)
        .digest();
    return `${enc}.${b64urlEncode(sig)}`;
}

export function verifyDownload(
    token: string,
): { path: string; filename: string } | null {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [enc, sigEnc] = parts;
    const expected = crypto
        .createHmac("sha256", getSecret())
        .update(enc)
        .digest();
    if (!timingSafeEqStr(sigEnc, b64urlEncode(expected))) return null;
    try {
        const parsed = JSON.parse(b64urlDecode(enc).toString("utf8")) as {
            p: string;
            f: string;
        };
        if (!parsed?.p || !parsed?.f) return null;
        return { path: parsed.p, filename: parsed.f };
    } catch {
        return null;
    }
}

/**
 * Returns a relative download URL (e.g. "/download/abc.def"). Browser clients
 * prefix it with their same-origin `/api` gateway.
 */
export function buildDownloadUrl(path: string, filename: string): string {
    return `/download/${signDownload(path, filename)}`;
}

/**
 * Expiring blob tokens — the filesystem storage driver's stand-in for S3
 * presigned URLs.
 *
 * A presigned URL is a capability: whoever holds it can fetch that one object
 * until it expires, with no session attached (the browser follows it as a
 * plain <a> click, so no Authorization header is available). These tokens
 * reproduce exactly that contract: HMAC over {path, filename, exp}, verified
 * by the unauthenticated `/download/signed/:token` route. Access control
 * happened when the token was minted — the same moment it would have happened
 * for a presigned URL.
 *
 * Unlike `signDownload` above, these DO expire: they replace URLs that always
 * carried an expiry, and the routes that mint them re-check access on every
 * request, so a short lifetime costs nothing.
 */
export function signBlobToken(
    path: string,
    filename: string,
    expiresInSeconds: number,
): string {
    const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const payload = JSON.stringify({ p: path, f: filename, e: exp });
    const enc = b64urlEncode(Buffer.from(payload, "utf8"));
    const sig = crypto
        .createHmac("sha256", getSecret())
        .update("blob:" + enc)
        .digest();
    return `${enc}.${b64urlEncode(sig)}`;
}

export function verifyBlobToken(
    token: string,
): { path: string; filename: string } | null {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [enc, sigEnc] = parts;
    const expected = crypto
        .createHmac("sha256", getSecret())
        .update("blob:" + enc)
        .digest();
    if (!timingSafeEqStr(sigEnc, b64urlEncode(expected))) return null;
    try {
        const parsed = JSON.parse(b64urlDecode(enc).toString("utf8")) as {
            p: string;
            f: string;
            e: number;
        };
        if (!parsed?.p || !parsed?.f || typeof parsed.e !== "number") return null;
        if (parsed.e < Math.floor(Date.now() / 1000)) return null;
        return { path: parsed.p, filename: parsed.f };
    } catch {
        return null;
    }
}

/**
 * Write-side twin of `signBlobToken` — the filesystem driver's stand-in for a
 * presigned S3 `PUT`.
 *
 * The S3 URL it replaces binds the object key, the declared content type and
 * the exact byte count into the signature, so the capability cannot be
 * replayed with a different body. This reproduces that: {path, contentType,
 * size, exp} under HMAC, redeemed by `PUT /download/signed/:token`. A distinct
 * HMAC domain ("blob-put:") means a read token can never be spent as a write
 * token, or the reverse, even though both travel on the same route.
 */
export function signBlobUploadToken(
    path: string,
    contentType: string,
    sizeBytes: number,
    expiresInSeconds: number,
): string {
    const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const payload = JSON.stringify({
        p: path,
        c: contentType,
        s: sizeBytes,
        e: exp,
    });
    const enc = b64urlEncode(Buffer.from(payload, "utf8"));
    const sig = crypto
        .createHmac("sha256", getSecret())
        .update("blob-put:" + enc)
        .digest();
    return `${enc}.${b64urlEncode(sig)}`;
}

export function verifyBlobUploadToken(
    token: string,
): { path: string; contentType: string; sizeBytes: number } | null {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [enc, sigEnc] = parts;
    const expected = crypto
        .createHmac("sha256", getSecret())
        .update("blob-put:" + enc)
        .digest();
    if (!timingSafeEqStr(sigEnc, b64urlEncode(expected))) return null;
    try {
        const parsed = JSON.parse(b64urlDecode(enc).toString("utf8")) as {
            p: string;
            c: string;
            s: number;
            e: number;
        };
        if (!parsed?.p || !parsed?.c) return null;
        if (typeof parsed.s !== "number" || typeof parsed.e !== "number")
            return null;
        if (parsed.e < Math.floor(Date.now() / 1000)) return null;
        return { path: parsed.p, contentType: parsed.c, sizeBytes: parsed.s };
    } catch {
        return null;
    }
}

/** Expiring source capability. Every redemption must recheck its issuer's access. */
export type SourceDownloadClaims = {
    a: string; d: string; v: string; p: string; h: string | null; f: string; e: number;
};
export function signSourceDownload(input: Omit<SourceDownloadClaims, "e">, lifetime = 3600): string {
    const enc = b64urlEncode(Buffer.from(JSON.stringify({ ...input, e: Math.floor(Date.now() / 1000) + Math.min(3600, lifetime) }), "utf8"));
    const sig = crypto.createHmac("sha256", getSecret()).update("source-download:" + enc).digest();
    return `${enc}.${b64urlEncode(sig)}`;
}
export function verifySourceDownload(token: string): SourceDownloadClaims | null {
    if (token.length > 16000) return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [enc, sig] = parts;
    const expected = crypto.createHmac("sha256", getSecret()).update("source-download:" + enc).digest();
    if (!timingSafeEqStr(sig, b64urlEncode(expected))) return null;
    try {
        const value = JSON.parse(b64urlDecode(enc).toString("utf8")) as SourceDownloadClaims;
        if (![value.a, value.d, value.v, value.p, value.f].every(item => typeof item === "string" && item.length > 0)) return null;
        if (value.h !== null && (typeof value.h !== "string" || !/^[a-f0-9]{64}$/.test(value.h))) return null;
        if (!Number.isInteger(value.e) || value.e <= Math.floor(Date.now() / 1000)) return null;
        return value;
    } catch { return null; }
}
export function buildSourceDownloadUrl(input: Omit<SourceDownloadClaims, "e">): string {
    const base = process.env.API_PUBLIC_URL?.trim() || process.env.BACKEND_PUBLIC_URL?.trim() ||
        (process.env.NODE_ENV === "production" ? "" : `http://localhost:${process.env.PORT || 3001}`);
    let url: URL;
    try { url = new URL(base); } catch { throw new Error("Invalid public API URL"); }
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error("Invalid public API URL");
    return `${url.origin}${url.pathname.replace(/\/+$/, "")}/download/source/${signSourceDownload(input)}`;
}

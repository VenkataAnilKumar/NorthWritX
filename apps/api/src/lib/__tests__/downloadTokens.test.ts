import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { signDownload, verifyDownload, buildDownloadUrl } from "../downloadTokens";

const SECRET = "test-secret-32-bytes-long-enough!!";

beforeAll(() => {
    process.env.DOWNLOAD_SIGNING_SECRET = SECRET;
});

afterAll(() => {
    delete process.env.DOWNLOAD_SIGNING_SECRET;
});

describe("signDownload", () => {
    it("returns a two-part dot-separated token", () => {
        const token = signDownload("documents/user/doc.pdf", "contract.pdf");
        const parts = token.split(".");
        expect(parts).toHaveLength(2);
        expect(parts[0].length).toBeGreaterThan(0);
        expect(parts[1].length).toBeGreaterThan(0);
    });

    it("produces different tokens for different paths", () => {
        const t1 = signDownload("documents/a/file.pdf", "a.pdf");
        const t2 = signDownload("documents/b/file.pdf", "b.pdf");
        expect(t1).not.toBe(t2);
    });

    it("uses base64url characters only (no +, /, =)", () => {
        const token = signDownload("documents/user/file.pdf", "file.pdf");
        expect(token).not.toMatch(/[+/=]/);
    });
});

describe("verifyDownload", () => {
    it("round-trips Unicode filenames and long runs of padding-like characters", () => {
        const path = `documents/user/${"=".repeat(20_000)}/source.docx`;
        const filename = "审阅 — café.docx";
        expect(verifyDownload(signDownload(path, filename))).toEqual({ path, filename });
    });

    it("round-trips a valid token", () => {
        const path = "documents/user123/doc456/source.pdf";
        const filename = "Contract Final v2.pdf";
        const token = signDownload(path, filename);
        const result = verifyDownload(token);
        expect(result).not.toBeNull();
        expect(result!.path).toBe(path);
        expect(result!.filename).toBe(filename);
    });

    it("returns null for a tampered payload", () => {
        const token = signDownload("documents/user/file.pdf", "file.pdf");
        const [, sig] = token.split(".");
        const fakePayload = Buffer.from(
            JSON.stringify({ p: "documents/attacker/file.pdf", f: "file.pdf" }),
        )
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/g, "");
        expect(verifyDownload(`${fakePayload}.${sig}`)).toBeNull();
    });

    it("returns null for a tampered signature", () => {
        const token = signDownload("documents/user/file.pdf", "file.pdf");
        const [enc] = token.split(".");
        const fakeSig = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
        expect(verifyDownload(`${enc}.${fakeSig}`)).toBeNull();
    });

    it("returns null for a token with too many parts", () => {
        expect(verifyDownload("a.b.c")).toBeNull();
    });

    it("returns null for a token with too few parts", () => {
        expect(verifyDownload("onlyonepart")).toBeNull();
    });

    it("returns null when payload JSON is missing required fields", () => {
        const bad = Buffer.from(JSON.stringify({ x: 1 }))
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/g, "");
        const sig = Buffer.alloc(32).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
        expect(verifyDownload(`${bad}.${sig}`)).toBeNull();
    });

    it("returns null when signed with a different secret", () => {
        const token = signDownload("documents/user/file.pdf", "file.pdf");
        process.env.DOWNLOAD_SIGNING_SECRET = "different-secret-value-!!";
        const result = verifyDownload(token);
        process.env.DOWNLOAD_SIGNING_SECRET = SECRET;
        expect(result).toBeNull();
    });
});

describe("buildDownloadUrl", () => {
    it("returns a path starting with /download/", () => {
        const url = buildDownloadUrl("documents/user/file.pdf", "file.pdf");
        expect(url).toMatch(/^\/download\//);
    });

    it("embeds a verifiable token in the URL", () => {
        const path = "documents/user/file.pdf";
        const filename = "file.pdf";
        const url = buildDownloadUrl(path, filename);
        const token = url.replace("/download/", "");
        const result = verifyDownload(token);
        expect(result).not.toBeNull();
        expect(result!.path).toBe(path);
        expect(result!.filename).toBe(filename);
    });
});

// A source capability must never be interchangeable with old download/upload tokens.
import { signSourceDownload, verifySourceDownload, signBlobToken, buildSourceDownloadUrl } from "../downloadTokens";
describe("source download tokens", () => {
    const input = { a: "issuer", d: "document", v: "version", p: "source/path", h: "a".repeat(64), f: "Advice.docx" };
    it("binds issuer/version/path/hash and bounds expiry", () => {
        const value = verifySourceDownload(signSourceDownload(input, 99999));
        expect(value).toMatchObject(input);
        expect(value!.e - Math.floor(Date.now() / 1000)).toBeLessThanOrEqual(3600);
        expect(value!.e - Math.floor(Date.now() / 1000)).toBeGreaterThanOrEqual(3599);
        expect(verifySourceDownload(signSourceDownload(input, -1))).toBeNull();
    });
    it("rejects tampering and tokens signed for another purpose", () => {
        const token = signSourceDownload(input);
        expect(verifySourceDownload(token + "changed")).toBeNull();
        expect(verifySourceDownload(signDownload(input.p, input.f))).toBeNull();
        expect(verifySourceDownload(signBlobToken(input.p, input.f, 3600))).toBeNull();
        expect(verifyDownload(token)).toBeNull();
        expect(verifySourceDownload(token.split(".")[0] + "." + "é".repeat(43))).toBeNull();
    });
    it("rejects missing claims and does not expose credentials in public URL configuration", () => {
        expect(verifySourceDownload(signSourceDownload({ ...input, a: "" }))).toBeNull();
        process.env.API_PUBLIC_URL = "https://api.northwrit.local";
        expect(buildSourceDownloadUrl(input)).toMatch(/^https:\/\/api.northwrit.local\/download\/source\//);
        process.env.API_PUBLIC_URL = "https://user:password@api.northwrit.local";
        expect(() => buildSourceDownloadUrl(input)).toThrow("Invalid public API URL");
        process.env.API_PUBLIC_URL = "not a valid URL private-marker";
        expect(() => buildSourceDownloadUrl(input)).toThrow("Invalid public API URL");
        delete process.env.API_PUBLIC_URL;
    });
});

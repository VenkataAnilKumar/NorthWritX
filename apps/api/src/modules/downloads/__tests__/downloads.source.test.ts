import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { tableDb } from "../../../__tests__/helpers/tableDb";
import type { Db } from "../../../lib/supabase";
import { signSourceDownload } from "../../../lib/downloadTokens";
import { resolveSourceDownload } from "../downloads.service";
import { ensureDocAccess } from "../../../lib/access";
import { headFile } from "../../../lib/storage";
vi.mock("../../../lib/access", () => ({ ensureDocAccess: vi.fn() }));
vi.mock("../../../lib/storage", () => ({ headFile: vi.fn() }));
const claims = { a: "issuer", d: "document", v: "version", p: "documents/issuer/document/versions/version.docx", h: "a".repeat(64), f: "Advice v1.docx" };
function fixture() {
    const data = tableDb({
        documents: [{ id: claims.d, user_id: claims.a, project_id: "matter", archived_at: null }],
        document_versions: [{ id: claims.v, document_id: claims.d, storage_path: claims.p, content_sha256: claims.h, deleted_at: null }],
    });
    const lookup = vi.fn().mockResolvedValue({ data: { user: { id: claims.a, email: "current@northwrit.local" } }, error: null });
    const db = { ...data.db, auth: { admin: { getUserById: lookup } } } as unknown as Db;
    return { ...data, db, lookup, token: signSourceDownload(claims) };
}
beforeEach(() => {
    vi.resetAllMocks(); vi.stubEnv("DOWNLOAD_SIGNING_SECRET", "test-source-download-secret-long-enough");
    vi.mocked(ensureDocAccess).mockResolvedValue({ ok: true, projectRole: "viewer" } as never);
    vi.mocked(headFile).mockResolvedValue({ size: 42, etag: null, contentType: null });
});
afterEach(() => vi.unstubAllEnvs());
describe("source link admission", () => {
    it("uses current account email and admits the exact source without a recipient session", async () => {
        const f = fixture(); const result = await resolveSourceDownload(f.db, f.token);
        expect(result).toMatchObject({ ok: true, data: { storagePath: claims.p, filename: claims.f, size: 42 } });
        expect(f.lookup).toHaveBeenCalledTimes(2);
        expect(ensureDocAccess).toHaveBeenCalledWith(expect.objectContaining({ id: claims.d }), claims.a, "current@northwrit.local", f.db);
    });
    it("denies a revoked issuer before touching storage", async () => {
        const f = fixture(); vi.mocked(ensureDocAccess).mockResolvedValue({ ok: false } as never);
        expect(await resolveSourceDownload(f.db, f.token)).toMatchObject({ ok: false, kind: "not_found" });
        expect(headFile).not.toHaveBeenCalled();
    });
    it("denies revocation during slow object-storage admission", async () => {
        const f = fixture(); vi.mocked(headFile).mockImplementationOnce(async () => {
            vi.mocked(ensureDocAccess).mockResolvedValue({ ok: false } as never); return { size: 42, etag: null, contentType: null };
        });
        expect(await resolveSourceDownload(f.db, f.token)).toMatchObject({ ok: false, kind: "not_found" });
    });
    it.each(["path", "hash", "deleted", "archived"])("denies changed source state: %s", async kind => {
        const f = fixture();
        if (kind === "path") f.tables.document_versions[0].storage_path = "replacement";
        if (kind === "hash") f.tables.document_versions[0].content_sha256 = "b".repeat(64);
        if (kind === "deleted") f.tables.document_versions[0].deleted_at = "2026-11-17";
        if (kind === "archived") f.tables.documents[0].archived_at = "2026-11-17";
        expect(await resolveSourceDownload(f.db, f.token)).toMatchObject({ ok: false, kind: "not_found" });
        expect(headFile).not.toHaveBeenCalled();
    });
    it("rejects a source mutation during admission and permits stable unhashed legacy versions", async () => {
        const f = fixture(); vi.mocked(headFile).mockImplementationOnce(async () => { f.tables.document_versions[0].content_sha256 = "b".repeat(64); return { size: 42, etag: null, contentType: null }; });
        expect(await resolveSourceDownload(f.db, f.token)).toMatchObject({ ok: false });
        const legacy = fixture(); legacy.tables.document_versions[0].content_sha256 = null;
        expect(await resolveSourceDownload(legacy.db, signSourceDownload({ ...claims, h: null }))).toMatchObject({ ok: true });
    });
    it.each(["deleted", "banned", "changed_identity"])("denies an inactive issuer: %s", async kind => {
        const f = fixture(); f.lookup.mockResolvedValue({ data: { user: kind === "deleted" ? null : { id: kind === "changed_identity" ? "other" : claims.a, banned_until: "2999-01-01" } }, error: null });
        expect(await resolveSourceDownload(f.db, f.token)).toMatchObject({ ok: false, kind: "not_found" });
    });
    it("fails closed on account/storage errors without treating missing infrastructure as permission", async () => {
        const f = fixture(); f.lookup.mockResolvedValue({ data: { user: null }, error: { status: 503 } });
        expect(await resolveSourceDownload(f.db, f.token)).toMatchObject({ ok: false, kind: "error" });
        const missing = fixture(); vi.mocked(headFile).mockResolvedValueOnce(null);
        expect(await resolveSourceDownload(missing.db, missing.token)).toMatchObject({ ok: false, kind: "not_found" });
    });
});

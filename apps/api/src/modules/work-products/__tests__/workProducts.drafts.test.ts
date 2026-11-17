import { beforeEach, describe, expect, it, vi } from "vitest";
import { scriptedDb } from "../../../__tests__/helpers/scriptedDb";
import type { WorkProduct, WorkProductVersion } from "@northwrit/contracts";
const mocks = vi.hoisted(() => ({ access: vi.fn(), sources: vi.fn(), render: vi.fn() }));
vi.mock("../../../lib/access", () => ({ checkProjectAccess: mocks.access }));
vi.mock("../../documents/documents.service", () => ({ resolveWorkProductSources: mocks.sources }));
vi.mock("../workProducts.docx", () => ({ renderDraftDocx: mocks.render }));
import { saveWorkProduct, readWorkProductVersion, exportWorkProductVersion, listWorkProducts, listWorkProductVersions } from "../workProducts.service";
const id = "10000000-0000-4000-8000-000000000001";
const actor = { projectId: id, userId: id, userEmail: "synthetic@northwrit.local" };
const payload = { request_id: id, expected_version_id: null, title: "Draft", body: "Body", scope: "", assumptions: "", sources: [] };
const product = { id, project_id: id, title: "Draft", current_version_id: id } as WorkProduct;
const version = { ...payload, id, work_product_id: id, revision: 1, created_by: id, author_label: "Author", created_at: "now" } as unknown as WorkProductVersion;
beforeEach(() => {
    vi.clearAllMocks();mocks.access.mockResolvedValue({ ok: true, projectRole: "owner", project: { id } });
    mocks.sources.mockResolvedValue({ ok: true, data: [] });mocks.render.mockResolvedValue(Buffer.from("docx"));
});
describe("saved work-product boundaries", () => {
    it.each([{}, { ...payload, approved: true }, { ...payload, body: " " }, { ...payload, body: "bad\u0001text" }, { ...payload, title: "bad\uD800" }, { ...payload, title: "x".repeat(201) }, { ...payload, sources: [{ document_id: id, version_id: id, content_sha256: "bad" }] }])("rejects malformed/server-owned input before a write", async input => {
        const fake = scriptedDb([]);
        expect(await saveWorkProduct(fake.db, actor, null, input)).toMatchObject({ ok: false, kind: "validation" });fake.done();
    });
    it.each(["viewer", null])("denies writes by role %s", async role => {
        mocks.access.mockResolvedValue(role ? { ok: true, projectRole: role } : { ok: false });
        const fake = scriptedDb([]);
        expect(await saveWorkProduct(fake.db, actor, null, payload)).toMatchObject({ ok: false, kind: role ? "forbidden" : "not_found" });fake.done();
    });
    it("binds RPC identity to the actor and propagates CAS/evidence conflicts", async () => {
        const fake = scriptedDb([{ rpc: "save_work_product_version", error: { code: "P0001", message: "internal detail" } }]);
        expect(await saveWorkProduct(fake.db, actor, null, payload)).toMatchObject({ ok: false, kind: "conflict" });
        expect(fake.calls[0].args).toMatchObject({ p_actor_id: actor.userId, p_project_id: actor.projectId, p_payload: payload });fake.done();
    });
    it("keeps saved content readable but visibly stale when its evidence changes", async () => {
        mocks.sources.mockResolvedValue({ ok: false, kind: "conflict", detail: "changed" });
        const fake = scriptedDb([{ table: "work_products", data: product }, { table: "work_product_versions", data: version }]);
        expect(await readWorkProductVersion(fake.db, actor, id, id)).toMatchObject({ ok: true, data: { version: { body: "Body" }, evidence_status: "changed_or_unavailable" } });fake.done();
    });
    it("blocks stale evidence before rendering any export", async () => {
        mocks.sources.mockResolvedValue({ ok: false, kind: "conflict", detail: "changed" });
        const fake = scriptedDb([{ table: "work_products", data: product }, { table: "work_product_versions", data: version }]);
        expect(await exportWorkProductVersion(fake.db, actor, id, id)).toMatchObject({ ok: false, kind: "conflict" });
        expect(mocks.render).not.toHaveBeenCalled();fake.done();
    });
    it("rechecks evidence/matter authority after rendering and withholds bytes on revocation", async () => {
        mocks.sources.mockResolvedValueOnce({ ok: true, data: [] }).mockResolvedValueOnce({ ok: false, kind: "not_found", detail: "revoked" });
        const fake = scriptedDb([{ table: "work_products", data: product }, { table: "work_product_versions", data: version }, { table: "work_products", data: product }]);
        expect(await exportWorkProductVersion(fake.db, actor, id, id)).toMatchObject({ ok: false, kind: "not_found" });
        expect(mocks.render).toHaveBeenCalledOnce();expect(mocks.sources).toHaveBeenCalledTimes(2);fake.done();
    });
    it("exports the requested historical version without a storage capability", async () => {
        const fake = scriptedDb([{ table: "work_products", data: product }, { table: "work_product_versions", data: { ...version, title: "A/B" } }, { table: "work_products", data: product }]);
        expect(await exportWorkProductVersion(fake.db, actor, id, id)).toMatchObject({ ok: true, data: { filename: "A_B - draft r1.docx", bytes: Buffer.from("docx") } });
        expect(fake.calls[1].filters).toContainEqual(["eq", "id", id]);fake.done();
    });
    it("bounds catalogue and history reads", async () => {
        const fake = scriptedDb([]);
        expect(await listWorkProducts(fake.db, actor, 51, 0)).toMatchObject({ ok: false, kind: "validation" });
        expect(await listWorkProductVersions(fake.db, actor, id, 50, -1)).toMatchObject({ ok: false, kind: "validation" });fake.done();
    });
});

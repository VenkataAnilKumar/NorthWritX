import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { exportWorkProduct, listWorkProducts, listWorkProductVersions, NorthWritApiError, readWorkProduct, saveWorkProduct } from "./northwritApi";
vi.mock("./errorReporting", () => ({ trackPendingRequest: () => () => {}, reportApiFailure: vi.fn(), reportNetworkFailure: vi.fn() }));
const fetchMock = vi.fn();
beforeEach(() => { vi.stubGlobal("fetch", fetchMock); fetchMock.mockReset(); });
afterEach(() => vi.unstubAllGlobals());
function json(value: unknown) { return new Response(JSON.stringify(value), { headers: { "Content-Type": "application/json" } }); }
describe("work-product API transport", () => {
    it("uses encoded matter/product/version paths with cookie auth, no cache and bounded pages", async () => {
        const requests = [
            [() => listWorkProducts("matter/x"), "/projects/matter%2Fx/work-products?limit=50&offset=0"],
            [() => listWorkProducts("matter", 50), "/projects/matter/work-products?limit=50&offset=50"],
            [() => listWorkProductVersions("matter", "draft/x", 50), "/projects/matter/work-products/draft%2Fx/versions?limit=50&offset=50"],
            [() => readWorkProduct("matter", "draft/x"), "/projects/matter/work-products/draft%2Fx"],
            [() => readWorkProduct("matter", "draft", "version/x"), "/projects/matter/work-products/draft/versions/version%2Fx"],
        ] as const;
        for (const [request, path] of requests) {
            fetchMock.mockResolvedValueOnce(json({ marker: path }));
            await expect(request()).resolves.toEqual({ marker: path });
            expect(fetchMock).toHaveBeenLastCalledWith(`/api${path}`, expect.objectContaining({ cache: "no-store", credentials: "include" }));
        }
    });
    it("posts exact optimistic base and stable request identity for create and append", async () => {
        for (const id of [null, "draft/x"]) {
            const input = { request_id: "request", expected_version_id: id ? "v1" : null, title: "Advice", body: "Text", scope: "", assumptions: "", sources: [] };
            fetchMock.mockResolvedValueOnce(json({ idempotent: true }));
            await expect(saveWorkProduct("matter", id, input)).resolves.toEqual({ idempotent: true });
            expect(fetchMock).toHaveBeenLastCalledWith(`/api/projects/matter/work-products${id ? "/draft%2Fx/versions" : ""}`, expect.objectContaining({ method: "POST", body: JSON.stringify(input), credentials: "include", headers: expect.objectContaining({ "Content-Type": "application/json" }) }));
        }
    });
    it("POSTs authenticated export bytes for the selected revision and parses the filename", async () => {
        fetchMock.mockResolvedValueOnce(new Response("docx", { headers: { "Content-Disposition": 'attachment; filename="Advice - draft r2.docx"' } }));
        const file = await exportWorkProduct("matter", "draft/x", "v/2");
        expect(file.filename).toBe("Advice - draft r2.docx"); expect(await file.blob.text()).toBe("docx");
        expect(fetchMock).toHaveBeenLastCalledWith("/api/projects/matter/work-products/draft%2Fx/versions/v%2F2/export", expect.objectContaining({ method: "POST", cache: "no-store", credentials: "include" }));
        fetchMock.mockResolvedValueOnce(new Response("bytes"));
        expect((await exportWorkProduct("matter", "draft", "v1")).filename).toBeNull();
    });
    it("preserves export access/conflict statuses instead of downloading error bytes", async () => {
        for (const status of [403, 404, 409]) {
            fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ detail: "Draft unavailable" }), { status }));
            await expect(exportWorkProduct("matter", "draft", "v1")).rejects.toMatchObject({ status, name: "NorthWritApiError" });
        }
        fetchMock.mockResolvedValueOnce(new Response("internal database detail", { status: 500 }));
        try { await exportWorkProduct("matter", "draft", "v1"); throw new Error("Expected refusal"); }
        catch (error) { expect(error).toBeInstanceOf(NorthWritApiError); expect((error as Error).message).not.toContain("database"); }
    });
});

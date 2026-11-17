import { StrictMode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { WorkProductReadResponse, WorkProductSaveResponse } from "@northwrit/contracts";
import { useMatterDrafts } from "./useMatterDrafts";
import * as api from "@/app/lib/northwritApi";
import { downloadBlob } from "@/app/lib/downloadDocument";
import { notifyError } from "@/app/lib/userFacingError";
vi.mock("@/app/lib/northwritApi", async importOriginal => ({ ...await importOriginal<typeof api>(), listWorkProducts: vi.fn(), readWorkProduct: vi.fn(), listWorkProductVersions: vi.fn(), saveWorkProduct: vi.fn(), exportWorkProduct: vi.fn() }));
vi.mock("@/app/lib/userFacingError", () => ({ notifyError: vi.fn(), notifySuccess: vi.fn() }));
vi.mock("@/app/lib/downloadDocument", () => ({ downloadBlob: vi.fn() }));
const source = { document_id: "doc", version_id: "doc-v1", content_sha256: "a".repeat(64), filename: "Source.docx", version_number: 1 };
const read = (revision = 1, current = revision): WorkProductReadResponse => ({
    work_product: { id: "draft", project_id: "a", title: "Advice", current_version_id: `v${current}`, created_at: "2026-11-17", updated_at: "2026-11-17" },
    version: { id: `v${revision}`, work_product_id: "draft", revision, based_on_version_id: revision > 1 ? `v${revision - 1}` : null, title: "Advice", body: `Text ${revision}`, scope: "Contract", assumptions: "Synthetic", sources: [source], created_by: "author", author_label: "Author", created_at: "2026-11-17" }, evidence_status: "current",
});
function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(yes => { resolve = yes; }); return { promise, resolve }; }
async function mount(canEdit = true) {
    const hook = renderHook(() => useMatterDrafts("a", canEdit), { wrapper: StrictMode });
    await waitFor(() => expect(hook.result.current.listState).toBe("ready"));
    return hook;
}
beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.listWorkProducts).mockResolvedValue({ items: [read().work_product] });
    vi.mocked(api.readWorkProduct).mockResolvedValue(read());
    vi.mocked(api.listWorkProductVersions).mockResolvedValue({ current_version_id: "v1", versions: [read().version] });
    vi.mocked(api.saveWorkProduct).mockResolvedValue({ ...read(2), idempotent: false });
    vi.mocked(api.exportWorkProduct).mockResolvedValue({ blob: new Blob(["docx"]), filename: "draft.docx" });
});
describe("matter drafts", () => {
    it("preserves failed edits and retries an identical payload with the same UUID", async () => {
        const { result } = await mount();
        await act(async () => { await result.current.open("draft"); });
        act(() => result.current.setFields(old => ({ ...old, body: "My edits" })));
        vi.mocked(api.saveWorkProduct).mockRejectedValueOnce(new TypeError("network"));
        await act(async () => { await result.current.save(); });
        expect(result.current.fields.body).toBe("My edits"); expect(result.current.dirty).toBe(true);
        await act(async () => { await result.current.save(); });
        const [first, retry] = vi.mocked(api.saveWorkProduct).mock.calls;
        expect(first[2].request_id).toMatch(/^[a-f0-9-]{36}$/);
        expect(retry[2]).toEqual(first[2]);
        expect(first[2]).toMatchObject({ expected_version_id: "v1", body: "My edits", sources: [{ document_id: "doc", version_id: "doc-v1", content_sha256: "a".repeat(64) }] });
        expect(result.current.dirty).toBe(false);
    });
    it("uses a new request identity when a failed payload changes", async () => {
        const { result } = await mount(); act(() => result.current.create());
        vi.mocked(api.saveWorkProduct).mockRejectedValueOnce(new TypeError("network"));
        act(() => result.current.setFields(old => ({ ...old, title: "New", body: "First" })));
        await act(async () => { await result.current.save(); });
        act(() => result.current.setFields(old => ({ ...old, body: "Second" })));
        await act(async () => { await result.current.save(); });
        const calls = vi.mocked(api.saveWorkProduct).mock.calls;
        expect(calls[0][1]).toBeNull(); expect(calls[0][2].expected_version_id).toBeNull();
        expect(calls[0][2].request_id).not.toBe(calls[1][2].request_id);
    });
    it("blocks a conflicting save until reload, without overwriting the local text", async () => {
        const { result } = await mount(); await act(async () => { await result.current.open("draft"); });
        act(() => result.current.setFields(old => ({ ...old, body: "Preserve me" })));
        vi.mocked(api.saveWorkProduct).mockRejectedValueOnce(new api.NorthWritApiError({ status: 409, message: "Changed" }));
        await act(async () => { await result.current.save(); });
        expect(result.current.conflict).toBe(true); expect(result.current.fields.body).toBe("Preserve me");
        await act(async () => { await result.current.save(); }); expect(api.saveWorkProduct).toHaveBeenCalledTimes(1);
        vi.mocked(api.readWorkProduct).mockResolvedValueOnce(read(3));
        await act(async () => { await result.current.open("draft"); });
        expect(result.current.conflict).toBe(false); expect(result.current.fields.body).toBe("Text 3");
    });
    it("restores historical content with the current base as a new immutable revision", async () => {
        const { result } = await mount(); vi.mocked(api.readWorkProduct).mockResolvedValueOnce(read(1, 3));
        await act(async () => { await result.current.open("draft", "v1"); });
        expect(result.current.historical).toBe(true);
        await act(async () => { await result.current.save(); }); expect(api.saveWorkProduct).not.toHaveBeenCalled();
        await act(async () => { await result.current.save(true); });
        expect(api.saveWorkProduct).toHaveBeenCalledWith("a", "draft", expect.objectContaining({ expected_version_id: "v3", body: "Text 1" }));
    });
    it("allows readers to export saved history but denies creating or saving", async () => {
        const { result } = await mount(false); act(() => result.current.create()); expect(result.current.creating).toBe(false);
        vi.mocked(api.readWorkProduct).mockResolvedValueOnce(read(1, 2));
        await act(async () => { await result.current.open("draft", "v1"); });
        await act(async () => { await result.current.save(true); await result.current.exportSelected(); });
        expect(api.saveWorkProduct).not.toHaveBeenCalled(); expect(api.exportWorkProduct).toHaveBeenCalledWith("a", "draft", "v1"); expect(downloadBlob).toHaveBeenCalledOnce();
    });
    it("exports the selected saved revision even when the form has unsaved edits", async () => {
        const { result } = await mount(); await act(async () => { await result.current.open("draft"); });
        act(() => result.current.setFields(old => ({ ...old, body: "Unsaved" })));
        await act(async () => { await result.current.exportSelected(); });
        expect(api.exportWorkProduct).toHaveBeenCalledWith("a", "draft", "v1"); expect(result.current.fields.body).toBe("Unsaved");
    });
    it("blocks export for stale evidence and marks it stale after a server refusal", async () => {
        const { result } = await mount(); vi.mocked(api.readWorkProduct).mockResolvedValueOnce({ ...read(), evidence_status: "changed_or_unavailable" });
        await act(async () => { await result.current.open("draft"); await result.current.exportSelected(); });
        expect(api.exportWorkProduct).not.toHaveBeenCalled();
        await act(async () => { await result.current.open("draft"); });
        vi.mocked(api.exportWorkProduct).mockRejectedValueOnce(new api.NorthWritApiError({ status: 409, message: "Source changed" }));
        await act(async () => { await result.current.exportSelected(); });
        expect(result.current.selected?.evidence_status).toBe("changed_or_unavailable"); expect(downloadBlob).not.toHaveBeenCalled();
    });
    it("drops old matter reads, writes, downloads and retained callbacks after unmount", async () => {
        const { result, unmount } = await mount(); await act(async () => { await result.current.open("draft"); });
        const pending = deferred<{ blob: Blob; filename: string }>(); vi.mocked(api.exportWorkProduct).mockReturnValueOnce(pending.promise);
        let exporting!: Promise<void>; act(() => { exporting = result.current.exportSelected(); });
        const old = result.current; unmount();
        await act(async () => { pending.resolve({ blob: new Blob(), filename: "late.docx" }); await exporting; await old.save(); await old.open("draft"); });
        expect(downloadBlob).not.toHaveBeenCalled(); expect(api.saveWorkProduct).not.toHaveBeenCalled();
        const next = await mount(); expect(next.result.current.selected).toBeNull();
    });
    it("does not publish late save results or failures to a new matter view", async () => {
        const hook = await mount(); await act(async () => { await hook.result.current.open("draft"); });
        const pending = deferred<WorkProductSaveResponse>(); vi.mocked(api.saveWorkProduct).mockReturnValueOnce(pending.promise);
        let saving!: Promise<void>; act(() => { saving = hook.result.current.save(); }); hook.unmount();
        const next = renderHook(() => useMatterDrafts("b", true)); await waitFor(() => expect(next.result.current.listState).toBe("ready"));
        await act(async () => { pending.resolve({ ...read(2), idempotent: false }); await saving; });
        expect(next.result.current.selected).toBeNull(); expect(next.result.current.fields.body).toBe("");
    });
    it("shows failures as unavailable and preserves the last text after denied reads", async () => {
        const { result } = await mount(); await act(async () => { await result.current.open("draft"); });
        vi.mocked(api.readWorkProduct).mockRejectedValueOnce(new api.NorthWritApiError({ status: 404, message: "Not found" }));
        await act(async () => { await result.current.open("other"); });
        expect(result.current.readFailed).toBe(true); expect(result.current.fields.body).toBe("Text 1");
        await act(async () => { await result.current.exportSelected(); }); expect(api.exportWorkProduct).not.toHaveBeenCalled(); expect(notifyError).toHaveBeenCalled();
    });
    it("treats an idempotent older save as historical without rolling back the current pointer", async () => {
        const { result } = await mount(); await act(async () => { await result.current.open("draft"); });
        vi.mocked(api.saveWorkProduct).mockResolvedValueOnce({ ...read(2, 3), idempotent: true });
        await act(async () => { await result.current.save(); });
        expect(result.current.selected?.work_product.current_version_id).toBe("v3");
        expect(result.current.selected?.version.id).toBe("v2"); expect(result.current.historical).toBe(true);
        await act(async () => { await result.current.save(); await result.current.exportSelected(); });
        expect(api.saveWorkProduct).toHaveBeenCalledOnce(); expect(api.exportWorkProduct).toHaveBeenCalledWith("a", "draft", "v2");
    });
    it("preserves the recovery base when a newer revision exists", async () => {
        const { result } = await mount();
        vi.mocked(api.readWorkProduct).mockResolvedValueOnce(read(1, 3));
        await act(async () => { await result.current.restoreRecovery({ id:"copy",project_id:"a",work_product_id:"draft",base_version_id:"v1",sequence:1,updated_at:"now",expires_at:"later",fields:{title:"Recovered",body:"Private edits",scope:"",assumptions:"",sources:[]} }); });
        expect(result.current.historical).toBe(false);expect(result.current.recovered).toBe(true);
        await act(async () => { await result.current.save(); });
        expect(api.saveWorkProduct).toHaveBeenCalledWith("a","draft",expect.objectContaining({expected_version_id:"v1",body:"Private edits"}));
    });
    it("drops a late read after the matter editor unmounts", async () => {
        const hook = await mount(); const pending = deferred<WorkProductReadResponse>();
        vi.mocked(api.readWorkProduct).mockReturnValueOnce(pending.promise);
        let opening!: Promise<void>; act(() => { opening = hook.result.current.open("draft"); }); hook.unmount();
        const next = await mount();
        await act(async () => { pending.resolve(read()); await opening; });
        expect(next.result.current.selected).toBeNull(); expect(next.result.current.fields.body).toBe(""); expect(notifyError).not.toHaveBeenCalled();
    });
    it("keeps a failed list distinct from an empty matter and permits an honest retry", async () => {
        vi.mocked(api.listWorkProducts).mockRejectedValue(new TypeError("network"));
        const hook = renderHook(() => useMatterDrafts("a", true));
        await waitFor(() => expect(hook.result.current.listState).toBe("failed"));
        vi.mocked(api.listWorkProducts).mockResolvedValue({ items: [] });
        await act(async () => { await hook.result.current.loadList(); });
        expect(hook.result.current.listState).toBe("ready"); expect(hook.result.current.items).toEqual([]);
    });
    it("retries a new draft after its conflicting source references are reviewed", async () => {
        const { result } = await mount(); act(() => result.current.create());
        act(() => result.current.setFields(old => ({ ...old, title: "New", body: "Keep this", sources: [source] })));
        vi.mocked(api.saveWorkProduct).mockRejectedValueOnce(new api.NorthWritApiError({ status: 409, message: "Changed source" }));
        await act(async () => { await result.current.save(); }); expect(result.current.conflict).toBe(true);
        act(() => result.current.setFields(old => ({ ...old, sources: [] })));
        expect(result.current.conflict).toBe(false); expect(result.current.fields.body).toBe("Keep this");
        await act(async () => { await result.current.save(); });
        expect(api.saveWorkProduct).toHaveBeenCalledTimes(2);
    });
    it("paginates beyond 50 drafts and revisions without duplicates after saving", async () => {
        vi.mocked(api.listWorkProducts).mockResolvedValue({ items: Array.from({ length: 50 }, (_, i) => ({ ...read().work_product, id: `draft-${i}` })) });
        const { result } = await mount(); expect(result.current.moreItems).toBe(true);
        vi.mocked(api.listWorkProducts).mockResolvedValueOnce({ items: [{ ...read().work_product, id: "draft-50" }] });
        await act(async () => { await result.current.loadList(true); });
        expect(api.listWorkProducts).toHaveBeenLastCalledWith("a", 50); expect(result.current.items).toHaveLength(51);
        const history = Array.from({ length: 50 }, (_, i) => read(51 - i).version);
        vi.mocked(api.readWorkProduct).mockResolvedValueOnce(read(51));
        vi.mocked(api.listWorkProductVersions).mockResolvedValueOnce({ current_version_id: "v51", versions: history });
        await act(async () => { await result.current.open("draft"); }); expect(result.current.moreVersions).toBe(true);
        vi.mocked(api.listWorkProductVersions).mockResolvedValueOnce({ current_version_id: "v51", versions: [read(1).version] });
        await act(async () => { await result.current.loadMoreVersions(); });
        expect(api.listWorkProductVersions).toHaveBeenLastCalledWith("a", "draft", 50); expect(result.current.versions).toHaveLength(51);
        vi.mocked(api.saveWorkProduct).mockResolvedValueOnce({ ...read(52), idempotent: false });
        await act(async () => { await result.current.save(); });
        vi.mocked(api.listWorkProductVersions).mockResolvedValueOnce({ current_version_id: "v52", versions: [read(52).version, ...history.slice(0, 49)] });
        await act(async () => { await result.current.loadMoreVersions(); });
        expect(api.listWorkProductVersions).toHaveBeenLastCalledWith("a", "draft", 0); expect(result.current.versions).toHaveLength(52);
    });
    it("keeps initial loading reliable under Strict Mode and refuses duplicate in-flight saves", async () => {
        const { result } = await mount(); await act(async () => { await result.current.open("draft"); });
        const pending = deferred<WorkProductSaveResponse>(); vi.mocked(api.saveWorkProduct).mockReturnValueOnce(pending.promise);
        let saving!: Promise<void>; act(() => { saving = result.current.save(); void result.current.save(); result.current.create(); });
        expect(api.saveWorkProduct).toHaveBeenCalledOnce(); expect(result.current.creating).toBe(false);
        await act(async () => { pending.resolve({ ...read(2), idempotent: false }); await saving; });
    });
});

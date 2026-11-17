import { StrictMode, useState } from "react";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Document, Folder, Project } from "@/app/components/shared/types";
import { getProject } from "@/app/lib/northwritApi";
import { useProjectDocumentState } from "./useProjectDocumentState";
vi.mock("@/app/lib/northwritApi", () => ({ getProject: vi.fn() }));

const doc = (id: string) => ({ id } as Document);
const folder = (id: string) => ({ id } as Folder);
const matter = (id: string) => ({ id, name: id, documents: [doc(`${id}-document`)], folders: [folder(`${id}-folder`)] } as Project);
function deferred() {
    let resolve!: (value: Project) => void;
    let reject!: (error: Error) => void;
    const promise = new Promise<Project>((yes, no) => { resolve = yes; reject = no; });
    return { promise, resolve, reject };
}
function mount() {
    return renderHook(({ id }) => {
        const [project, setProject] = useState<Project | null>(matter("a"));
        const [folders, setFolders] = useState<Folder[]>([folder("a-folder")]);
        const state = useProjectDocumentState(id, setProject, setFolders);
        return { ...state, project, folders, setProject, setWorkspaceFolders: setFolders };
    }, { initialProps: { id: "a" }, wrapper: StrictMode });
}
beforeEach(() => vi.resetAllMocks());

describe("matter-bound document state", () => {
    it("ignores an A refresh after switching to B, including its folders", async () => {
        const pending = deferred();
        vi.mocked(getProject).mockReturnValueOnce(pending.promise);
        const { result, rerender } = mount();
        let refresh!: Promise<void>;
        act(() => { refresh = result.current.refreshCollection(); });
        act(() => {
            result.current.setProject(matter("b")); result.current.setWorkspaceFolders([folder("b-folder")]);
            rerender({ id: "b" });
        });
        await act(async () => { pending.resolve(matter("a")); await refresh; });
        expect(result.current.project?.id).toBe("b");
        expect(result.current.folders).toEqual([folder("b-folder")]);
    });
    it("ignores retained upload setters and refresh callbacks after navigation", async () => {
        const { result, rerender } = mount();
        const old = { ...result.current };
        act(() => { result.current.setProject(matter("b")); result.current.setWorkspaceFolders([folder("b-folder")]); rerender({ id: "b" }); });
        act(() => { old.setDocuments([doc("old-upload")]); old.setFolders([folder("old-folder")]); });
        await act(async () => old.refreshCollection());
        expect(result.current.project?.documents).toEqual(matter("b").documents);
        expect(result.current.folders).toEqual([folder("b-folder")]);
        expect(getProject).not.toHaveBeenCalled();
    });
    it("treats A to B to A as a new view and drops the first A's results", async () => {
        const pending = deferred();
        vi.mocked(getProject).mockReturnValueOnce(pending.promise);
        const { result, rerender } = mount();
        const oldSetter = result.current.setDocuments;
        let refresh!: Promise<void>;
        act(() => { refresh = result.current.refreshCollection(); });
        act(() => { result.current.setProject(matter("b")); rerender({ id: "b" }); });
        act(() => { result.current.setProject({ ...matter("a"), name: "Fresh A" }); rerender({ id: "a" }); });
        await act(async () => { pending.resolve({ ...matter("a"), name: "Old A" }); await refresh; });
        act(() => oldSetter([doc("old-upload")]));
        expect(result.current.project?.name).toBe("Fresh A");
        expect(result.current.project?.documents).toEqual(matter("a").documents);
    });
    it("retains the latest refresh when responses arrive out of order", async () => {
        const first = deferred(), second = deferred();
        vi.mocked(getProject).mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
        const { result } = mount();
        let one!: Promise<void>, two!: Promise<void>;
        act(() => { one = result.current.refreshCollection(); two = result.current.refreshCollection(); });
        await act(async () => { second.resolve({ ...matter("a"), name: "Latest" }); await two; });
        await act(async () => { first.resolve({ ...matter("a"), name: "Stale" }); await one; });
        expect(result.current.project?.name).toBe("Latest");
    });
    it("preserves data on current failure, propagates it and allows retry", async () => {
        const failure = new Error("offline");
        vi.mocked(getProject).mockRejectedValueOnce(failure).mockResolvedValueOnce({ ...matter("a"), name: "Retried" });
        const { result } = mount();
        await act(async () => { await expect(result.current.refreshCollection()).rejects.toBe(failure); });
        expect(result.current.project?.name).toBe("a");
        await act(async () => result.current.refreshCollection());
        expect(result.current.project?.name).toBe("Retried");
    });
    it("rejects a mismatched response without applying its data", async () => {
        vi.mocked(getProject).mockResolvedValueOnce(matter("b"));
        const { result } = mount();
        await act(async () => { await expect(result.current.refreshCollection()).rejects.toThrow("Unexpected matter"); });
        expect(result.current.project?.id).toBe("a");
    });
    it("stops state writes after unmount", async () => {
        const pending = deferred();
        vi.mocked(getProject).mockReturnValueOnce(pending.promise);
        const setProject = vi.fn(), setFolders = vi.fn();
        const { result, unmount } = renderHook(() => useProjectDocumentState("a", setProject, setFolders));
        const oldSetter = result.current.setDocuments;
        const oldFolderSetter = result.current.setFolders;
        const refresh = result.current.refreshCollection();
        unmount();
        await act(async () => { pending.resolve(matter("a")); await refresh; });
        oldSetter([doc("late")]); oldFolderSetter([folder("late")]);
        expect(setProject).not.toHaveBeenCalled(); expect(setFolders).not.toHaveBeenCalled();
    });
    it("applies current upload updates without losing matter metadata", () => {
        const { result } = mount();
        act(() => result.current.setDocuments(previous => [...previous, doc("upload")]));
        expect(result.current.project?.documents).toEqual([doc("a-document"), doc("upload")]);
        expect(result.current.project?.name).toBe("a");
        act(() => result.current.setFolders(previous => [...previous, folder("new-folder")]));
        expect(result.current.folders).toEqual([folder("a-folder"), folder("new-folder")]);
    });
    it("guards queued project and folder updaters again when React applies them", async () => {
        vi.mocked(getProject).mockResolvedValueOnce(matter("a"));
        const setProject = vi.fn(), setFolders = vi.fn();
        const { result, rerender } = renderHook(({ id }) => useProjectDocumentState(id, setProject, setFolders), { initialProps: { id: "a" } });
        await act(async () => result.current.refreshCollection());
        const projectUpdater = setProject.mock.calls[0][0];
        const folderUpdater = setFolders.mock.calls[0][0];
        rerender({ id: "b" });
        const current = matter("b"), folders = [folder("b-folder")];
        expect(projectUpdater(current)).toBe(current);
        expect(folderUpdater(folders)).toBe(folders);
    });
    it("does not surface a departed matter's failed refresh in the new view", async () => {
        const pending = deferred();
        vi.mocked(getProject).mockReturnValueOnce(pending.promise);
        const { result, rerender } = mount();
        const refresh = result.current.refreshCollection();
        act(() => { result.current.setProject(matter("b")); rerender({ id: "b" }); });
        await act(async () => { pending.reject(new Error("old matter unavailable")); await expect(refresh).resolves.toBeUndefined(); });
        expect(result.current.project?.id).toBe("b");
    });

});

import { act, renderHook } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getDocumentStatuses } from "../lib/northwritApi";
import { useDocumentConversionPolling } from "./useDocumentConversionPolling";
import type { Document } from "../components/shared/types";
vi.mock("../lib/northwritApi", () => ({ getDocumentStatuses: vi.fn() }));
const doc = (id: string, status = "processing") => ({id, status} as Document);
afterEach(() => { vi.useRealTimers(); vi.resetAllMocks(); });
describe("conversion polling", () => {
    it("batches 250 ids, limits concurrency and prevents overlapping cycles", async () => {
        vi.useFakeTimers();
        const pending: (() => void)[] = [];
        vi.mocked(getDocumentStatuses).mockImplementation(ids => new Promise(resolve => pending.push(() => resolve(ids.map(id => doc(id,"ready"))))));
        const {result, unmount} = renderHook(() => {
            const [documents, setDocuments] = useState(Array.from({length:250}, (_,i) => doc(String(i))));
            useDocumentConversionPolling(documents, setDocuments);
            return documents;
        });
        await act(async () => { await vi.advanceTimersByTimeAsync(9000); });
        expect(getDocumentStatuses).toHaveBeenCalledTimes(2);
        expect(vi.mocked(getDocumentStatuses).mock.calls[0][0]).toHaveLength(100);
        await act(async () => { pending.shift()!(); await Promise.resolve(); });
        expect(getDocumentStatuses).toHaveBeenCalledTimes(3);
        expect(vi.mocked(getDocumentStatuses).mock.calls[2][0]).toHaveLength(50);
        await act(async () => { for (const finish of pending.splice(0)) finish(); });
        expect(result.current.every(d => d.status === "ready")).toBe(true);
        await act(async () => { await vi.advanceTimersByTimeAsync(9000); });
        expect(getDocumentStatuses).toHaveBeenCalledTimes(3);
        unmount();
    });
    it("retries failures and ignores late responses after unmount", async () => {
        vi.useFakeTimers();
        let finish!: (value: Document[]) => void;
        vi.mocked(getDocumentStatuses).mockRejectedValueOnce(new Error("offline")).mockImplementationOnce(() => new Promise(resolve => {finish=resolve;}));
        const set = vi.fn();
        const {unmount} = renderHook(() => useDocumentConversionPolling([doc("a")], set));
        await act(async () => { await vi.advanceTimersByTimeAsync(6000); });
        expect(getDocumentStatuses).toHaveBeenCalledTimes(2);
        set.mockClear();
        unmount();
        await act(async () => {finish([doc("a","ready")]);});
        expect(set).not.toHaveBeenCalled();
        expect(vi.mocked(getDocumentStatuses).mock.calls[1][1]?.aborted).toBe(true);
    });
    it("does not let an older conversion response replace a newly selected version", async () => {
        vi.useFakeTimers();
        let finish!: (rows: Document[]) => void;
        vi.mocked(getDocumentStatuses).mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }))
            .mockResolvedValueOnce([{ ...doc("a", "ready"), current_version_id: "v2" }]);
        const { result } = renderHook(() => {
            const [documents, setDocuments] = useState<Document[]>([{ ...doc("a"), current_version_id: "v1" }]);
            useDocumentConversionPolling(documents, setDocuments);
            return { documents, setDocuments };
        });
        await act(async () => { await vi.advanceTimersByTimeAsync(3000); });
        act(() => result.current.setDocuments([{ ...doc("a"), current_version_id: "v2" }]));
        await act(async () => finish([{ ...doc("a", "ready"), current_version_id: "v1" }]));
        expect(result.current.documents[0]).toMatchObject({ current_version_id: "v2", status: "processing" });
        expect(vi.mocked(getDocumentStatuses).mock.calls[0][1]?.aborted).toBe(true);
        await act(async () => { await vi.advanceTimersByTimeAsync(3000); });
        expect(result.current.documents[0]).toMatchObject({ current_version_id: "v2", status: "ready" });
    });
    it("rechecks the requested version when a queued state updater is applied", async () => {
        vi.useFakeTimers();
        vi.mocked(getDocumentStatuses).mockResolvedValue([{ ...doc("a", "ready"), current_version_id: "v1" }]);
        const set = vi.fn();
        renderHook(() => useDocumentConversionPolling([{ ...doc("a"), current_version_id: "v1" }], set));
        await act(async () => { await vi.advanceTimersByTimeAsync(3000); });
        const replacement = [{ ...doc("a"), current_version_id: "v2" }];
        expect(set.mock.calls[0][0](replacement)).toBe(replacement);
    });

    it("drops an old conversion result after in-place bytes change on the same version", async () => {
        vi.useFakeTimers();
        let finish!: (rows: Document[]) => void;
        vi.mocked(getDocumentStatuses).mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }))
            .mockResolvedValueOnce([{ ...doc("a", "ready"), current_version_id: "v1", content_sha256: "new-bytes" }]);
        const { result } = renderHook(() => {
            const [documents, setDocuments] = useState<Document[]>([{ ...doc("a"), current_version_id: "v1", content_sha256: "old-bytes" }]);
            useDocumentConversionPolling(documents, setDocuments);
            return { documents, setDocuments };
        });
        await act(async () => { await vi.advanceTimersByTimeAsync(3000); });
        act(() => result.current.setDocuments([{ ...doc("a"), current_version_id: "v1", content_sha256: "new-bytes" }]));
        await act(async () => finish([{ ...doc("a", "ready"), current_version_id: "v1", content_sha256: "old-bytes" }]));
        expect(result.current.documents[0]).toMatchObject({ content_sha256: "new-bytes", status: "processing" });
        expect(vi.mocked(getDocumentStatuses).mock.calls[0][1]?.aborted).toBe(true);
        await act(async () => { await vi.advanceTimersByTimeAsync(3000); });
        expect(result.current.documents[0]).toMatchObject({ content_sha256: "new-bytes", status: "ready" });
    });

});

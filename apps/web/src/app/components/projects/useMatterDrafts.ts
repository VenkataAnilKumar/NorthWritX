"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type SetStateAction } from "react";
import type { WorkProduct, WorkProductReadResponse, WorkProductSourceRef, WorkProductVersionSummary, WorkProductRecovery } from "@northwrit/contracts";
import { exportWorkProduct, listWorkProducts, listWorkProductVersions, NorthWritApiError, readWorkProduct, saveWorkProduct } from "@/app/lib/northwritApi";
import { notifyError, notifySuccess } from "@/app/lib/userFacingError";
import { downloadBlob } from "@/app/lib/downloadDocument";

export type DraftFields = { title: string; body: string; scope: string; assumptions: string; sources: WorkProductSourceRef[] };
export const emptyDraft = (): DraftFields => ({ title: "", body: "", scope: "", assumptions: "", sources: [] });
export function draftFields(read: WorkProductReadResponse): DraftFields {
    const { title, body, scope, assumptions, sources } = read.version;
    return { title, body, scope, assumptions, sources: sources.map(({ document_id, version_id, content_sha256, locator }) => ({ document_id, version_id, content_sha256, ...(locator ? { locator } : {}) })) };
}
const mergeById = <T extends { id: string }>(items: T[]) => [...new Map(items.map(item => [item.id, item])).values()];

/** Mount under a matter-ID key: async work may finish, but cannot affect another editor. */
export function useMatterDrafts(projectId: string, canEdit: boolean) {
    const [items, setItems] = useState<WorkProduct[]>([]);
    const [listState, setListState] = useState<"loading" | "ready" | "failed">("loading");
    const [moreItems, setMoreItems] = useState(false);
    const listOffset = useRef(0);
    const [selected, setSelected] = useState<WorkProductReadResponse | null>(null);
    const [versions, setVersions] = useState<WorkProductVersionSummary[]>([]);
    const [moreVersions, setMoreVersions] = useState(false);
    const versionOffset = useRef(0);
    const [fields, setFields] = useState<DraftFields>(emptyDraft);
    const [baseline, setBaseline] = useState<DraftFields>(emptyDraft);
    const [editorSession, setEditorSession] = useState(0);
    const [recoveryBase, setRecoveryBase] = useState<string | null | undefined>(undefined);
    const [creating, setCreating] = useState(false);
    const [busy, setBusy] = useState(false);
    const [conflict, setConflict] = useState(false);
    const [readFailed, setReadFailed] = useState(false);
    const lock = useRef(false);
    const epoch = useRef(0);
    const active = useRef(false);
    const attempt = useRef<{ fingerprint: string; id: string } | null>(null);
    useLayoutEffect(() => {
        active.current = true;
        const token = epoch.current;
        return () => { active.current = false; epoch.current = token + 1; lock.current = false; };
    }, []);
    const current = (token: number) => active.current && epoch.current === token;
    const dirty = JSON.stringify(fields) !== JSON.stringify(baseline);
    const historical = Boolean(selected && selected.version.id !== selected.work_product.current_version_id && recoveryBase === undefined);

    const loadList = useCallback(async (append = false) => {
        if (!active.current || lock.current) return;
        const token = epoch.current;
        lock.current = true; setBusy(true);
        try {
            const offset = append ? listOffset.current : 0;
            const page = await listWorkProducts(projectId, offset);
            if (!active.current || token !== epoch.current) return;
            setItems(old => mergeById(append ? [...old, ...page.items] : page.items));
            listOffset.current = offset + page.items.length;
            setMoreItems(page.items.length === 50 && listOffset.current <= 10000);
            setListState("ready");
        } catch (error) {
            if (!active.current || token !== epoch.current) return;
            if (!append) setListState("failed");
            notifyError(error, { action: "load matter drafts", operation: "work_products.read" });
        } finally {
            if (active.current && token === epoch.current) { lock.current = false; setBusy(false); }
        }
    }, [projectId]);
    useEffect(() => { void loadList(); }, [loadList]);

    async function open(id: string, versionId?: string) {
        if (!active.current || lock.current) return;
        const token = epoch.current;
        lock.current = true; setBusy(true); setReadFailed(false);
        try {
            const [read, history] = await Promise.all([readWorkProduct(projectId, id, versionId), listWorkProductVersions(projectId, id)]);
            if (!current(token)) return;
            // The read endpoint's current pointer is authoritative for the selected snapshot.
            // If another save lands during these reads, the next save still fails closed by CAS.
            setRecoveryBase(undefined); setEditorSession(value => value + 1);
            setSelected(read); setVersions(history.versions); versionOffset.current = history.versions.length;
            setMoreVersions(history.versions.length === 50);
            const next = draftFields(read); setFields(next); setBaseline(next);
            setCreating(false); setConflict(false); attempt.current = null;
        } catch (error) {
            if (!current(token)) return;
            setReadFailed(true);
            notifyError(error, { action: "open draft revision", operation: "work_products.read" });
        } finally { if (current(token)) { lock.current = false; setBusy(false); } }
    }
    function create() {
        if (!active.current || lock.current || !canEdit) return;
        setRecoveryBase(undefined); setEditorSession(value => value + 1);
        setSelected(null); setVersions([]); setFields(emptyDraft()); setBaseline(emptyDraft());
        setCreating(true); setConflict(false); setReadFailed(false); attempt.current = null;
    }
    async function loadMoreVersions() {
        if (!active.current || lock.current || !selected) return;
        const token = epoch.current;
        lock.current = true; setBusy(true);
        try {
            const offset = versionOffset.current;
            const page = await listWorkProductVersions(projectId, selected.work_product.id, offset);
            if (!current(token)) return;
            setVersions(old => mergeById([...old, ...page.versions]).sort((a, b) => b.revision - a.revision));
            versionOffset.current = offset + page.versions.length;
            setMoreVersions(page.versions.length === 50 && versionOffset.current <= 10000);
        } catch (error) {
            if (current(token)) notifyError(error, { action: "load draft history", operation: "work_products.read" });
        } finally { if (current(token)) { lock.current = false; setBusy(false); } }
    }
    async function save(restore = false) {
        if (!active.current || lock.current || !canEdit || conflict || readFailed || (!creating && !selected) || (historical && !restore)) return;
        const token = epoch.current;
        const payload = { ...fields, expected_version_id: recoveryBase !== undefined ? recoveryBase : selected?.work_product.current_version_id ?? null };
        const fingerprint = JSON.stringify({ id: selected?.work_product.id ?? null, ...payload });
        if (attempt.current?.fingerprint !== fingerprint) attempt.current = { fingerprint, id: crypto.randomUUID() };
        lock.current = true; setBusy(true);
        try {
            const saved = await saveWorkProduct(projectId, selected?.work_product.id ?? null, { ...payload, request_id: attempt.current.id });
            if (!current(token)) return;
            setRecoveryBase(undefined);
            const read: WorkProductReadResponse = { ...saved, evidence_status: "current" };
            setSelected(read); setFields(draftFields(read)); setBaseline(draftFields(read));
            setItems(old => mergeById([saved.work_product, ...old.filter(item => item.id !== saved.work_product.id)]));
            setVersions(old => mergeById([saved.version, ...old]).sort((a, b) => b.revision - a.revision));
            // Restart pagination after a local insertion; the next page deduplicates the first 50.
            versionOffset.current = 0; setMoreVersions(true); setCreating(false); setConflict(false); attempt.current = null;
            notifySuccess(restore ? "Restored as a new draft revision" : "Draft revision saved");
        } catch (error) {
            if (!current(token)) return;
            if (error instanceof NorthWritApiError && error.status === 409) setConflict(true);
            notifyError(error, { action: "save draft revision", operation: "work_products.save" });
        } finally { if (current(token)) { lock.current = false; setBusy(false); } }
    }
    async function exportSelected() {
        if (!active.current || lock.current || !selected || readFailed || selected.evidence_status !== "current") return;
        const token = epoch.current;
        lock.current = true; setBusy(true);
        try {
            const file = await exportWorkProduct(projectId, selected.work_product.id, selected.version.id);
            if (current(token)) downloadBlob(file.blob, file.filename || `NorthWrit-draft-r${selected.version.revision}.docx`);
        } catch (error) {
            if (!current(token)) return;
            if (error instanceof NorthWritApiError && error.status === 409) {
                setSelected(old => old ? { ...old, evidence_status: "changed_or_unavailable" } : old);
            }
            notifyError(error, { action: "export draft revision", operation: "work_products.export" });
        } finally { if (current(token)) { lock.current = false; setBusy(false); } }
    }
    async function restoreRecovery(copy: WorkProductRecovery): Promise<boolean> {
        if (!active.current || lock.current || !canEdit) return false;
        const token = epoch.current; lock.current = true; setBusy(true);
        try {
            const read = copy.work_product_id ? await readWorkProduct(projectId, copy.work_product_id, copy.base_version_id ?? undefined) : null;
            const history = copy.work_product_id ? await listWorkProductVersions(projectId, copy.work_product_id) : null;
            if (!current(token)) return false;
            setRecoveryBase(copy.base_version_id);
            setSelected(read); setVersions(history?.versions ?? []); setMoreVersions(Boolean(history?.versions.length === 50));
            versionOffset.current = history?.versions.length ?? 0;
            setFields(copy.fields); setBaseline(read ? draftFields(read) : emptyDraft());
            setCreating(!read); setConflict(false); setReadFailed(false); attempt.current = null;
            setEditorSession(value => value + 1); return true;
        } catch (error) {
            if (current(token)) notifyError(error, { action: "recover draft edits", operation: "work_products.recovery" });
            return false;
        } finally { if (current(token)) { lock.current = false; setBusy(false); } }
    }
    function editFields(update: SetStateAction<DraftFields>) {
        if (!active.current || lock.current || !canEdit || historical || readFailed) return;
        setFields(update);
        if (creating) setConflict(false);
    }
    return { editorSession, restoreRecovery, recovered: recoveryBase !== undefined, recoveryBaseVersionId: recoveryBase !== undefined ? recoveryBase : selected?.work_product.current_version_id ?? null, items, listState, moreItems, selected, versions, moreVersions, fields, setFields: editFields, creating, busy, conflict, readFailed, dirty, historical, loadList, open, create, loadMoreVersions, save, exportSelected };
}

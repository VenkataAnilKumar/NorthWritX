"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCardUI, PillButtonUI } from "@northwrit/ui";
import { Download, Plus, Save } from "lucide-react";
import type { Document, Project } from "@/app/components/shared/types";
import { SkeletonLine } from "@/app/components/shared/TablePrimitive";
import { FormTextInput, FieldLabel, FORM_CONTROL_GLASS_CLASS } from "@/app/components/ui/form-field";
import { ModalTextarea } from "@/app/components/modals/ModalTextarea";
import { ConfirmPopup } from "@/app/components/popups/ConfirmPopup";
import { ProjectSectionToolbar, useProjectWorkspace } from "./ProjectWorkspace";
import { useAuth } from "@/app/contexts/AuthContext";
import { useMatterDraftRecovery } from "./useMatterDraftRecovery";
import { useMatterDrafts } from "./useMatterDrafts";
import { useProjectDocumentState } from "./useProjectDocumentState";
import { notifyError } from "@/app/lib/userFacingError";

const dateLabel = (value: string) => new Date(value).toLocaleString();
const readySource = (doc: Document) => Boolean(doc.current_version_id && /^[a-f0-9]{64}$/.test(doc.content_sha256 ?? ""));
const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function ProjectDrafts() {
    const { user } = useAuth();
    const { projectId, project, projectLoading, canDo } = useProjectWorkspace();
    if (projectLoading || !project || project.id !== projectId || !user) return <>
        <ProjectSectionToolbar />
        <section aria-label="Matter drafts" aria-busy={projectLoading} className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
            {projectLoading ? <div role="status" className="mx-auto max-w-6xl space-y-5"><span className="sr-only">Loading matter drafts</span><SkeletonLine className="h-7 w-36" /><SkeletonLine className="h-48 w-full" /></div>
                : <p role="status" className="text-muted-foreground">Matter unavailable. Return to Matters to choose an accessible matter.</p>}
        </section>
    </>;
    // A different matter or access role must never inherit this editor's async callbacks or text.
    return <MatterDraftWorkspace key={`${user.id}:${projectId}:${project.access_role}`} userId={user.id} project={project} canEdit={canDo("content.edit")} />;
}

function MatterDraftWorkspace({ project, canEdit, userId }: { project: Project; canEdit: boolean; userId: string }) {
    const state = useMatterDrafts(project.id, canEdit);
    const recovery = useMatterDraftRecovery(project.id,userId,canEdit,state);
    const busy = state.busy || recovery.busy;
    const [discarding,setDiscarding] = useState(false);
    const router = useRouter();
    const { setProject, setFolders, registerNavigationGuard } = useProjectWorkspace();
    const { refreshCollection } = useProjectDocumentState(project.id, setProject, setFolders);
    const [refreshingSources, setRefreshingSources] = useState(false);
    async function refreshSources() {
        setRefreshingSources(true);
        try { await refreshCollection(); }
        catch (error) { notifyError(error, { action: "refresh matter sources", operation: "work_products.read" }); }
        finally { setRefreshingSources(false); }
    }
    const [pending, setPending] = useState<(() => void) | null>(null);
    const request = useCallback((action: () => void) => {
        if (busy) return;
        if (state.dirty) setPending(() => action);
        else action();
    }, [busy, state.dirty]);
    const navigate = useCallback((href: string) => request(() => router.push(href)), [request, router]);
    useLayoutEffect(() => registerNavigationGuard(navigate), [navigate, registerNavigationGuard]);
    useEffect(() => {
        if (!state.dirty && !busy) return;
        const beforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
        const linkClick = (event: MouseEvent) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const link = (event.target as Element)?.closest?.("a[href]") as HTMLAnchorElement | null;
            if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
            const url = new URL(link.href);
            if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return;
            event.preventDefault(); event.stopImmediatePropagation();
            navigate(`${url.pathname}${url.search}${url.hash}`);
        };
        window.addEventListener("beforeunload", beforeUnload);
        document.addEventListener("click", linkClick, true);
        return () => { window.removeEventListener("beforeunload", beforeUnload); document.removeEventListener("click", linkClick, true); };
    }, [state.dirty, busy, navigate]);
    const editable = canEdit && !state.historical && !busy && !state.readFailed;
    const sourceNames = new Map((project.documents ?? []).map(doc => [doc.id, doc.filename]));
    const selected = state.selected;
    const update = (name: "title" | "body" | "scope" | "assumptions", value: string) => state.setFields(old => ({ ...old, [name]: value }));
    return <>
        <ProjectSectionToolbar />
        <section aria-label="Matter drafts" aria-busy={busy} className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
            <div className="mx-auto max-w-6xl space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h2 className="text-lg font-medium text-foreground">Drafts</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Matter work products with saved revisions and source references.</p>
                        {!canEdit && <p className="mt-1 text-sm text-muted-foreground">Read-only access. You can read and export saved revisions.</p>}
                    </div>
                    {canEdit && <PillButtonUI tone="black" disabled={busy} onClick={() => request(state.create)}><Plus aria-hidden="true" className="h-4 w-4" />New draft</PillButtonUI>}
                </div>
                {canEdit && <GlassCardUI><section aria-label="Private recovery copies" className="space-y-3 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-sm font-medium">Private recovery copies</h3><PillButtonUI tone="white" size="sm" disabled={recovery.loading || busy} onClick={()=>void recovery.refresh()}>Refresh recovery copies</PillButtonUI></div>
                    <p className="text-sm text-muted-foreground">Only you can recover these edits. Copies expire after 24 hours. Explicit Save creates a revision.</p>
                    {recovery.loading && <p role="status" className="text-sm text-muted-foreground">Loading recovery copies…</p>}
                    {recovery.failed && <p role="status" className="text-sm text-muted-foreground">Recovery list unavailable. Your current text is preserved.</p>}
                    <ul className="space-y-3">{recovery.items.map(copy=><li key={copy.id} className="flex min-w-0 flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0 text-sm"><p className="break-words font-medium [overflow-wrap:anywhere]">{copy.title || "Untitled draft"}</p><p className="text-muted-foreground">{dateLabel(copy.updated_at)}</p></div>
                        <div className="flex flex-wrap gap-2"><PillButtonUI tone="white" size="sm" disabled={busy} onClick={()=>request(()=>void recovery.recover(copy.id))}>Recover edits</PillButtonUI><PillButtonUI tone="white" size="sm" disabled={busy} onClick={()=>void recovery.discard(copy.id)}>Discard copy</PillButtonUI></div>
                    </li>)}</ul>
                </section></GlassCardUI>}
                <div className="grid min-w-0 gap-5 lg:grid-cols-[16rem_minmax(0,1fr)]">
                    <aside aria-label="Saved drafts" className="min-w-0 space-y-3">
                        <h3 className="text-sm font-medium text-foreground">Saved drafts</h3>
                        {state.listState === "loading" ? <div role="status" className="space-y-3"><span className="sr-only">Loading saved drafts</span><SkeletonLine className="h-10 w-full" /><SkeletonLine className="h-10 w-full" /></div>
                            : state.listState === "failed" ? <div><p role="status" className="text-sm text-muted-foreground">Draft list unavailable.</p><PillButtonUI tone="white" disabled={busy} onClick={() => void state.loadList()}>Retry draft list</PillButtonUI></div>
                                : !state.items.length ? <p className="text-sm text-muted-foreground">No saved drafts yet.</p> : null}
                        <ul className="space-y-2">
                            {state.items.map(item => <li key={item.id}><button type="button" disabled={busy} aria-pressed={selected?.work_product.id === item.id}
                                className={`w-full rounded-xl p-3 text-left text-sm text-foreground ${focus} disabled:opacity-60 ${selected?.work_product.id === item.id ? "bg-app-surface-active" : "bg-app-surface hover:bg-app-surface-hover"}`}
                                onClick={() => request(() => void state.open(item.id))}>
                                <span className="block break-words font-medium [overflow-wrap:anywhere]">{item.title}</span>
                                <span className="mt-1 block text-xs text-muted-foreground">{dateLabel(item.updated_at)}</span>
                            </button></li>)}
                        </ul>
                        {state.moreItems && <PillButtonUI tone="white" disabled={busy} onClick={() => void state.loadList(true)}>More drafts</PillButtonUI>}
                    </aside>
                    <div className="min-w-0 space-y-5">
                        {busy && <p role="status" className="text-sm text-muted-foreground">Working on draft…</p>}
                        {state.readFailed && <p role="status" className="text-sm text-muted-foreground">Revision unavailable. Your previous text is preserved. Select a draft to retry before editing or exporting.</p>}
                        {!selected && !state.creating ? <GlassCardUI><div className="space-y-2 p-5"><h3 className="text-base font-medium text-foreground">Choose a draft</h3><p className="text-sm text-muted-foreground">Open a saved draft to read its history, or create a new work product.</p></div></GlassCardUI> : <>
                            <GlassCardUI><form className="min-w-0 space-y-5 rounded-2xl bg-app-surface p-5" onSubmit={event => { event.preventDefault(); void state.save(); }}>
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="min-w-0 space-y-1 text-sm">
                                        <h3 className="font-medium text-foreground">{state.recovered ? "Recovered edits" : state.creating ? "New draft" : `Revision ${selected?.version.revision}${state.historical ? " · Historical" : " · Current when loaded"}`}</h3>
                                        <p className="font-medium text-foreground">DRAFT — NOT APPROVED</p>
                                        {selected && <p className="break-words text-muted-foreground [overflow-wrap:anywhere]">{selected.version.author_label} · {dateLabel(selected.version.created_at)}</p>}
                                        <p role="status" className="text-muted-foreground">{state.dirty ? "Unsaved changes" : state.creating ? "Not saved" : "Saved revision"}</p>
                                    </div>
                                    {canEdit && state.dirty && <p role="status" className="text-sm text-muted-foreground">{recovery.status==="saved"?"Recovery saved":recovery.status==="failed"?"Recovery unavailable — save a revision or copy your text": "Saving recovery…"}</p>}
                                    <div className="flex flex-wrap gap-2">
                                        {selected && <PillButtonUI tone="white" disabled={busy || state.readFailed || selected.evidence_status !== "current"} onClick={() => void state.exportSelected()}><Download aria-hidden="true" className="h-4 w-4" />Export revision {selected.version.revision} DOCX</PillButtonUI>}
                                        {canEdit && !state.historical && <PillButtonUI tone="black" type="submit" disabled={!editable || state.conflict || !state.fields.title.trim() || !state.fields.body.trim() || (!state.dirty && !state.creating)}><Save aria-hidden="true" className="h-4 w-4" />Save revision</PillButtonUI>}
                                    </div>
                                </div>
                                {state.conflict && <div className="space-y-2 text-sm"><p role="status">Save conflict: the draft or its sources changed. Your text is preserved. Copy any edits you need, then reload the current revision and review its source references.</p>{selected && <PillButtonUI tone="white" disabled={busy} onClick={() => request(() => void state.open(selected.work_product.id))}>Reload current revision</PillButtonUI>}{!selected && <p>For a new draft, review and change its source references, then retry saving.</p>}</div>}
                                {selected?.evidence_status === "changed_or_unavailable" && <p role="status" className="text-sm text-muted-foreground">Sources changed or are unavailable. Export is blocked. Review the references in a new revision; historical text does not establish current claim support.</p>}
                                <div><FieldLabel htmlFor="draft-title">Draft title</FieldLabel><FormTextInput id="draft-title" required maxLength={200} value={state.fields.title} readOnly={!editable} onChange={event => update("title", event.target.value)} /></div>
                                <div><FieldLabel htmlFor="draft-body">Draft text</FieldLabel><ModalTextarea id="draft-body" className="min-h-72 resize-y bg-app-surface font-serif text-base shadow-none backdrop-blur-none" required maxLength={100000} value={state.fields.body} readOnly={!editable} onChange={event => update("body", event.target.value)} /><p className="mt-1 text-xs text-muted-foreground">Plain text. Up to 100,000 characters. Save creates an immutable revision. Wait for Recovery saved before leaving. The latest uncheckpointed keystrokes may be lost if the connection or page closes.</p></div>
                                <div className="grid gap-5 xl:grid-cols-2">
                                    <div><FieldLabel htmlFor="draft-scope">Scope</FieldLabel><ModalTextarea id="draft-scope" maxLength={10000} value={state.fields.scope} readOnly={!editable} onChange={event => update("scope", event.target.value)} /></div>
                                    <div><FieldLabel htmlFor="draft-assumptions">Assumptions</FieldLabel><ModalTextarea id="draft-assumptions" maxLength={10000} value={state.fields.assumptions} readOnly={!editable} onChange={event => update("assumptions", event.target.value)} /></div>
                                </div>
                                <fieldset className="min-w-0 space-y-3"><legend className="mb-2 text-sm font-medium text-foreground">Source references ({state.fields.sources.length}/50)</legend>
                                    <p className="text-sm text-muted-foreground">References bind to exact versions and hashes. Locators are your notes, not verified citations.</p>
                                    {editable && <PillButtonUI tone="white" size="sm" disabled={refreshingSources} onClick={() => void refreshSources()}>{refreshingSources ? "Refreshing sources…" : "Refresh source list"}</PillButtonUI>}
                                    {editable && <div><FieldLabel htmlFor="draft-source">Add matter document</FieldLabel><select id="draft-source" className={`${FORM_CONTROL_GLASS_CLASS} h-10 min-w-0`} value="" disabled={state.fields.sources.length >= 50} onChange={event => {
                                        const doc = project.documents?.find(item => item.id === event.target.value);
                                        if (doc && readySource(doc)) state.setFields(old => ({ ...old, sources: [...old.sources, { document_id: doc.id, version_id: doc.current_version_id!, content_sha256: doc.content_sha256! }] }));
                                    }}><option value="">Choose a source document</option>{(project.documents ?? []).map(doc => <option key={doc.id} value={doc.id} disabled={!readySource(doc) || state.fields.sources.some(ref => ref.document_id === doc.id && ref.version_id === doc.current_version_id)}>{doc.filename}{!readySource(doc) ? " — version identity unavailable" : ` · v${doc.active_version_number ?? "?"}`}</option>)}</select></div>}
                                    {!state.fields.sources.length && <p className="text-sm text-muted-foreground">No source references. This draft makes no claim of source support.</p>}
                                    <ul className="space-y-4">{state.fields.sources.map((source, index) => {
                                        const snapshot = selected?.version.sources.find(ref => ref.document_id === source.document_id && ref.version_id === source.version_id && ref.content_sha256 === source.content_sha256);
                                        return <li key={`${source.document_id}:${source.version_id}:${source.content_sha256}`} className="min-w-0 space-y-2 text-sm">
                                            <div className="flex flex-wrap items-center justify-between gap-2"><p className="min-w-0 break-words font-medium text-foreground [overflow-wrap:anywhere]">{snapshot?.filename ?? sourceNames.get(source.document_id) ?? "Referenced document"}</p>{editable && <PillButtonUI tone="white" size="sm" onClick={() => state.setFields(old => ({ ...old, sources: old.sources.filter((_, i) => i !== index) }))} aria-label={`Remove source ${index + 1}`}>Remove</PillButtonUI>}</div>
                                            <p className="break-words text-xs text-muted-foreground [overflow-wrap:anywhere]">Version ID: {source.version_id}<br />SHA-256: {source.content_sha256}</p>
                                            <FieldLabel htmlFor={`draft-locator-${index}`}>Source {index + 1} locator</FieldLabel><FormTextInput id={`draft-locator-${index}`} maxLength={200} placeholder="For example, section 4.2 or page 3" value={source.locator ?? ""} readOnly={!editable} onChange={event => state.setFields(old => ({ ...old, sources: old.sources.map((ref, i) => i === index ? { ...ref, locator: event.target.value } : ref) }))} />
                                        </li>;
                                    })}</ul>
                                </fieldset>
                                {selected && <p className="text-xs text-muted-foreground">Export includes revision {selected.version.revision} as saved, with its scope, assumptions and references. Unsaved edits are excluded. Exports remain drafts and require professional review.</p>}
                            </form></GlassCardUI>
                            {selected && <GlassCardUI><section aria-label="Revision history" className="min-w-0 space-y-3 p-5">
                                <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-base font-medium text-foreground">Revision history</h3><PillButtonUI tone="white" disabled={busy} onClick={() => request(() => void state.open(selected.work_product.id))}>Reload current revision</PillButtonUI></div>
                                <p className="text-sm text-muted-foreground">Historical revisions are read-only. Restoring creates a new revision and rechecks its sources.</p>
                                <ul className="space-y-2">{state.versions.map(version => <li key={version.id}><button type="button" disabled={busy} aria-pressed={selected.version.id === version.id} className={`w-full rounded-xl p-3 text-left text-sm ${focus} disabled:opacity-60 ${selected.version.id === version.id ? "bg-app-surface-active" : "hover:bg-app-surface-hover"}`} onClick={() => request(() => void state.open(selected.work_product.id, version.id))}><span className="block break-words font-medium [overflow-wrap:anywhere]">Revision {version.revision} · {version.title}</span><span className="mt-1 block break-words text-muted-foreground [overflow-wrap:anywhere]">{version.author_label} · {dateLabel(version.created_at)}</span></button></li>)}</ul>
                                {state.moreVersions && <PillButtonUI tone="white" disabled={busy} onClick={() => void state.loadMoreVersions()}>More revisions</PillButtonUI>}
                                {canEdit && state.historical && <PillButtonUI tone="black" disabled={busy || state.conflict || state.readFailed || selected.evidence_status !== "current"} onClick={() => void state.save(true)}>Restore as new revision</PillButtonUI>}
                            </section></GlassCardUI>}
                        </>}
                    </div>
                </div>
            </div>
        </section>
        <ConfirmPopup open={Boolean(pending)} title="Discard unsaved draft changes?" message="Copy any text you need before continuing. Unsaved changes will be discarded." confirmLabel="Discard changes" confirmStatus={discarding?"loading":"idle"} cancelLabel="Keep editing" onCancel={() => {if(!discarding)setPending(null);}} onConfirm={() => { if(discarding)return;setDiscarding(true);void recovery.clearCurrent().then(cleared=>{if(cleared){const action=pending;setPending(null);action?.();}}).finally(()=>setDiscarding(false)); }} />
    </>;
}

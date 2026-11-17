"use client";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { WorkProductRecoveryInput, WorkProductRecoverySummary } from "@northwrit/contracts";
import { discardDraftRecovery, listDraftRecoveries, readDraftRecovery, saveDraftRecovery } from "@/app/lib/northwritApi";
import { notifyError } from "@/app/lib/userFacingError";
import type { useMatterDrafts } from "./useMatterDrafts";

type Editor = ReturnType<typeof useMatterDrafts>;
type Scope = { session: number; id: string | null; sequence: number; discarded: boolean; latest: WorkProductRecoveryInput | null; tail: Promise<unknown> };
type Status = "idle" | "pending" | "saved" | "failed";
export function useMatterDraftRecovery(projectId: string, userId: string, canEdit: boolean, editor: Editor) {
    const scope = useMemo<Scope>(() => ({ session:editor.editorSession, id:null, sequence:0, discarded:false, latest:null, tail:Promise.resolve() }), [editor.editorSession]);
    const active = useRef<Scope | null>(null);
    const alive = useRef(false);
    const readLock = useRef(false);
    const [busy,setBusy] = useState(false);
    const consumed = useRef(new Set<string>());
    const [items, setItems] = useState<WorkProductRecoverySummary[]>([]);
    const [checkpointGeneration,setCheckpointGeneration] = useState(0);
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);
    const [notice, setNotice] = useState<{ scope: Scope | null; status: Status }>({ scope:null,status:"idle" });
    const [copyIdentity, setCopyIdentity] = useState<{scope:Scope;id:string} | null>(null);
    const inputJson = JSON.stringify({ expected_user_id:userId,sequence:1,work_product_id:editor.selected?.work_product.id ?? null,
        base_version_id:editor.recoveryBaseVersionId,fields:editor.fields });
    const setStatus = useCallback((target: Scope, status: Status) => {
        if (active.current!==target || target.discarded) return;
        setNotice(old => active.current===target && !target.discarded ? {scope:target,status} : old);
    }, []);
    const refresh = useCallback(async () => {
        if (!alive.current || !canEdit) return;
        setLoading(true);
        try {
            const result=await listDraftRecoveries(projectId);
            if(alive.current) { setItems(result.items); setFailed(false); }
        } catch(error) {
            if(alive.current) {setFailed(true);notifyError(error,{action:"load private recovery copies",operation:"work_products.recovery"});}
        } finally {if(alive.current)setLoading(false);}
    },[projectId,canEdit]);
    const persist = useCallback((target: Scope, input: WorkProductRecoveryInput) => {
        if(target.discarded) return Promise.resolve();
        target.id ??= crypto.randomUUID(); const id=target.id; const sequence=++target.sequence;
        if(active.current===target)setCopyIdentity({scope:target,id});
        setStatus(target,"pending");
        const request=target.tail.catch(()=>undefined).then(async()=>{
            if(target.discarded)return;
            await saveDraftRecovery(projectId,id,{...input,sequence});
            if(sequence===target.sequence)setStatus(target,"saved");
        });
        target.tail=request.catch(()=>undefined);
        return request.catch(error=>{
            if(active.current===target && !target.discarded && sequence===target.sequence) {
                setStatus(target,"failed");notifyError(error,{action:"checkpoint draft recovery",operation:"work_products.recovery",dedupeKey:"draft-recovery-write"});
            }
        });
    },[projectId,setStatus]);
    const clearCurrent = useCallback(async (rearm = false) => {
        const target=scope; target.discarded=true;
        const ids=[...consumed.current,...(target.id?[target.id]:[])];
        try {
            await target.tail;
            await Promise.all(ids.map(id=>discardDraftRecovery(projectId,id,userId)));
            for(const id of ids)consumed.current.delete(id);
            if(rearm) {target.id=null;target.sequence=0;target.discarded=false;if(alive.current)setCheckpointGeneration(value=>value+1);}
            if(alive.current)setItems(old=>old.filter(item=>!ids.includes(item.id)));
            return alive.current && active.current===target;
        } catch(error) {
            target.discarded=false; setStatus(target,"failed");
            if(alive.current)notifyError(error,{action:"discard recovery copy",operation:"work_products.recovery"});
            return false;
        }
    },[scope,projectId,userId,setStatus]);
    useLayoutEffect(()=>{
        active.current=scope;
        return ()=>{ active.current=null; if(scope.latest && !scope.discarded)void persist(scope,scope.latest); };
    },[scope,persist]);
    useLayoutEffect(()=>{scope.latest=canEdit && editor.dirty && !editor.historical ? JSON.parse(inputJson) : null;},[scope,canEdit,editor.dirty,editor.historical,inputJson]);
    useEffect(()=>{
        alive.current=true; void refresh();
        return ()=>{alive.current=false;};
    },[refresh]);
    useEffect(()=>{
        if(!canEdit)return;
        if(!editor.dirty) {
            if(!scope.discarded && (scope.id || consumed.current.size))void clearCurrent(true);
            return;
        }
        if(editor.historical || scope.discarded)return;
        const timer=setTimeout(()=>{void persist(scope,JSON.parse(inputJson));},800);
        return ()=>clearTimeout(timer);
    },[canEdit,editor.dirty,editor.historical,inputJson,scope,persist,clearCurrent,checkpointGeneration]);
    async function recover(id: string) {
        if(readLock.current)return;
        readLock.current=true;setBusy(true);const target=scope;
        try {
            const copy=await readDraftRecovery(projectId,id);
            if(!alive.current || active.current!==target)return;
            if(await editor.restoreRecovery(copy)) { consumed.current.add(id); setItems(old=>old.filter(item=>item.id!==id)); }
        } catch(error) {if(alive.current)notifyError(error,{action:"read recovery copy",operation:"work_products.recovery"});}
        finally {readLock.current=false;if(alive.current)setBusy(false);}
    }
    async function discard(id: string) {
        try {await discardDraftRecovery(projectId,id,userId);if(alive.current)setItems(old=>old.filter(item=>item.id!==id));}
        catch(error) {if(alive.current)notifyError(error,{action:"discard recovery copy",operation:"work_products.recovery"});}
    }
    return { items:items.filter(item=>item.id!==(copyIdentity?.scope===scope?copyIdentity.id:null)), loading,failed,busy,refresh,recover,discard,clearCurrent,
        status:notice.scope===scope?notice.status:"idle" as Status };
}

"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, type Dispatch, type SetStateAction } from "react";
import type { Document, Folder, Project } from "@/app/components/shared/types";
import { getProject } from "@/app/lib/northwritApi";

/** Keep late upload/refresh callbacks bound to the matter view that started them. */
export function useProjectDocumentState(
    projectId: string,
    setProject: Dispatch<SetStateAction<Project | null>>,
    setFolders: Dispatch<SetStateAction<Folder[]>>,
) {
    // A -> B -> A is a new view of A, not permission to reuse the first A's work.
    const scope = useMemo(() => ({ projectId }), [projectId]);
    const activeScope = useRef<typeof scope | null>(null);
    const refreshSequence = useRef(0);
    useLayoutEffect(() => {
        activeScope.current = scope;
        return () => {
            activeScope.current = null;
            refreshSequence.current += 1;
        };
    }, [scope]);

    const setDocuments = useCallback((update: SetStateAction<Document[]>) => {
        if (activeScope.current !== scope) return;
        setProject(previous => {
            if (activeScope.current !== scope || previous?.id !== projectId) return previous;
            const documents = typeof update === "function" ? update(previous.documents ?? []) : update;
            return { ...previous, documents };
        });
    }, [projectId, scope, setProject]);

    const setScopedFolders = useCallback((update: SetStateAction<Folder[]>) => {
        if (activeScope.current !== scope) return;
        setFolders(previous => activeScope.current === scope
            ? typeof update === "function" ? update(previous) : update
            : previous);
    }, [scope, setFolders]);

    const refreshCollection = useCallback(async () => {
        if (activeScope.current !== scope) return;
        const request = ++refreshSequence.current;
        let updated: Project;
        try {
            updated = await getProject(projectId);
        } catch (error) {
            if (activeScope.current !== scope || request !== refreshSequence.current) return;
            throw error;
        }
        if (activeScope.current !== scope || request !== refreshSequence.current) return;
        if (updated.id !== projectId) throw new Error("Unexpected matter in document refresh response");
        setProject(previous => activeScope.current === scope && request === refreshSequence.current && previous?.id === projectId ? updated : previous);
        setFolders(previous => activeScope.current === scope && request === refreshSequence.current ? updated.folders ?? [] : previous);
    }, [projectId, scope, setFolders, setProject]);

    return { setDocuments, setFolders: setScopedFolders, refreshCollection };
}

"use client";

import { GlassCardUI, PillButtonUI } from "@northwrit/ui";
import { Pencil } from "lucide-react";
import { SkeletonLine } from "@/app/components/shared/TablePrimitive";
import { ProjectSectionToolbar, useProjectWorkspace } from "./ProjectWorkspace";

const labels = ["Client name", "Matter reference", "Practice", "Jurisdiction", "Matter status", "Workspace"];
const statusLabels = { open: "Open", on_hold: "On hold", closed: "Closed" };

export function ProjectOverview() {
    const { project, projectLoading, canDo, openProjectDetails } = useProjectWorkspace();
    const values = project ? [
        project.client_name,
        project.cm_number,
        project.practice,
        project.jurisdiction,
        project.matter_status ? statusLabels[project.matter_status] : null,
        project.org_id ? project.organization_name || "Organisation" : "Personal",
    ] : [];

    return (
        <>
            <ProjectSectionToolbar />
            <section aria-label="Matter overview" aria-busy={projectLoading}
                className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
                {!projectLoading && !project ? (
                    <p role="status" className="text-muted-foreground">Matter unavailable. Return to Matters to choose an accessible matter.</p>
                ) : (
                    <div className="mx-auto max-w-5xl space-y-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-medium text-foreground">Matter overview</h2>
                                <p className="mt-1 text-sm text-muted-foreground">Context for your documents, conversations and reviews.</p>
                            </div>
                            {project && canDo("access.manage") ? (
                                <PillButtonUI tone="white" onClick={openProjectDetails}>
                                    <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                                    Edit matter details
                                </PillButtonUI>
                            ) : null}
                        </div>
                        {projectLoading ? <p role="status" className="sr-only">Loading matter overview</p> : null}
                        <GlassCardUI>
                            <dl className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2 lg:grid-cols-3">
                                {labels.map((label, index) => (
                                    <div key={label} className="min-w-0">
                                        <dt className="text-sm text-muted-foreground">{label}</dt>
                                        <dd className="mt-2 break-words text-base text-foreground [overflow-wrap:anywhere]">
                                            {projectLoading ? <SkeletonLine className="my-1 w-32 max-w-full" /> : values[index]?.trim() || "Not specified"}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </GlassCardUI>
                        <p className="text-sm text-muted-foreground">Matter status tracks progress. It does not archive the matter or apply a legal hold.</p>
                    </div>
                )}
            </section>
        </>
    );
}

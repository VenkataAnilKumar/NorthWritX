"use client";

import type { MatterMetadataInput, MatterStatus } from "@northwrit/contracts";
import { useEffect, useMemo, useState } from "react";
import { Users } from "lucide-react";
import { Modal } from "@/app/components/modals/Modal";
import { ModalSelect } from "@/app/components/modals/ModalSelect";
import {
    FieldLabel,
    FormTextInput,
} from "@/app/components/ui/form-field";
import { AccessVisibilityField } from "@/app/components/modals/AccessVisibilityField";
import type {
    ContentVisibility,
    Project,
} from "@/app/components/shared/types";
import { listOrgs, type Org } from "@/app/lib/northwritApi";
import { userFacingApiError } from "@/app/lib/userFacingError";
import { ProjectPracticeField } from "./ProjectPracticeField";

const PERSONAL_WORKSPACE = "__personal__";

export type ProjectDetailsValues = MatterMetadataInput & {
    name: string;
    cmNumber: string;
    practice: string;
    visibility?: ContentVisibility;
};

interface ProjectDetailsModalProps {
    open: boolean;
    project: Project | null;
    canEdit: boolean;
    onClose: () => void;
    onSave: (values: ProjectDetailsValues) => Promise<void>;
    onShareProject?: () => void;
}

export function ProjectDetailsModal({
    open,
    project,
    canEdit,
    onClose,
    onSave,
    onShareProject,
}: ProjectDetailsModalProps) {
    const [nameDraft, setNameDraft] = useState("");
    const [cmDraft, setCmDraft] = useState("");
    const [practiceDraft, setPracticeDraft] = useState("");
    const [clientDraft, setClientDraft] = useState("");
    const [jurisdictionDraft, setJurisdictionDraft] = useState("");
    const [statusDraft, setStatusDraft] = useState<MatterStatus | "">("");
    const [visibilityDraft, setVisibilityDraft] =
        useState<ContentVisibility>("private");
    const [orgs, setOrgs] = useState<Org[]>([]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const projectId = project?.id ?? null;
    const projectName = project?.name ?? "";
    const projectCmNumber = project?.cm_number ?? "";
    const projectPractice = project?.practice ?? "";
    const projectClient = project?.client_name ?? "";
    const projectJurisdiction = project?.jurisdiction ?? "";
    const projectStatus = project?.matter_status ?? "";
    const projectVisibility: ContentVisibility =
        project?.visibility ?? "private";

    useEffect(() => {
        if (!open || !projectId) return;
        setNameDraft(projectName);
        setCmDraft(projectCmNumber);
        setPracticeDraft(projectPractice);
        setClientDraft(projectClient);
        setJurisdictionDraft(projectJurisdiction);
        setStatusDraft(projectStatus);
        setVisibilityDraft(projectVisibility);
        setError(null);
    }, [
        open,
        projectId,
        projectName,
        projectCmNumber,
        projectPractice,
        projectClient,
        projectJurisdiction,
        projectStatus,
        projectVisibility,
    ]);

    useEffect(() => {
        setSaved(false);
    }, [open, projectId]);

    useEffect(() => {
        if (!open) return;
        let cancelled = false;
        listOrgs()
            .then((rows) => {
                if (!cancelled) setOrgs(rows);
            })
            .catch(() => {
                if (!cancelled) setOrgs([]);
            });
        return () => {
            cancelled = true;
        };
    }, [open]);

    const trimmedName = nameDraft.trim();
    const trimmedCm = cmDraft.trim();
    const trimmedPractice = practiceDraft.trim();
    const metadataError = Array.from(clientDraft.trim()).length > 200
        ? "Client name must be at most 200 characters."
        : Array.from(jurisdictionDraft.trim()).length > 100
          ? "Jurisdiction must be at most 100 characters." : null;
    const hasChanges = useMemo(() => {
        if (!project) return false;
        return (
            trimmedName !== project.name ||
            trimmedCm !== (project.cm_number ?? "") ||
            trimmedPractice !== (project.practice ?? "") ||
            clientDraft.trim() !== (project.client_name ?? "") ||
            jurisdictionDraft.trim() !== (project.jurisdiction ?? "") ||
            statusDraft !== (project.matter_status ?? "") ||
            (!!project.org_id &&
                visibilityDraft !== (project.visibility ?? "private"))
        );
    }, [project, trimmedCm, trimmedName, trimmedPractice, visibilityDraft, clientDraft, jurisdictionDraft, statusDraft]);

    // The select falls back to rendering its raw value when no option matches,
    // so a failed (or still pending) listOrgs used to show the organization's
    // UUID. The row already carries the name — use it.
    const orgOptions = useMemo(() => {
        const options = [
            { value: PERSONAL_WORKSPACE, label: "No organization" },
            ...orgs.map((org) => ({ value: org.id, label: org.name })),
        ];
        if (
            project?.org_id &&
            !options.some((option) => option.value === project.org_id)
        ) {
            options.push({
                value: project.org_id,
                label: project.organization_name ?? "Organisation",
            });
        }
        return options;
    }, [orgs, project?.org_id, project?.organization_name]);

    if (!project) return null;

    async function handleSave() {
        if (!canEdit || saving || !hasChanges || !trimmedName || metadataError) return;
        setSaving(true);
        setSaved(false);
        setError(null);
        try {
            await onSave({
                ...(clientDraft.trim() !== projectClient ? { client_name: clientDraft.trim() || null } : {}),
                ...(jurisdictionDraft.trim() !== projectJurisdiction ? { jurisdiction: jurisdictionDraft.trim() || null } : {}),
                ...(statusDraft !== projectStatus ? { matter_status: statusDraft || null } : {}),
                name: trimmedName,
                cmNumber: trimmedCm,
                practice:
                    trimmedPractice && trimmedPractice !== "Other"
                        ? trimmedPractice
                        : "",
                ...(project?.org_id &&
                visibilityDraft !== (project.visibility ?? "private")
                    ? { visibility: visibilityDraft }
                    : {}),
            });
            setSaved(true);
        } catch (err: unknown) {
            // An intentional 4xx (a name conflict, a refusal) says something
            // the generic line cannot; anything else still falls back to it.
            setError(
                userFacingApiError(err, "Could not update matter details."),
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            breadcrumbs={["Matters", project.name, "Details"]}
            secondaryAction={
                onShareProject
                    ? {
                          label: "Share",
                          icon: <Users className="h-4 w-4" />,
                          onClick: onShareProject,
                      }
                    : undefined
            }
            footerStatus={
                error || metadataError ? (
                    <span role="alert" className="text-sm text-red-600">{error || metadataError}</span>
                ) : saved ? (
                    <span role="status" className="text-sm text-gray-400">Updated</span>
                ) : null
            }
            primaryAction={
                canEdit
                    ? {
                          label: saving ? "Updating..." : "Update",
                          onClick: () => void handleSave(),
                          disabled: saving || !hasChanges || !trimmedName || !!metadataError,
                      }
                    : undefined
            }
            cancelAction={canEdit ? undefined : false}
        >
            <div className="flex min-h-0 flex-1 flex-col gap-6 py-1">
                <div>
                    <FieldLabel htmlFor="project-details-name">
                        Matter name
                    </FieldLabel>
                    <FormTextInput
                        id="project-details-name"
                        value={nameDraft}
                        onChange={(e) => {
                            setNameDraft(e.target.value);
                            setSaved(false);
                            setError(null);
                        }}
                        disabled={!canEdit || saving}
                        placeholder="Add matter name"
                        variant="minimal"
                    />
                </div>

                <div>
                    <FieldLabel htmlFor="project-details-cm">
                        Matter reference
                    </FieldLabel>
                    <FormTextInput
                        id="project-details-cm"
                        value={cmDraft}
                        onChange={(e) => {
                            setCmDraft(e.target.value);
                            setSaved(false);
                            setError(null);
                        }}
                        disabled={!canEdit || saving}
                        placeholder="Add a matter reference"
                        variant="minimal"
                        className="text-xl text-gray-600"
                    />
                </div>

                <div>
                    <FieldLabel htmlFor="project-details-practice">
                        Practice
                    </FieldLabel>
                    <ProjectPracticeField
                        id="project-details-practice"
                        value={practiceDraft}
                        onChange={(value) => {
                            setPracticeDraft(value);
                            setSaved(false);
                            setError(null);
                        }}
                        disabled={!canEdit || saving}
                    />
                </div>

                <div>
                    <FieldLabel htmlFor="project-details-client">Client name</FieldLabel>
                    <FormTextInput id="project-details-client" value={clientDraft}
                        onChange={(e) => { setClientDraft(e.target.value); setSaved(false); setError(null); }}
                        disabled={!canEdit || saving} placeholder="Not specified" variant="minimal"
                        aria-invalid={Array.from(clientDraft.trim()).length > 200} />
                </div>
                <div>
                    <FieldLabel htmlFor="project-details-jurisdiction">Jurisdiction</FieldLabel>
                    <FormTextInput id="project-details-jurisdiction" value={jurisdictionDraft}
                        onChange={(e) => { setJurisdictionDraft(e.target.value); setSaved(false); setError(null); }}
                        disabled={!canEdit || saving} placeholder="Not specified" variant="minimal"
                        aria-invalid={Array.from(jurisdictionDraft.trim()).length > 100} />
                </div>
                <div>
                    <FieldLabel htmlFor="project-details-status">Matter status</FieldLabel>
                    <ModalSelect id="project-details-status" value={statusDraft}
                        onChange={(value) => { setStatusDraft(value as MatterStatus | ""); setSaved(false); setError(null); }}
                        disabled={!canEdit || saving}
                        options={[
                            { value: "", label: "Not specified" },
                            { value: "open", label: "Open" },
                            { value: "on_hold", label: "On hold" },
                            { value: "closed", label: "Closed" },
                        ]} />
                    <p className="mt-2 text-sm text-muted-foreground">Status tracks progress. It does not archive the matter or apply a legal hold.</p>
                </div>

                <div>
                    <FieldLabel htmlFor="project-details-org">
                        Organisation
                    </FieldLabel>
                    <ModalSelect
                        id="project-details-org"
                        value={project.org_id ?? PERSONAL_WORKSPACE}
                        onChange={() => undefined}
                        disabled
                        options={orgOptions}
                    />
                </div>

                {project.org_id ? (
                    <AccessVisibilityField
                        visibility={visibilityDraft}
                        onChange={(next) => {
                            setVisibilityDraft(next);
                            setSaved(false);
                            setError(null);
                        }}
                        organizationName={project.organization_name}
                        resourceNoun="project"
                        disabled={!canEdit || saving}
                    />
                ) : null}
            </div>
        </Modal>
    );
}

import { z } from "zod";
import type { WorkProduct, WorkProductDraftInput, WorkProductSourceRef, WorkProductVersion, WorkProductSaveResponse, WorkProductReadResponse, WorkProductVersionPage } from "@northwrit/contracts";
import type { Db } from "../../lib/supabase";
import { checkProjectAccess } from "../../lib/access";
import { can } from "../../lib/permissions";
import { failure, internalFailure, ok, type ServiceResult } from "../../lib/serviceResult";
import { resolveWorkProductSources } from "../documents/documents.service";
import { renderDraftDocx } from "./workProducts.docx";

type Actor = { projectId: string; userId: string; userEmail?: string };
const uuid = z.string().uuid();
const invalidXml = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\uD800-\uDFFF\uFFFE\uFFFF]/u;
const validText = (value: string, max: number) => Array.from(value).length <= max && !invalidXml.test(value);
const boundedText = (max: number) => z.string().refine(value => validText(value, max));
const input = z.object({
    request_id: uuid, expected_version_id: uuid.nullable(),
    title: z.string().trim().min(1).refine(value => validText(value, 200)),
    body: boundedText(100000).refine(value => value.trim().length > 0),
    scope: boundedText(10000), assumptions: boundedText(10000),
    sources: z.array(z.object({ document_id: uuid, version_id: uuid,
        content_sha256: z.string().regex(/^[a-f0-9]{64}$/), locator: boundedText(200).optional(),
    }).strict()).max(50),
}).strict();

export async function listWorkProducts(db: Db, actor: Actor, limit: number, offset: number): Promise<ServiceResult<WorkProduct[]>> {
    if (!Number.isInteger(limit) || limit < 1 || limit > 50 || !Number.isInteger(offset) || offset < 0 || offset > 10000)
        return failure("validation", "Use a limit of 1–50 and an offset of 0–10000.");
    const access = await checkProjectAccess(actor.projectId, actor.userId, actor.userEmail, db);
    if (!access.ok) return failure("not_found", "Matter not found.");
    const { data, error } = await db.from("work_products").select("*").eq("project_id", actor.projectId)
        .order("updated_at", { ascending: false }).order("id").range(offset, offset + limit - 1);
    return error ? internalFailure(error) : ok(data as WorkProduct[]);
}

export async function saveWorkProduct(db: Db, actor: Actor, workProductId: string | null, payload: unknown): Promise<ServiceResult<WorkProductSaveResponse>> {
    const parsed = input.safeParse(payload);
    if (!parsed.success || (workProductId === null && parsed.data.expected_version_id !== null) || (workProductId !== null && !parsed.data.expected_version_id))
        return failure("validation", "Provide a valid draft and the expected current version (null for a new work product).");
    const access = await checkProjectAccess(actor.projectId, actor.userId, actor.userEmail, db);
    if (!access.ok) return failure("not_found", "Matter not found.");
    if (!can(access.projectRole, "content.edit")) return failure("forbidden", "Editing matter content requires editor access.");
    const { data, error } = await db.rpc("save_work_product_version", {
        p_project_id: actor.projectId, p_work_product_id: workProductId,
        p_actor_id: actor.userId, p_actor_email: actor.userEmail ?? null, p_payload: parsed.data as WorkProductDraftInput,
    });
    if (error?.code === "P0002") return failure("not_found", "Matter or work product not found.");
    if (error?.code === "42501") return failure("forbidden", "Editing matter content requires editor access.");
    if (error?.code === "P0001") return failure("conflict", "The draft, request identity or source references changed. Reload and review before saving.");
    return error ? internalFailure(error) : ok(data as { work_product: WorkProduct; version: WorkProductVersion; idempotent: boolean });
}

async function productAccess(db: Db, actor: Actor, id: string) {
    const access = await checkProjectAccess(actor.projectId, actor.userId, actor.userEmail, db);
    if (!access.ok) return failure("not_found", "Matter not found.");
    const { data, error } = await db.from("work_products").select("*,projects(name)").eq("id", id).eq("project_id", actor.projectId).maybeSingle();
    if (error) return internalFailure(error);
    if (!data) return failure("not_found", "Work product not found.");
    const { projects, ...product } = data as WorkProduct & { projects?: { name: string } | null };
    return ok({ product, matterName: projects?.name ?? "Matter" });
}

export async function readWorkProductVersion(db: Db, actor: Actor, id: string, versionId: string | null): Promise<ServiceResult<WorkProductReadResponse>> {
    const access = await productAccess(db, actor, id);
    if (!access.ok) return access;
    const { data, error } = await db.from("work_product_versions").select("*")
        .eq("work_product_id", id).eq("id", versionId ?? access.data.product.current_version_id).maybeSingle();
    if (error) return internalFailure(error);
    if (!data) return failure("not_found", "Draft version not found.");
    const version = data as WorkProductVersion;
    const sources = await resolveWorkProductSources(db, { ...actor, sources: version.sources });
    if (!sources.ok && sources.kind !== "conflict") return sources;
    return ok({ work_product: access.data.product, version, evidence_status: sources.ok ? "current" as const : "changed_or_unavailable" as const });
}

export async function listWorkProductVersions(db: Db, actor: Actor, id: string, limit: number, offset: number): Promise<ServiceResult<WorkProductVersionPage>> {
    if (!Number.isInteger(limit) || limit < 1 || limit > 50 || !Number.isInteger(offset) || offset < 0 || offset > 10000)
        return failure("validation", "Use a limit of 1–50 and an offset of 0–10000.");
    const access = await productAccess(db, actor, id);
    if (!access.ok) return access;
    const { data, error } = await db.from("work_product_versions").select("id,work_product_id,revision,title,created_by,author_label,created_at")
        .eq("work_product_id", id).order("revision", { ascending: false }).range(offset, offset + limit - 1);
    return error ? internalFailure(error) : ok({ current_version_id: access.data.product.current_version_id, versions: data });
}

export async function exportWorkProductVersion(db: Db, actor: Actor, id: string, versionId: string) {
    const draft = await readWorkProductVersion(db, actor, id, versionId);
    if (!draft.ok) return draft;
    if (draft.data.evidence_status !== "current") return failure("conflict", "Source references changed or are unavailable. Review the draft sources before export.");
    const access = await productAccess(db, actor, id);
    if (!access.ok) return access;
    // Sources were checked before rendering. The second check below is finalization.
    const bytes = await renderDraftDocx({ id: actor.projectId, name: access.data.matterName }, draft.data.version);
    const sources: WorkProductSourceRef[] = draft.data.version.sources;
    const final = await resolveWorkProductSources(db, { ...actor, sources });
    if (!final.ok) return final;
    const title = draft.data.version.title.replace(/[\\/\x00-\x1f\x7f]/g, "_");
    return ok({ bytes, filename: `${title} - draft r${draft.data.version.revision}.docx` });
}

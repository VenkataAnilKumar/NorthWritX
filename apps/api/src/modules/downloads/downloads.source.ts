import type { Db } from "../../lib/supabase";
import { verifySourceDownload } from "../../lib/downloadTokens";
import { ensureDocAccess } from "../../lib/access";
import { headFile } from "../../lib/storage";
import { failure, internalFailure, ok, type ServiceResult } from "../../lib/serviceResult";
import { contentTypeForDocumentType, documentSuffix } from "../../lib/documentTypes";

const unavailable = () => failure("not_found", "Source unavailable or link expired.");

/** No cached account/email, permission or storage URL may authorize redemption. */
async function admission(db: Db, token: string) {
    const claims = verifySourceDownload(token);
    if (!claims) return unavailable();
    const { data: account, error: accountError } = await db.auth.admin.getUserById(claims.a);
    if (accountError) return accountError.status === 404 ? unavailable() : internalFailure(accountError);
    const user = account.user;
    if (!user || user.id !== claims.a) return unavailable();
    const state = user as typeof user & { banned_until?: string | null; deleted_at?: string | null };
    if (state.deleted_at || (state.banned_until && (!Number.isFinite(Date.parse(state.banned_until)) || Date.parse(state.banned_until) > Date.now()))) return unavailable();
    const { data: version, error: versionError } = await db.from("document_versions")
        .select("id,document_id,storage_path,content_sha256,deleted_at")
        .eq("id", claims.v).eq("document_id", claims.d).is("deleted_at", null).maybeSingle();
    if (versionError) return internalFailure(versionError);
    if (!version || version.storage_path !== claims.p || (version.content_sha256 ?? null) !== claims.h) return unavailable();
    const { data: document, error: documentError } = await db.from("documents")
        .select("id,user_id,project_id,org_id,workflow_id,archived_at")
        .eq("id", claims.d).maybeSingle();
    if (documentError) return internalFailure(documentError);
    if (!document || document.archived_at) return unavailable();
    const access = await ensureDocAccess(document, user.id, user.email, db);
    return access.ok ? ok(claims) : unavailable();
}

/** Admit a source stream, rechecking after potentially slow object-storage I/O. */
export async function resolveSourceDownload(db: Db, token: string): Promise<ServiceResult<{
    storagePath: string; filename: string; size: number; contentType: string;
}>> {
    const initial = await admission(db, token);
    if (!initial.ok) return initial;
    const metadata = await headFile(initial.data.p);
    if (!metadata) return unavailable();
    const final = await admission(db, token);
    if (!final.ok) return final;
    return ok({ storagePath: final.data.p, filename: final.data.f, size: metadata.size,
        contentType: contentTypeForDocumentType(documentSuffix(final.data.f)) });
}

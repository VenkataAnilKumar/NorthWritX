import type { WorkProductSource, WorkProductSourceRef } from "@northwrit/contracts";
import type { Db } from "../../lib/supabase";
import { failure, internalFailure, ok, type ServiceResult } from "../../lib/serviceResult";

/** Snapshot exact authorized source versions within one matter, including legacy history. */
export async function resolveWorkProductSources(db: Db, args: {
    projectId: string; userId: string; userEmail?: string; sources: WorkProductSourceRef[];
}): Promise<ServiceResult<WorkProductSource[]>> {
    const { data, error } = await db.rpc("resolve_work_product_sources", {
        p_project_id: args.projectId, p_actor_id: args.userId,
        p_actor_email: args.userEmail ?? null, p_sources: args.sources,
    });
    if (error?.code === "P0002") return failure("not_found", "Matter not found.");
    if (error?.code === "P0001") return failure("conflict", "Source references changed or are unavailable. Review the draft sources.");
    if (error) return internalFailure(error);
    return ok(data as WorkProductSource[]);
}

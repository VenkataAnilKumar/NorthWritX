import { z } from "zod";
import type { WorkProductRecovery, WorkProductRecoverySummary } from "@northwrit/contracts";
import type { Db } from "../../lib/supabase";
import { checkProjectAccess, can } from "../../lib/access";
import { failure, internalFailure, ok } from "../../lib/serviceResult";

type Actor = { projectId: string; userId: string; userEmail?: string };
const text = (max: number) => z.string().refine(value => Array.from(value).length<=max && !/[\u0000\uD800-\uDFFF]/u.test(value));
const fields = z.object({ title:text(200),body:text(100000),scope:text(10000),assumptions:text(10000),sources:z.array(z.object({
 document_id:z.string().uuid(),version_id:z.string().uuid(),content_sha256:z.string().regex(/^[a-f0-9]{64}$/),locator:text(200).optional(),
}).strict()).max(50) }).strict();
const input = z.object({ expected_user_id:z.string().uuid(),sequence:z.number().int().min(1).max(2147483647),work_product_id:z.string().uuid().nullable(),base_version_id:z.string().uuid().nullable(),fields }).strict();
async function access(db: Db, actor: Actor) {
 const result=await checkProjectAccess(actor.projectId,actor.userId,actor.userEmail,db);
 if(!result.ok) return failure("not_found","Matter not found.");
 return can(result.projectRole,"content.edit") ? ok(true) : failure("forbidden","Recovery copies require editor access.");
}
export async function listRecoveries(db: Db,actor: Actor) {
 const allowed=await access(db,actor); if(!allowed.ok)return allowed;
 const {data,error}=await db.from("work_product_recoveries").select("id,project_id,work_product_id,base_version_id,sequence,updated_at,expires_at,title:fields->>title")
 .eq("project_id",actor.projectId).eq("user_id",actor.userId).is("discarded_at",null).gt("expires_at",new Date().toISOString()).order("updated_at",{ascending:false}).limit(50);
 return error?internalFailure(error):ok({items:(data??[]) as unknown as WorkProductRecoverySummary[]});
}
export async function readRecovery(db: Db,actor: Actor,id: string) {
 const allowed=await access(db,actor); if(!allowed.ok)return allowed;
 const {data,error}=await db.from("work_product_recoveries").select("id,project_id,work_product_id,base_version_id,sequence,fields,updated_at,expires_at")
 .eq("id",id).eq("project_id",actor.projectId).eq("user_id",actor.userId).is("discarded_at",null).gt("expires_at",new Date().toISOString()).maybeSingle();
 return error?internalFailure(error):data?ok(data as WorkProductRecovery):failure("not_found","Recovery copy unavailable or expired.");
}
export async function writeRecovery(db: Db,actor: Actor,id: string,payload: unknown,discard=false) {
 const parsed=discard?z.object({expected_user_id:z.string().uuid()}).strict().safeParse(payload):input.safeParse(payload);
 if(!parsed.success)return failure("validation","Provide a valid recovery checkpoint.");
 if(parsed.data.expected_user_id!==actor.userId)return failure("forbidden","Recovery request does not match the current account.");
 const value=discard?null:input.parse(parsed.data);
 const {data,error}=await db.rpc("write_work_product_recovery",{p_id:id,p_project_id:actor.projectId,p_actor_id:actor.userId,p_actor_email:actor.userEmail??null,
 p_sequence:value?.sequence??0,p_work_product_id:value?.work_product_id??null,p_base_version_id:value?.base_version_id??null,p_fields:value?.fields??null,p_discard:discard});
 if(error?.code==="P0002")return failure("not_found","Recovery copy unavailable.");
 if(error?.code==="42501")return failure("forbidden","Recovery copies require editor access.");
 if(error?.message==="recovery_limit")return failure("validation","Keep at most 50 recovery copies per matter. Discard an older copy before checkpointing another view.");
 if(error?.code==="P0001")return failure("conflict","This recovery copy changed, expired or was discarded. Keep your text and save a revision.");
 return error?internalFailure(error):ok(data as WorkProductRecovery);
}
export async function pruneRecoveries(db: Db) {
 const {error}=await db.rpc("prune_work_product_recoveries",{p_limit:500}); if(error)throw error;
}

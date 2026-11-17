import { Router, type Request, type Response } from "express";
import { requireAuth } from "../../middleware/auth";
import { createServerSupabase } from "../../lib/supabase";
import { asyncRoute, routerErrorHandler } from "../../middleware/asyncRoute";
import { sendServiceFailure } from "../../lib/serviceResult";
import { UUID_PATTERN } from "../../lib/uuid";
import { buildContentDisposition } from "../../lib/storage";
import { listRecoveries, readRecovery, writeRecovery, listWorkProducts, saveWorkProduct, readWorkProductVersion, listWorkProductVersions, exportWorkProductVersion } from "./workProducts.service";

export const workProductsRouter = Router({ mergeParams: true });
const actor = (req: Request, res: Response) => ({ projectId: String(req.params.projectId), userId: String(res.locals.userId), userEmail: res.locals.userEmail as string | undefined });
workProductsRouter.use(requireAuth);
workProductsRouter.use((req,res,next) => {
    res.setHeader("Cache-Control","private, no-store");
    if (!UUID_PATTERN.test(String(req.params.projectId))) return void res.status(400).json({ detail: "Invalid matter identifier." });
    next();
});
for (const key of ["workProductId","versionId","recoveryId"]) workProductsRouter.param(key, (_req,res,next,value: string) => {
    if (!UUID_PATTERN.test(value)) return void res.status(400).json({ detail: "Invalid work-product identifier." });
    next();
});
workProductsRouter.get("/recoveries", asyncRoute(async(req,res)=>{
 const result=await listRecoveries(createServerSupabase(),actor(req,res));
 if(!result.ok)return void sendServiceFailure(res,result); res.json(result.data);
}));
workProductsRouter.get("/recoveries/:recoveryId", asyncRoute(async(req,res)=>{
 const result=await readRecovery(createServerSupabase(),actor(req,res),req.params.recoveryId);
 if(!result.ok)return void sendServiceFailure(res,result); res.json(result.data);
}));
workProductsRouter.post("/recoveries/:recoveryId", asyncRoute(async(req,res)=>{
 const result=await writeRecovery(createServerSupabase(),actor(req,res),req.params.recoveryId,req.body);
 if(!result.ok)return void sendServiceFailure(res,result); res.json(result.data);
}));
workProductsRouter.delete("/recoveries/:recoveryId", asyncRoute(async(req,res)=>{
 const result=await writeRecovery(createServerSupabase(),actor(req,res),req.params.recoveryId,req.body,true);
 if(!result.ok)return void sendServiceFailure(res,result); res.status(204).send();
}));
workProductsRouter.get("/", asyncRoute(async (req, res) => {
    const result = await listWorkProducts(createServerSupabase(), actor(req,res), Number(req.query.limit ?? 50), Number(req.query.offset ?? 0));
    if (!result.ok) return void sendServiceFailure(res,result);
    res.json({ items: result.data });
}));
workProductsRouter.post("/", asyncRoute(async (req,res) => {
    const result = await saveWorkProduct(createServerSupabase(),actor(req,res),null,req.body);
    if (!result.ok) return void sendServiceFailure(res,result);
    res.status(result.data.idempotent ? 200 : 201).json(result.data);
}));
workProductsRouter.post("/:workProductId/versions", asyncRoute(async (req,res) => {
    const result = await saveWorkProduct(createServerSupabase(),actor(req,res),req.params.workProductId,req.body);
    if (!result.ok) return void sendServiceFailure(res,result);
    res.status(result.data.idempotent ? 200 : 201).json(result.data);
}));
workProductsRouter.get("/:workProductId/versions", asyncRoute(async (req,res) => {
    const result = await listWorkProductVersions(createServerSupabase(),actor(req,res),req.params.workProductId,Number(req.query.limit ?? 50),Number(req.query.offset ?? 0));
    if (!result.ok) return void sendServiceFailure(res,result);
    res.json(result.data);
}));
workProductsRouter.get("/:workProductId", asyncRoute(async (req,res) => {
    const result = await readWorkProductVersion(createServerSupabase(),actor(req,res),req.params.workProductId,null);
    if (!result.ok) return void sendServiceFailure(res,result);
    res.json(result.data);
}));
workProductsRouter.get("/:workProductId/versions/:versionId", asyncRoute(async (req,res) => {
    const result = await readWorkProductVersion(createServerSupabase(),actor(req,res),req.params.workProductId,req.params.versionId);
    if (!result.ok) return void sendServiceFailure(res,result);
    res.json(result.data);
}));
workProductsRouter.post("/:workProductId/versions/:versionId/export", asyncRoute(async (req,res) => {
    const result = await exportWorkProductVersion(createServerSupabase(),actor(req,res),req.params.workProductId,req.params.versionId);
    if (!result.ok) return void sendServiceFailure(res,result);
    res.setHeader("Content-Type","application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition",buildContentDisposition("attachment",result.data.filename));
    res.send(result.data.bytes);
}));
workProductsRouter.use(routerErrorHandler("[work-products]"));

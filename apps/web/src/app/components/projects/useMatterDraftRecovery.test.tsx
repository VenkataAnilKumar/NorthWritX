import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useMatterDraftRecovery } from "./useMatterDraftRecovery";
import type { useMatterDrafts } from "./useMatterDrafts";
import * as api from "@/app/lib/northwritApi";
vi.mock("@/app/lib/northwritApi",()=>({listDraftRecoveries:vi.fn(),readDraftRecovery:vi.fn(),saveDraftRecovery:vi.fn(),discardDraftRecovery:vi.fn()}));
vi.mock("@/app/lib/userFacingError",()=>({notifyError:vi.fn()}));
function editor(dirty=true,body="Unsaved",session=0) {
 return {editorSession:session,selected:null,recoveryBaseVersionId:null,fields:{title:"Advice",body,scope:"",assumptions:"",sources:[]},dirty,historical:false,restoreRecovery:vi.fn().mockResolvedValue(true)} as unknown as ReturnType<typeof useMatterDrafts>;
}
async function tick() {await act(async()=>{await vi.advanceTimersByTimeAsync(900);});}
beforeEach(()=>{
 vi.useFakeTimers();vi.clearAllMocks();vi.mocked(api.listDraftRecoveries).mockResolvedValue({items:[]});
 vi.mocked(api.saveDraftRecovery).mockImplementation(async(_p,id,input)=>({...input,id,project_id:"p",updated_at:"now",expires_at:"later"}));
 vi.mocked(api.discardDraftRecovery).mockResolvedValue(undefined);
});
afterEach(()=>vi.useRealTimers());
describe("private recovery controller",()=>{
 it("debounces edits and records the expected account and original base",async()=>{
  const hook=renderHook(({body})=>useMatterDraftRecovery("p","account-a",true,editor(true,body)),{initialProps:{body:"First"}});
  hook.rerender({body:"Latest"});await tick();
  expect(api.saveDraftRecovery).toHaveBeenCalledOnce();
  expect(vi.mocked(api.saveDraftRecovery).mock.calls[0][2]).toMatchObject({expected_user_id:"account-a",sequence:1,base_version_id:null,fields:{body:"Latest"}});
  expect(hook.result.current.status).toBe("saved");
 });
 it("does not checkpoint read-only views and surfaces failed checkpoints",async()=>{
  const read=renderHook(()=>useMatterDraftRecovery("p","a",false,editor()));await tick();expect(api.saveDraftRecovery).not.toHaveBeenCalled();read.unmount();
  vi.mocked(api.saveDraftRecovery).mockRejectedValueOnce(new Error("network"));
  const write=renderHook(()=>useMatterDraftRecovery("p","a",true,editor()));await tick();expect(write.result.current.status).toBe("failed");
 });
 it("serializes discard after a pending write and never flushes a discarded view on unmount",async()=>{
  let finish!:()=>void;
  vi.mocked(api.saveDraftRecovery).mockImplementationOnce(()=>new Promise(resolve=>{finish=()=>resolve({} as never);}));
  const hook=renderHook(()=>useMatterDraftRecovery("p","a",true,editor()));await tick();
  let discarding!:Promise<boolean>;act(()=>{discarding=hook.result.current.clearCurrent();});
  expect(api.discardDraftRecovery).not.toHaveBeenCalled();
  await act(async()=>{finish();await discarding;});expect(api.discardDraftRecovery).toHaveBeenCalledOnce();
  hook.unmount();await tick();expect(api.saveDraftRecovery).toHaveBeenCalledOnce();
 });
 it("rearms recovery after successful explicit save for the next edit",async()=>{
  const hook=renderHook(({dirty,body})=>useMatterDraftRecovery("p","a",true,editor(dirty,body)),{initialProps:{dirty:true,body:"Before save"}});
  await tick();const first=vi.mocked(api.saveDraftRecovery).mock.calls[0][1];
  hook.rerender({dirty:false,body:"Saved"});await tick();
  hook.rerender({dirty:true,body:"New edit"});await tick();
  const calls=vi.mocked(api.saveDraftRecovery).mock.calls;
  expect(calls.at(-1)?.[1]).not.toBe(first);expect(calls.at(-1)?.[2].fields.body).toBe("New edit");
 });
 it("keeps a late unmounted callback bound to the old account",async()=>{
  const first=renderHook(()=>useMatterDraftRecovery("p","old-user",true,editor()));first.unmount();
  const next=renderHook(()=>useMatterDraftRecovery("other","new-user",true,editor(false)));await tick();
  expect(vi.mocked(api.saveDraftRecovery).mock.calls[0][2].expected_user_id).toBe("old-user");
  expect(next.result.current.status).toBe("idle");
 });
});

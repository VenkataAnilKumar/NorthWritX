import { beforeEach, describe, expect, it, vi } from "vitest";
import { scriptedDb } from "../../../__tests__/helpers/scriptedDb";
import { parseMatterMetadata } from "../projects.metadata";
const mocks = vi.hoisted(() => ({ access: vi.fn() }));
vi.mock("../../../lib/access", async (original) => ({
  ...(await original<typeof import("../../../lib/access")>()),
  checkProjectAccess: mocks.access,
}));
import { updateProject } from "../projects.crud";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.access.mockResolvedValue({ ok: true, projectRole: "owner", project: { org_id: null } });
});

describe("Matter metadata validation", () => {
  it("distinguishes omitted fields, null clearing and trimmed text", () => {
    expect(parseMatterMetadata({})).toEqual({ ok: true, values: {} });
    expect(parseMatterMetadata({ client_name: "  Client  ", jurisdiction: "  ", matter_status: null }))
      .toEqual({ ok: true, values: { client_name: "Client", jurisdiction: null, matter_status: null } });
  });
  it.each(["open", "on_hold", "closed", null])("accepts status %s", (matter_status) => {
    expect(parseMatterMetadata({ matter_status })).toEqual({ ok: true, values: { matter_status } });
  });
  it.each([
    { client_name: 7 }, { jurisdiction: [] }, { client_name: {} },
    { client_name: "x".repeat(201) }, { jurisdiction: "x".repeat(101) },
    { matter_status: "archived" }, { matter_status: false }, { matter_status: "" },
  ])("rejects invalid metadata %j", (input) => {
    expect(parseMatterMetadata(input).ok).toBe(false);
  });
  it("counts Unicode code points consistently with PostgreSQL", () => {
    expect(parseMatterMetadata({ client_name: "😀".repeat(200) }).ok).toBe(true);
    expect(parseMatterMetadata({ client_name: "😀".repeat(201) }).ok).toBe(false);
    expect(parseMatterMetadata({ jurisdiction: "x".repeat(100) }).ok).toBe(true);
  });
});

describe("Matter metadata settings access", () => {
  it.each(["editor", "viewer"])("refuses %s before writing", async (role) => {
    mocks.access.mockResolvedValue({ ok: true, projectRole: role });
    const fake = scriptedDb([]);
    expect(await updateProject(fake.db, { projectId: "p", userId: "u", body: { client_name: "Client" } }))
      .toMatchObject({ ok: false, kind: "forbidden" });
    fake.done();
  });
  it("hides inaccessible projects before metadata validation", async () => {
    mocks.access.mockResolvedValue({ ok: false });
    const fake = scriptedDb([]);
    expect(await updateProject(fake.db, { projectId: "p", userId: "u", body: { matter_status: "bad" } }))
      .toEqual({ ok: false, kind: "not_found" });
    fake.done();
  });
  it("normalizes a sparse PATCH without changing identity, scope or lifecycle", async () => {
    const fake = scriptedDb([
      { table: "projects", op: "update", data: { id: "p", client_name: "Client", matter_status: null } },
      { table: "documents", data: [] }, { table: "project_subfolders", data: [] },
      { table: "memory_files", data: [] },
    ]);
    const result = await updateProject(fake.db, { projectId: "p", userId: "u", body: {
      client_name: "  Client  ", matter_status: null, user_id: "intruder", org_id: "foreign", archived_at: "now",
    } });
    expect(result).toMatchObject({ ok: true, body: { id: "p", client_name: "Client", matter_status: null } });
    expect(fake.calls[0].payload).toEqual({ client_name: "Client", matter_status: null, updated_at: expect.any(String) });
    expect(fake.calls[0].filters).toEqual([["eq", "id", "p"]]);
    fake.done();
  });
  it("rejects malformed metadata without writing", async () => {
    const fake = scriptedDb([]);
    expect(await updateProject(fake.db, { projectId: "p", userId: "u", body: { jurisdiction: 42 } }))
      .toMatchObject({ ok: false, kind: "validation" });
    fake.done();
  });
});

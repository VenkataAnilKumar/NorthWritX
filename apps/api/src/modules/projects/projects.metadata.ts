import type { MatterMetadata } from "@northwrit/contracts";

/** Count Unicode code points, matching PostgreSQL char_length (not UTF-16 units). */
export function parseMatterMetadata(body: Record<string, unknown>):
  | { ok: true; values: Partial<MatterMetadata> }
  | { ok: false; detail: string } {
  const values: Partial<MatterMetadata> = {};
  for (const [key, limit] of [["client_name", 200], ["jurisdiction", 100]] as const) {
    if (!(key in body)) continue;
    const value = body[key];
    if (value !== null && typeof value !== "string")
      return { ok: false, detail: `${key} must be a string or null` };
    const normalized = typeof value === "string" ? value.trim() || null : null;
    if (normalized !== null && Array.from(normalized).length > limit)
      return { ok: false, detail: `${key} must be at most ${limit} characters` };
    values[key] = normalized;
  }
  if ("matter_status" in body) {
    const value = body.matter_status;
    if (value !== null && value !== "open" && value !== "on_hold" && value !== "closed")
      return { ok: false, detail: "matter_status must be open, on_hold, closed or null" };
    values.matter_status = value;
  }
  return { ok: true, values };
}

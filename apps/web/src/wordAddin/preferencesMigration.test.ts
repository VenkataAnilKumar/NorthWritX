import { describe, expect, it, vi } from "vitest";
import { readWordPreference } from "../../../word-addin/src/taskpane/lib/wordPreferenceStorage";

describe("Word preference namespace transition", () => {
  const key = "northwrit_word_chat_storage_mode:user-1";
  const legacy = "northwrit_word_chat_storage_mode:user-1";
  it("preserves a local-only preference and stores it under the new key", async () => {
    const values = new Map([[legacy, "local"]]);
    const storage = { getItem: vi.fn(async (name: string) => values.get(name)), setItem: vi.fn(async (name: string, value: string) => { values.set(name, value); }) };
    expect(await readWordPreference(storage, key)).toBe("local");
    expect(values.get(key)).toBe("local");
    expect(values.get(legacy)).toBe("local");
  });
  it("prefers the explicit new setting", async () => {
    const storage = { getItem: vi.fn(async () => "cloud"), setItem: vi.fn() };
    expect(await readWordPreference(storage, key)).toBe("cloud");
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).not.toHaveBeenCalled();
  });
  it("propagates storage failures so the hook can keep its privacy-safe fallback", async () => {
    const storage = { getItem: vi.fn(async () => { throw new Error("storage unavailable"); }), setItem: vi.fn() };
    await expect(readWordPreference(storage, key)).rejects.toThrow("storage unavailable");
    expect(storage.setItem).not.toHaveBeenCalled();
  });
  it("does not turn a failed migration into a missing preference", async () => {
    const storage = { getItem: vi.fn().mockResolvedValueOnce(null).mockResolvedValueOnce("local"), setItem: vi.fn().mockRejectedValue(new Error("write unavailable")) };
    await expect(readWordPreference(storage, key)).rejects.toThrow("write unavailable");
  });
});

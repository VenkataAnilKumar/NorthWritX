interface PreferenceStorage {
  getItem(key: string): Promise<string | null | undefined>;
  setItem(key: string, value: string): Promise<unknown>;
}

/** Read the new key first; retain local-only choices from existing installs. */
export async function readWordPreference(storage: PreferenceStorage, key: string): Promise<string | null> {
  const current = await storage.getItem(key);
  if (current != null) return current;
  const legacy = await storage.getItem(key.replace(/^northwrit_/, "northwrit_"));
  if (legacy != null) await storage.setItem(key, legacy);
  return legacy ?? null;
}

/** Shared bot R2 folder helpers (safe for client + server). */

export function slugifyBotFolder(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "unnamed";
}

/** R2 prefix folder: `bots/{slug}/` — prefers stored folder, then bot name, then bot id. */
export function resolveBotStorageFolder(
  name: string,
  options?: { storageFolder?: string; botId?: string }
): string {
  if (options?.storageFolder?.trim()) {
    return slugifyBotFolder(options.storageFolder);
  }
  if (name.trim()) {
    return slugifyBotFolder(name);
  }
  if (options?.botId?.trim()) {
    return slugifyBotFolder(options.botId);
  }
  return "unnamed";
}

export function botStoragePrefix(folder: string): string {
  return `bots/${slugifyBotFolder(folder)}`;
}

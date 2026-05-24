/** Normalize MT4/MT5 account login to digits-only string. */
export function normalizeMtAccountNumber(value: string): string {
  return value.trim().replace(/\D/g, "");
}

/** MT account logins are numeric; allow typical broker lengths. */
export function isValidMtAccountNumber(value: string): boolean {
  const n = normalizeMtAccountNumber(value);
  return n.length >= 4 && n.length <= 15;
}

/** Prefer subscription MT account, then profile from registration. */
export function resolveMtAccountNumber(
  subscriptionMt?: string | null,
  profileMt?: string | null,
): string {
  const fromSub = normalizeMtAccountNumber(subscriptionMt ?? "");
  if (fromSub) return fromSub;
  return normalizeMtAccountNumber(profileMt ?? "");
}

/** Parse Firestore Timestamp, ISO string, or Date into Date (or null). */
export function toDate(value: unknown): Date | null {
  if (value == null) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "object" && value !== null) {
    if ("toDate" in value && typeof (value as { toDate: () => Date }).toDate === "function") {
      return (value as { toDate: () => Date }).toDate();
    }
    if ("_seconds" in value && typeof (value as { _seconds: number })._seconds === "number") {
      return new Date((value as { _seconds: number })._seconds * 1000);
    }
  }
  return null;
}

export function formatDisplayDate(value: unknown, fallback = "No expiry"): string {
  const d = toDate(value);
  if (!d) return fallback;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/** Whole days from now until `value` (negative if past). */
export function daysUntil(value: unknown): number | null {
  const d = toDate(value);
  if (!d) return null;
  return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

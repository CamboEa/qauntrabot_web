import { getBearerToken, verifySessionToken } from "@/lib/session-auth";

/** Verify Firebase ID token — any signed-in user (not admin-only). */
export async function requireSignedInUser(
  req: Request,
): Promise<{ uid: string; email: string } | null> {
  const token = getBearerToken(req);
  if (!token) return null;

  return verifySessionToken(token);
}

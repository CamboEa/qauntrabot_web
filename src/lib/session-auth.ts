/** Verify Firebase ID token for signed-in dashboard users (not admin-only). */
export async function verifySessionToken(
  idToken: string,
): Promise<{ uid: string; email: string } | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  );

  if (!res.ok) return null;

  const data = (await res.json()) as {
    users?: Array<{ localId: string; email: string }>;
  };

  const user = data.users?.[0];
  if (!user?.localId) return null;

  return { uid: user.localId, email: user.email ?? "" };
}

export function getBearerToken(req: Request): string | null {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7);
}

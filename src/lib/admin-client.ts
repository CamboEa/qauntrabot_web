import { auth } from "@/lib/firebase";

export async function getAdminToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

export async function adminFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAdminToken();
  if (!token) throw new Error("Not authenticated");

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(path, { ...options, headers });
}

export async function adminJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await adminFetch(path, options);
  const data = await res.json();
  if (!res.ok) {
    const body = data as { error?: string; hint?: string };
    throw new Error(body.hint ? `${body.error ?? "Request failed"} — ${body.hint}` : (body.error ?? "Request failed"));
  }
  return data as T;
}

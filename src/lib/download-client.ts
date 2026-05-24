import { getAuthToken } from "@/lib/auth";

export async function fetchSignedDownloadUrl(key: string): Promise<string> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Please sign in to download.");
  }

  const res = await fetch(`/api/download?key=${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? "Download not available.");
  }
  if (!data.url) {
    throw new Error("Download URL missing.");
  }
  return data.url;
}

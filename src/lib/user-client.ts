import { getAuthToken } from "@/lib/auth";
import type { UserProfile } from "@/lib/firestore";

export type UpdateProfileInput = {
  platform?: string;
  mtAccountNumber?: string;
};

export async function updateMyProfile(data: UpdateProfileInput): Promise<UserProfile> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Please sign in to update your profile.");
  }

  const res = await fetch("/api/user/profile", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const body = (await res.json()) as UserProfile & { error?: string };
  if (!res.ok) {
    throw new Error(body.error ?? "Failed to update profile.");
  }

  return body;
}

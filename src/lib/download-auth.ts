import { getUserSubscription } from "@/lib/firestore-api";
import { isSubscriptionActive } from "@/lib/subscription-plans";
import { getBearerToken, verifySessionToken } from "@/lib/session-auth";

const ALLOWED_PREFIX = "bots/";

export function isAllowedBotFileKey(key: string): boolean {
  if (!key.startsWith(ALLOWED_PREFIX)) return false;
  if (key.includes("..") || key.includes("\\")) return false;
  return /\.(ex4|ex5|mq4|mq5|pdf|html?)$/i.test(key);
}

export async function requireActiveSubscriber(
  req: Request,
): Promise<{ uid: string; email: string } | null> {
  const token = getBearerToken(req);
  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session) return null;

  const sub = await getUserSubscription(session.uid);
  if (!sub || !isSubscriptionActive(sub.validUntil, sub.status)) return null;

  return session;
}

/**
 * Firestore for API routes: prefers Admin SDK; falls back to client SDK when
 * FIREBASE_SERVICE_ACCOUNT_* is not set (requires permissive Firestore rules).
 */
import * as server from "./firestore-server";
import * as client from "./firestore";

const ADMIN_NOT_CONFIGURED = "Firebase Admin not configured";

async function withFallback<T>(serverFn: () => Promise<T>, clientFn: () => Promise<T>): Promise<T> {
  try {
    return await serverFn();
  } catch (err) {
    if (err instanceof Error && err.message.includes(ADMIN_NOT_CONFIGURED)) {
      return clientFn();
    }
    throw err;
  }
}

export type { BotDoc, BotInput, SubscriptionInput, SubscriptionPlanDoc } from "./firestore";

export const getAllPlans = () => withFallback(server.getAllPlans, client.getAllPlans);
export const getAllBots = () => withFallback(server.getAllBots, client.getAllBots);
export const getBot = (id: string) => withFallback(() => server.getBot(id), () => client.getBot(id));
export const createBot = (id: string, data: Parameters<typeof server.createBot>[1]) =>
  withFallback(() => server.createBot(id, data), () => client.createBot(id, data));
export const updateBot = (id: string, data: Parameters<typeof server.updateBot>[1]) =>
  withFallback(() => server.updateBot(id, data), () => client.updateBot(id, data));
export const deleteBot = (id: string) =>
  withFallback(() => server.deleteBot(id), () => client.deleteBot(id));

export const getAllUsers = () => withFallback(server.getAllUsers, client.getAllUsers);

export const getAllSubscriptions = () =>
  withFallback(server.getAllSubscriptions, client.getAllSubscriptions);
export const upsertSubscription = (
  uid: string,
  data: Parameters<typeof server.upsertSubscription>[1]
) => withFallback(() => server.upsertSubscription(uid, data), () => client.upsertSubscription(uid, data));
export const deleteSubscription = (uid: string) =>
  withFallback(() => server.deleteSubscription(uid), () => client.deleteSubscription(uid));

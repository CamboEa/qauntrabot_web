import { unstable_cache } from "next/cache";
import { getAllBots } from "@/lib/firestore-api";
import { serializeBot, type SerializableBot } from "@/lib/bot-display";

export const getCachedBots = unstable_cache(
  async (): Promise<SerializableBot[]> => {
    try {
      const bots = await getAllBots();
      return bots.map(serializeBot);
    } catch {
      return [];
    }
  },
  ["bot-catalogue"],
  { revalidate: 300 },
);

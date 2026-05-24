import { unstable_cache } from "next/cache";
import { getAllPlans } from "@/lib/firestore-api";
import { getDefaultPlans } from "@/lib/subscription-plans";

export const getCachedPlans = unstable_cache(
  async () => {
    try {
      const plans = await getAllPlans();
      return plans.length > 0 ? plans : getDefaultPlans();
    } catch {
      return getDefaultPlans();
    }
  },
  ["subscription-plans"],
  { revalidate: 3600 },
);

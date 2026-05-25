import type { MetadataRoute } from "next";
import { getAllBots } from "@/lib/firestore-api";
import { PUBLIC_ROUTES } from "@/lib/seo";
import { SHOW_LIVE_RESULTS_PAGE, SITE_URL } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = PUBLIC_ROUTES.map(
    ({ path, changeFrequency = "weekly", priority = 0.8 }) => ({
      url: `${SITE_URL}${path === "/" ? "" : path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })
  );

  if (SHOW_LIVE_RESULTS_PAGE) {
    staticEntries.push({
      url: `${SITE_URL}/performance`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }

  let botEntries: MetadataRoute.Sitemap = [];
  try {
    const bots = await getAllBots();
    botEntries = bots
      .filter((b) => b.status !== "soon")
      .map((bot) => ({
        url: `${SITE_URL}/bots/${bot.id}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.75,
      }));
  } catch {
    // Build without dynamic bot URLs if Firestore is unavailable.
  }

  return [...staticEntries, ...botEntries];
}

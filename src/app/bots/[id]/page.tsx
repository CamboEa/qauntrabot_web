import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import BotDetailView from "@/components/bots/BotDetailView";
import { getAllBots, getBot } from "@/lib/firestore-api";
import { getFallbackBot, FALLBACK_BOTS } from "@/lib/fallback-bots";
import { publicAssetUrl, serializeBot } from "@/lib/bot-display";

type Params = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  try {
    const bots = await getAllBots();
    if (bots.length > 0) return bots.map((b) => ({ id: b.id }));
  } catch {
    /* use fallback */
  }
  return FALLBACK_BOTS.map((b) => ({ id: b.id }));
}

async function resolveBot(id: string) {
  try {
    const fromDb = await getBot(id);
    if (fromDb) return fromDb;
  } catch {
    /* fallback */
  }
  return getFallbackBot(id);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const bot = await resolveBot(id);
  if (!bot) {
    return { title: "Bot not found — QauntraBot" };
  }
  return {
    title: `${bot.name} — QauntraBot`,
    description: bot.description,
  };
}

export default async function BotDetailPage({ params }: Params) {
  const { id } = await params;
  const bot = await resolveBot(id);

  if (!bot) {
    notFound();
  }

  const coverUrl = publicAssetUrl(bot.imageKey);

  return (
    <PageWrapper>
      <BotDetailView bot={serializeBot(bot)} coverUrl={coverUrl} />
    </PageWrapper>
  );
}

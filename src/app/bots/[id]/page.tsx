import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BotDetailView from "@/components/bots/BotDetailView";
import PageWrapper from "@/components/layout/PageWrapper";
import { getAllBots, getBot } from "@/lib/firestore-api";
import { serializeBot } from "@/lib/bot-display";

type Params = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  try {
    const bots = await getAllBots();
    return bots.map((b) => ({ id: b.id }));
  } catch {
    return [];
  }
}

async function resolveBot(id: string) {
  try {
    return await getBot(id);
  } catch {
    return null;
  }
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

  const isActive = bot.status !== "soon";

  return (
    <PageWrapper
      hero={{
        eyebrow: bot.assetTag,
        title: bot.name,
        accent: bot.subtitle.endsWith(".") ? bot.subtitle : `${bot.subtitle}.`,
        description: `${bot.asset} · ${bot.risk} risk · Min. deposit ${bot.minDeposit}`,
        cta: isActive ? { label: "Subscribe", href: "/pricing" } : undefined,
        secondaryCta: { label: "All bots", href: "/bots" },
      }}
    >
      <BotDetailView bot={serializeBot(bot)} />
    </PageWrapper>
  );
}

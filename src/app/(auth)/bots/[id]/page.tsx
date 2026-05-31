import { notFound } from "next/navigation";
import BotDetailView from "@/components/bots/BotDetailView";
import PageWrapper from "@/components/layout/PageWrapper";
import { BotProductJsonLd } from "@/components/seo/JsonLd";
import { serializeBot } from "@/lib/bot-display";
import { getAllBots, getBot } from "@/lib/firestore-api";
import { createPageMetadata } from "@/lib/seo";

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

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  const bot = await resolveBot(id);
  if (!bot) {
    return createPageMetadata({
      title: "Bot not found",
      description: "This trading bot could not be found.",
      path: `/bots/${id}`,
      noIndex: true,
    });
  }
  return createPageMetadata({
    title: bot.name,
    description: bot.description,
    path: `/bots/${id}`,
    keywords: [
      bot.name,
      bot.asset,
      "expert advisor",
      "MT5 EA",
      "algorithmic trading",
    ],
  });
}

export default async function BotDetailPage({ params }: Params) {
  const { id } = await params;
  const bot = await resolveBot(id);

  if (!bot) {
    notFound();
  }

  const isActive = bot.status !== "soon";

  return (
    <>
      <BotProductJsonLd
        id={bot.id}
        name={bot.name}
        description={bot.description}
        asset={bot.asset}
      />
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
    </>
  );
}

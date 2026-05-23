"use client";

import { useState, useEffect } from "react";
import { getAllBots, getUserSubscription, type BotDoc } from "@/lib/firestore";
import { isSubscriptionActive } from "@/lib/subscription-plans";
import { useAuth } from "@/contexts/AuthContext";
import SectionHeader from "@/components/shared/SectionHeader";
import PageSection from "@/components/shared/PageSection";
import BotCatalogCard, { BotCatalogCardSkeleton } from "@/components/bots/BotCatalogCard";

type Filter = "all" | "live" | "beta" | "soon";

export default function BotsSection({ hideHeader = false }: { hideHeader?: boolean }) {
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>("all");
  const [bots, setBots] = useState<BotDoc[]>([]);
  const [loadingBots, setLoadingBots] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    getAllBots()
      .then(setBots)
      .catch(() => setBots([]))
      .finally(() => setLoadingBots(false));
  }, []);

  useEffect(() => {
    if (!user) {
      setHasSubscription(false);
      return;
    }
    getUserSubscription(user.uid)
      .then((sub) => setHasSubscription(sub ? isSubscriptionActive(sub.validUntil, sub.status) : false))
      .catch(() => setHasSubscription(false));
  }, [user]);

  const filtered = filter === "all" ? bots : bots.filter((b) => b.status === filter);

  const handleDownload = async (e: React.MouseEvent, bot: BotDoc) => {
    e.preventDefault();
    e.stopPropagation();
    if (!bot.fileKey) return;
    setDownloadingId(bot.id);
    try {
      const res = await fetch(`/api/download?key=${encodeURIComponent(bot.fileKey)}`);
      const { url } = await res.json();
      const a = document.createElement("a");
      a.href = url;
      a.download = bot.fileKey.split("/").pop() ?? "bot.ex5";
      a.click();
    } catch {
      alert("Download failed. Please contact support.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <PageSection id="bots" underHero={hideHeader} standalone={!hideHeader}>
      {!hideHeader && (
        <div className="headline-gap">
          <SectionHeader
            eyebrow="Strategy Catalogue"
            title="Available"
            accent="Trading Bots."
            description="Each bot is an independent Expert Advisor, deployable on MT4 or MT5 with isolated risk parameters."
          />
        </div>
      )}

      <div className="tab-group">
        {(["all", "live", "beta", "soon"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`shrink-0 cursor-pointer ${filter === f ? "tab-pill-active" : ""}`}
          >
            {f === "soon" ? "Coming Soon" : f === "all" ? "All Bots" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-site">
        {loadingBots &&
          Array.from({ length: 3 }).map((_, i) => <BotCatalogCardSkeleton key={i} />)}

        {!loadingBots &&
          filtered.map((bot) => {
            const isActive = bot.status !== "soon";
            return (
              <BotCatalogCard
                key={bot.id}
                bot={bot}
                showDownload={Boolean(user && hasSubscription && isActive && bot.fileKey)}
                isDownloading={downloadingId === bot.id}
                onDownload={(e) => handleDownload(e, bot)}
              />
            );
          })}
      </div>

      {!loadingBots && bots.length === 0 && (
        <p className="text-center text-sm text-muted-foreground font-data py-12 max-w-md mx-auto leading-relaxed">
          No bots in the catalogue yet. Run{" "}
          <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">npm run seed:data</code> after
          configuring Firebase Admin in <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">.env</code>.
        </p>
      )}

      {!loadingBots && bots.length > 0 && filtered.length === 0 && (
        <p className="text-center text-sm text-muted-foreground font-data py-12">
          No bots match this filter.
        </p>
      )}
    </PageSection>
  );
}

"use client";

import Link from "next/link";
import { useDashboard } from "@/contexts/DashboardContext";
import DashboardSectionHead from "@/components/dashboard/DashboardSectionHead";
import DashboardBotRow from "@/components/dashboard/DashboardBotRow";
import DashboardSubscriptionAlerts from "@/components/dashboard/DashboardSubscriptionAlerts";

export default function DashboardBots() {
  const { loading, active, platform, accessibleBots, lockedBots, bots } = useDashboard();

  const list = active ? accessibleBots : lockedBots.length ? lockedBots : bots;

  return (
    <div className="dashboard-page">
      <DashboardSectionHead
        eyebrow="Bots"
        title={active ? "Your Expert Advisors" : "Bot catalogue"}
        aside={
          active ? (
            <span>
              {accessibleBots.length} deployable · {lockedBots.length} coming soon
            </span>
          ) : undefined
        }
      />

      <DashboardSubscriptionAlerts />

      {loading ? (
        <div className="dashboard-bot-list">
          {[1, 2, 3].map((n) => (
            <div key={n} className="dashboard-skeleton !min-h-[6rem]" />
          ))}
        </div>
      ) : (
        <div className="dashboard-bot-list">
          {list.map((bot) => (
            <DashboardBotRow key={bot.id} bot={bot} canDownload={active} userPlatform={platform} />
          ))}
          {list.length === 0 && (
            <p className="text-sm text-muted-foreground py-8 text-center">No bots in the catalogue yet.</p>
          )}
        </div>
      )}

      {!active && !loading && bots.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          <Link href="/pricing" className="text-primary font-medium hover:underline">
            Subscribe
          </Link>{" "}
          to download and deploy these strategies on your account.
        </p>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import {
  Monitor,
  ShieldCheck,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  Server,
  TrendingDown,
  LineChart,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboard } from "@/contexts/DashboardContext";
import { formatRelativeTime } from "@/lib/dates";
import { formatMoney } from "@/lib/format-money";
import DashboardSectionHead from "@/components/dashboard/DashboardSectionHead";
import DashboardBlock from "@/components/dashboard/DashboardBlock";
import DashboardCard from "@/components/dashboard/DashboardCard";
import DashboardMetaItem from "@/components/dashboard/DashboardMetaItem";
import BalanceGrowthChart from "@/components/dashboard/BalanceGrowthChart";
import BotLiveSituation from "@/components/dashboard/BotLiveSituation";
import AttachedChartBadge from "@/components/dashboard/AttachedChartBadge";
import { formatSymbolTimeframe } from "@/lib/chart-context";
import ContentHeading from "@/components/shared/ContentHeading";

export default function DashboardTradingAccount() {
  const { profile } = useAuth();
  const {
    subscription,
    loading,
    active,
    platform,
    mtAccountNumber,
    tradingSnapshot,
    refresh,
  } = useDashboard();
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const mtAccount = mtAccountNumber;
  const hasProfileOnly = !subscription?.mtAccountNumber && Boolean(profile?.mtAccountNumber);
  const currency = tradingSnapshot?.currency ?? "USD";
  const history = tradingSnapshot?.balanceHistory ?? [];
  const maxFloatingLoss = tradingSnapshot?.maxFloatingLoss;

  const handleCopyAccount = async () => {
    if (!mtAccount) return;
    try {
      await navigator.clipboard.writeText(mtAccount);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  return (
    <div className="dashboard-page">
      <DashboardSectionHead
        eyebrow="Trading account"
        title="Your MT account"
        description="Same live readout as your EA chart dashboard — trend, market hours, grid, and balance."
        aside={
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="btn-outline-brand text-xs !py-2 !px-3 cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        }
      />

      {loading ? (
        <div className="dashboard-skeleton" />
      ) : (
        <>
          <DashboardBlock
            title={
              <>
                <Monitor size={16} className="text-primary" />
                Live account
              </>
            }
            action={
              tradingSnapshot ? (
                <span className="text-xs font-data text-muted-foreground inline-flex items-center gap-1">
                  <Server size={12} />
                  {formatRelativeTime(tradingSnapshot.updatedAt)}
                </span>
              ) : null
            }
          >
            {tradingSnapshot ? (
              <>
                {tradingSnapshot.botStatus && (
                  <AttachedChartBadge status={tradingSnapshot.botStatus} />
                )}
                <div className="dashboard-hero-stats dashboard-hero-stats--4">
                  <div className="dashboard-hero-stat">
                    <p className="stat-label normal-case">Balance</p>
                    <p className="dashboard-hero-value">
                      {formatMoney(tradingSnapshot.balance, currency)}
                    </p>
                  </div>
                  <div className="dashboard-hero-stat">
                    <p className="stat-label normal-case">Equity</p>
                    <p className="dashboard-hero-value">
                      {formatMoney(tradingSnapshot.equity, currency)}
                    </p>
                  </div>
                  <div className="dashboard-hero-stat">
                    <p className="stat-label normal-case">Floating P/L</p>
                    <p
                      className={`dashboard-hero-value ${
                        tradingSnapshot.profit >= 0 ? "text-profit" : "text-loss"
                      }`}
                    >
                      {formatMoney(tradingSnapshot.profit, currency)}
                    </p>
                  </div>
                  <div className="dashboard-hero-stat">
                    <p className="stat-label normal-case inline-flex items-center gap-1">
                      <TrendingDown size={12} className="text-loss" />
                      Max floating loss
                    </p>
                    <p
                      className={`dashboard-hero-value ${
                        maxFloatingLoss !== undefined && maxFloatingLoss < 0
                          ? "text-loss"
                          : "text-muted-foreground"
                      }`}
                    >
                      {maxFloatingLoss !== undefined && maxFloatingLoss < 0
                        ? formatMoney(maxFloatingLoss, currency)
                        : "—"}
                    </p>
                    <p className="text-[0.65rem] font-data text-muted-foreground">
                      Worst open P/L this EA session
                    </p>
                  </div>
                </div>

                <BalanceGrowthChart
                  history={history}
                  currency={currency}
                  currentBalance={tradingSnapshot.balance}
                />

                {tradingSnapshot.botStatus ? (
                  <BotLiveSituation
                    status={tradingSnapshot.botStatus}
                    currency={currency}
                  />
                ) : (
                  <DashboardCard variant="soft">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Bot situation not synced yet.</strong> Recompile
                      the EA from the latest <span className="font-data">SuperFiveCentBot.mq5</span> sample
                      and keep it attached — trend, market block, and grid stats will appear here.
                    </p>
                  </DashboardCard>
                )}
              </>
            ) : (
              <DashboardCard variant="soft">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">No live balance yet.</strong> Attach your
                  licensed EA on this MT account — balance, growth chart, and max floating loss sync
                  automatically.
                </p>
                {active && (
                  <Link
                    href="/dashboard/setup"
                    className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:underline w-fit"
                  >
                    Setup guide <ArrowRight size={14} />
                  </Link>
                )}
              </DashboardCard>
            )}
            {tradingSnapshot?.server && (
              <p className="text-xs font-data text-muted-foreground -mt-1">
                Broker server: {tradingSnapshot.server}
              </p>
            )}
          </DashboardBlock>

          {mtAccount ? (
            <DashboardCard variant="accent">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <ContentHeading icon={Monitor} as="h3">
                  Linked trading account
                </ContentHeading>
                <div className="flex flex-wrap gap-2">
                  {hasProfileOnly && (
                    <span className="inline-flex items-center text-xs font-data text-muted-foreground px-2 py-1 rounded-full bg-secondary border border-border">
                      Registered at sign-up
                    </span>
                  )}
                  {active && (
                    <span className="inline-flex items-center gap-1 text-xs font-data text-profit px-2 py-1 rounded-full bg-profit/10 border border-profit/20">
                      <ShieldCheck size={12} />
                      Licensed
                    </span>
                  )}
                </div>
              </div>

              <div className="text-center sm:text-left py-2">
                <p className="stat-label normal-case mb-2">MT account number</p>
                <p className="font-data text-2xl sm:text-3xl font-bold text-foreground tracking-tight break-all">
                  {mtAccount}
                </p>
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="btn-outline-brand text-xs w-fit mx-auto sm:mx-0 mt-4 cursor-pointer"
                >
                  {copied ? <Check size={14} className="text-profit" /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy account number"}
                </button>
              </div>

              <div className="dashboard-meta-grid">
                <DashboardMetaItem label="Platform" value={platform} />
                <DashboardMetaItem
                  label="Attached chart"
                  value={
                    tradingSnapshot?.botStatus
                      ? formatSymbolTimeframe(
                          tradingSnapshot.botStatus.symbol,
                          tradingSnapshot.botStatus.timeframe,
                        )
                      : "—"
                  }
                  mono
                />
              </div>
            </DashboardCard>
          ) : (
            <DashboardCard variant="soft">
              <p className="text-sm text-muted-foreground flex items-start gap-2">
                <LineChart size={16} className="text-primary shrink-0 mt-0.5" />
                No trading account on file. Add your MT login when registering, or contact support.
              </p>
            </DashboardCard>
          )}
        </>
      )}
    </div>
  );
}

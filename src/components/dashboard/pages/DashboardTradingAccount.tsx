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
  Pencil,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboard } from "@/contexts/DashboardContext";
import { formatRelativeTime } from "@/lib/dates";
import { formatMoney } from "@/lib/format-money";
import { normalizeMtAccountNumber } from "@/lib/mt-account";
import { updateMyProfile } from "@/lib/user-client";
import DashboardSectionHead from "@/components/dashboard/DashboardSectionHead";
import DashboardBlock from "@/components/dashboard/DashboardBlock";
import DashboardCard from "@/components/dashboard/DashboardCard";
import DashboardMetaItem from "@/components/dashboard/DashboardMetaItem";
import BalanceGrowthChart from "@/components/dashboard/BalanceGrowthChart";
import BotLiveSituation from "@/components/dashboard/BotLiveSituation";
import AttachedChartBadge from "@/components/dashboard/AttachedChartBadge";
import { formatSymbolTimeframe } from "@/lib/chart-context";
import { toast } from "@/lib/toast";
import ContentHeading from "@/components/shared/ContentHeading";

const PLATFORMS = ["MetaTrader 5 (MT5)", "MetaTrader 4 (MT4)"] as const;
type PlatformOption = (typeof PLATFORMS)[number];

export default function DashboardTradingAccount() {
  const { profile, refreshProfile } = useAuth();
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
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draftPlatform, setDraftPlatform] = useState<PlatformOption>(PLATFORMS[0]);
  const [draftMtAccount, setDraftMtAccount] = useState("");

  const mtAccount = mtAccountNumber;
  const hasProfileOnly = !subscription?.mtAccountNumber && Boolean(profile?.mtAccountNumber);
  const currency = tradingSnapshot?.currency ?? "USD";
  const history = tradingSnapshot?.balanceHistory ?? [];
  const maxFloatingLoss = tradingSnapshot?.maxFloatingLoss;

  useEffect(() => {
    if (editing) return;
    setDraftPlatform(
      PLATFORMS.includes(platform as PlatformOption)
        ? (platform as PlatformOption)
        : PLATFORMS[0],
    );
    setDraftMtAccount(mtAccount);
  }, [editing, platform, mtAccount]);

  const startEditing = () => {
    setDraftPlatform(
      PLATFORMS.includes(platform as PlatformOption)
        ? (platform as PlatformOption)
        : PLATFORMS[0],
    );
    setDraftMtAccount(mtAccount);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const handleSaveAccount = async () => {
    const mtAccountNumber = normalizeMtAccountNumber(draftMtAccount);
    if (!mtAccountNumber) {
      toast.warning("Enter your MT account number.");
      return;
    }
    if (mtAccountNumber.length < 4 || mtAccountNumber.length > 15) {
      toast.warning("MT account must be 4–15 digits.");
      return;
    }

    setSaving(true);
    try {
      await updateMyProfile({
        platform: draftPlatform,
        mtAccountNumber,
      });
      await Promise.all([refreshProfile(), refresh()]);
      toast.success("Trading account updated.");
      setEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyAccount = async () => {
    if (!mtAccount) return;
    try {
      await navigator.clipboard.writeText(mtAccount);
      setCopied(true);
      toast.success("Account number copied.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy account number.");
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
                      the EA from the latest{" "}
                      <span className="font-data">SuperFiveCentBot.mq5</span> or{" "}
                      <span className="font-data">SuperFiveCentBotBTC.mq5</span> sample
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

          {mtAccount || editing ? (
            <DashboardCard variant="accent">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <ContentHeading icon={Monitor} as="h3">
                  Linked trading account
                </ContentHeading>
                <div className="flex flex-wrap gap-2">
                  {!editing && hasProfileOnly && (
                    <span className="inline-flex items-center text-xs font-data text-muted-foreground px-2 py-1 rounded-full bg-secondary border border-border">
                      Registered at sign-up
                    </span>
                  )}
                  {active && !editing && (
                    <span className="inline-flex items-center gap-1 text-xs font-data text-profit px-2 py-1 rounded-full bg-profit/10 border border-profit/20">
                      <ShieldCheck size={12} />
                      Licensed
                    </span>
                  )}
                </div>
              </div>

              {editing ? (
                <div className="stack-4 pt-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your license is locked to this MT login. Use the same account you run the EA on.
                  </p>
                  <div className="stack-2">
                    <label className="field-label">Platform</label>
                    <select
                      value={draftPlatform}
                      onChange={(e) => setDraftPlatform(e.target.value as PlatformOption)}
                      className="input-field cursor-pointer"
                      disabled={saving}
                    >
                      {PLATFORMS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="stack-2">
                    <label className="field-label">MT account number</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      value={draftMtAccount}
                      onChange={(e) =>
                        setDraftMtAccount(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="e.g. 12345678"
                      className="input-field font-data text-lg"
                      disabled={saving}
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleSaveAccount}
                      disabled={saving}
                      className="btn-primary-brand text-sm cursor-pointer disabled:opacity-50"
                    >
                      {saving ? "Saving…" : "Save changes"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={saving}
                      className="btn-outline-brand text-sm cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center sm:text-left py-2">
                    <p className="stat-label normal-case mb-2">MT account number</p>
                    <p className="font-data text-2xl sm:text-3xl font-bold text-foreground tracking-tight break-all">
                      {mtAccount}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="btn-outline-brand text-xs cursor-pointer inline-flex items-center gap-1.5"
                      >
                        {copied ? <Check size={14} className="text-profit" /> : <Copy size={14} />}
                        {copied ? "Copied" : "Copy account number"}
                      </button>
                      <button
                        type="button"
                        onClick={startEditing}
                        className="btn-outline-brand text-xs cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Pencil size={14} />
                        Edit account
                      </button>
                    </div>
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
                </>
              )}
            </DashboardCard>
          ) : (
            <DashboardCard variant="soft">
              <p className="text-sm text-muted-foreground flex items-start gap-2">
                <LineChart size={16} className="text-primary shrink-0 mt-0.5" />
                No trading account on file yet. Add your MT login to link your license.
              </p>
              <button
                type="button"
                onClick={startEditing}
                className="btn-primary-brand text-sm w-fit mt-4 cursor-pointer inline-flex items-center gap-1.5"
              >
                <Pencil size={14} />
                Add MT account
              </button>
            </DashboardCard>
          )}
        </>
      )}
    </div>
  );
}

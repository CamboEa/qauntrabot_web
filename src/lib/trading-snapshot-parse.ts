import { toDate } from "@/lib/dates";
import type { BalanceHistoryPoint, BotRuntimeStatus, TradingSnapshot } from "@/lib/firestore";

export function parseBalanceHistory(data: unknown): BalanceHistoryPoint[] {
  if (!Array.isArray(data)) return [];
  const points: BalanceHistoryPoint[] = [];
  for (const item of data) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const at = toDate(row.at);
    if (!at) continue;
    points.push({ balance: Number(row.balance) || 0, at });
  }
  return points;
}

function numOrNull(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function parseBotRuntimeStatus(data: unknown): BotRuntimeStatus | null {
  if (!data || typeof data !== "object") return null;
  const s = data as Record<string, unknown>;
  const symbol = typeof s.symbol === "string" ? s.symbol : "";
  if (!symbol) return null;

  return {
    botName: typeof s.botName === "string" ? s.botName : undefined,
    symbol,
    serverTime: typeof s.serverTime === "string" ? s.serverTime : undefined,
    todayPnl: Number(s.todayPnl) || 0,
    dayTarget: Number(s.dayTarget) || 0,
    floatingPnl: Number(s.floatingPnl) || 0,
    marketOpen: s.marketOpen !== false,
    marketBlockReason:
      typeof s.marketBlockReason === "string" && s.marketBlockReason
        ? s.marketBlockReason
        : undefined,
    emaPeriod: s.emaPeriod !== undefined ? Number(s.emaPeriod) : undefined,
    emaValue: numOrNull(s.emaValue),
    emaDistancePips: numOrNull(s.emaDistancePips),
    emaSlopePips: numOrNull(s.emaSlopePips),
    emaTrend: typeof s.emaTrend === "string" ? s.emaTrend : null,
    buyFilter: typeof s.buyFilter === "string" ? s.buyFilter : null,
    sellFilter: typeof s.sellFilter === "string" ? s.sellFilter : null,
    buyPositions: Number(s.buyPositions) || 0,
    sellPositions: Number(s.sellPositions) || 0,
    buyLots: Number(s.buyLots) || 0,
    sellLots: Number(s.sellLots) || 0,
    buyAvgEntry: numOrNull(s.buyAvgEntry),
    sellAvgEntry: numOrNull(s.sellAvgEntry),
    buyPnl: Number(s.buyPnl) || 0,
    sellPnl: Number(s.sellPnl) || 0,
    buySlArmed: Boolean(s.buySlArmed),
    sellSlArmed: Boolean(s.sellSlArmed),
    buyHedgeOverride: Boolean(s.buyHedgeOverride),
    sellHedgeOverride: Boolean(s.sellHedgeOverride),
  };
}

export function parseTradingSnapshot(data: unknown): TradingSnapshot | null {
  if (!data || typeof data !== "object") return null;
  const s = data as Record<string, unknown>;
  const updated = toDate(s.updatedAt);
  if (!updated) return null;
  return {
    balance: Number(s.balance) || 0,
    equity: Number(s.equity) || 0,
    profit: Number(s.profit) || 0,
    currency: (s.currency as string) || "USD",
    server: (s.server as string) || undefined,
    maxFloatingLoss:
      s.maxFloatingLoss !== undefined && s.maxFloatingLoss !== null
        ? Number(s.maxFloatingLoss)
        : undefined,
    balanceHistory: parseBalanceHistory(s.balanceHistory),
    botStatus: parseBotRuntimeStatus(s.botStatus),
    updatedAt: updated,
  };
}

function botStatusFingerprint(status: BotRuntimeStatus | null | undefined): string {
  if (!status) return "";
  return JSON.stringify(status);
}

export function botStatusChanged(
  prev: BotRuntimeStatus | null | undefined,
  next: BotRuntimeStatus | null | undefined,
): boolean {
  return botStatusFingerprint(prev) !== botStatusFingerprint(next);
}

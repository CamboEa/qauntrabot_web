import { NextRequest, NextResponse } from "next/server";
import {
  getSubscriptionByLicenseKey,
  getUserProfile,
  updateTradingSnapshot,
} from "@/lib/firestore-api";
import { normalizeLicenseKey, verifyLicenseForAccount } from "@/lib/license-verify";
import { normalizeMtAccountNumber } from "@/lib/mt-account";
import { parseBotRuntimeStatus } from "@/lib/trading-snapshot-parse";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

type ReportBody = {
  licenseKey?: string;
  account?: string;
  balance?: number;
  equity?: number;
  profit?: number;
  currency?: string;
  server?: string;
  maxFloatingLoss?: number;
  botStatus?: Record<string, unknown>;
};

/** MT5 EA reports live balance/equity (same auth as license verify). */
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limit = checkRateLimit(`trading-report:${ip}`, 300, 60_000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
      );
    }

    const body = (await req.json()) as ReportBody;
    const key = normalizeLicenseKey(body.licenseKey ?? "");
    const account = normalizeMtAccountNumber(body.account ?? "");

    if (!key || !account) {
      return NextResponse.json({ error: "licenseKey and account are required" }, { status: 400 });
    }

    const subscription = await getSubscriptionByLicenseKey(key);
    const profile = subscription ? await getUserProfile(subscription.uid) : null;
    const check = verifyLicenseForAccount(subscription, profile, account);

    if (!check.valid) {
      return NextResponse.json(
        { ok: false, code: check.code, message: check.message },
        { status: 403 },
      );
    }

    const balance = Number(body.balance);
    const equity = Number(body.equity);
    if (!Number.isFinite(balance) || !Number.isFinite(equity)) {
      return NextResponse.json({ error: "balance and equity must be numbers" }, { status: 400 });
    }

    const maxFloatingLoss = Number(body.maxFloatingLoss);
    const botStatus = body.botStatus ? parseBotRuntimeStatus(body.botStatus) : null;
    await updateTradingSnapshot(subscription!.uid, {
      balance,
      equity,
      profit: Number.isFinite(Number(body.profit)) ? Number(body.profit) : 0,
      currency: (body.currency ?? "USD").trim().slice(0, 8) || "USD",
      server: body.server?.trim().slice(0, 120),
      maxFloatingLoss: Number.isFinite(maxFloatingLoss) ? maxFloatingLoss : undefined,
      botStatus: botStatus ?? undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[trading/report POST]", err);
    return NextResponse.json({ error: "Failed to save trading stats" }, { status: 500 });
  }
}

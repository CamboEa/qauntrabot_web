import { NextRequest, NextResponse } from "next/server";
import {
  getSubscriptionByLicenseKey,
  getUserProfile,
} from "@/lib/firestore-api";
import {
  normalizeLicenseKey,
  verifyLicenseForAccount,
} from "@/lib/license-verify";
import { normalizeMtAccountNumber } from "@/lib/mt-account";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

type VerifyBody = {
  licenseKey?: string;
  account?: string;
};

function readParams(req: NextRequest): { licenseKey: string; account: string } {
  const fromQuery = {
    licenseKey: req.nextUrl.searchParams.get("licenseKey") ?? req.nextUrl.searchParams.get("key") ?? "",
    account: req.nextUrl.searchParams.get("account") ?? "",
  };
  return {
    licenseKey: fromQuery.licenseKey,
    account: fromQuery.account,
  };
}

async function verify(licenseKey: string, account: string) {
  const key = normalizeLicenseKey(licenseKey);
  const accountNorm = normalizeMtAccountNumber(account);

  if (!key) {
    return NextResponse.json(
      {
        valid: false,
        code: "INVALID_KEY",
        message: "licenseKey is required.",
        expiresAt: null,
        licensedAccount: null,
      },
      { status: 400 },
    );
  }

  if (!accountNorm) {
    return NextResponse.json(
      {
        valid: false,
        code: "ACCOUNT_MISMATCH",
        message: "account is required (MT login number).",
        expiresAt: null,
        licensedAccount: null,
      },
      { status: 400 },
    );
  }

  const subscription = await getSubscriptionByLicenseKey(key);
  const profile = subscription
    ? await getUserProfile(subscription.uid)
    : null;

  const result = verifyLicenseForAccount(subscription, profile, accountNorm);
  const status = result.valid ? 200 : 403;

  return NextResponse.json(result, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function rateLimited(req: NextRequest): NextResponse | null {
  const ip = getClientIp(req);
  const limit = checkRateLimit(`license-verify:${ip}`, 60, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }
  return null;
}

/** License check for Expert Advisors — locked to registered MT account + active subscription. */
export async function GET(req: NextRequest) {
  try {
    const blocked = rateLimited(req);
    if (blocked) return blocked;
    const { licenseKey, account } = readParams(req);
    return await verify(licenseKey, account);
  } catch (err) {
    console.error("[license/verify GET]", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const blocked = rateLimited(req);
    if (blocked) return blocked;
    let licenseKey = "";
    let account = "";

    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const body = (await req.json()) as VerifyBody;
      licenseKey = body.licenseKey ?? "";
      account = body.account ?? "";
    } else {
      const form = await req.formData();
      licenseKey = String(form.get("licenseKey") ?? form.get("key") ?? "");
      account = String(form.get("account") ?? "");
    }

    if (!licenseKey && !account) {
      const q = readParams(req);
      licenseKey = q.licenseKey;
      account = q.account;
    }

    return await verify(licenseKey, account);
  } catch (err) {
    console.error("[license/verify POST]", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

import { isSubscriptionActive } from "./subscription-plans";
import { normalizeMtAccountNumber, resolveMtAccountNumber } from "./mt-account";
import type { Subscription, UserProfile } from "./firestore";

export type LicenseVerifyCode =
  | "OK"
  | "INVALID_KEY"
  | "SUBSCRIPTION_INACTIVE"
  | "ACCOUNT_MISMATCH"
  | "NO_MT_ACCOUNT";

export type LicenseVerifyResult = {
  valid: boolean;
  code: LicenseVerifyCode;
  message: string;
  expiresAt: string | null;
  licensedAccount: string | null;
};

export function normalizeLicenseKey(value: string): string {
  return value.trim().toUpperCase();
}

export function verifyLicenseForAccount(
  subscription: Subscription | null,
  profile: UserProfile | null,
  accountNumber: string,
): LicenseVerifyResult {
  const account = normalizeMtAccountNumber(accountNumber);

  if (!subscription) {
    return {
      valid: false,
      code: "INVALID_KEY",
      message: "This license key was not found. Check Dashboard → License on the website.",
      expiresAt: null,
      licensedAccount: null,
    };
  }

  if (subscription.status === "cancelled") {
    return {
      valid: false,
      code: "SUBSCRIPTION_INACTIVE",
      message: "Your subscription was cancelled. Renew to restore access.",
      expiresAt: subscription.validUntil?.toISOString() ?? null,
      licensedAccount: null,
    };
  }

  if (!isSubscriptionActive(subscription.validUntil, subscription.status)) {
    return {
      valid: false,
      code: "SUBSCRIPTION_INACTIVE",
      message: "Your subscription has expired. Renew to restore access.",
      expiresAt: subscription.validUntil?.toISOString() ?? null,
      licensedAccount: null,
    };
  }

  const licensedAccount = resolveMtAccountNumber(
    subscription.mtAccountNumber,
    profile?.mtAccountNumber,
  );

  if (!licensedAccount) {
    return {
      valid: false,
      code: "NO_MT_ACCOUNT",
      message: "No MetaTrader account linked to this license.",
      expiresAt: subscription.validUntil?.toISOString() ?? null,
      licensedAccount: null,
    };
  }

  if (!account) {
    return {
      valid: false,
      code: "ACCOUNT_MISMATCH",
      message: "Could not read MT account number from terminal.",
      expiresAt: subscription.validUntil?.toISOString() ?? null,
      licensedAccount,
    };
  }

  if (account !== licensedAccount) {
    return {
      valid: false,
      code: "ACCOUNT_MISMATCH",
      message: `Wrong account. Licensed: ${licensedAccount}. This MT login: ${account}.`,
      expiresAt: subscription.validUntil?.toISOString() ?? null,
      licensedAccount,
    };
  }

  return {
    valid: true,
    code: "OK",
    message: "License valid for this account.",
    expiresAt: subscription.validUntil?.toISOString() ?? null,
    licensedAccount,
  };
}

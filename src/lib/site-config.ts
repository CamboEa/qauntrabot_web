/** Set to true when the Live Results (/performance) page is ready to ship. */
export const SHOW_LIVE_RESULTS_PAGE = false;

/** Public site origin (no trailing slash). Override with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://qauntra-bot.vercel.app"
).replace(/\/$/, "");

/** EA license check endpoint — use as InpLicenseApiUrl in MetaTrader inputs. */
export const LICENSE_VERIFY_URL = `${SITE_URL}/api/license/verify`;

/** EA balance sync endpoint (POST from MT5). */
export const TRADING_REPORT_URL = `${SITE_URL}/api/trading/report`;

/** Host only — add to MT5 WebRequest allow list (Tools → Options → Expert Advisors). */
export const SITE_HOST = new URL(SITE_URL).host;

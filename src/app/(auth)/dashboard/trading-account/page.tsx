import DashboardTradingAccount from "@/components/dashboard/pages/DashboardTradingAccount";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Trading account",
  description: "View your linked MetaTrader account number and platform.",
  path: "/dashboard/trading-account",
  noIndex: true,
});

export default function TradingAccountPage() {
  return <DashboardTradingAccount />;
}

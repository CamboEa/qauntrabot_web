import type { Metadata } from "next";
import DashboardTradingAccount from "@/components/dashboard/pages/DashboardTradingAccount";

export const metadata: Metadata = {
  title: "Trading account — Dashboard — QauntraBot",
  description: "View your linked MetaTrader account number and platform.",
};

export default function TradingAccountPage() {
  return <DashboardTradingAccount />;
}

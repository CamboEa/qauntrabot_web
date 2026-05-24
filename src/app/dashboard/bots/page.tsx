import type { Metadata } from "next";
import DashboardBots from "@/components/dashboard/pages/DashboardBots";

export const metadata: Metadata = {
  title: "My bots — Dashboard — QauntraBot",
  description: "Download and manage your Expert Advisors.",
};

export default function DashboardBotsPage() {
  return <DashboardBots />;
}

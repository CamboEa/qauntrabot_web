import type { Metadata } from "next";
import DashboardSetup from "@/components/dashboard/pages/DashboardSetup";

export const metadata: Metadata = {
  title: "Quick setup — Dashboard — QauntraBot",
  description: "How to install and run your QauntraBot Expert Advisors.",
};

export default function DashboardSetupPage() {
  return <DashboardSetup />;
}

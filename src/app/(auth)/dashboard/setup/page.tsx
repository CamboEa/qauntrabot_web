import DashboardSetup from "@/components/dashboard/pages/DashboardSetup";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Quick setup",
  description: "How to install and run your QauntraBot Expert Advisors.",
  path: "/dashboard/setup",
  noIndex: true,
});

export default function DashboardSetupPage() {
  return <DashboardSetup />;
}

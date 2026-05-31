import DashboardBots from "@/components/dashboard/pages/DashboardBots";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "My bots",
  description: "Download and manage your Expert Advisors.",
  path: "/dashboard/bots",
  noIndex: true,
});

export default function DashboardBotsPage() {
  return <DashboardBots />;
}

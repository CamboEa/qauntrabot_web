import DashboardLicense from "@/components/dashboard/pages/DashboardLicense";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "License key",
  description: "Your QauntraBot EA license key.",
  path: "/dashboard/license",
  noIndex: true,
});

export default function LicensePage() {
  return <DashboardLicense />;
}

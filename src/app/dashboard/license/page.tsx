import type { Metadata } from "next";
import DashboardLicense from "@/components/dashboard/pages/DashboardLicense";

export const metadata: Metadata = {
  title: "License key — Dashboard — QauntraBot",
  description: "Your QauntraBot EA license key.",
};

export default function LicensePage() {
  return <DashboardLicense />;
}

import DashboardCreateEA from "@/components/dashboard/pages/DashboardCreateEA";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Create your EA",
  description: "Answer a few questions and AI will design a custom Expert Advisor specification for you.",
  path: "/dashboard/create-ea",
  noIndex: true,
});

export default function DashboardCreateEAPage() {
  return <DashboardCreateEA />;
}

import PageWrapper from "@/components/layout/PageWrapper";
import RegistrationSection from "@/components/sections/RegistrationSection";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Get Access",
  description: "Create your QauntraBot account and access licensed Expert Advisors.",
  path: "/register",
});

export default function RegisterPage() {
  return (
    <PageWrapper
      hero={{
        eyebrow: "Secure Portal",
        title: "Get",
        accent: "access.",
        description: "Create an account to manage licenses, download builds, and deploy your Expert Advisors.",
      }}
    >
      <RegistrationSection hideHeader />
    </PageWrapper>
  );
}

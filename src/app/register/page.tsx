import type { Metadata } from "next";
import PageWrapper from "@/components/layout/PageWrapper";
import RegistrationSection from "@/components/sections/RegistrationSection";

export const metadata: Metadata = {
  title: "Get Access — QauntraBot",
  description: "Create your QauntraBot account and access licensed Expert Advisors.",
};

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

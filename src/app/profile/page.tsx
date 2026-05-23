import type { Metadata } from "next";
import PageWrapper from "@/components/layout/PageWrapper";
import ProfileView from "@/components/profile/ProfileView";

export const metadata: Metadata = {
  title: "Profile — QauntraBot",
  description: "Manage your QauntraBot account and subscription.",
};

export default function ProfilePage() {
  return (
    <PageWrapper
      hero={{
        eyebrow: "Your account",
        title: "Profile",
        accent: "& subscription.",
        description: "Account details, license key, and subscription status.",
      }}
    >
      <ProfileView />
    </PageWrapper>
  );
}

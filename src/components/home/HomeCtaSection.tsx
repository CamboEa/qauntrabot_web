"use client";

import Image from "next/image";
import PageCtaBand from "@/components/shared/PageCtaBand";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function HomeCtaSection() {
  return (
    <ScrollReveal variant="scale" delay={0} duration={800}>
      <PageCtaBand
        title="Ready to automate?"
        description="7-day money-back · No performance fees"
        icon={
          <Image src="/logo/logo.png" alt="" width={32} height={32} className="object-contain" aria-hidden />
        }
        secondary={{ label: "View Plans", href: "/pricing" }}
        primary={{ label: "Get Access", href: "/register" }}
      />
    </ScrollReveal>
  );
}

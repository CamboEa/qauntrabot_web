import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import KpiBarSection from "@/components/sections/KpiBarSection";
import WeeklyGainSection from "@/components/sections/WeeklyGainSection";
import HomePerformanceSection from "@/components/sections/HomePerformanceSection";
import HomeFeaturesSection from "@/components/sections/HomeFeaturesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import EmailPlaybookSection from "@/components/sections/EmailPlaybookSection";
import SleepCtaSection from "@/components/sections/SleepCtaSection";

const HomeBacktestSection = dynamic(() => import("@/components/home/HomeBacktestSection"));
const HomeBotsSection = dynamic(() => import("@/components/home/HomeBotsSection"));

export default function Home() {
  return (
    <>
      <Navbar authNav={false} />
      <main className="flex-1">
        <HeroSection />
        <KpiBarSection />
        <WeeklyGainSection />
        <HomePerformanceSection />
        <HomeBotsSection />
        <HomeFeaturesSection />
        <HomeBacktestSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <EmailPlaybookSection />
        <SleepCtaSection />
      </main>
      <Footer />
    </>
  );
}

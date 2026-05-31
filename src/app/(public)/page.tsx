import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import WeeklyGainSection from "@/components/sections/WeeklyGainSection";

const HomeBacktestSection = dynamic(() => import("@/components/home/HomeBacktestSection"));
const HomeExploreSection = dynamic(() => import("@/components/home/HomeExploreSection"));
const HomeCtaSection = dynamic(() => import("@/components/home/HomeCtaSection"));

export default function Home() {
  return (
    <>
      <Navbar authNav={false} />
      <main className="flex-1">
        <HeroSection />
        <WeeklyGainSection />
        <HomeBacktestSection />
        <HomeExploreSection />
        <HomeCtaSection />
      </main>
      <Footer />
    </>
  );
}

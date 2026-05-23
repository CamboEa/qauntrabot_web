import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import WeeklyGainSection from "@/components/sections/WeeklyGainSection";
import HomeExploreSection from "@/components/home/HomeExploreSection";
import HomeCtaSection from "@/components/home/HomeCtaSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <WeeklyGainSection />
        <HomeExploreSection />
        <HomeCtaSection />
      </main>
      <Footer />
    </>
  );
}

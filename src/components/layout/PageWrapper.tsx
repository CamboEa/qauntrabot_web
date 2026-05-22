import Navbar from "./Navbar";
import Footer from "./Footer";
import PageHero, { type PageHeroProps } from "@/components/shared/PageHero";

type PageWrapperProps = {
  children: React.ReactNode;
  hero?: PageHeroProps;
};

export default function PageWrapper({ children, hero }: PageWrapperProps) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[4.5rem] md:pt-24 bg-background">
        {hero && <PageHero {...hero} />}
        {children}
      </main>
      <Footer />
    </>
  );
}

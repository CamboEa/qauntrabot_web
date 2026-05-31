import Navbar from "./Navbar";
import Footer from "./Footer";
import PageHero, { type PageHeroProps } from "@/components/shared/PageHero";

type PageWrapperProps = {
  children: React.ReactNode;
  hero?: PageHeroProps;
  /** When false, navbar uses static sign-in links (no Firebase on marketing pages). */
  authNav?: boolean;
};

export default function PageWrapper({ children, hero, authNav = true }: PageWrapperProps) {
  return (
    <>
      <Navbar authNav={authNav} />
      <main className="flex-1 pt-[4.5rem] md:pt-24 bg-background">
        {hero && <PageHero {...hero} />}
        {children}
      </main>
      <Footer />
    </>
  );
}

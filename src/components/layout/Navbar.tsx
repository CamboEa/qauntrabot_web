"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import UserNavMenu from "./UserNavMenu";
import { SHOW_LIVE_RESULTS_PAGE } from "@/lib/site-config";

const NAV_LINKS = [
  { label: "Bots", href: "/bots" },
  { label: "Features", href: "/features" },
  ...(SHOW_LIVE_RESULTS_PAGE ? [{ label: "Live Results", href: "/performance" }] : []),
  { label: "Pricing", href: "/pricing" },
  { label: "FAQs", href: "/faqs" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4 md:px-6">
      <nav
        className={`mx-auto max-w-7xl transition-all duration-300 rounded-2xl border ${
          scrolled
            ? "bg-card/98 backdrop-blur-xl border-border shadow-[0_8px_32px_rgba(11,31,61,0.08)]"
            : "bg-card/90 backdrop-blur-lg border-border/80"
        }`}
      >
        <div className="flex items-center justify-between h-[3.25rem] sm:h-14 px-4 md:px-5">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 cursor-pointer min-w-0">
            <Image
              src="/logo/logo.png"
              alt="QauntraBot"
              width={34}
              height={34}
              className="object-contain shrink-0"
              priority
            />
            <span className="font-display text-base sm:text-lg font-bold text-foreground tracking-tight truncate">
              QauntraBot
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={label}
                  href={href}
                  className={`nav-link cursor-pointer ${active ? "nav-link-active" : ""}`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <UserNavMenu />
          </div>

          <button
            type="button"
            className="lg:hidden flex flex-col justify-center gap-1.5 p-2.5 -mr-1 text-foreground cursor-pointer rounded-xl hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span className={`block h-0.5 w-5 bg-foreground transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-[5px]" : ""}`} />
            <span className={`block h-0.5 w-5 bg-foreground transition-all duration-300 ${mobileOpen ? "opacity-0 scale-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-foreground transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[5px]" : ""}`} />
          </button>
        </div>

        <div
          className={`lg:hidden grid transition-all duration-300 ease-out ${mobileOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        >
          <div className="overflow-hidden">
            <div className="border-t border-border px-4 py-5 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={label}
                    href={href}
                    className={`rounded-xl px-4 py-3 text-sm font-medium cursor-pointer transition-colors ${
                      active
                        ? "bg-primary/8 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
              <div className="mt-4 pt-4 border-t border-border">
                <UserNavMenu mobile />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

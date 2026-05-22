import Image from "next/image";
import Link from "next/link";

const LINKS = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Live Results", href: "/performance" },
    { label: "Pricing", href: "/pricing" },
    { label: "Bots", href: "/bots" },
  ],
  Support: [
    { label: "FAQs", href: "/faqs" },
    { label: "Get Access", href: "/register" },
  ],
  Legal: ["Terms of Service", "Privacy Policy", "Risk Disclosure", "Refund Policy"],
};

export default function Footer() {
  return (
    <footer className="section-navy section-y-sm">
      <div className="container-site stack-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-10">
          <div className="col-span-2 lg:col-span-2 stack-4">
            <Link href="/" className="flex items-center gap-3 w-fit cursor-pointer">
              <Image src="/logo/logo.png" alt="QauntraBot" width={32} height={32} className="object-contain" />
              <span className="font-display text-lg font-bold text-primary-foreground">QauntraBot</span>
            </Link>
            <p className="text-sm text-primary-foreground/55 leading-relaxed max-w-sm">
              Institutional-grade algorithmic trading for precision, consistency, and capital preservation.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-primary-foreground/45 font-data">
              {["Secure Checkout", "Encrypted Delivery", "24/7 Support"].map((label) => (
                <span key={label} className="inline-flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-profit" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group} className="stack-3">
              <h4 className="text-xs font-bold text-primary-foreground/80 uppercase tracking-wider font-data">{group}</h4>
              <ul className="stack-2">
                {links.map((link) => {
                  const label = typeof link === "string" ? link : link.label;
                  const href = typeof link === "string" ? "#" : link.href;
                  return (
                    <li key={label}>
                      {href !== "#" ? (
                        <Link href={href} className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors cursor-pointer">
                          {label}
                        </Link>
                      ) : (
                        <span className="text-sm text-primary-foreground/35">{label}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-5 stack-2">
          <h5 className="text-xs font-bold text-primary-foreground/70 uppercase tracking-wider font-data">Risk Disclosure</h5>
          <p className="text-sm text-primary-foreground/45 leading-relaxed">
            Trading carries significant risk. Past performance is not indicative of future results. QauntraBot does not provide investment advice.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10 text-xs text-primary-foreground/40 font-data">
          <p>© {new Date().getFullYear()} QauntraBot Technologies</p>
          <span className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-profit" />
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}

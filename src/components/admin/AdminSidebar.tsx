"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  Users,
  CreditCard,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { signOut } from "@/lib/auth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/bots", label: "Bots", icon: Bot },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
  };

  return (
    <aside className="w-full lg:w-60 shrink-0 bg-primary text-primary-foreground flex flex-col min-h-screen lg:min-h-0 lg:sticky lg:top-0 lg:h-screen">
      <div className="p-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Image src="/logo/logo.png" alt="" width={28} height={28} className="rounded-md" />
          <div>
            <p className="font-display font-bold text-sm leading-none">QauntraBot</p>
            <p className="text-[0.65rem] text-primary-foreground/50 font-data uppercase tracking-wider mt-0.5">
              Admin
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 stack-2">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                active
                  ? "bg-primary-foreground/15 text-primary-foreground"
                  : "text-primary-foreground/60 hover:bg-primary-foreground/8 hover:text-primary-foreground"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10 stack-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/8 transition-colors cursor-pointer"
        >
          <ExternalLink size={18} />
          View site
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/8 transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}

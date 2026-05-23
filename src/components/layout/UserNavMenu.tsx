"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, LayoutDashboard, Bot, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/auth";

function userInitials(email: string): string {
  const part = email.split("@")[0] ?? "U";
  return part.slice(0, 2).toUpperCase();
}

function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

export default function UserNavMenu({ mobile = false }: { mobile?: boolean }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  if (loading) {
    return (
      <div
        className={`${mobile ? "w-full" : ""} h-10 w-10 rounded-full bg-secondary animate-pulse shrink-0`}
        aria-hidden
      />
    );
  }

  if (!user) {
    if (mobile) {
      return (
        <div className="flex flex-col gap-2">
          <Link
            href="/register"
            className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary cursor-pointer text-center"
          >
            Sign In
          </Link>
          <Link href="/register" className="btn-primary-brand w-full justify-center">
            Get Access
          </Link>
        </div>
      );
    }
    return (
      <>
        <Link href="/register" className="nav-link cursor-pointer">
          Sign In
        </Link>
        <Link href="/register" className="btn-primary-brand text-sm !py-2.5 !px-5">
          Get Access
        </Link>
      </>
    );
  }

  const email = user.email ?? profile?.email ?? "";
  const admin = isAdminEmail(email);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    router.push("/");
  };

  if (mobile) {
    return (
      <div className="flex flex-col gap-1">
        <Link
          href="/profile"
          className="rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary cursor-pointer flex items-center gap-2"
        >
          <User size={18} />
          Profile
        </Link>
        <Link
          href="/bots"
          className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary cursor-pointer flex items-center gap-2"
        >
          <Bot size={18} />
          Browse bots
        </Link>
        {admin && (
          <Link
            href="/admin"
            className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary cursor-pointer flex items-center gap-2"
          >
            <LayoutDashboard size={18} />
            Admin
          </Link>
        )}
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-xl px-4 py-3 text-sm font-medium text-loss hover:bg-loss/10 cursor-pointer flex items-center gap-2 text-left"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-border bg-secondary/80 pl-1 pr-2.5 py-1 hover:border-primary/30 hover:bg-secondary transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-data font-semibold">
          {userInitials(email)}
        </span>
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+0.5rem)] min-w-[12rem] rounded-xl border border-border bg-card shadow-[0_12px_40px_rgba(11,31,61,0.12)] py-1 z-50"
          role="menu"
        >
          <div className="px-3 py-2 border-b border-border">
            <p className="text-xs font-data text-muted-foreground truncate max-w-[11rem]">{email}</p>
          </div>
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-secondary cursor-pointer"
          >
            <User size={16} />
            Profile
          </Link>
          <Link
            href="/bots"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
          >
            <Bot size={16} />
            Browse bots
          </Link>
          {admin && (
            <Link
              href="/admin"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
            >
              <LayoutDashboard size={16} />
              Admin
            </Link>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-loss hover:bg-loss/10 cursor-pointer text-left"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

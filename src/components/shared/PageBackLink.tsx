import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type PageBackLinkProps = {
  href: string;
  label: string;
  className?: string;
};

export default function PageBackLink({ href, label, className = "" }: PageBackLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-data cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:rounded-lg ${className}`}
    >
      <ArrowLeft size={16} aria-hidden />
      {label}
    </Link>
  );
}

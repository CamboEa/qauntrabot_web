import type { ReactNode } from "react";

type Variant = "cream" | "alt" | "white";

const VARIANT_CLASS: Record<Variant, string> = {
  cream: "section-cream",
  alt: "section-alt",
  white: "section-white",
};

type PageSectionProps = {
  id?: string;
  variant?: Variant;
  /** When true, sits under PageHero — uses tighter top padding */
  underHero?: boolean;
  /** Full section padding when no page hero */
  standalone?: boolean;
  narrow?: boolean;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
};

export default function PageSection({
  id,
  variant = "cream",
  underHero = false,
  standalone = false,
  narrow = false,
  className = "",
  containerClassName = "",
  children,
}: PageSectionProps) {
  const spacing = underHero ? "page-body-y" : standalone ? "section-y" : "page-body-y";

  return (
    <section id={id} className={`${VARIANT_CLASS[variant]} ${spacing} ${className}`}>
      <div
        className={[
          "container-site stack-6",
          narrow ? "max-w-3xl" : "",
          narrow ? "mx-auto" : "",
          containerClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </section>
  );
}

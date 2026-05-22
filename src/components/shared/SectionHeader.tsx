import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  eyebrowDot?: boolean;
  title: ReactNode;
  accent?: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  eyebrowDot,
  title,
  accent,
  description,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div className={`stack-3 ${centered ? "items-center text-center" : ""} ${className}`}>
      {eyebrow && (
        <span className="eyebrow">
          {eyebrowDot && <span className="w-1.5 h-1.5 rounded-full bg-profit shrink-0" />}
          {eyebrow}
        </span>
      )}
      <h2 className={`section-title ${centered ? "max-w-2xl" : ""}`}>
        {title}
        {accent && (
          <>
            <br />
            <span className="section-title-accent">{accent}</span>
          </>
        )}
      </h2>
      {description && (
        <p
          className={`text-base text-muted-foreground leading-relaxed max-w-xl ${
            centered ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

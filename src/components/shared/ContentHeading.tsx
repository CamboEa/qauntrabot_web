import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type ContentHeadingProps = {
  icon?: LucideIcon;
  children: ReactNode;
  as?: "h2" | "h3";
  className?: string;
};

export default function ContentHeading({
  icon: Icon,
  children,
  as: Tag = "h2",
  className = "",
}: ContentHeadingProps) {
  return (
    <Tag className={`content-heading ${className}`}>
      {Icon && <Icon size={20} className="text-primary shrink-0" strokeWidth={1.75} />}
      {children}
    </Tag>
  );
}

import type { LucideIcon } from "lucide-react";

type IconTileProps = {
  icon: LucideIcon;
  size?: number;
  className?: string;
};

export default function IconTile({ icon: Icon, size = 20, className = "" }: IconTileProps) {
  return (
    <div
      className={`icon-tile shrink-0 ${className}`}
      aria-hidden
    >
      <Icon size={size} className="text-primary" strokeWidth={1.75} />
    </div>
  );
}

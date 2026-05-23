type StatCardProps = {
  label: string;
  value: string;
  valueClassName?: string;
  compact?: boolean;
};

export default function StatCard({
  label,
  value,
  valueClassName = "text-foreground",
  compact = false,
}: StatCardProps) {
  return (
    <div className={`card-surface card-pad ${compact ? "text-center" : "stack-2"}`}>
      <p className="stat-label">{label}</p>
      <p className={`stat-value ${compact ? "text-lg md:text-xl" : ""} ${valueClassName}`}>
        {value}
      </p>
    </div>
  );
}

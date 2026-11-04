import { cn } from "@/lib/utils";

export function Progress({
  value,
  max = 100,
  className,
  barClassName,
}: {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemax={max}
      className={cn(
        "h-3 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10",
        className,
      )}
    >
      <div
        className={cn("h-full lumen-aurora transition-all duration-700", barClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function StreakBadge({ count }: { count: number }) {
  const heat =
    count >= 100
      ? "from-rose-500 via-fuchsia-500 to-violet-500"
      : count >= 30
        ? "from-orange-500 via-rose-500 to-fuchsia-500"
        : count >= 7
          ? "from-amber-400 to-rose-500"
          : "from-amber-300 to-orange-400";
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium bg-gradient-to-br text-white shadow-md",
        heat,
      )}
    >
      <Flame className="h-3.5 w-3.5" />
      {count} day{count === 1 ? "" : "s"}
    </div>
  );
}

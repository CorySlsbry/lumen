import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  gradient,
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
        gradient
          ? `bg-gradient-to-br ${gradient} text-white`
          : "bg-black/5 text-current dark:bg-white/10",
        className,
      )}
    >
      {children}
    </span>
  );
}

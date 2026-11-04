import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-2xl border border-black/10 bg-white/80 px-4 text-base placeholder:text-current/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/60 dark:bg-white/5 dark:border-white/10",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

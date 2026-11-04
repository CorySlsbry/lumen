import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "lumen-aurora text-white shadow-lg shadow-fuchsia-500/20 hover:brightness-110 focus-visible:ring-fuchsia-500",
        secondary:
          "bg-white/10 backdrop-blur text-current border border-white/15 hover:bg-white/20",
        ghost: "hover:bg-black/5 dark:hover:bg-white/5",
        outline: "border border-current/30 hover:bg-current/5",
        destructive: "bg-rose-600 text-white hover:bg-rose-500",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-base",
        lg: "h-14 px-7 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

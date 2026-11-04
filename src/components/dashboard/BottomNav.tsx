"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Target, Sparkles, Moon, User } from "lucide-react";

const TABS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/goals", label: "Goals", icon: Target },
  { href: "/dashboard/tarot", label: "Tarot", icon: Sparkles },
  { href: "/dashboard/horoscope", label: "Sky", icon: Moon },
  { href: "/dashboard/profile", label: "Me", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="lumen-bottom-nav fixed bottom-0 inset-x-0 z-30 border-t border-white/10 bg-black/40 backdrop-blur-xl">
      <ul className="grid grid-cols-5 max-w-md mx-auto">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-3 text-xs transition-colors",
                  active ? "text-white" : "text-white/50 hover:text-white/80",
                )}
              >
                <Icon className={cn("h-5 w-5", active && "text-fuchsia-300")} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

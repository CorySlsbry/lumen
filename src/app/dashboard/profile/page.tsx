import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronRight, Bell, Shield, CreditCard, Users, LogOut, Sparkles } from "lucide-react";

const ROWS = [
  { href: "/dashboard/premium", icon: Sparkles, label: "Premium", badge: "Free" },
  { href: "/dashboard/family", icon: Users, label: "Household & members" },
  { href: "/dashboard/linked", icon: CreditCard, label: "Linked accounts" },
  { href: "/dashboard/notifications", icon: Bell, label: "Notifications" },
  { href: "/dashboard/security", icon: Shield, label: "Security & privacy" },
];

export default function ProfilePage() {
  return (
    <div className="px-5 pt-8 pb-8 space-y-6">
      <header className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full lumen-aurora grid place-items-center text-2xl font-bold">
          C
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold tracking-tight">Cory</h1>
          <p className="text-sm text-white/60">Recent grad · Aries</p>
        </div>
      </header>

      <Card className="bg-white/5 border-white/10 text-white overflow-hidden">
        <CardContent className="p-0">
          {ROWS.map((r) => {
            const Icon = r.icon;
            return (
              <Link
                key={r.href}
                href={r.href}
                className="flex items-center gap-3 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
              >
                <Icon className="h-5 w-5 text-white/60" />
                <span className="flex-1">{r.label}</span>
                {r.badge && <Badge>{r.badge}</Badge>}
                <ChevronRight className="h-4 w-4 text-white/40" />
              </Link>
            );
          })}
        </CardContent>
      </Card>

      <Button variant="ghost" className="w-full text-rose-300 hover:text-rose-200">
        <LogOut className="h-4 w-4" /> Sign out
      </Button>

      <p className="text-xs text-white/30 text-center">
        Lumen v0.1 · Phase 1 (Shadow Savings)
      </p>
    </div>
  );
}

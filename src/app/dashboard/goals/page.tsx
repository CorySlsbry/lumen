import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Target, Flame, Waves, ShoppingBag, Umbrella, Lock } from "lucide-react";
import { formatMoney } from "@/lib/utils";

const GOAL_TEMPLATES = [
  {
    kind: "rainy_day",
    title: "Rainy-day fund",
    icon: Umbrella,
    blurb: "1–3 months of expenses for the unexpected.",
    gradient: "from-amber-400 to-rose-500",
  },
  {
    kind: "debt_payoff",
    title: "Debt snowball / avalanche",
    icon: Flame,
    blurb: "Model both — we'll show which finishes faster.",
    gradient: "from-rose-500 to-fuchsia-500",
    premium: true,
  },
  {
    kind: "big_purchase",
    title: "Big purchase",
    icon: ShoppingBag,
    blurb: "Wedding, house, car — set a date, hit it.",
    gradient: "from-violet-500 to-indigo-500",
  },
  {
    kind: "freelance_smoothing",
    title: "Income smoother",
    icon: Waves,
    blurb: "Build a 3-month buffer for variable income months.",
    gradient: "from-sky-500 to-blue-500",
    premium: true,
  },
];

const ACTIVE = [
  {
    name: "First $1,000",
    currentCents: 23_700,
    targetCents: 100_000,
    kind: "rainy_day",
  },
];

export default function GoalsPage() {
  return (
    <div className="px-5 pt-8 pb-8 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/50 mb-1">
            Goals
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Your targets</h1>
        </div>
        <Button size="icon" variant="secondary">
          <Plus className="h-5 w-5" />
        </Button>
      </header>

      {/* Active */}
      {ACTIVE.map((g) => (
        <Card key={g.name} className="bg-white/5 border-white/10 text-white">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-300" />
                <h3 className="font-semibold">{g.name}</h3>
              </div>
              <Badge>{Math.round((g.currentCents / g.targetCents) * 100)}%</Badge>
            </div>
            <Progress value={g.currentCents} max={g.targetCents} />
            <div className="flex justify-between text-sm">
              <span className="font-bold tabular-nums">
                {formatMoney(g.currentCents)}
              </span>
              <span className="text-white/50 tabular-nums">
                of {formatMoney(g.targetCents)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Templates */}
      <div>
        <h2 className="text-sm uppercase tracking-widest text-white/50 mb-3">
          Add another
        </h2>
        <div className="grid gap-3">
          {GOAL_TEMPLATES.map((t) => {
            const Icon = t.icon;
            return (
              <Card key={t.kind} className="bg-white/5 border-white/10 text-white">
                <CardContent className="p-5 flex items-center gap-4">
                  <div
                    className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${t.gradient} grid place-items-center shrink-0`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{t.title}</h4>
                      {t.premium && <Lock className="h-3 w-3 text-white/40" />}
                    </div>
                    <p className="text-xs text-white/60">{t.blurb}</p>
                  </div>
                  <Button size="sm" variant="secondary" asChild>
                    <Link
                      href={t.premium ? "/dashboard/premium" : `/dashboard/goals/new?kind=${t.kind}`}
                    >
                      {t.premium ? "Premium" : "Start"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { SavingsTicker } from "@/components/dashboard/SavingsTicker";
import { StreakBadge } from "@/components/dashboard/StreakBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { drawReading } from "@/lib/tarot/reader";
import { generateWeeklyForecast, isoMonday } from "@/lib/horoscope/forecast";
import { ArrowRight, Moon, Sparkles, Target } from "lucide-react";
import { formatMoney } from "@/lib/utils";

/**
 * Dashboard home — server component rendering a mocked-user view for Phase 1.
 *
 * In production this would query the DB for the current user; for the demo we
 * inline a sample state so the entire UI renders without a logged-in account.
 */
export default function DashboardHome() {
  const today = new Date().toISOString().slice(0, 10);
  const userId = "demo-user";
  const reading = drawReading({
    userId,
    dateISO: today,
    spread: "daily_one_card",
  });
  const card = reading.cards[0];

  const week = isoMonday(new Date());
  const forecast = generateWeeklyForecast({ sign: "leo", weekStart: week });

  // Mock state
  const monthSavedCents = 3_847;
  const streak = 12;
  const goal = {
    name: "First $1,000",
    currentCents: 23_700,
    targetCents: 100_000,
  };

  return (
    <div className="px-5 pt-8 space-y-6">
      <header className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm text-white/50">Good evening,</p>
          <h1 className="text-2xl font-bold tracking-tight">Cory</h1>
        </div>
        <StreakBadge count={streak} />
      </header>

      <SavingsTicker targetCents={monthSavedCents} />

      {/* Active goal */}
      <Card className="bg-white/5 border-white/10 text-white">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-300" />
              <span className="text-sm font-medium">{goal.name}</span>
            </div>
            <Link
              href="/dashboard/goals"
              className="text-xs text-white/50 hover:text-white/80"
            >
              View all
            </Link>
          </div>
          <Progress value={goal.currentCents} max={goal.targetCents} />
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-bold tabular-nums">
              {formatMoney(goal.currentCents)}
            </span>
            <span className="text-white/50 tabular-nums">
              of {formatMoney(goal.targetCents)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Today's tarot */}
      <Link href="/dashboard/tarot">
        <Card className="bg-gradient-to-br from-violet-700/40 via-fuchsia-700/30 to-rose-700/30 border-white/15 text-white tarot-lift block cursor-pointer">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-fuchsia-200" />
                <span className="text-xs uppercase tracking-widest text-white/60">
                  Today&apos;s card
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-white/50" />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-5xl">{card.card.glyph}</div>
              <div>
                <div className="font-bold text-lg">
                  {card.card.name}
                  {card.reversed && (
                    <span className="ml-2 text-xs text-white/60">(reversed)</span>
                  )}
                </div>
                <div className="text-xs text-white/60">
                  {card.card.keywords.join(" · ")}
                </div>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed line-clamp-3">
              {reading.synthesis}
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* This week's sky */}
      <Link href="/dashboard/horoscope">
        <Card className="bg-gradient-to-br from-indigo-800/40 to-blue-800/30 border-white/15 text-white block cursor-pointer">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-indigo-200" />
                <span className="text-xs uppercase tracking-widest text-white/60">
                  This week
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-white/50" />
            </div>
            <h3 className="font-bold mb-2">{forecast.headline}</h3>
            <p className="text-sm text-white/80 leading-relaxed line-clamp-2">
              {forecast.body}
            </p>
            <div className="mt-3 text-xs text-white/50">
              Lucky day: {forecast.luckyDay}
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Premium nudge */}
      <Card className="bg-white/5 border-white/10 text-white">
        <CardContent className="p-5 flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Unlock weekly tarot spreads</div>
            <div className="text-xs text-white/60">
              + full birth chart, debt planner, family accounts
            </div>
          </div>
          <Button size="sm" asChild>
            <Link href="/dashboard/premium">Upgrade</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

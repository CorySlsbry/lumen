import { generateWeeklyForecast, isoMonday } from "@/lib/horoscope/forecast";
import { SIGNS, sunSign } from "@/lib/horoscope/zodiac";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Lock, Star, Moon, Sun } from "lucide-react";

export default function HoroscopePage() {
  // Demo: hardcoded birth date. Real: pull from user record.
  const birthDate = "1992-08-12";
  const sign = sunSign(birthDate);
  const meta = SIGNS[sign];
  const week = isoMonday(new Date());
  const forecast = generateWeeklyForecast({ sign, weekStart: week });
  const isPremium = false;

  return (
    <div className="px-5 pt-8 pb-8 space-y-6">
      <header>
        <p className="text-xs uppercase tracking-widest text-white/50 mb-1">
          The Sky
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          {meta.glyph} {meta.label}
        </h1>
        <p className="text-sm text-white/60 mt-1 italic">{meta.archetype}</p>
      </header>

      <Card className="bg-gradient-to-br from-indigo-800/40 via-blue-800/30 to-violet-800/30 border-white/15 text-white">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Badge gradient="from-indigo-500 to-violet-500">
              <Star className="h-3 w-3" /> {forecast.theme}
            </Badge>
            <span className="text-xs text-white/50">Week of {forecast.weekStart}</span>
          </div>
          <h2 className="text-2xl font-bold leading-tight">{forecast.headline}</h2>
          <p className="text-white/80 leading-relaxed">{forecast.body}</p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl bg-white/5 p-3">
              <div className="text-xs text-white/50 mb-0.5">Lucky day</div>
              <div className="font-semibold flex items-center gap-1.5">
                <Sun className="h-4 w-4 text-amber-300" /> {forecast.luckyDay}
              </div>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <div className="text-xs text-white/50 mb-0.5">Watch out for</div>
              <div className="text-sm">{forecast.watchOutFor}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isPremium && (
        <Card className="bg-white/5 border-white/10 text-white">
          <CardContent className="p-5 flex items-start gap-3">
            <Lock className="h-5 w-5 text-fuchsia-300 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">
                See your full birth chart
              </h3>
              <p className="text-sm text-white/60 mb-3">
                Moon sign, rising sign, and Mercury — all tuned to money decisions
                this week. Premium feature.
              </p>
              <Button size="sm" asChild>
                <Link href="/dashboard/premium">Unlock full chart</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white/5 border-white/10 text-white">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Moon className="h-4 w-4 text-indigo-300" />
            <span className="text-xs uppercase tracking-widest text-white/60">
              Element wisdom
            </span>
          </div>
          <p className="text-sm text-white/80">
            As a {meta.element} sign with {meta.modality} energy, your money pattern
            is: <strong className="text-white">{meta.archetype}</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

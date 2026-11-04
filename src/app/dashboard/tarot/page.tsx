"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { drawReading, type SpreadKind } from "@/lib/tarot/reader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Lock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function TarotPage() {
  const [spread, setSpread] = useState<SpreadKind>("daily_one_card");
  const today = new Date().toISOString().slice(0, 10);
  const reading = drawReading({ userId: "demo-user", dateISO: today, spread });
  const isPremiumSpread = spread === "three_card_past_present_future";
  const isPremium = false; // demo: replace with subscription check

  return (
    <div className="px-5 pt-8 pb-8 space-y-6">
      <header>
        <p className="text-xs uppercase tracking-widest text-white/50 mb-1">Tarot</p>
        <h1 className="text-3xl font-bold tracking-tight">Today&apos;s pull</h1>
      </header>

      <div className="flex gap-2">
        <button
          onClick={() => setSpread("daily_one_card")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-all",
            spread === "daily_one_card"
              ? "lumen-aurora text-white shadow"
              : "bg-white/10 text-white/70",
          )}
        >
          Daily
        </button>
        <button
          onClick={() => setSpread("three_card_past_present_future")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-all flex items-center gap-1.5",
            spread === "three_card_past_present_future"
              ? "lumen-aurora text-white shadow"
              : "bg-white/10 text-white/70",
          )}
        >
          Three-card {!isPremium && <Lock className="h-3 w-3" />}
        </button>
      </div>

      {isPremiumSpread && !isPremium ? (
        <Card className="bg-white/5 border-white/10 text-white">
          <CardContent className="p-6 text-center space-y-4">
            <Lock className="h-8 w-8 mx-auto text-fuchsia-300" />
            <h3 className="text-xl font-bold">Three-card spreads are Premium.</h3>
            <p className="text-sm text-white/70">
              Past · Present · Future readings tuned to your week&apos;s money chapter.
            </p>
            <Button asChild>
              <Link href="/dashboard/premium">See Premium</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={reading.seed}
              initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "grid gap-3",
                spread === "three_card_past_present_future"
                  ? "grid-cols-3"
                  : "grid-cols-1",
              )}
            >
              {reading.cards.map((c) => (
                <div
                  key={c.position}
                  className="rounded-2xl aspect-[2/3] relative tarot-lift overflow-hidden border border-white/15 bg-gradient-to-br from-violet-700/50 via-fuchsia-700/40 to-rose-700/40 flex flex-col items-center justify-center p-4 text-center"
                  style={{
                    transform: c.reversed ? "rotate(180deg)" : undefined,
                  }}
                >
                  <div
                    className="text-xs uppercase tracking-widest text-white/50 mb-2"
                    style={c.reversed ? { transform: "rotate(180deg)" } : undefined}
                  >
                    {c.position}
                  </div>
                  <div className="text-6xl mb-2">{c.card.glyph}</div>
                  <div
                    className="font-bold text-sm"
                    style={c.reversed ? { transform: "rotate(180deg)" } : undefined}
                  >
                    {c.card.name}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          <Card className="bg-white/5 border-white/10 text-white">
            <CardContent className="p-6 space-y-4">
              {reading.cards.map((c) => (
                <div key={c.position} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge gradient="from-violet-500 to-fuchsia-500">
                      {c.position}
                    </Badge>
                    <span className="text-sm font-semibold">{c.card.name}</span>
                    {c.reversed && (
                      <span className="text-xs text-white/50">(reversed)</span>
                    )}
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {c.reversed ? c.card.reversed : c.card.upright}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="text-center text-xs text-white/40 flex items-center justify-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            Same card every visit today — the deck remembers
          </div>
        </div>
      )}
    </div>
  );
}

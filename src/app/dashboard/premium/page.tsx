"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PRICING, effectivePrice, referralCopy } from "@/lib/stripe/pricing";
import { REFERRAL_THRESHOLD } from "@/lib/referrals/code";
import { formatMoney, cn } from "@/lib/utils";
import { Check, Gift, Sparkles } from "lucide-react";

const FEATURES = [
  "Unlimited goals",
  "Three-card and weekly tarot spreads",
  "Full birth-chart horoscope (moon + rising + transits)",
  "Family / parent-kid shared accounts",
  "Debt snowball + avalanche planner",
  "Freelance income smoothing forecast",
  "Article library + downloads",
  "Export to CSV / tax-ready summaries",
  "Priority human support",
];

export default function PremiumPage() {
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");
  // Mock: pull from referrals table in prod
  const activatedReferrals = 0;
  const eligible = activatedReferrals >= REFERRAL_THRESHOLD;
  const finalCents = effectivePrice(plan, activatedReferrals);

  return (
    <div className="px-5 pt-8 pb-8 space-y-6">
      <header className="text-center">
        <div className="mx-auto mb-3 inline-flex h-14 w-14 rounded-2xl lumen-aurora items-center justify-center shadow-2xl shadow-fuchsia-500/40">
          <Sparkles className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Lumen Premium</h1>
        <p className="text-white/60 mt-2 max-w-sm mx-auto">
          The whole app, every demographic, no walls.
        </p>
      </header>

      {/* Plan picker */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setPlan("monthly")}
          className={cn(
            "rounded-2xl p-5 border text-left transition-all",
            plan === "monthly"
              ? "border-white/40 bg-white/10"
              : "border-white/10 bg-white/5",
          )}
        >
          <div className="text-xs uppercase tracking-widest text-white/50 mb-1">
            Monthly
          </div>
          <div className="text-2xl font-bold">{PRICING.monthly.label}</div>
        </button>
        <button
          onClick={() => setPlan("yearly")}
          className={cn(
            "rounded-2xl p-5 border text-left transition-all relative overflow-hidden",
            plan === "yearly"
              ? "border-white/40 bg-white/10"
              : "border-white/10 bg-white/5",
          )}
        >
          <span className="absolute top-2 right-2 rounded-full bg-emerald-500/20 text-emerald-200 text-[10px] px-2 py-0.5 uppercase tracking-widest">
            Save 33%
          </span>
          <div className="text-xs uppercase tracking-widest text-white/50 mb-1">
            Yearly
          </div>
          <div className="text-2xl font-bold">{PRICING.yearly.label}</div>
          <div className="text-xs text-white/50 mt-0.5">
            ≈ {formatMoney(PRICING.yearly.monthlyEquivCents)}/mo
          </div>
        </button>
      </div>

      {/* Final price */}
      <Card className="bg-white/5 border-white/10 text-white">
        <CardContent className="p-5 flex items-baseline justify-between">
          <div>
            <div className="text-xs text-white/50">You pay</div>
            <div className="text-3xl font-bold">
              {formatMoney(finalCents)}
              <span className="text-sm font-normal text-white/50 ml-1">
                / {PRICING[plan].cadence}
              </span>
            </div>
          </div>
          {eligible && (
            <Badge gradient="from-emerald-500 to-teal-500">15% referral discount</Badge>
          )}
        </CardContent>
      </Card>

      {/* Referral */}
      <Card className="bg-gradient-to-br from-pink-700/40 to-rose-700/30 border-white/15 text-white">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Gift className="h-5 w-5 text-rose-200 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{referralCopy()}</h3>
              <p className="text-sm text-white/70 mb-3">
                Friends activated: <strong>{activatedReferrals}</strong> /{" "}
                {REFERRAL_THRESHOLD}
              </p>
              <Button size="sm" variant="secondary">
                Get my referral link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="bg-white/5 border-white/10 text-white">
        <CardContent className="p-5 space-y-2">
          {FEATURES.map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-emerald-300 shrink-0" />
              {f}
            </div>
          ))}
        </CardContent>
      </Card>

      <Button size="lg" className="w-full">
        Start 7-day free trial
      </Button>

      <p className="text-xs text-white/40 text-center">
        Cancel anytime in settings. No hidden fees. Lumen never takes a cut of
        your savings.
      </p>
    </div>
  );
}

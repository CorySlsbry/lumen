import Link from "next/link";
import { PersonaSwitcher } from "@/components/landing/PersonaSwitcher";
import { RoundUpDemo } from "@/components/landing/RoundUpDemo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PRICING, referralCopy } from "@/lib/stripe/pricing";
import { Sparkles, Moon, Coins, ShieldCheck, Users, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden text-white lumen-night min-h-dvh">
      {/* Ambient aurora orbs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[40rem] w-[40rem] rounded-full opacity-30 blur-3xl lumen-aurora" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[40rem] w-[40rem] rounded-full opacity-20 blur-3xl lumen-aurora" />

      {/* Top nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-xl">
          <span className="inline-block h-7 w-7 rounded-full lumen-aurora shadow-lg shadow-fuchsia-500/30" />
          Lumen
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <Link href="#how">How it works</Link>
          <Link href="#features">Features</Link>
          <Link href="#pricing">Pricing</Link>
          <Link href="/login" className="text-white">
            Log in
          </Link>
        </nav>
        <Button size="sm" asChild>
          <Link href="/onboarding">Get started</Link>
        </Button>
      </header>

      {/* HERO */}
      <section className="relative z-10 px-6 pt-12 md:pt-20 pb-24 mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-white/60">
            <Sparkles className="h-3 w-3" /> A little light on your money
          </span>
        </div>
        <PersonaSwitcher />
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/onboarding">
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="#how">See how it works</Link>
          </Button>
        </div>
        <p className="text-center text-white/50 text-xs mt-4">
          Free forever for basics. Premium {PRICING.monthly.label}. Cancel anytime.
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative z-10 px-6 py-16 mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              The change you don&apos;t miss <br />
              builds the fund you can&apos;t live without.
            </h3>
            <p className="text-white/70 text-lg leading-relaxed mb-6">
              Lumen watches your spending in read-only mode. Every purchase rounds
              up to the next dollar — and that spare change becomes a real cushion
              over weeks, not years.
            </p>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-start gap-3">
                <Coins className="mt-1 h-5 w-5 text-amber-300" />
                Average user saves <strong className="text-white">$38/mo</strong> in round-ups alone.
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-emerald-300" />
                Bank-grade encryption. We never see your password, your account number, or move your money without permission.
              </li>
              <li className="flex items-start gap-3">
                <Users className="mt-1 h-5 w-5 text-fuchsia-300" />
                Built for solo, family, and parent-kid accounts — every life stage covered.
              </li>
            </ul>
          </div>
          <RoundUpDemo />
        </div>
      </section>

      {/* THREE FEATURE CARDS */}
      <section id="features" className="relative z-10 px-6 py-16 mx-auto max-w-6xl">
        <h3 className="text-center text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Money, with a soul.
        </h3>
        <p className="text-center text-white/60 mb-12">
          The boring math is here. The reason to come back is everything else.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/5 border-white/10 text-white">
            <CardContent className="p-6 space-y-3">
              <Coins className="h-8 w-8 text-amber-300" />
              <h4 className="text-xl font-semibold">Round-ups, real time</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Every swipe rounds up. Phantom savings ticker climbs all day.
                Pull the trigger to sweep when you&apos;re ready.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 text-white">
            <CardContent className="p-6 space-y-3">
              <Sparkles className="h-8 w-8 text-fuchsia-300" />
              <h4 className="text-xl font-semibold">Daily tarot pull</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                A 78-card deck, finance-themed. Today&apos;s card, three-card
                spreads, and a journal that remembers.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 text-white">
            <CardContent className="p-6 space-y-3">
              <Moon className="h-8 w-8 text-indigo-300" />
              <h4 className="text-xl font-semibold">Money horoscope</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Real astronomy — your sun sign, weekly transits, and a forecast
                aimed at your wallet, not your love life.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="relative z-10 px-6 py-20 mx-auto max-w-4xl">
        <h3 className="text-center text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Free does a lot. Premium does more.
        </h3>
        <p className="text-center text-white/60 mb-12">{referralCopy()}</p>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/5 border-white/10 text-white">
            <CardContent className="p-8">
              <div className="text-sm uppercase tracking-widest text-white/50 mb-2">Free</div>
              <div className="text-4xl font-bold mb-1">$0</div>
              <div className="text-white/60 text-sm mb-6">forever</div>
              <ul className="space-y-2 text-sm text-white/80">
                <li>· Round-up tracking</li>
                <li>· Daily tarot pull</li>
                <li>· Daily horoscope (sun sign)</li>
                <li>· 1 active savings goal</li>
              </ul>
              <Button variant="secondary" className="w-full mt-6" asChild>
                <Link href="/onboarding">Start free</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 text-white relative overflow-hidden">
            <div className="absolute inset-0 lumen-aurora opacity-20 pointer-events-none" />
            <CardContent className="p-8 relative">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm uppercase tracking-widest text-white/80">Premium</div>
                <span className="rounded-full bg-white/15 text-xs px-2 py-1">
                  {PRICING.yearly.savingsCopy}
                </span>
              </div>
              <div className="text-4xl font-bold mb-1">{PRICING.monthly.label}</div>
              <div className="text-white/60 text-sm mb-6">
                or {PRICING.yearly.label} — 15% more off when you refer 2 friends
              </div>
              <ul className="space-y-2 text-sm text-white/90">
                <li>· Unlimited goals + multi-goal allocation</li>
                <li>· Three-card and weekly tarot spreads</li>
                <li>· Full birth-chart horoscope</li>
                <li>· Family + parent-kid shared accounts</li>
                <li>· Debt snowball/avalanche planner</li>
                <li>· Freelance income smoothing</li>
                <li>· Full article library + downloads</li>
              </ul>
              <Button className="w-full mt-6" asChild>
                <Link href="/onboarding?plan=premium">Try Premium free for 7 days</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 px-6 py-12 mx-auto max-w-6xl border-t border-white/10 text-sm text-white/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-block h-5 w-5 rounded-full lumen-aurora" />
            Lumen © {new Date().getFullYear()}
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/terms">Terms</Link>
            <Link href="/legal/disclosures">Disclosures</Link>
            <span className="text-white/30">
              Bank linking via Plaid · Built on Google Cloud
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}

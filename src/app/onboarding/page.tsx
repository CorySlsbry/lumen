"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { PERSONAS, type PersonaId } from "@/lib/personas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatMoney } from "@/lib/utils";
import { sunSign, SIGNS } from "@/lib/horoscope/zodiac";
import { ArrowRight, Check, Sparkles, Users, Wallet, Calendar } from "lucide-react";

type Step =
  | "persona"
  | "birth"
  | "household"
  | "goal"
  | "link"
  | "done";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("persona");
  const [persona, setPersona] = useState<PersonaId | null>(null);
  const [birthDate, setBirthDate] = useState("");
  const [household, setHousehold] = useState<"solo" | "family" | "parent_kid">("solo");
  const [goalAmount, setGoalAmount] = useState(100_000);
  const [linked, setLinked] = useState(false);

  const order: Step[] = ["persona", "birth", "household", "goal", "link", "done"];
  const idx = order.indexOf(step);
  const next = () => setStep(order[Math.min(order.length - 1, idx + 1)]);
  const back = () => setStep(order[Math.max(0, idx - 1)]);

  const selectedPersona = persona ? PERSONAS.find((p) => p.id === persona)! : null;

  return (
    <main className="min-h-dvh lumen-night text-white relative overflow-hidden">
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-[40rem] w-[40rem] rounded-full opacity-25 blur-3xl lumen-aurora" />

      <div className="relative z-10 mx-auto max-w-xl px-6 pt-8 pb-32">
        {/* Progress dots */}
        <div className="flex items-center gap-2 mb-12">
          {order.slice(0, -1).map((s, i) => (
            <div
              key={s}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all",
                i <= idx ? "lumen-aurora" : "bg-white/10",
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
          >
            {step === "persona" && (
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                  Which is closest to you?
                </h2>
                <p className="text-white/60 mb-8">
                  Pick the one that hurts a little. We&apos;ll tune everything else.
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {PERSONAS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setPersona(p.id);
                        setGoalAmount(p.defaultGoal.targetCents);
                        setTimeout(next, 200);
                      }}
                      className={cn(
                        "rounded-2xl p-5 border text-left transition-all hover:scale-[1.01]",
                        persona === p.id
                          ? "border-white/40 bg-white/10"
                          : "border-white/10 bg-white/5",
                      )}
                    >
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="font-semibold">{p.label}</span>
                        <span className="text-xs text-white/40">{p.pain}</span>
                      </div>
                      <p
                        className={cn(
                          "text-sm bg-clip-text text-transparent bg-gradient-to-br font-medium",
                          p.gradient,
                        )}
                      >
                        {p.promise}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "birth" && (
              <div>
                <Calendar className="h-8 w-8 mb-4 text-indigo-300" />
                <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                  When were you born?
                </h2>
                <p className="text-white/60 mb-8">
                  Used for your money horoscope. Skip if you&apos;d rather not — sun
                  sign is enough to start.
                </p>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="text-white bg-white/10 border-white/20 [color-scheme:dark]"
                />
                {birthDate && (
                  <p className="mt-4 text-sm text-white/70">
                    {SIGNS[sunSign(birthDate)].glyph} {SIGNS[sunSign(birthDate)].label} —{" "}
                    {SIGNS[sunSign(birthDate)].archetype}
                  </p>
                )}
                <div className="flex gap-3 mt-8">
                  <Button variant="secondary" onClick={back}>
                    Back
                  </Button>
                  <Button onClick={next} className="flex-1">
                    {birthDate ? "Continue" : "Skip for now"} <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === "household" && (
              <div>
                <Users className="h-8 w-8 mb-4 text-emerald-300" />
                <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                  Who&apos;s on this with you?
                </h2>
                <p className="text-white/60 mb-8">
                  You can change this later or invite people once you&apos;re in.
                </p>
                <div className="space-y-3">
                  {[
                    { id: "solo", label: "Just me", desc: "Solo account, full privacy." },
                    {
                      id: "family",
                      label: "Me + my partner",
                      desc: "Shared goals, shared visibility, separate spending. Premium feature.",
                    },
                    {
                      id: "parent_kid",
                      label: "Me + my kids",
                      desc: "Allowances, chores, parental controls. Premium feature.",
                    },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setHousehold(opt.id as typeof household)}
                      className={cn(
                        "w-full rounded-2xl p-4 border text-left transition-all",
                        household === opt.id
                          ? "border-white/40 bg-white/10"
                          : "border-white/10 bg-white/5",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{opt.label}</div>
                          <div className="text-sm text-white/60">{opt.desc}</div>
                        </div>
                        {household === opt.id && <Check className="h-5 w-5" />}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-8">
                  <Button variant="secondary" onClick={back}>
                    Back
                  </Button>
                  <Button onClick={next} className="flex-1">
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === "goal" && selectedPersona && (
              <div>
                <Sparkles className="h-8 w-8 mb-4 text-amber-300" />
                <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                  Your first target.
                </h2>
                <p className="text-white/60 mb-8">
                  Based on your situation, we suggest:{" "}
                  <strong className="text-white">{selectedPersona.defaultGoal.name}</strong>
                  . Adjust if it&apos;s not the right number.
                </p>
                <div className="rounded-2xl border border-white/15 bg-white/5 p-6 mb-6">
                  <div className="text-sm text-white/60 mb-2">Goal target</div>
                  <div className="text-5xl font-bold tabular-nums">
                    {formatMoney(goalAmount)}
                  </div>
                  <input
                    type="range"
                    min={10_000}
                    max={2_000_000}
                    step={10_000}
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(Number(e.target.value))}
                    className="w-full mt-4 accent-fuchsia-500"
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={back}>
                    Back
                  </Button>
                  <Button onClick={next} className="flex-1">
                    Lock it in <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === "link" && (
              <div>
                <Wallet className="h-8 w-8 mb-4 text-fuchsia-300" />
                <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                  Link a card to start tracking.
                </h2>
                <p className="text-white/60 mb-8">
                  Read-only. We see purchases to round up — we never see your password
                  and we never move money without permission.
                </p>
                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      setLinked(true);
                      setTimeout(next, 800);
                    }}
                  >
                    {linked ? (
                      <>
                        <Check className="h-5 w-5" /> Linked — sample bank
                      </>
                    ) : (
                      <>Connect with Plaid</>
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    onClick={next}
                  >
                    Skip — explore first
                  </Button>
                </div>
                <p className="text-xs text-white/40 mt-4 text-center">
                  Phase 1 sandbox — round-ups are simulated until banking partner integration goes live.
                </p>
              </div>
            )}

            {step === "done" && (
              <div className="text-center">
                <div className="mx-auto mb-6 h-24 w-24 rounded-full lumen-aurora shadow-2xl shadow-fuchsia-500/40 grid place-items-center">
                  <Sparkles className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-4xl font-bold mb-3 tracking-tight">You&apos;re in.</h2>
                <p className="text-white/70 mb-8 max-w-sm mx-auto">
                  Your dashboard is ready. First round-up calculation lands within an hour.
                  Today&apos;s tarot card is already waiting.
                </p>
                <Button size="lg" onClick={() => router.push("/dashboard")}>
                  Open my dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

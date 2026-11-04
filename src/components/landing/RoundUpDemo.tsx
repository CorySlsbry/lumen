"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { computeRoundUp } from "@/lib/roundup/simulator";
import { formatMoney } from "@/lib/utils";

const SAMPLE_TXS = [
  { merchant: "Starbucks", amountCents: 487 },
  { merchant: "Whole Foods", amountCents: 4_312 },
  { merchant: "Uber", amountCents: 1_843 },
  { merchant: "Spotify", amountCents: 999 },
  { merchant: "Chipotle", amountCents: 1_267 },
  { merchant: "Target", amountCents: 5_544 },
  { merchant: "Gas", amountCents: 3_876 },
];

export function RoundUpDemo() {
  const [shown, setShown] = useState(0);
  const [saved, setSaved] = useState(0);

  useEffect(() => {
    if (shown >= SAMPLE_TXS.length) return;
    const t = setTimeout(() => {
      const tx = SAMPLE_TXS[shown];
      const r = computeRoundUp({ amountCents: tx.amountCents });
      setSaved((s) => s + r.roundUpCents);
      setShown((s) => s + 1);
    }, 700);
    return () => clearTimeout(t);
  }, [shown]);

  const reset = () => {
    setShown(0);
    setSaved(0);
  };

  return (
    <div className="rounded-3xl border border-white/15 bg-black/30 backdrop-blur-xl p-6 md:p-8 max-w-md mx-auto text-white">
      <div className="flex items-baseline justify-between mb-6">
        <span className="text-sm uppercase tracking-widest text-white/60">
          Phantom savings
        </span>
        <button
          onClick={reset}
          className="text-xs text-white/50 hover:text-white/80"
        >
          replay
        </button>
      </div>
      <motion.div
        key={saved}
        initial={{ scale: 0.95, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-6xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent lumen-aurora"
      >
        {formatMoney(saved)}
      </motion.div>
      <div className="mt-8 space-y-2 min-h-[14rem]">
        {SAMPLE_TXS.slice(0, shown).map((tx, i) => {
          const r = computeRoundUp({ amountCents: tx.amountCents });
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between text-sm border-b border-white/5 pb-2"
            >
              <span className="text-white/80">{tx.merchant}</span>
              <span className="text-white/40 line-through tabular-nums">
                {formatMoney(tx.amountCents)}
              </span>
              <span className="text-emerald-300 font-medium tabular-nums">
                +{formatMoney(r.roundUpCents)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatMoney } from "@/lib/utils";

/**
 * Animated savings ticker — counts up from 0 to `targetCents` over `durationMs`.
 */
export function SavingsTicker({
  targetCents,
  label = "Saved this month",
}: {
  targetCents: number;
  label?: string;
}) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const duration = 1100;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setShown(Math.round(eased * targetCents));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [targetCents]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="text-xs uppercase tracking-widest text-white/50 mb-2">
        {label}
      </div>
      <motion.div className="text-5xl md:text-6xl font-bold tabular-nums tracking-tight bg-clip-text text-transparent lumen-aurora">
        {formatMoney(shown)}
      </motion.div>
    </div>
  );
}

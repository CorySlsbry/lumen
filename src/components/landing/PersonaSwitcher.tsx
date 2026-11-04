"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PERSONAS, type PersonaId } from "@/lib/personas";
import { cn } from "@/lib/utils";

export function PersonaSwitcher({
  onChange,
  initial = "recent_grad",
}: {
  onChange?: (id: PersonaId) => void;
  initial?: PersonaId;
}) {
  const [active, setActive] = useState<PersonaId>(initial);
  const persona = PERSONAS.find((p) => p.id === active)!;

  const select = (id: PersonaId) => {
    setActive(id);
    onChange?.(id);
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {PERSONAS.map((p) => (
          <button
            key={p.id}
            onClick={() => select(p.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              active === p.id
                ? `bg-gradient-to-br ${p.gradient} text-white shadow-lg`
                : "bg-white/10 backdrop-blur text-white/80 hover:bg-white/20",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={persona.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-white/70 text-lg md:text-xl mb-3 italic">
            &ldquo;{persona.pain}&rdquo;
          </p>
          <h2
            className={cn(
              "text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br",
              persona.gradient,
            )}
          >
            {persona.promise}
          </h2>
          <p className="mt-6 text-white/80 text-base md:text-lg max-w-2xl mx-auto">
            {persona.onboardingNudge}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

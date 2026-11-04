# lumen

> **Portfolio snapshot.** A sanitized, history-free copy of a private repository, published to show the work.
> Credentials, customer and lead data, internal notes and third-party material were removed, and real client
> and people names were replaced with fictional ones, so this copy is not meant to run as-is.

- **What it is:** Lumen, a mobile-first personal-finance PWA with round-up savings.
- **Stack:** Next.js, React, Tailwind, Firebase, Firebase Admin, Stripe, Anthropic Claude API, Vitest, Drizzle, Zod
- **Languages:** TypeScript, JavaScript, CSS
- **Private repo history:** 1 commits, 2026-05-12 to 2026-05-12
- **This snapshot:** 72 files, 5 test files
- **Built by:** Cory Salisbury, with Claude Code

_All rights reserved. Shared for portfolio review only; no license is granted to copy, modify or redistribute this code._

---

> A little light on your money.

A mobile-first personal finance PWA: round-up savings, daily tarot, real
birth-chart horoscopes, and gamified goals — built for six demographics from
recent grads to families with kids.

Phase 1 ships as **shadow savings** (Plaid read-only, simulated round-ups, zero
money movement). Real ACH sweeps are gated behind Phase 2 banking-partner
onboarding — see `memory/compliance_roadmap.md`.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 15 + React 19 + Tailwind 4 + shadcn-style primitives, PWA |
| API | Next.js Route Handlers + Zod validation |
| Hosting | Google Cloud Run (containerized) |
| Database | Cloud SQL Postgres 16 via Drizzle ORM |
| Auth | Firebase Auth (email/OAuth/Apple) |
| Bank linking | Plaid (sandbox in Phase 1) |
| Money movement | Deferred — Unit BaaS in Phase 2 |
| Payments | Stripe (subscription, 7-day trial) |
| Astrology | Sun-sign tropical zodiac; Swiss Ephemeris adapter ready for full chart |
| Tarot | Custom 78-card finance-themed deck, deterministic seeded pulls |

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill env vars
cp .env.example .env.local

# 3. Start local Postgres (Docker example)
docker run -d --name lumen-pg \
  -e POSTGRES_USER=lumen -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=lumen -p 5432:5432 postgres:16

# 4. Generate + run migrations
npm run db:generate
npm run db:migrate

# 5. Run dev server
npm run dev
```

Visit http://localhost:3000.

---

## Project layout

```
src/
├── app/                       # Next.js App Router
│   ├── page.tsx               # Landing page (six-persona switcher)
│   ├── onboarding/            # Dante-funnel signup wizard
│   ├── login/                 # Firebase Auth
│   ├── dashboard/             # Authed app
│   │   ├── page.tsx           # Home — ticker, today's card, this week's sky
│   │   ├── tarot/             # Daily + three-card spreads
│   │   ├── horoscope/         # Sun sign + birth-chart forecast
│   │   ├── goals/             # Rainy day, debt, big purchase, smoothing
│   │   ├── family/            # Couple-shared and parent-kid accounts
│   │   ├── premium/           # Paywall + referral
│   │   └── profile/           # Settings
│   └── api/
│       ├── auth/session/      # Firebase ID token → session cookie
│       ├── plaid/             # link-token + exchange
│       ├── stripe/            # checkout + webhook
│       ├── tarot/             # Deterministic reading endpoint
│       └── horoscope/         # Weekly forecast endpoint
├── components/
│   ├── ui/                    # Button, Card, Progress, Input, Badge
│   ├── landing/               # PersonaSwitcher, RoundUpDemo
│   └── dashboard/             # BottomNav, SavingsTicker, StreakBadge
├── lib/
│   ├── personas.ts            # Canonical six-demographic data
│   ├── db/                    # Drizzle schema, client, branded IDs
│   ├── auth/                  # Firebase client + admin + session
│   ├── roundup/               # Pure round-up math + Plaid wrapper
│   ├── tarot/                 # 78-card deck + seeded reader
│   ├── horoscope/             # Sun sign + weekly forecast + ephemeris adapter
│   ├── goals/                 # Debt snowball/avalanche + smoothing math
│   ├── gamification/          # Streaks + badges
│   ├── referrals/             # Code generation + discount eligibility
│   └── stripe/                # Pricing + client
└── ...
```

---

## Domain primitives that are tested

Pure-logic tests run with `npm test` (vitest, no DB required):

- `src/lib/roundup/simulator.spec.ts` — round-up math
- `src/lib/gamification/engine.spec.ts` — streaks + badge thresholds
- `src/lib/tarot/reader.spec.ts` — determinism, no duplicates in three-card
- `src/lib/horoscope/forecast.spec.ts` — sun sign cutoffs, ISO Monday, deterministic forecasts
- `src/lib/goals/debt.spec.ts` — snowball/avalanche simulation

---

## Six demographics → six tuned funnels

The `lib/personas.ts` file is the single source of truth for segmentation. The
landing page renders all six promises with animated transitions
(`components/landing/PersonaSwitcher.tsx`); the onboarding wizard uses the
chosen persona to set the default goal, copy, and gradient.

| Persona | Pain | Promise |
|---|---|---|
| Recent grad | "I have no idea how to start." | "Your first $1,000, on autopilot." |
| Parent | "Two incomes, four mouths, no plan." | "Family money, one source of truth." |
| Debt payoff | "I owe more than I make." | "A snowball you can actually push." |
| Curious learner | "I want to understand, not be told." | "Learn the money game without the lectures." |
| Freelancer | "Feast one month, starve the next." | "Smooth your income, not your nerves." |
| Rainy-day fund | "One emergency from disaster." | "Build the cushion before you need it." |

---

## Monetization

- **Free forever:** round-up tracking, daily tarot, daily horoscope, 1 goal
- **Premium $4.99/mo or $39.99/yr** (33% off yearly) with a 7-day trial
- **Refer 2 friends:** lock in 15% off your subscription, perpetually

Premium unlocks: unlimited goals, three-card + weekly tarot spreads, full
birth-chart horoscope, family/parent-kid accounts, debt planner, freelance
smoothing, article library, CSV/tax export.

> We do not take a cut of your savings. Ever. See `memory/monetization_model.md`
> for the decision history.

---

## Deploying to Cloud Run

### 1. Pre-reqs

- A GCP project with billing on
- Cloud SQL Postgres 16 instance
- Cloud Build, Artifact Registry, and Cloud Run APIs enabled
- All secrets in Secret Manager (the names in `cloudbuild.yaml` are the lookup keys)

### 2. First deploy

```bash
# From the repo root
gcloud builds submit --config cloudbuild.yaml \
  --substitutions _SQL_INSTANCE=PROJECT:REGION:INSTANCE
```

### 3. Subsequent deploys

Connect a Cloud Build trigger to `main` — every push deploys.

### 4. Cold start

Cloud Run scales to zero. First request after idle = ~1.5s cold start. To keep
hot, set `--min-instances=1` in `cloudbuild.yaml` (costs ≈ $5/mo).

---

## Compliance roadmap

This codebase is **safe to ship publicly today** because no real money moves.
Plaid is read-only; round-ups are computed and shown as "phantom savings" with
clear copy disclosing the sandbox status.

Going Phase 2 (real ACH sweeps) requires:
- BaaS partner (recommend Unit; alternatives: Treasury Prime, Synctera, Bond)
- KYC/CIP (Plaid Identity → Alloy at scale)
- BSA/AML program with designated Compliance Officer
- Reg E disclosures wired into transfer UI
- Audit of access-token storage (encrypt with Cloud KMS)

Full details in `memory/compliance_roadmap.md`.

---

## What was deferred

- **Real money movement** — Phase 2 (see above)
- **Native mobile shells** — Capacitor wrap (~2 days) when App Store presence is needed
- **Full birth chart** — sun sign ships; moon + rising + transits ride on Swiss Ephemeris in Phase 2
- **ML-driven adaptive savings amounts** — Digit-style; needs ~3 months of transaction history per user
- **Article library content** — schema is there, ~10–15 seed articles to write

---

## License

Proprietary. © 2026 Cory.

/**
 * Lumen database schema — Cloud SQL Postgres.
 *
 * Designed by the Database Agent under Architect oversight.
 *
 * Conventions:
 *   - All money in INTEGER MINOR UNITS (cents). NEVER floats.
 *   - All timestamps stored as UTC `timestamp with time zone`.
 *   - Branded ID types live in src/lib/db/ids.ts.
 *   - Schema is Phase-1 safe: no PAN, no account numbers, no routing numbers — Plaid tokens only.
 */

import {
  pgTable,
  text,
  integer,
  bigint,
  timestamp,
  boolean,
  jsonb,
  uniqueIndex,
  index,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";

/* -------------------------------------------------------------------------- */
/*  Enums                                                                     */
/* -------------------------------------------------------------------------- */

export const personaEnum = pgEnum("persona", [
  "recent_grad",
  "parent",
  "debt_payoff",
  "financially_curious",
  "freelancer",
  "rainy_day",
]);

export const accountKindEnum = pgEnum("account_kind", ["solo", "family", "parent_kid"]);

export const householdRoleEnum = pgEnum("household_role", [
  "primary",
  "partner",
  "parent",
  "child",
]);

export const goalKindEnum = pgEnum("goal_kind", [
  "rainy_day",
  "debt_payoff",
  "big_purchase",
  "freelance_smoothing",
  "custom",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "free",
  "trialing",
  "active",
  "past_due",
  "canceled",
]);

export const ledgerKindEnum = pgEnum("ledger_kind", [
  "round_up",
  "manual_deposit",
  "goal_allocation",
  "fee",
  "withdrawal",
  "adjustment",
]);

export const referralStatusEnum = pgEnum("referral_status", [
  "invited",
  "joined",
  "activated",
]);

/* -------------------------------------------------------------------------- */
/*  Users & Auth                                                              */
/* -------------------------------------------------------------------------- */

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(), // Firebase Auth UID
    email: text("email").notNull(),
    displayName: text("display_name"),
    persona: personaEnum("persona"),
    birthDate: text("birth_date"), // ISO date for astrology — stored as text to avoid TZ ambiguity
    birthTime: text("birth_time"), // ISO time, optional
    birthLocationLat: text("birth_location_lat"),
    birthLocationLng: text("birth_location_lng"),
    referralCode: text("referral_code").notNull(), // their own code to share
    referredByCode: text("referred_by_code"),
    streakCount: integer("streak_count").notNull().default(0),
    lastStreakAt: timestamp("last_streak_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailIdx: uniqueIndex("users_email_idx").on(t.email),
    referralCodeIdx: uniqueIndex("users_referral_code_idx").on(t.referralCode),
  }),
);

/* -------------------------------------------------------------------------- */
/*  Households (Solo / Family / Parent-Kid)                                   */
/* -------------------------------------------------------------------------- */

export const households = pgTable("households", {
  id: text("id").primaryKey(),
  kind: accountKindEnum("kind").notNull(),
  name: text("name").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const householdMembers = pgTable(
  "household_members",
  {
    householdId: text("household_id")
      .notNull()
      .references(() => households.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: householdRoleEnum("role").notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.householdId, t.userId] }),
    userIdx: index("household_members_user_idx").on(t.userId),
  }),
);

/* -------------------------------------------------------------------------- */
/*  Linked bank accounts (Plaid)                                              */
/*  Phase 1: read-only. We store Plaid item/access tokens, never raw account  */
/*  numbers or routing numbers.                                               */
/* -------------------------------------------------------------------------- */

export const linkedAccounts = pgTable(
  "linked_accounts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    plaidItemId: text("plaid_item_id").notNull(),
    plaidAccessToken: text("plaid_access_token").notNull(), // encrypt at rest via KMS in prod
    plaidAccountId: text("plaid_account_id").notNull(),
    institutionName: text("institution_name").notNull(),
    accountName: text("account_name").notNull(),
    accountMask: text("account_mask"), // last 4
    accountType: text("account_type").notNull(), // depository, credit, etc.
    accountSubtype: text("account_subtype"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("linked_accounts_user_idx").on(t.userId),
    plaidIdx: uniqueIndex("linked_accounts_plaid_idx").on(t.plaidAccountId),
  }),
);

/* -------------------------------------------------------------------------- */
/*  Source transactions (synced from Plaid)                                   */
/* -------------------------------------------------------------------------- */

export const transactions = pgTable(
  "transactions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    linkedAccountId: text("linked_account_id")
      .notNull()
      .references(() => linkedAccounts.id, { onDelete: "cascade" }),
    plaidTransactionId: text("plaid_transaction_id").notNull(),
    amountCents: bigint("amount_cents", { mode: "number" }).notNull(), // positive = debit (spend)
    isoCurrencyCode: text("iso_currency_code").notNull().default("USD"),
    merchantName: text("merchant_name"),
    category: text("category"),
    pending: boolean("pending").notNull().default(false),
    postedAt: timestamp("posted_at", { withTimezone: true }).notNull(),
    roundUpCents: integer("round_up_cents").notNull().default(0), // computed at ingest
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userPostedIdx: index("transactions_user_posted_idx").on(t.userId, t.postedAt),
    plaidIdx: uniqueIndex("transactions_plaid_idx").on(t.plaidTransactionId),
  }),
);

/* -------------------------------------------------------------------------- */
/*  Goals                                                                     */
/* -------------------------------------------------------------------------- */

export const goals = pgTable(
  "goals",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    householdId: text("household_id").references(() => households.id, { onDelete: "set null" }),
    kind: goalKindEnum("kind").notNull(),
    name: text("name").notNull(),
    targetCents: bigint("target_cents", { mode: "number" }).notNull(),
    currentCents: bigint("current_cents", { mode: "number" }).notNull().default(0),
    targetDate: text("target_date"), // ISO date
    isActive: boolean("is_active").notNull().default(true),
    metadata: jsonb("metadata"), // debt details, big-purchase items, etc.
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("goals_user_idx").on(t.userId),
  }),
);

/* -------------------------------------------------------------------------- */
/*  Shadow ledger — Phase 1 simulated savings                                 */
/*  Double-entry: every line has account_id + amount; positives are credits.  */
/* -------------------------------------------------------------------------- */

export const ledgerEntries = pgTable(
  "ledger_entries",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    goalId: text("goal_id").references(() => goals.id, { onDelete: "set null" }),
    kind: ledgerKindEnum("kind").notNull(),
    amountCents: bigint("amount_cents", { mode: "number" }).notNull(),
    description: text("description"),
    sourceTransactionId: text("source_transaction_id").references(() => transactions.id, {
      onDelete: "set null",
    }),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userOccurredIdx: index("ledger_user_occurred_idx").on(t.userId, t.occurredAt),
  }),
);

/* -------------------------------------------------------------------------- */
/*  Gamification — badges, milestones                                         */
/* -------------------------------------------------------------------------- */

export const badges = pgTable(
  "badges",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    badgeKey: text("badge_key").notNull(), // e.g. "first_dollar", "streak_7", "goal_smashed"
    earnedAt: timestamp("earned_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userBadgeIdx: uniqueIndex("badges_user_key_idx").on(t.userId, t.badgeKey),
  }),
);

/* -------------------------------------------------------------------------- */
/*  Tarot reading history                                                     */
/* -------------------------------------------------------------------------- */

export const tarotReadings = pgTable(
  "tarot_readings",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    spreadKind: text("spread_kind").notNull(), // "daily_one_card" | "three_card_past_present_future"
    cards: jsonb("cards").notNull(), // [{ position, cardId, reversed }]
    seed: text("seed").notNull(), // deterministic seed so we can re-render the same reading
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userCreatedIdx: index("tarot_user_created_idx").on(t.userId, t.createdAt),
  }),
);

/* -------------------------------------------------------------------------- */
/*  Horoscope cache (computed weekly from birth chart)                         */
/* -------------------------------------------------------------------------- */

export const horoscopeForecasts = pgTable(
  "horoscope_forecasts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    weekStart: text("week_start").notNull(), // ISO Monday of the forecast week
    payload: jsonb("payload").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userWeekIdx: uniqueIndex("horoscope_user_week_idx").on(t.userId, t.weekStart),
  }),
);

/* -------------------------------------------------------------------------- */
/*  Subscriptions & referrals                                                 */
/* -------------------------------------------------------------------------- */

export const subscriptions = pgTable("subscriptions", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  status: subscriptionStatusEnum("status").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  priceId: text("price_id"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  referralDiscountActive: boolean("referral_discount_active").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const referrals = pgTable(
  "referrals",
  {
    id: text("id").primaryKey(),
    referrerUserId: text("referrer_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    refereeUserId: text("referee_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    refereeEmail: text("referee_email"),
    status: referralStatusEnum("status").notNull().default("invited"),
    activatedAt: timestamp("activated_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    referrerIdx: index("referrals_referrer_idx").on(t.referrerUserId),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Household = typeof households.$inferSelect;
export type Goal = typeof goals.$inferSelect;
export type LedgerEntry = typeof ledgerEntries.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type LinkedAccount = typeof linkedAccounts.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Referral = typeof referrals.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type TarotReading = typeof tarotReadings.$inferSelect;
export type HoroscopeForecast = typeof horoscopeForecasts.$inferSelect;

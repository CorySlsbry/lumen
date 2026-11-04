/**
 * The Lumen Tarot Deck — 78 cards with finance-themed interpretations.
 *
 * Owned by the Backend Agent with copy from the CX Agent.
 * Interpretations are deterministic — no LLM call per reading.
 *
 * Source structure: Rider-Waite-Smith.
 * Suits → finance domains:
 *   Wands     → motivation, hustle, side income
 *   Cups      → relationship with money, emotional spending, generosity
 *   Swords    → hard decisions, cutting costs, mental clarity
 *   Pentacles → tangible wealth, work, investment, security
 */

export type Suit = "wands" | "cups" | "swords" | "pentacles";
export type Arcana = "major" | "minor";

export type TarotCard = {
  id: string;
  name: string;
  arcana: Arcana;
  suit?: Suit;
  number?: number;
  keywords: string[];
  /** Finance-themed interpretation for an upright pull. */
  upright: string;
  /** Finance-themed interpretation for a reversed pull. */
  reversed: string;
  /** Single-emoji placeholder until real illustrated art ships. */
  glyph: string;
};

/* -------------------------------------------------------------------------- */
/*  Major Arcana (22)                                                          */
/* -------------------------------------------------------------------------- */

const MAJORS: TarotCard[] = [
  {
    id: "fool",
    name: "The Fool",
    arcana: "major",
    number: 0,
    keywords: ["beginnings", "leap", "innocence"],
    upright:
      "A new money chapter is opening. The first deposit, the first budget — start before you feel ready.",
    reversed:
      "Look before you leap. A spontaneous purchase is whispering — sleep on it twenty-four hours.",
    glyph: "🃏",
  },
  {
    id: "magician",
    name: "The Magician",
    arcana: "major",
    number: 1,
    keywords: ["resourcefulness", "skill", "manifest"],
    upright:
      "You already have the tools. Earn-side leverage is closer than you think — look at what you can charge for.",
    reversed:
      "The tools are gathering dust. Audit your subscriptions and unused skills this week.",
    glyph: "🪄",
  },
  {
    id: "high_priestess",
    name: "The High Priestess",
    arcana: "major",
    number: 2,
    keywords: ["intuition", "patience", "inner knowing"],
    upright:
      "Your gut is saying wait. The opportunity will still be there after the numbers are checked.",
    reversed:
      "You are ignoring a quiet signal. Open the bank app you've been avoiding.",
    glyph: "🌙",
  },
  {
    id: "empress",
    name: "The Empress",
    arcana: "major",
    number: 3,
    keywords: ["abundance", "creativity", "nurture"],
    upright:
      "Abundance is forming. Plant a small recurring deposit and let it compound quietly.",
    reversed:
      "Overspending on others is draining you. Generosity should be sustainable, not silent self-harm.",
    glyph: "🌹",
  },
  {
    id: "emperor",
    name: "The Emperor",
    arcana: "major",
    number: 4,
    keywords: ["structure", "authority", "discipline"],
    upright:
      "Set the rules and follow them. A simple budget you actually stick to beats a perfect one you don't.",
    reversed:
      "Rigidity is breaking you. Loosen one envelope so the rest hold.",
    glyph: "🏛️",
  },
  {
    id: "hierophant",
    name: "The Hierophant",
    arcana: "major",
    number: 5,
    keywords: ["tradition", "guidance", "mentors"],
    upright:
      "Boring works. The 50/30/20 split or the index fund is boring for a reason.",
    reversed:
      "You inherited a money belief that no longer fits. Question one rule from your upbringing this week.",
    glyph: "🗝️",
  },
  {
    id: "lovers",
    name: "The Lovers",
    arcana: "major",
    number: 6,
    keywords: ["choice", "alignment", "partnership"],
    upright:
      "A money decision asks for alignment — with your partner, or with your own values.",
    reversed:
      "Two parts of you want different things. Write down what each wants before you spend.",
    glyph: "💞",
  },
  {
    id: "chariot",
    name: "The Chariot",
    arcana: "major",
    number: 7,
    keywords: ["drive", "momentum", "willpower"],
    upright: "Foot on the gas. A goal is in reach — sprint the last stretch.",
    reversed:
      "You are pulling in two directions. Pick one financial priority for the next thirty days.",
    glyph: "🏎️",
  },
  {
    id: "strength",
    name: "Strength",
    arcana: "major",
    number: 8,
    keywords: ["courage", "patience", "soft power"],
    upright:
      "Quiet strength. The negotiation you have been dreading goes better than you fear.",
    reversed:
      "Self-doubt is shrinking the ask. You are worth more than you are about to request.",
    glyph: "🦁",
  },
  {
    id: "hermit",
    name: "The Hermit",
    arcana: "major",
    number: 9,
    keywords: ["reflection", "solitude", "study"],
    upright:
      "Step away from the noise. An hour with your numbers tonight is worth a week of guessing.",
    reversed:
      "Isolation is hiding the truth. Ask one trusted friend about money this week.",
    glyph: "🕯️",
  },
  {
    id: "wheel",
    name: "Wheel of Fortune",
    arcana: "major",
    number: 10,
    keywords: ["luck", "cycles", "fate"],
    upright:
      "The cycle is turning your way. An unexpected windfall — bank most of it.",
    reversed:
      "The cycle is grinding. This phase ends. Hold steady, automate, wait.",
    glyph: "🎡",
  },
  {
    id: "justice",
    name: "Justice",
    arcana: "major",
    number: 11,
    keywords: ["fairness", "accountability", "consequence"],
    upright:
      "The math is the math. Run the spreadsheet. The truth is friendlier than you fear.",
    reversed:
      "Avoiding a bill or a conversation. The cost of waiting compounds.",
    glyph: "⚖️",
  },
  {
    id: "hanged_man",
    name: "The Hanged Man",
    arcana: "major",
    number: 12,
    keywords: ["pause", "perspective", "sacrifice"],
    upright:
      "A pause is wisdom. Hold off the purchase one week; the desire usually fades.",
    reversed:
      "Stalled too long. The decision you have been avoiding is the one to make today.",
    glyph: "🪢",
  },
  {
    id: "death",
    name: "Death",
    arcana: "major",
    number: 13,
    keywords: ["ending", "transformation", "release"],
    upright:
      "An era ends. Cancel the subscription, close the account, release the dead weight.",
    reversed:
      "Clinging to a sunk cost. The money is gone — the lesson is the asset.",
    glyph: "🌑",
  },
  {
    id: "temperance",
    name: "Temperance",
    arcana: "major",
    number: 14,
    keywords: ["balance", "moderation", "blending"],
    upright:
      "Balance. Spend a little, save a little, give a little. The middle path is the long one.",
    reversed:
      "All-or-nothing thinking. You don't have to be perfect to be on track.",
    glyph: "🍶",
  },
  {
    id: "devil",
    name: "The Devil",
    arcana: "major",
    number: 15,
    keywords: ["bondage", "shadow", "compulsion"],
    upright:
      "A habit owns you — name it. The first dollar you redirect is freedom buying back.",
    reversed:
      "The chains are looser than they feel. Cut one cord this week.",
    glyph: "⛓️",
  },
  {
    id: "tower",
    name: "The Tower",
    arcana: "major",
    number: 16,
    keywords: ["upheaval", "revelation", "rebuild"],
    upright:
      "A money structure cracks — pay attention. What looked solid was built on hope, not numbers.",
    reversed:
      "You sensed the collapse coming. Trust that instinct next time.",
    glyph: "🗼",
  },
  {
    id: "star",
    name: "The Star",
    arcana: "major",
    number: 17,
    keywords: ["hope", "renewal", "guidance"],
    upright:
      "Hope returns. After a hard chapter, a small win restores the belief that this works.",
    reversed:
      "Discouragement is lying to you. Look at your six-month-ago self.",
    glyph: "⭐",
  },
  {
    id: "moon",
    name: "The Moon",
    arcana: "major",
    number: 18,
    keywords: ["illusion", "fear", "subconscious"],
    upright:
      "A money fear is bigger in the dark than in the spreadsheet. Open the app.",
    reversed:
      "The fog lifts. You see now what the offer really was.",
    glyph: "🌕",
  },
  {
    id: "sun",
    name: "The Sun",
    arcana: "major",
    number: 19,
    keywords: ["joy", "success", "vitality"],
    upright:
      "The win is real. Celebrate it. Then automate the next one.",
    reversed:
      "Borrowing tomorrow's joy. Pause before splurging your good news away.",
    glyph: "☀️",
  },
  {
    id: "judgement",
    name: "Judgement",
    arcana: "major",
    number: 20,
    keywords: ["reckoning", "awakening", "review"],
    upright:
      "An honest accounting calls. The annual review is uncomfortable and necessary.",
    reversed:
      "Self-blame is paralysis. Past mistakes are tuition, not debt.",
    glyph: "📯",
  },
  {
    id: "world",
    name: "The World",
    arcana: "major",
    number: 21,
    keywords: ["completion", "wholeness", "arrival"],
    upright: "The goal is done. Mark it. Then pick the next one.",
    reversed:
      "Almost there. Do not abandon the last 10% — it is where the meaning lives.",
    glyph: "🌍",
  },
];

/* -------------------------------------------------------------------------- */
/*  Minor Arcana — generated suit-by-suit for compactness                     */
/* -------------------------------------------------------------------------- */

type MinorMeta = {
  upright: string;
  reversed: string;
  keywords: string[];
};

const WANDS: Record<string, MinorMeta> = {
  ace: {
    upright:
      "A spark. A side-income idea is worth a weekend prototype, not a quitting decision.",
    reversed:
      "False start. The idea is real but the timing isn't.",
    keywords: ["spark", "inspiration", "potential"],
  },
  two: {
    upright: "Two paths. Plan the one you'd regret not trying.",
    reversed: "Overthinking the map. Pick a direction this week.",
    keywords: ["planning", "decision", "horizon"],
  },
  three: {
    upright: "First customers, first reviews. Your bet is finding its footing.",
    reversed: "Expansion before foundation. Tighten the offer first.",
    keywords: ["foresight", "expansion", "shipping"],
  },
  four: {
    upright:
      "Celebrate a milestone. A goal hit deserves a small ritual before the next.",
    reversed: "Skipping the celebration. You are running on fumes.",
    keywords: ["milestone", "harmony", "home"],
  },
  five: {
    upright: "Friction with collaborators. Disagreement is data — listen.",
    reversed: "Avoiding the hard conversation. It compounds.",
    keywords: ["conflict", "competition", "tension"],
  },
  six: {
    upright: "Recognition arrives. Don't discount the win as luck.",
    reversed: "External validation chasing. The next win has to satisfy you alone.",
    keywords: ["victory", "recognition", "praise"],
  },
  seven: {
    upright: "Defend your numbers. Negotiate the rate. Hold the line.",
    reversed: "Capitulating early. You haven't been pushed yet.",
    keywords: ["defense", "perseverance", "boundary"],
  },
  eight: {
    upright: "Fast movement. Invoices, messages, opportunities — answer them today.",
    reversed: "Stalled momentum. One reply unsticks the queue.",
    keywords: ["speed", "movement", "alignment"],
  },
  nine: {
    upright: "Almost across the finish line. One more push, then rest.",
    reversed: "Burned out. Protect the cushion before adding load.",
    keywords: ["resilience", "endurance", "guard"],
  },
  ten: {
    upright: "Overloaded. Delegate, automate, or drop one thing this week.",
    reversed: "The load is lifting because you finally said no.",
    keywords: ["burden", "responsibility", "release"],
  },
  page: {
    upright: "Curiosity arrives. Take the short course before the long bet.",
    reversed: "Scattered enthusiasm. Pick one experiment, finish it.",
    keywords: ["learner", "explorer", "trial"],
  },
  knight: {
    upright: "Bold move. The opportunity rewards action this quarter.",
    reversed: "Reckless speed. Get one second opinion before signing.",
    keywords: ["bold", "adventure", "drive"],
  },
  queen: {
    upright: "Confident magnetism. Your work attracts the right client this week.",
    reversed: "Self-doubt is dimming the offer. Raise the price.",
    keywords: ["warmth", "confidence", "draw"],
  },
  king: {
    upright: "Long-game vision. The decision serves you ten years out.",
    reversed: "Ego decision. Whose approval are you actually buying?",
    keywords: ["vision", "leadership", "mastery"],
  },
};

const CUPS: Record<string, MinorMeta> = {
  ace: {
    upright:
      "Generosity returns. A gift, a tip, an unexpected reimbursement — receive it cleanly.",
    reversed: "Emotional spending. Name the feeling before the swipe.",
    keywords: ["receiving", "open heart", "flow"],
  },
  two: {
    upright: "A joint money decision goes well. Ask for the agreement out loud.",
    reversed: "Imbalance with a partner around spending. Surface it kindly.",
    keywords: ["partnership", "balance", "union"],
  },
  three: {
    upright: "A small celebration is worth the line item.",
    reversed: "Over-celebrating to mask anxiety. Look underneath.",
    keywords: ["celebration", "community", "joy"],
  },
  four: {
    upright: "Bored with your current plan. Boredom is not failure — boring saves.",
    reversed: "Re-engagement. The plan looks workable again.",
    keywords: ["apathy", "reassessment", "contemplation"],
  },
  five: {
    upright: "Grief over a loss. Two cups still stand — count what remains.",
    reversed: "Acceptance. The lesson is paid for; keep it.",
    keywords: ["loss", "regret", "salvage"],
  },
  six: {
    upright: "Nostalgia spending creeps in. The childhood treat is fine in moderation.",
    reversed: "Stuck in past money patterns. Adult-you can override.",
    keywords: ["nostalgia", "memory", "innocence"],
  },
  seven: {
    upright: "Too many options. The choice paralysis is the cost — narrow to three.",
    reversed: "Clarity arrives. One option lights up.",
    keywords: ["choices", "fantasy", "illusion"],
  },
  eight: {
    upright: "Walk away. A draining money situation deserves the exit.",
    reversed: "Hesitating at the threshold. The next page is already open.",
    keywords: ["withdrawal", "search", "departure"],
  },
  nine: {
    upright: "A wish granted, in proportion. Enjoy without inflating the next one.",
    reversed: "Satisfaction is missing despite the win. Check the goal.",
    keywords: ["wish", "contentment", "fulfillment"],
  },
  ten: {
    upright: "The family-money picture aligns. Joint goals are clicking.",
    reversed: "Surface harmony, hidden tension. One conversation overdue.",
    keywords: ["family", "harmony", "fulfillment"],
  },
  page: {
    upright: "A gentle financial idea — try it small.",
    reversed: "Wishful thinking. Run the math before the dream.",
    keywords: ["dreamer", "intuition", "creative"],
  },
  knight: {
    upright: "An offer or invitation arrives. Read the fine print warmly.",
    reversed: "Charm hides risk. Trust but verify.",
    keywords: ["romance", "offer", "charm"],
  },
  queen: {
    upright: "Emotional money intelligence. You sense what the household needs.",
    reversed: "Over-giving. Refill your own cup first.",
    keywords: ["compassion", "intuition", "care"],
  },
  king: {
    upright: "Cool head, warm heart. Hard decisions made without panic.",
    reversed: "Suppressing concerns until they spill. Speak earlier.",
    keywords: ["composure", "diplomacy", "steady"],
  },
};

const SWORDS: Record<string, MinorMeta> = {
  ace: {
    upright: "Mental clarity. The truth about a number is visible today.",
    reversed: "Self-deception. The story you're telling is missing a column.",
    keywords: ["clarity", "breakthrough", "truth"],
  },
  two: {
    upright: "A stalemate. List the pros and cons in writing — the answer reveals.",
    reversed: "Decision time. The stall has cost more than the choice will.",
    keywords: ["stalemate", "balance", "indecision"],
  },
  three: {
    upright: "A painful money truth surfaces. Acknowledge it — then plan.",
    reversed: "Healing from a money grief. The sharpness is fading.",
    keywords: ["hurt", "truth", "grief"],
  },
  four: {
    upright: "Rest. The mind needs a financial sabbath — close the app for a day.",
    reversed: "Restless. You're rested enough; the next action is ready.",
    keywords: ["rest", "recovery", "pause"],
  },
  five: {
    upright: "A win at someone's cost. Was the fight worth the friendship?",
    reversed: "Reconciliation. Apologize for the money jab.",
    keywords: ["conflict", "pyrrhic", "tension"],
  },
  six: {
    upright: "Move on from a chapter. The new town, the new job, the new account.",
    reversed: "Resistance to leaving. The dock is rotting; the boat is fine.",
    keywords: ["transition", "passage", "release"],
  },
  seven: {
    upright: "Strategy. Watch where you're being charged silently — audit your statements.",
    reversed: "Self-sabotage. The habit you hide is the one to name.",
    keywords: ["strategy", "stealth", "deception"],
  },
  eight: {
    upright: "Trapped feeling. The cage is mostly in your head — list three exits.",
    reversed: "Freedom dawns. One assumption broken opens the room.",
    keywords: ["restriction", "trap", "blocked"],
  },
  nine: {
    upright: "Money anxiety at night. Tomorrow's spreadsheet is friendlier than tonight's catastrophe.",
    reversed: "The anxiety is releasing. Sleep, then check.",
    keywords: ["anxiety", "worry", "dread"],
  },
  ten: {
    upright: "Rock bottom of a money chapter. Only up from here.",
    reversed: "Refusing the lesson. The same wound twice is a pattern.",
    keywords: ["bottom", "collapse", "endings"],
  },
  page: {
    upright: "Curiosity about an investment idea — research before commit.",
    reversed: "Gossip about money. Discount what cousins say.",
    keywords: ["watchful", "curious", "vigilant"],
  },
  knight: {
    upright: "Decisive cut. Cancel the subscription, fire the vendor, end the trial.",
    reversed: "Hasty cut. Wait twenty-four hours before any reversal.",
    keywords: ["assertive", "sharp", "swift"],
  },
  queen: {
    upright: "Independent judgement. You don't need anyone's approval on this purchase.",
    reversed: "Coldness. Money decisions made out of resentment cost twice.",
    keywords: ["independent", "clear-eyed", "discerning"],
  },
  king: {
    upright: "Wise authority. Make the rule that future-you will thank.",
    reversed: "Tyranny of the spreadsheet. Numbers serve a life, not the other way around.",
    keywords: ["intellect", "ethics", "discipline"],
  },
};

const PENTACLES: Record<string, MinorMeta> = {
  ace: {
    upright: "A tangible opportunity. The raise, the bonus, the contract — take it.",
    reversed: "A missed opportunity stings. The next one is closer than you think.",
    keywords: ["opportunity", "seed", "tangible"],
  },
  two: {
    upright: "Juggling two income streams or two debts. The rhythm is working.",
    reversed: "Dropping balls. Simplify by one stream this month.",
    keywords: ["juggling", "balance", "adaptability"],
  },
  three: {
    upright: "Collaboration pays. The right partner makes the project profitable.",
    reversed: "Wrong team. The friction is costing more than the project earns.",
    keywords: ["teamwork", "skill", "craft"],
  },
  four: {
    upright: "Grip tightening. Saving works; hoarding doesn't. Loosen one finger.",
    reversed: "Releasing the grip. Generosity returns in kind.",
    keywords: ["security", "hoard", "control"],
  },
  five: {
    upright: "A lean month. Help is closer than the cold suggests — ask.",
    reversed: "The lean phase ends. Warmth returns.",
    keywords: ["lack", "hardship", "isolation"],
  },
  six: {
    upright: "Generosity flows both directions. Give or receive without keeping score.",
    reversed: "Strings attached. Make the terms explicit.",
    keywords: ["generosity", "exchange", "fairness"],
  },
  seven: {
    upright: "Patience. The investment is growing slowly — that is the design.",
    reversed: "Impatience with compound time. Don't pull the seedling to check the roots.",
    keywords: ["patience", "harvest", "investment"],
  },
  eight: {
    upright: "Skill builds. Each hour of study compounds. Keep going.",
    reversed: "Skipping repetitions. The shortcut takes longer.",
    keywords: ["mastery", "diligence", "craftsmanship"],
  },
  nine: {
    upright: "Self-sufficiency. The garden you tended is feeding you.",
    reversed: "Isolation dressed as independence. Let someone in.",
    keywords: ["independence", "luxury", "self-reliance"],
  },
  ten: {
    upright: "Generational wealth — even a small step counts. Estate plan, beneficiary, will.",
    reversed: "Family money entanglement. Clarity benefits everyone.",
    keywords: ["legacy", "inheritance", "family wealth"],
  },
  page: {
    upright: "A new financial study. Start the course, read the book.",
    reversed: "Procrastinated learning. Begin a chapter today.",
    keywords: ["studious", "earnest", "diligent"],
  },
  knight: {
    upright: "Slow and steady wins. Automate the boring, repeat the boring, win.",
    reversed: "Stuck in a rut. The same boring needs one variable changed.",
    keywords: ["steady", "methodical", "reliable"],
  },
  queen: {
    upright: "Practical abundance. The household runs because you tend the numbers.",
    reversed: "Self-neglect. The caregiver needs care too.",
    keywords: ["nurturing", "practical", "abundance"],
  },
  king: {
    upright: "Wealth as ease. You have enough — let it serve the life you want.",
    reversed: "Status spending. The car talks; the bank account whispers louder.",
    keywords: ["prosperity", "security", "patriarch"],
  },
};

const RANKS = ["ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "page", "knight", "queen", "king"] as const;
const RANK_NUMS: Record<(typeof RANKS)[number], number> = {
  ace: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  page: 11,
  knight: 12,
  queen: 13,
  king: 14,
};

const SUIT_GLYPHS: Record<Suit, string> = {
  wands: "🔥",
  cups: "💧",
  swords: "⚔️",
  pentacles: "🪙",
};

function buildMinor(suit: Suit, meta: Record<string, MinorMeta>): TarotCard[] {
  return RANKS.map((rank) => ({
    id: `${rank}_of_${suit}`,
    name: `${rank[0].toUpperCase() + rank.slice(1)} of ${suit[0].toUpperCase() + suit.slice(1)}`,
    arcana: "minor" as const,
    suit,
    number: RANK_NUMS[rank],
    keywords: meta[rank].keywords,
    upright: meta[rank].upright,
    reversed: meta[rank].reversed,
    glyph: SUIT_GLYPHS[suit],
  }));
}

export const DECK: TarotCard[] = [
  ...MAJORS,
  ...buildMinor("wands", WANDS),
  ...buildMinor("cups", CUPS),
  ...buildMinor("swords", SWORDS),
  ...buildMinor("pentacles", PENTACLES),
];

if (DECK.length !== 78) {
  throw new Error(`Deck must have 78 cards, has ${DECK.length}`);
}

export function getCard(id: string): TarotCard {
  const c = DECK.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown card: ${id}`);
  return c;
}

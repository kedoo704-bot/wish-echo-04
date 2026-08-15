/**
 * The Garden's curated starter letters — static content, no database. This
 * is what makes /garden feel populated without needing a live public feed
 * of user submissions. A visitor can also write and share their own (see
 * app/garden/write) — those are DB-backed (src/lib/garden.ts) but behave
 * like a regular Kehdoo card: a private link, not listed here.
 *
 * flowerSeed is fixed per letter (not random) so the same pre-defined
 * letter always shows the same bouquet.
 */
export type PredefinedLetter = {
  slug: string;
  message: string;
  to: string;
  from: string;
  flowerSeed: number;
};

const PREDEFINED_LETTERS: PredefinedLetter[] = [
  {
    slug: "for-a-friend",
    message:
      "Just wanted to say — you make hard days easier and good days brighter. Thank you for being exactly who you are.",
    to: "a friend",
    from: "someone who's grateful",
    flowerSeed: 1201,
  },
  {
    slug: "good-morning",
    message: "Good morning! Wherever you are today, I hope something small makes you smile. You deserve it.",
    to: "you",
    from: "a stranger",
    flowerSeed: 4482,
  },
  {
    slug: "im-sorry",
    message: "I've been meaning to say this properly: I'm sorry. I hope we can move past it, together.",
    to: "you know who you are",
    from: "",
    flowerSeed: 7734,
  },
  {
    slug: "long-distance",
    message: "Miles apart but never far from my mind. Counting down the days until I see you again.",
    to: "my person",
    from: "missing you",
    flowerSeed: 3390,
  },
  {
    slug: "be-proud",
    message: "Whatever today looked like, you showed up. That's enough. Be proud of yourself.",
    to: "you",
    from: "a reminder",
    flowerSeed: 8817,
  },
  {
    slug: "thank-you",
    message: "You probably don't know how much that small thing you did meant to me. So — thank you.",
    to: "you",
    from: "someone you helped",
    flowerSeed: 2265,
  },
];

export function getAllPredefinedLetters(): PredefinedLetter[] {
  return PREDEFINED_LETTERS;
}

export function getAllPredefinedSlugs(): string[] {
  return PREDEFINED_LETTERS.map((l) => l.slug);
}

export function getPredefinedLetterBySlug(slug: string): PredefinedLetter | undefined {
  return PREDEFINED_LETTERS.find((l) => l.slug === slug);
}

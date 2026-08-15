import { getPredefinedLetterBySlug } from "@/lib/garden-letters-content";

/**
 * SEO landing pages for the Garden — one per letter theme, each linked to
 * a real pre-defined letter (src/lib/garden-letters-content.ts) so the
 * "sample" shown on the page is honest content the product actually
 * ships, not invented copy. Same programmatic-SEO shape as
 * src/lib/occasion-content.ts for /wishes: a typed content array + one
 * shared template component (GardenLandingPage) + one dynamic route.
 *
 * Slug is deliberately keyword-rich and decoupled from the underlying
 * letter's own short slug, same reasoning as occasion-content.ts.
 */
export type GardenLandingContent = {
  slug: string;
  letterSlug: string; // foreign key into PREDEFINED_LETTERS
  label: string;
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  heroSubheadline: string;
  keywords: string[];
};

const GARDEN_LANDING_CONTENT: GardenLandingContent[] = [
  {
    slug: "letter-to-a-friend",
    letterSlug: "for-a-friend",
    label: "Letter to a Friend",
    metaTitle: "Letter to a Friend — Write & Share a Decorated Note | Kehdoo Garden",
    metaDescription:
      "Write a heartfelt letter to a friend and share it as a decorated note with its own illustrated bouquet. Free, anonymous, no sign-up.",
    heroHeadline: "A letter for a friend, decorated with flowers",
    heroSubheadline: "Some things are easier to say in a letter. Write yours and share it as one link.",
    keywords: ["letter to a friend", "friendship letter", "note for a friend", "digital garden letter"],
  },
  {
    slug: "good-morning-letter",
    letterSlug: "good-morning",
    label: "Good Morning Letter",
    metaTitle: "Good Morning Letter — Write & Share a Decorated Note | Kehdoo Garden",
    metaDescription:
      "Start someone's day with a good morning letter, decorated with an illustrated flower bouquet. Free, anonymous, no sign-up.",
    heroHeadline: "A good morning letter, grown from flowers",
    heroSubheadline: "A few kind words, dressed up as a little bouquet — better than another forwarded GIF.",
    keywords: ["good morning letter", "good morning note", "digital garden letter"],
  },
  {
    slug: "apology-letter",
    letterSlug: "im-sorry",
    label: "Apology Letter",
    metaTitle: "Apology Letter — Write & Share a Decorated Note | Kehdoo Garden",
    metaDescription:
      "Say sorry properly with a written apology letter, decorated with an illustrated flower bouquet. Free, anonymous, no sign-up.",
    heroHeadline: "An apology, said properly",
    heroSubheadline: "Some apologies deserve more than a text. Write it out, and let it bloom a little.",
    keywords: ["apology letter", "sorry letter", "how to apologize in writing", "digital garden letter"],
  },
  {
    slug: "long-distance-love-letter",
    letterSlug: "long-distance",
    label: "Long-Distance Love Letter",
    metaTitle: "Long-Distance Love Letter — Write & Share a Decorated Note | Kehdoo Garden",
    metaDescription:
      "Write a long-distance love letter and share it as a decorated note with its own illustrated bouquet. Free, anonymous, no sign-up.",
    heroHeadline: "A love letter across any distance",
    heroSubheadline: "Miles apart is still just miles. Say what you'd say if they were in the room.",
    keywords: ["long distance love letter", "love letter online", "digital garden letter"],
  },
  {
    slug: "letter-of-encouragement",
    letterSlug: "be-proud",
    label: "Letter of Encouragement",
    metaTitle: "Letter of Encouragement — Write & Share a Decorated Note | Kehdoo Garden",
    metaDescription:
      "Write a letter of encouragement for someone (or yourself), decorated with an illustrated flower bouquet. Free, anonymous, no sign-up.",
    heroHeadline: "A little encouragement, in writing",
    heroSubheadline: "Sometimes the kindest thing is just telling someone: you're doing fine.",
    keywords: ["letter of encouragement", "motivational letter", "digital garden letter"],
  },
  {
    slug: "thank-you-letter",
    letterSlug: "thank-you",
    label: "Thank You Letter",
    metaTitle: "Thank You Letter — Write & Share a Decorated Note | Kehdoo Garden",
    metaDescription:
      "Write a proper thank-you letter and share it as a decorated note with its own illustrated bouquet. Free, anonymous, no sign-up.",
    heroHeadline: "A thank you, written out in full",
    heroSubheadline: "\"Thanks\" is easy to type. A real thank-you letter is easy to keep.",
    keywords: ["thank you letter", "gratitude letter", "digital garden letter"],
  },
];

export function getAllGardenLandingSlugs(): string[] {
  return GARDEN_LANDING_CONTENT.map((c) => c.slug);
}

export function getGardenLandingBySlug(slug: string): GardenLandingContent | undefined {
  return GARDEN_LANDING_CONTENT.find((c) => c.slug === slug);
}

export function getAllGardenLandingContent(): GardenLandingContent[] {
  return GARDEN_LANDING_CONTENT;
}

/** The real pre-defined letter backing this landing page's sample section. */
export function getSampleLetterFor(content: GardenLandingContent) {
  return getPredefinedLetterBySlug(content.letterSlug);
}

/** Fallback FAQs — same 3-question shape for every theme, no fabricated claims. */
export function getGardenLandingFaqs(content: GardenLandingContent): Array<{ question: string; answer: string }> {
  return [
    {
      question: `Is writing a ${content.label.toLowerCase()} on Kehdoo free?`,
      answer: "Yes. Writing and sharing a letter in the Garden is free, and no account is required.",
    },
    {
      question: "Who can read the letter I write?",
      answer:
        "Your letter gets its own private link, like a Kehdoo card — anyone with that link can read it, but it isn't listed publicly for others to browse.",
    },
    {
      question: "What does the illustrated bouquet look like?",
      answer:
        "Every letter gets its own small cluster of roses, sunflowers, and lotus flowers, generated from the letter itself so it looks the same every time you open it.",
    },
  ];
}

import { MESSAGE_TEMPLATES, MESSAGE_TYPES } from "@/lib/wish";

/**
 * Occasion landing-page copy, keyed by a keyword-rich URL slug rather than
 * the short internal MESSAGE_TYPES id — this is the one typed accessor layer
 * every /wishes/[slug] route, its metadata, its JSON-LD, and the sitemap all
 * read from. Sample messages are NOT duplicated here: they're pulled live
 * from MESSAGE_TEMPLATES in src/lib/wish.ts, the same data the creator flow
 * itself uses, so a landing page can never show a message the product
 * doesn't actually offer.
 *
 * "custom" is intentionally excluded — it has no fixed occasion to target
 * with a keyword-driven page.
 */
export type OccasionContent = {
  slug: string;
  occasionId: string;
  label: string;
  emoji: string;
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  heroSubheadline: string;
  keywords: string[];
};

const OCCASION_CONTENT: OccasionContent[] = [
  {
    slug: "birthday-wishes",
    occasionId: "birthday",
    label: "Birthday Wishes",
    emoji: "🎂",
    metaTitle: "Birthday Wishes — Free Animated Birthday Card Maker",
    metaDescription:
      "Create a beautiful animated birthday wish in seconds. Pick a heartfelt message, add a photo, and share an unforgettable birthday card as one link.",
    heroHeadline: "Birthday wishes that feel like a real gift",
    heroSubheadline:
      "Turn a birthday message into a gorgeous animated card — no design skills, no app download.",
    keywords: ["birthday wishes", "happy birthday card", "animated birthday card", "birthday message online"],
  },
  {
    slug: "thank-you-messages",
    occasionId: "thank-you",
    label: "Thank You Messages",
    emoji: "💖",
    metaTitle: "Thank You Messages — Free Animated Thank You Card Maker",
    metaDescription:
      "Say thank you properly. Create a heartfelt, animated thank-you card in seconds and share it as a single link — free, no sign-up required.",
    heroHeadline: "Thank you messages that actually land",
    heroSubheadline: "Turn a few grateful words into a gorgeous animated card your person will keep.",
    keywords: ["thank you messages", "thank you card online", "gratitude message", "animated thank you card"],
  },
  {
    slug: "sorry-messages",
    occasionId: "sorry",
    label: "Sorry Messages",
    emoji: "🌸",
    metaTitle: "Sorry Messages — Free Animated Apology Card Maker",
    metaDescription:
      "Say sorry in a way that feels sincere. Create a gentle, animated apology card in seconds and share it as one link.",
    heroHeadline: "An apology that feels sincere",
    heroSubheadline: "Turn a heartfelt sorry into a beautiful animated card, shared with one tap.",
    keywords: ["sorry messages", "apology card online", "sorry card", "animated apology message"],
  },
  {
    slug: "good-morning-wishes",
    occasionId: "good-morning",
    label: "Good Morning Wishes",
    emoji: "☀️",
    metaTitle: "Good Morning Wishes — Free Animated Good Morning Card Maker",
    metaDescription:
      "Start someone's day right. Create a bright, animated good morning wish in seconds and share it as a single link.",
    heroHeadline: "Good morning wishes worth waking up to",
    heroSubheadline: "A warm animated card is a nicer way to say good morning than a forwarded GIF.",
    keywords: ["good morning wishes", "good morning card", "good morning message online", "animated good morning card"],
  },
  {
    slug: "congratulations-messages",
    occasionId: "congrats",
    label: "Congratulations Messages",
    emoji: "🎉",
    metaTitle: "Congratulations Messages — Free Animated Congrats Card Maker",
    metaDescription:
      "Celebrate someone's win properly. Create an animated congratulations card in seconds and share it as one link.",
    heroHeadline: "Congratulations that feel as big as the win",
    heroSubheadline: "Turn your congrats into a gorgeous animated card they'll actually want to keep.",
    keywords: ["congratulations messages", "congrats card online", "animated congratulations card"],
  },
  {
    slug: "get-well-soon-messages",
    occasionId: "get-well",
    label: "Get Well Soon Messages",
    emoji: "🌿",
    metaTitle: "Get Well Soon Messages — Free Animated Get Well Card Maker",
    metaDescription:
      "Send comfort, not just words. Create a gentle, animated get well soon card in seconds and share it as one link.",
    heroHeadline: "Get well soon messages that show you care",
    heroSubheadline: "A soft animated card can say more than a text ever could.",
    keywords: ["get well soon messages", "get well card online", "animated get well soon card"],
  },
  {
    slug: "miss-you-messages",
    occasionId: "miss-you",
    label: "Miss You Messages",
    emoji: "💌",
    metaTitle: "Miss You Messages — Free Animated Miss You Card Maker",
    metaDescription:
      "Tell them you miss them, beautifully. Create an animated miss-you card in seconds and share it as a single link.",
    heroHeadline: "Miss you messages across any distance",
    heroSubheadline: "Turn 'I miss you' into a gorgeous animated card, shared in one tap.",
    keywords: ["miss you messages", "miss you card online", "animated miss you card"],
  },
  {
    slug: "best-wishes-messages",
    occasionId: "best-wishes",
    label: "Best Wishes Messages",
    emoji: "✨",
    metaTitle: "Best Wishes Messages — Free Animated Well-Wishes Card Maker",
    metaDescription:
      "Send your best wishes for a new job, move, or milestone. Create an animated card in seconds and share it as one link.",
    heroHeadline: "Best wishes for whatever comes next",
    heroSubheadline: "A gorgeous animated card for new jobs, new chapters, and new beginnings.",
    keywords: ["best wishes messages", "best wishes card online", "animated well wishes card"],
  },
  {
    slug: "anniversary-wishes",
    occasionId: "anniversary",
    label: "Anniversary Wishes",
    emoji: "💍",
    metaTitle: "Anniversary Wishes — Free Animated Anniversary Card Maker",
    metaDescription:
      "Celebrate another year together. Create a romantic, animated anniversary card in seconds and share it as one link.",
    heroHeadline: "Anniversary wishes worth celebrating",
    heroSubheadline: "Turn your anniversary message into a gorgeous animated card they'll treasure.",
    keywords: ["anniversary wishes", "anniversary card online", "animated anniversary card"],
  },
  {
    slug: "fathers-day-wishes",
    occasionId: "fathers-day",
    label: "Father's Day Wishes",
    emoji: "👔",
    metaTitle: "Father's Day Wishes — Free Animated Father's Day Card Maker",
    metaDescription:
      "Give your dad a card he'll actually keep. Create an animated Father's Day wish in seconds and share it as one link.",
    heroHeadline: "Father's Day wishes he'll actually keep",
    heroSubheadline: "Turn a heartfelt message into a gorgeous animated card for the man who's done it all.",
    keywords: ["fathers day wishes", "fathers day card online", "animated fathers day card"],
  },
];

export function getAllOccasionSlugs(): string[] {
  return OCCASION_CONTENT.map((o) => o.slug);
}

export function getOccasionBySlug(slug: string): OccasionContent | undefined {
  return OCCASION_CONTENT.find((o) => o.slug === slug);
}

export function getAllOccasions(): OccasionContent[] {
  return OCCASION_CONTENT;
}

/** Real sample messages for an occasion, pulled live from the creator's own template data. */
export function getSampleMessages(occasionId: string) {
  return MESSAGE_TEMPLATES[occasionId] ?? [];
}

/** Synthesized, honest FAQs — same 4-question shape for every occasion, no fabricated claims. */
export function getOccasionFaqs(occasion: OccasionContent): Array<{ question: string; answer: string }> {
  const messageType = MESSAGE_TYPES.find((t) => t.id === occasion.occasionId);
  const label = messageType?.label ?? occasion.label;

  return [
    {
      question: `What is a Kehdoo ${occasion.label.toLowerCase()} card?`,
      answer: `It's a short animated greeting page for "${label}" — write or pick a message, add a photo if you want, and Kehdoo turns it into a shareable card at a single link.`,
    },
    {
      question: `Is it free to create and share a ${occasion.label.toLowerCase()} card?`,
      answer: "Yes. Creating and sharing a card on Kehdoo is free, and you don't need an account to do it.",
    },
    {
      question: `Can I add a photo to my ${occasion.label.toLowerCase()} card?`,
      answer: "Yes. You can add a photo during creation — it's resized and stripped of metadata before it's stored.",
    },
    {
      question: "How do I share the card once it's ready?",
      answer:
        "Share the link directly via WhatsApp or your device's native share sheet, copy the link, or download the card as a PNG.",
    },
  ];
}

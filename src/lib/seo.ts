export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kehdoo.com";

/** Plain-text Q&A that doubles as crawlable AEO/GEO content and FAQPage JSON-LD. */
export const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "What is Kehdoo?",
    a: "Kehdoo is a free greeting-card maker that turns a short message into a beautiful animated page you can share as a single link — over WhatsApp, social media, email, or a QR code. No app download is required.",
  },
  {
    q: "Do I need an account to create a card?",
    a: "No. You can create and share a greeting without signing up. Signing in with Google is optional and only adds a dashboard where your saved cards are collected.",
  },
  {
    q: "Is Kehdoo free?",
    a: "Yes, creating and sharing greeting cards on Kehdoo is free.",
  },
  {
    q: "What occasions does Kehdoo support?",
    a: "Kehdoo includes ready-made messages for thank you, sorry, good morning, congratulations, happy birthday, get well soon, miss you, best wishes, and fully custom notes.",
  },
  {
    q: "Can I download or print the card?",
    a: "Yes. Every card can be downloaded as a high-resolution PNG or opened as a print-ready page to save as a PDF or print at home.",
  },
  {
    q: "Is my data private?",
    a: "Cards are shared through a private, unguessable link and are not indexed by search engines. Photos you add are resized and stripped of metadata before storage. You can create cards without an account at all.",
  },
];

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kehdoo",
  url: SITE_URL,
  slogan: "Jo dil mein hai, Kehdoo.",
  description: "Create and share heartfelt animated greeting cards as a single link.",
  logo: `${SITE_URL}/brand/app-full-logo.png`,
};

export const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Kehdoo",
  url: SITE_URL,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  description:
    "Turn a few words into a gorgeous animated greeting page. Share via WhatsApp, social, or QR — no sign-up required.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  inLanguage: "en",
};

export const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

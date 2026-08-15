/**
 * Single source of truth for the site's canonical URL and shared metadata
 * fields. Every route/module that needs the site origin or default OG/social
 * copy should import from here instead of redefining a local `BASE` constant
 * — that drift (9 separate copies in the reference project this pattern is
 * borrowed from) is exactly what this file exists to prevent.
 */
export const siteConfig = {
  name: "Kehdoo",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://kehdoo.com",
  description:
    "Turn a few words into a gorgeous animated greeting page. Share via WhatsApp, social, or QR. No sign-up required.",
  ogImage: "/brand/og-image.png", // 1200x630
  tagline: "Jo dil mein hai, Kehdoo",
} as const;

export const absoluteUrl = (path: string) =>
  `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;

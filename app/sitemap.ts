import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getAllOccasionSlugs } from "@/lib/occasion-content";
import { getAllPredefinedSlugs } from "@/lib/garden-letters-content";
import { getAllGardenLandingSlugs } from "@/lib/garden-landing-content";

// Stable site-wide fallback. Bump this only when page structure/copy
// meaningfully changes. A lastmod that moves on every build (e.g. via
// `new Date()`) trains crawlers to ignore the signal.
const SITE_LASTMOD = "2026-08-15";

export default function sitemap(): MetadataRoute.Sitemap {
  // Derived from the same accessor that backs generateStaticParams() for
  // /wishes/[slug] — a route can't exist here without also being built.
  const occasionEntries: MetadataRoute.Sitemap = getAllOccasionSlugs().map((slug) => ({
    url: `${siteConfig.url}/wishes/${slug}`,
    lastModified: SITE_LASTMOD,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: `${siteConfig.url}/`, lastModified: SITE_LASTMOD, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/wishes`, lastModified: SITE_LASTMOD, changeFrequency: "monthly", priority: 0.8 },
    ...occasionEntries,
    { url: `${siteConfig.url}/garden`, lastModified: SITE_LASTMOD, changeFrequency: "monthly", priority: 0.7 },
    ...getAllPredefinedSlugs().map((slug) => ({
      url: `${siteConfig.url}/garden/${slug}`,
      lastModified: SITE_LASTMOD,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    ...getAllGardenLandingSlugs().map((slug) => ({
      url: `${siteConfig.url}/garden/write/${slug}`,
      lastModified: SITE_LASTMOD,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    { url: `${siteConfig.url}/about`, lastModified: SITE_LASTMOD, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/privacy`, lastModified: SITE_LASTMOD, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/terms`, lastModified: SITE_LASTMOD, changeFrequency: "yearly", priority: 0.3 },
  ];
}

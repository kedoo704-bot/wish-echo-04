import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Stable site-wide fallback. Bump this only when page structure/copy
// meaningfully changes. A lastmod that moves on every build (e.g. via
// `new Date()`) trains crawlers to ignore the signal.
const SITE_LASTMOD = "2026-08-15";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteConfig.url}/`, lastModified: SITE_LASTMOD, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/about`, lastModified: SITE_LASTMOD, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/privacy`, lastModified: SITE_LASTMOD, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/terms`, lastModified: SITE_LASTMOD, changeFrequency: "yearly", priority: 0.3 },
  ];
}

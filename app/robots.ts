import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep private greetings, creator share pages, dashboard, and API routes out of crawls.
        // Garden letters carry their own noindex meta as needed (see
        // app/garden/[id]) rather than a blanket disallow here.
        disallow: ["/c/", "/share/", "/dashboard", "/api/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}

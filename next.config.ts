import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Content Security Policy. Dev needs 'unsafe-eval' + ws for HMR; production is
// tighter. Supabase (REST/Storage/Realtime), Google avatars, PostHog, and GTM
// are allowlisted.
//
// NOTE: GTM tags are managed from the GTM web UI without a code deploy — that's
// the whole point of using GTM. But any tag added there that talks to a new
// third-party host (a GA4 property, Meta Pixel, Google Ads conversion tag, ...)
// will be silently blocked by this CSP until its host is added here too. If a
// newly added GTM tag mysteriously doesn't fire, check the browser console for
// a CSP violation before assuming the tag itself is misconfigured.
const posthogHosts = "https://us.i.posthog.com https://us-assets.i.posthog.com";
const gtmHost = "https://www.googletagmanager.com";

const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' ${gtmHost} ${posthogHosts}${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https:`,
  `font-src 'self' data:`,
  `connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co ${gtmHost} ${posthogHosts}${
    isDev ? " ws://localhost:* http://localhost:*" : ""
  }`,
  `frame-src ${gtmHost}`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `object-src 'none'`,
  `manifest-src 'self'`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  ...(isDev
    ? []
    : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
];

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  outputFileTracingRoot: process.cwd(),
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
      {
        source: "/manifest.webmanifest",
        headers: [{ key: "Content-Type", value: "application/manifest+json" }],
      },
    ];
  },
};

export default nextConfig;

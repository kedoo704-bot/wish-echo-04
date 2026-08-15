"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    // App Router: client-side navigation doesn't fire a full page load, so
    // pageviews are captured explicitly in PostHogPageView instead.
    capture_pageview: false,
    capture_pageleave: true,
    // Don't create a person profile for anonymous visitors — Kehdoo cards can
    // be created without signing in, so most traffic should stay anonymous
    // until someone actually authenticates via identify().
    person_profiles: "identified_only",
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>;
}

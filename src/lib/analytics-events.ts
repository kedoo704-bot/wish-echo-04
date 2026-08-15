/**
 * Central event-name registry. Keep every posthog.capture() call site
 * importing from here rather than inlining string literals — that's what
 * stops event names from drifting into multiple spellings across the
 * codebase (which quietly breaks funnels/dashboards in the PostHog UI).
 */
export const AnalyticsEvent = {
  WISH_CREATED: "wish_created",
  CARD_SHARE_CLICKED: "card_share_clicked",
  CARD_DOWNLOADED: "card_downloaded",
} as const;

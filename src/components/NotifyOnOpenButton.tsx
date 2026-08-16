"use client";

import { useState } from "react";
import { Bell, BellRing } from "lucide-react";
import posthog from "posthog-js";
import { pushSupported, subscribeToCardOpenAlert } from "@/lib/push-client";
import { AnalyticsEvent } from "@/lib/analytics-events";

type Status = "idle" | "loading" | "subscribed" | "denied" | "unsupported";

/**
 * "Let me know when they open it" — shown on the creator's own share page
 * (/share/[id]) right after making a card. Subscribes this browser to a
 * one-time push when the card is first opened (see
 * app/api/cards/[id]/view, which fires the actual notification).
 */
export function NotifyOnOpenButton({ cardId }: { cardId: string }) {
  const [status, setStatus] = useState<Status>(() => (pushSupported() ? "idle" : "unsupported"));

  if (status === "unsupported") return null;

  const subscribe = async () => {
    setStatus("loading");
    const result = await subscribeToCardOpenAlert(cardId);
    if (result === "subscribed") posthog.capture(AnalyticsEvent.CARD_OPEN_ALERT_ENABLED);
    setStatus(result);
  };

  if (status === "subscribed") {
    return (
      <p className="mx-auto flex w-fit items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-2 text-xs font-medium text-primary">
        <BellRing className="h-3.5 w-3.5" />
        We&apos;ll notify you when it&apos;s opened
      </p>
    );
  }

  if (status === "denied") {
    return (
      <p className="mx-auto w-fit text-center text-[11px] text-muted-foreground">
        Notifications are blocked in your browser settings — you can still check view count from your dashboard.
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={subscribe}
      disabled={status === "loading"}
      className="btn-glass mx-auto flex w-fit items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium text-muted-foreground transition hover:text-foreground disabled:opacity-60"
    >
      <Bell className="h-3.5 w-3.5" />
      {status === "loading" ? "Enabling…" : "Notify me when they open it"}
    </button>
  );
}

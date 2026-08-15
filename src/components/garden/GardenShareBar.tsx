"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Sharing a letter is one button: copy the link. No WhatsApp/social menu,
 * no share sheet — matching gardenletters.online's own single floating
 * "copy" icon exactly, on the theory that a public letter's link is meant
 * to be pasted wherever, not routed through a picker.
 */
export function GardenShareBar({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — link is still visible/selectable on the page.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Link copied" : "Copy link"}
      title={copied ? "Copied!" : "Copy link"}
      className="absolute -right-4 top-8 grid h-11 w-11 place-items-center rounded-full bg-foreground text-background shadow-lg transition hover:opacity-90 active:scale-95"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Check, Copy, Download, Share2 } from "lucide-react";
import type { WishPayload } from "@/lib/wish";
import { downloadCardAsPng } from "@/lib/card-canvas";
import { getShareText, getShareTitle } from "@/lib/share";

/**
 * Creator-only share + download bar for a finished card. The caller supplies
 * the recipient URL so creator routes never leak into shared links.
 */
export function ShareActions({
  wish,
  emoji,
  label,
  photo,
  note,
  revealed,
  shareUrl,
}: {
  wish: WishPayload;
  emoji: string;
  label: string;
  photo?: string | null;
  note?: ReactNode;
  revealed: boolean;
  shareUrl?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [currentShareUrl, setCurrentShareUrl] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [actionNotice, setActionNotice] = useState("");
  const [manualCopyText, setManualCopyText] = useState("");

  useEffect(() => {
    setCurrentShareUrl(shareUrl ?? window.location.href);
  }, [shareUrl]);

  const shareTitle = getShareTitle(wish);
  const resolvedUrl = currentShareUrl || (typeof window !== "undefined" ? window.location.href : "");
  const shareText = getShareText(resolvedUrl);
  const shareWhatsapp = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const legacyCopy = (value: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    let copiedValue = false;
    try {
      copiedValue = document.execCommand("copy");
    } finally {
      document.body.removeChild(textarea);
    }

    return copiedValue;
  };

  const copyValue = async (value: string) => {
    try {
      if (window.isSecureContext && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else if (!legacyCopy(value)) {
        throw new Error("Clipboard unavailable");
      }
      setActionNotice("");
      setManualCopyText("");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      if (legacyCopy(value)) {
        setActionNotice("");
        setManualCopyText("");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return true;
      }

      setCopied(false);
      setManualCopyText(value);
      setActionNotice("Copy the text below.");
      return false;
    }
  };

  const copy = () => copyValue(resolvedUrl);

  const tryNative = async () => {
    setActionNotice("");
    setManualCopyText("");
    if ("share" in navigator) {
      try {
        const data = { title: shareTitle, text: shareText };
        if ("canShare" in navigator && !navigator.canShare(data)) {
          await copyValue(shareText);
          return;
        }
        await navigator.share(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        await copyValue(shareText);
      }
    } else {
      await copyValue(shareText);
    }
  };

  const handleDownloadPng = async () => {
    setDownloading(true);
    try {
      await downloadCardAsPng(wish, emoji, label, photo);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className={`safe-bottom fixed inset-x-0 bottom-0 z-50 px-4 pb-5 pt-6 transition-all duration-700 delay-200 ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ background: "linear-gradient(to top, var(--background) 72%, transparent)" }}
    >
      {/* On desktop the bar narrows and centres so it reads as an intentional
          floating action group rather than a full-width mobile dock. */}
      <div className="mx-auto w-full max-w-md">
        {note && (
          <p className="mx-auto mb-3 w-fit max-w-full rounded-full bg-background/78 px-3 py-1.5 text-center text-[11px] text-muted-foreground backdrop-blur-md">
            {note}
          </p>
        )}
        {actionNotice && (
          <p className="mx-auto mb-3 w-fit max-w-full rounded-full border border-destructive/20 bg-background/90 px-3 py-1.5 text-center text-[11px] text-destructive backdrop-blur-md">
            {actionNotice}
          </p>
        )}
        {manualCopyText && (
          <input
            readOnly
            value={manualCopyText}
            onFocus={(event) => event.currentTarget.select()}
            className="mb-3 h-10 w-full rounded-2xl border border-border/80 bg-background/92 px-3 text-xs text-foreground outline-none"
            aria-label="Share text"
          />
        )}

        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={tryNative}
            className="btn-3d flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-semibold"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <a
            href={shareWhatsapp}
            target="_blank"
            rel="noreferrer"
            aria-label="Share on WhatsApp"
            title="Share on WhatsApp"
            className="btn-glass flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-medium text-muted-foreground hover:text-foreground"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
            WhatsApp
          </a>
          <button
            onClick={copy}
            title={copied ? "Copied!" : "Copy link"}
            className="btn-glass flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-medium text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={handleDownloadPng}
            disabled={downloading}
            title="Download PNG"
            className="btn-glass flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            {downloading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="currentColor">
      <path d="M16.02 3.2A12.7 12.7 0 0 0 5.2 22.58L3.5 28.8l6.36-1.67A12.7 12.7 0 1 0 16.02 3.2Zm0 2.28a10.42 10.42 0 0 1 8.84 15.94 10.42 10.42 0 0 1-13.64 3.36l-.45-.27-3.78.99 1.01-3.68-.3-.48A10.42 10.42 0 0 1 16.02 5.48Zm-4.1 4.9c-.23 0-.6.08-.91.43-.31.34-1.2 1.17-1.2 2.86 0 1.68 1.23 3.31 1.4 3.54.17.23 2.37 3.79 5.86 5.16 2.9 1.14 3.5.91 4.13.85.63-.06 2.04-.83 2.33-1.63.29-.8.29-1.49.2-1.63-.09-.14-.31-.23-.66-.4-.34-.17-2.04-1-2.36-1.11-.31-.12-.54-.17-.77.17-.23.34-.88 1.11-1.08 1.34-.2.23-.4.26-.74.09-.34-.17-1.45-.53-2.77-1.7-1.02-.91-1.71-2.03-1.91-2.37-.2-.34-.02-.53.15-.7.16-.15.34-.4.51-.6.17-.2.23-.34.34-.57.12-.23.06-.43-.03-.6-.09-.17-.77-1.86-1.06-2.54-.28-.67-.56-.58-.77-.59h-.66Z" />
    </svg>
  );
}

"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Check, Copy, Download, MessageCircle, Printer, Share2 } from "lucide-react";
import type { WishPayload } from "@/lib/wish";
import { downloadCardAsPng, printCard } from "@/lib/card-canvas";
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
  const [printing, setPrinting] = useState(false);
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
        const data = { title: shareTitle, text: shareText, url: resolvedUrl };
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

  const handlePrint = async () => {
    setPrinting(true);
    try {
      await printCard(wish, emoji, label, photo);
    } finally {
      setPrinting(false);
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

        <div className="grid grid-cols-[1fr_auto] gap-2">
          <button
            onClick={tryNative}
            className="btn-3d flex min-h-12 items-center justify-center gap-2 rounded-2xl py-3.5 text-base font-semibold"
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
            className="btn-glass flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-2 grid grid-cols-4 gap-2">
          <button
            onClick={copy}
            title={copied ? "Copied!" : "Copy link"}
            className="btn-glass flex min-h-11 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-medium text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={handleDownloadPng}
            disabled={downloading}
            title="Download PNG"
            className="btn-glass flex min-h-11 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            {downloading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Save
          </button>
          <button
            onClick={handlePrint}
            disabled={printing}
            title="Print or save PDF"
            className="btn-glass flex min-h-11 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            {printing ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground" />
            ) : (
              <Printer className="h-4 w-4" />
            )}
            Print
          </button>
          <Link
            href="/"
            className="btn-glass flex min-h-11 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-medium text-muted-foreground hover:text-foreground"
          >
            <span className="text-sm leading-none">+</span>
            Create
          </Link>
        </div>
      </div>
    </div>
  );
}

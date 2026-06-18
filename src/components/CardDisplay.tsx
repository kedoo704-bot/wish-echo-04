"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MESSAGE_TYPES } from "@/lib/wish";
import { downloadCardAsPng, printCard } from "@/lib/card-canvas";
import { WishBackground } from "@/components/WishBackground";
import { incrementViews, getPhotoUrl, type CardRow } from "@/lib/cards";

export default function CardDisplay({ card }: { card: CardRow }) {
  const wish = card.payload;
  const typeMeta = MESSAGE_TYPES.find((m) => m.id === wish.type) ?? MESSAGE_TYPES[0];
  const photoUrl = card.photo_path ? getPhotoUrl(card.photo_path) : null;

  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setShareUrl(window.location.href);
    const t = setTimeout(() => setRevealed(true), 300);
    incrementViews(card.id);
    return () => clearTimeout(t);
  }, [card.id]);

  const copy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `${typeMeta.emoji} A wish for you from Kehdoo`;
  const shareWhatsapp = `https://wa.me/?text=${encodeURIComponent(`${shareText}: ${shareUrl}`)}`;

  const tryNative = async () => {
    if (
      typeof navigator !== "undefined" &&
      (navigator as Navigator & { share?: () => void }).share
    ) {
      try {
        await (
          navigator as Navigator & { share: (data: { title: string; text: string; url: string }) => Promise<void> }
        ).share({ title: "Kehdoo", text: shareText, url: shareUrl });
      } catch {
        /* user cancelled */
      }
    } else {
      copy();
    }
  };

  const handleDownloadPng = async () => {
    setDownloading(true);
    try {
      await downloadCardAsPng(wish, typeMeta.emoji, typeMeta.label, photoUrl ?? null);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = async () => {
    setPrinting(true);
    try {
      await printCard(wish, typeMeta.emoji, typeMeta.label, photoUrl ?? null);
    } finally {
      setPrinting(false);
    }
  };

  return (
    <main className="relative min-h-[100dvh] pb-36">
      <WishBackground bg={wish.bg} />

      {/* Floating back pill */}
      <div className="safe-top pointer-events-none absolute inset-x-0 top-0 z-50 px-5 pt-4">
        <Link
          href="/"
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3.5 py-2 text-sm font-medium backdrop-blur-md transition active:scale-95 hover:bg-background/95"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <span>←</span>
          <span className="font-serif text-base">Kehdoo</span>
        </Link>
      </div>

      {/* Card */}
      <div className="relative z-10 mx-auto max-w-2xl px-5 pt-20 md:px-8">
        <article
          className={`relative overflow-hidden rounded-[2.5rem] border border-border/60 bg-card/85 p-8 text-center shadow-2xl backdrop-blur-md transition-all duration-700 md:p-14 ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          {photoUrl && (
            <div className="absolute right-6 top-6 h-20 w-20 overflow-hidden rounded-full ring-[3px] ring-primary/30 shadow-xl">
              <img src={photoUrl} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          <div
            className="text-6xl md:text-8xl"
            style={{ animation: "floaty 4s ease-in-out infinite" }}
          >
            {typeMeta.emoji}
          </div>
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.38em] text-muted-foreground">
            {typeMeta.label}
          </p>
          {wish.to && (
            <h1 className="mt-7 font-serif text-5xl leading-[1.05] md:text-6xl">
              Dear <span className="italic shimmer-text">{wish.to}</span>,
            </h1>
          )}
          <p className="mx-auto mt-7 max-w-xl whitespace-pre-wrap font-serif text-2xl leading-relaxed text-foreground/90 md:text-3xl">
            {wish.message}
          </p>
          {wish.from && (
            <p className="mt-10 font-serif text-xl italic text-muted-foreground">
              — with love, {wish.from}
            </p>
          )}
          <div className="mx-auto mt-10 h-px w-20 bg-border/60" />
          <p className="mt-4 font-serif text-sm italic text-muted-foreground/70">
            Jo dil mein hai, Kehdoo.
          </p>
        </article>
      </div>

      {/* Fixed bottom action bar */}
      <div
        className={`safe-bottom fixed inset-x-0 bottom-0 z-50 px-4 pb-5 pt-6 transition-all duration-700 delay-300 ${
          revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        style={{
          background: "linear-gradient(to top, var(--background) 70%, transparent)",
        }}
      >
        {/* View count */}
        <p className="mb-3 text-center text-[11px] text-muted-foreground">
          {card.view_count > 1
            ? `Opened ${card.view_count} times`
            : "Just opened for the first time ✨"}
        </p>

        {/* Action row */}
        <div className="flex items-center gap-2">
          {/* Primary share button */}
          <button
            onClick={tryNative}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-base font-semibold text-primary-foreground transition-all active:scale-[0.97] active:brightness-95"
            style={{
              background: "var(--gradient-accent)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            ✦ Share
          </button>

          {/* Copy link */}
          <button
            onClick={copy}
            aria-label="Copy link"
            title={copied ? "Copied!" : "Copy link"}
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-card/80 text-base backdrop-blur transition active:scale-95 hover:bg-card"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            {copied ? (
              <span className="text-primary text-sm font-semibold">✓</span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            )}
          </button>

          {/* WhatsApp */}
          <a
            href={shareWhatsapp}
            target="_blank"
            rel="noreferrer"
            aria-label="Share on WhatsApp"
            title="Share on WhatsApp"
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-card/80 backdrop-blur transition active:scale-95 hover:bg-card"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L0 24l6.303-1.504A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.37l-.36-.213-3.736.892.942-3.639-.234-.373A9.818 9.818 0 0 1 2.182 12c0-5.423 4.395-9.818 9.818-9.818 5.424 0 9.818 4.395 9.818 9.818 0 5.424-4.394 9.818-9.818 9.818z"/>
            </svg>
          </a>

          {/* Download PNG */}
          <button
            onClick={handleDownloadPng}
            disabled={downloading}
            aria-label="Download as PNG"
            title="Download PNG"
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-card/80 backdrop-blur transition active:scale-95 hover:bg-card disabled:opacity-50"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            {downloading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            )}
          </button>
        </div>

        {/* Make your own */}
        <div className="mt-3 text-center">
          <Link
            href="/"
            className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline transition-colors"
          >
            Make your own →
          </Link>
        </div>
      </div>
    </main>
  );
}

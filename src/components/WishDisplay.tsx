"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { decodeWish, MESSAGE_TYPES } from "@/lib/wish";
import { downloadCardAsPng, printCard } from "@/lib/card-canvas";
import { toSrc } from "@/lib/image-compress";
import { WishBackground } from "@/components/WishBackground";

export default function WishDisplay() {
  const searchParams = useSearchParams();
  const token = searchParams.get("t") ?? "";
  const imgParam = searchParams.get("img");
  const wish = decodeWish(token);

  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setShareUrl(window.location.href);
    const t = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(t);
  }, []);

  /* ── invalid token ──────────────────────────────────────────────────── */
  if (!token || !wish) {
    return (
      <main className="relative grid min-h-screen place-items-center px-6 text-center">
        <WishBackground bg="gradient" dense={false} />
        <div className="relative z-10">
          <div className="text-6xl">🥺</div>
          <h1 className="mt-4 font-serif text-4xl">This wish couldn't be opened.</h1>
          <p className="mt-3 max-w-sm text-muted-foreground">
            The link may be incomplete or broken. Ask the sender to share the link again.
          </p>
          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90"
          >
            Create your own wish →
          </Link>
        </div>
      </main>
    );
  }

  const typeMeta = MESSAGE_TYPES.find((m) => m.id === wish.type) ?? MESSAGE_TYPES[0];

  const copy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `${typeMeta.emoji} A wish for you from Kehdoo`;
  const shareWhatsapp = `https://wa.me/?text=${encodeURIComponent(`${shareText}: ${shareUrl}`)}`;
  const shareTwitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  const tryNative = async () => {
    if (typeof navigator !== "undefined" && (navigator as Navigator & { share?: Function }).share) {
      try {
        await (navigator as Navigator & { share: Function }).share({
          title: "Kehdoo",
          text: shareText,
          url: shareUrl,
        });
      } catch {}
    } else {
      copy();
    }
  };

  const handleDownloadPng = async () => {
    setDownloading(true);
    try {
      await downloadCardAsPng(wish, typeMeta.emoji, typeMeta.label, imgParam);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = async () => {
    setPrinting(true);
    try {
      await printCard(wish, typeMeta.emoji, typeMeta.label, imgParam);
    } finally {
      setPrinting(false);
    }
  };

  return (
    <main className="relative min-h-screen px-5 py-10 md:px-8">
      <WishBackground bg={wish.bg} />

      {/* Back link */}
      <div className="relative z-10 mx-auto max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>←</span>
          <span className="font-serif text-base">Kehdoo</span>
        </Link>
      </div>

      {/* Wish card */}
      <div className="relative z-10 mx-auto mt-6 max-w-2xl">
        <article
          className={`relative overflow-hidden rounded-[2.5rem] border border-border/60 bg-card/85 p-8 text-center shadow-2xl backdrop-blur-md transition-all duration-700 md:p-14 ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          {imgParam && (
            <div className="absolute right-6 top-6 h-20 w-20 overflow-hidden rounded-full ring-[3px] ring-primary/30 shadow-xl">
              <img src={toSrc(imgParam)} alt="" className="h-full w-full object-cover" />
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

        {/* Share row */}
        <div
          className={`mt-5 transition-all duration-700 delay-200 ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={tryNative}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5"
              style={{ background: "var(--gradient-accent)", boxShadow: "var(--shadow-glow)" }}
            >
              ✦ Share
            </button>
            <button
              onClick={copy}
              className="rounded-full border border-border bg-card/80 px-5 py-2.5 text-sm backdrop-blur transition hover:bg-card"
            >
              {copied ? "Copied ✓" : "Copy link"}
            </button>
            <a
              href={shareWhatsapp}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border bg-card/80 px-5 py-2.5 text-sm backdrop-blur transition hover:bg-card"
            >
              WhatsApp
            </a>
            <a
              href={shareTwitter}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border bg-card/80 px-5 py-2.5 text-sm backdrop-blur transition hover:bg-card"
            >
              Twitter
            </a>
            <Link
              href="/"
              className="rounded-full border border-border bg-card/80 px-5 py-2.5 text-sm backdrop-blur transition hover:bg-card"
            >
              Make your own →
            </Link>
          </div>

          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            Nothing is stored. This whole wish lives inside the URL.
          </p>
        </div>

        {/* ── Download card section ────────────────────────────────────── */}
        <div
          className={`mt-8 transition-all duration-700 delay-400 ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div
            className="rounded-[1.75rem] border border-border/60 bg-card/70 p-6 backdrop-blur"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xl">🎴</span>
              <h2 className="font-serif text-xl">Save as greeting card</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Download a beautiful, print-ready card — or open as PDF to print at home.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleDownloadPng}
                disabled={downloading}
                className="flex items-center gap-2 rounded-2xl border border-border bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
              >
                {downloading ? (
                  <>
                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                    Rendering…
                  </>
                ) : (
                  <>
                    <span>⬇</span>
                    Download PNG
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                disabled={printing}
                className="flex items-center gap-2 rounded-2xl border border-border bg-card/80 px-5 py-3 text-sm font-medium backdrop-blur transition hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
                style={{ boxShadow: "var(--shadow-soft)" }}
              >
                {printing ? (
                  <>
                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60" />
                    Opening…
                  </>
                ) : (
                  <>
                    <span>🖨</span>
                    Print · Save as PDF
                  </>
                )}
              </button>
            </div>

            <p className="mt-3 text-[11px] text-muted-foreground">
              Each occasion has its own unique card design — matching colours, borders, and decorations.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

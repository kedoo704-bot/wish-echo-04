import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { decodeWish, MESSAGE_TYPES } from "@/lib/wish";
import { WishBackground } from "@/components/WishBackground";

export const Route = createFileRoute("/w/$token")({
  component: WishPage,
  head: () => ({
    meta: [
      { title: "A wish for you ✦ Kehdoo" },
      { name: "description", content: "Someone sent you a beautiful greeting on Kehdoo." },
      { property: "og:title", content: "A wish for you ✦ Kehdoo" },
      { property: "og:description", content: "Someone sent you a beautiful greeting." },
    ],
  }),
});

function WishPage() {
  const { token } = Route.useParams();
  const wish = decodeWish(token);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setShareUrl(window.location.href);
    const t = setTimeout(() => setRevealed(true), 250);
    return () => clearTimeout(t);
  }, []);

  if (!wish) {
    return (
      <main className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <div className="text-5xl">🥺</div>
          <h1 className="mt-3 font-serif text-4xl">This wish couldn't be opened.</h1>
          <p className="mt-2 text-muted-foreground">The link may be incomplete or broken.</p>
          <Link to="/" className="mt-6 inline-block rounded-full bg-foreground px-5 py-2.5 text-sm text-background">Create your own →</Link>
        </div>
      </main>
    );
  }

  const typeMeta = MESSAGE_TYPES.find((m) => m.id === wish.type) ?? MESSAGE_TYPES[0];

  const copy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const shareText = `${typeMeta.emoji} A wish for you from Kehdoo`;
  const shareWhatsapp = `https://wa.me/?text=${encodeURIComponent(`${shareText}: ${shareUrl}`)}`;
  const shareTwitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const tryNative = async () => {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try { await (navigator as any).share({ title: "Kehdoo", text: shareText, url: shareUrl }); } catch {}
    } else {
      copy();
    }
  };

  return (
    <main className="relative min-h-screen px-5 py-10 md:px-8">
      <WishBackground bg={wish.bg} />

      <div className="mx-auto max-w-2xl">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <span>←</span> <span className="font-serif text-base">Kehdoo</span>
        </Link>

        <article
          className={`mt-8 overflow-hidden rounded-[2rem] border border-border/60 bg-card/80 p-8 text-center backdrop-blur-md transition-all duration-700 md:p-14 ${revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <div className="text-6xl md:text-7xl" style={{ animation: "floaty 4s ease-in-out infinite" }}>{typeMeta.emoji}</div>
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">{typeMeta.label}</p>
          {wish.to && (
            <h1 className="mt-6 font-serif text-5xl leading-[1] md:text-6xl">
              Dear <span className="italic shimmer-text">{wish.to}</span>,
            </h1>
          )}
          <p className="mx-auto mt-7 max-w-xl whitespace-pre-wrap font-serif text-2xl leading-snug text-foreground/90 md:text-3xl">
            {wish.message}
          </p>
          {wish.from && (
            <p className="mt-10 font-serif text-xl italic text-muted-foreground">— with love, {wish.from}</p>
          )}

          <div className="mx-auto mt-10 h-px w-16 bg-border" />
          <p className="mt-4 font-serif text-sm italic text-muted-foreground">
            Jo dil mein hai, Kehdoo.
          </p>
        </article>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <button onClick={tryNative} className="rounded-full px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5" style={{ background: "var(--gradient-accent)", boxShadow: "var(--shadow-glow)" }}>
            ✦ Share
          </button>
          <button onClick={copy} className="rounded-full border border-border bg-card/80 px-5 py-2.5 text-sm backdrop-blur hover:bg-card">
            {copied ? "Copied ✓" : "Copy link"}
          </button>
          <a href={shareWhatsapp} target="_blank" rel="noreferrer" className="rounded-full border border-border bg-card/80 px-5 py-2.5 text-sm backdrop-blur hover:bg-card">
            WhatsApp
          </a>
          <a href={shareTwitter} target="_blank" rel="noreferrer" className="rounded-full border border-border bg-card/80 px-5 py-2.5 text-sm backdrop-blur hover:bg-card">
            Twitter
          </a>
          <Link to="/" className="rounded-full border border-border bg-card/80 px-5 py-2.5 text-sm backdrop-blur hover:bg-card">Make your own</Link>
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">Nothing is stored. This whole wish lives inside the URL.</p>
      </div>
    </main>
  );
}

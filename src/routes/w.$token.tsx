import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { decodeWish, MESSAGE_TYPES } from "@/lib/wish";
import { WishBackground } from "@/components/WishBackground";

export const Route = createFileRoute("/w/$token")({
  component: WishPage,
  head: () => ({
    meta: [
      { title: "A wish for you ✦ WishCraft" },
      { name: "description", content: "Someone sent you a beautiful greeting." },
    ],
  }),
});

function WishPage() {
  const { token } = Route.useParams();
  const wish = decodeWish(token);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setShareUrl(window.location.href);
  }, []);

  if (!wish) {
    return (
      <main className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="font-serif text-3xl">This wish couldn't be opened.</h1>
          <p className="mt-2 text-muted-foreground">The link may be incomplete.</p>
          <Link to="/" className="mt-6 inline-block rounded-full bg-foreground px-5 py-2.5 text-sm text-background">Create your own</Link>
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

  const shareWhatsapp = `https://wa.me/?text=${encodeURIComponent(`${typeMeta.emoji} A wish for you: ${shareUrl}`)}`;

  return (
    <main className="relative min-h-screen px-6 py-10">
      <WishBackground bg={wish.bg} />
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← WishCraft</Link>

        <article className="mt-8 rounded-3xl border border-border bg-card/85 p-8 text-center shadow-[0_30px_80px_-30px_rgba(180,80,60,0.3)] backdrop-blur md:p-14">
          <div className="text-5xl md:text-6xl animate-[floaty_4s_ease-in-out_infinite]">{typeMeta.emoji}</div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{typeMeta.label}</p>
          {wish.to && (
            <h1 className="mt-6 font-serif text-4xl leading-tight md:text-5xl">
              Dear <span className="italic" style={{ backgroundImage: "var(--gradient-accent)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{wish.to}</span>,
            </h1>
          )}
          <p className="mx-auto mt-6 max-w-xl whitespace-pre-wrap font-serif text-xl leading-relaxed text-foreground/90 md:text-2xl">
            {wish.message}
          </p>
          {wish.from && (
            <p className="mt-8 font-serif text-lg italic text-muted-foreground">— with love, {wish.from}</p>
          )}
        </article>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button onClick={copy} className="rounded-full bg-foreground px-5 py-2.5 text-sm text-background">
            {copied ? "Copied!" : "Copy link"}
          </button>
          <a href={shareWhatsapp} target="_blank" rel="noreferrer" className="rounded-full border border-border bg-card px-5 py-2.5 text-sm">
            Share on WhatsApp
          </a>
          <Link to="/" className="rounded-full border border-border bg-card px-5 py-2.5 text-sm">Make your own</Link>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">Nothing is stored. This whole wish lives inside the URL.</p>
      </div>
    </main>
  );
}

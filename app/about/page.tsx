import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Kehdoo",
  description:
    "Kehdoo is a no-backend greeting creator. Everything lives in the link — no sign-up, no data stored.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <span>←</span> <span className="font-serif text-base">Kehdoo</span>
      </Link>

      <article className="mt-10">
        <h1 className="font-serif text-5xl leading-tight md:text-6xl">
          About <span className="italic shimmer-text">Kehdoo</span>
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          <em>Jo dil mein hai, Kehdoo</em> — "Whatever is in your heart, say it." In Urdu and Hindi,{" "}
          <em>kehna</em> means to say or speak. Kehdoo is the gentle nudge to finally send that
          message you've been holding back.
        </p>

        <section className="mt-10 space-y-6 text-base leading-relaxed text-foreground/80">
          <p>
            Kehdoo lets you craft a gorgeous, animated greeting card in seconds and share it as a
            single link — no app download, no sign-up, no subscription. Write your message, pick a
            style, and generate a beautiful page that blooms when the recipient opens it.
          </p>
          <p>
            The entire wish is encoded inside the URL itself. There is no database, no server, no
            account. The link is the card.
          </p>
          <p>
            Send it on WhatsApp, post it on Instagram, print a QR code, or email it. The experience
            is the same on every device — a full-screen animated greeting with your words front and
            centre.
          </p>
        </section>

        <div
          className="mt-12 rounded-[2rem] border border-border/60 bg-card/70 p-8 text-center backdrop-blur"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <p className="font-serif text-2xl italic">Don't let the words sit inside.</p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90"
          >
            Create your wish →
          </Link>
        </div>
      </article>

      <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground">
        <p>© Kehdoo · kehdoo.com</p>
        <nav className="flex gap-4">
          <Link href="/about" className="hover:text-foreground">About</Link>
          <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground">Terms</Link>
        </nav>
      </footer>
    </main>
  );
}

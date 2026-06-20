import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import { FAQ, faqLd } from "@/lib/seo";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://kehdoo.com";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "About Kehdoo — Free Animated Greeting Card Maker",
  description:
    "Kehdoo turns a short message into a beautiful animated greeting you can share as a single link via WhatsApp, social, or QR. Free, no sign-up required.",
  alternates: { canonical: `${BASE}/about` },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <StructuredData data={faqLd} />
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
            You can create and share a card without an account at all. Sign in with Google only if
            you want a personal dashboard that keeps your cards together. Either way, cards are
            shared through a private, unguessable link and aren&apos;t indexed by search engines — and
            any photo you add is resized and stripped of metadata before it&apos;s stored.
          </p>
          <p>
            Send it on WhatsApp, post it on Instagram, print a QR code, or email it. The experience
            is the same on every device — a full-screen animated greeting with your words front and
            centre — and you can download it as a PNG or print it as a PDF.
          </p>
        </section>

        <section className="mt-14" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="font-serif text-3xl">
            Frequently asked questions
          </h2>
          <dl className="mt-6 space-y-6">
            {FAQ.map(({ q, a }) => (
              <div key={q}>
                <dt className="text-lg font-semibold text-foreground">{q}</dt>
                <dd className="mt-1.5 text-base leading-relaxed text-foreground/75">{a}</dd>
              </div>
            ))}
          </dl>
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

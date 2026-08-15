import Link from "next/link";
import { GardenLetterCard } from "@/components/garden/GardenLetterCard";
import type { GardenLandingContent } from "@/lib/garden-landing-content";
import {
  getAllGardenLandingContent,
  getGardenLandingFaqs,
  getSampleLetterFor,
} from "@/lib/garden-landing-content";

/**
 * The one reusable template behind every /garden/write/[slug] landing page
 * — see app/garden/write/[slug]/page.tsx. Driven by garden-landing-content.ts
 * plus the real pre-defined letter it references, so the sample shown is
 * honest product content, not invented copy. Same shape as
 * OccasionLandingPage (/wishes/[slug]) — content-driven, one template,
 * cross-linked to its siblings.
 */
export function GardenLandingPage({ content }: { content: GardenLandingContent }) {
  const sample = getSampleLetterFor(content);
  const faqs = getGardenLandingFaqs(content);
  const others = getAllGardenLandingContent().filter((c) => c.slug !== content.slug);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Kehdoo
        </Link>
        <span>/</span>
        <Link href="/garden" className="hover:text-foreground">
          Garden
        </Link>
        <span>/</span>
        <span className="truncate text-foreground/80">{content.label}</span>
      </nav>

      <article className="mt-8">
        <h1 className="font-serif text-4xl leading-tight md:text-5xl">
          {content.heroHeadline.split(" ").slice(0, -1).join(" ")}{" "}
          <span className="italic shimmer-text">{content.heroHeadline.split(" ").slice(-1)}</span>
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{content.heroSubheadline}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/garden/write"
            className="btn-3d inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold"
          >
            Write your {content.label.toLowerCase()} →
          </Link>
          <span className="text-xs text-muted-foreground">Free, no sign-up needed</span>
        </div>

        {content.keywords.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Related searches">
            {content.keywords.map((keyword) => (
              <li
                key={keyword}
                className="rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[11px] text-muted-foreground"
              >
                {keyword}
              </li>
            ))}
          </ul>
        )}

        {sample && (
          <section className="mt-14" aria-labelledby="sample-heading">
            <h2 id="sample-heading" className="font-serif text-2xl">
              A real example from the Garden
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              One of Kehdoo&apos;s starter letters — not a mockup, this is a real page in the Garden.
            </p>
            <div className="mx-auto mt-16 max-w-sm">
              <Link href={`/garden/${sample.slug}`}>
                <GardenLetterCard
                  letter={{ message: sample.message, to: sample.to, from: sample.from, flowerSeed: sample.flowerSeed }}
                  compact
                />
              </Link>
            </div>
          </section>
        )}

        <section className="mt-14" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="font-serif text-2xl">
            Frequently asked questions
          </h2>
          <dl className="mt-6 space-y-6">
            {faqs.map(({ question, answer }) => (
              <div key={question}>
                <dt className="text-base font-semibold text-foreground">{question}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-foreground/75">{answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div
          className="mt-14 rounded-[2rem] border border-border/60 bg-card/70 p-8 text-center backdrop-blur"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <p className="font-serif text-2xl italic">Don&apos;t let the words sit inside.</p>
          <Link
            href="/garden/write"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90"
          >
            Write your {content.label.toLowerCase()} →
          </Link>
        </div>

        <section className="mt-14" aria-labelledby="other-ideas-heading">
          <h2 id="other-ideas-heading" className="text-sm font-semibold text-muted-foreground">
            Other letter ideas
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/garden/write/${other.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  {other.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>

      <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground">
        <p>© Kehdoo · kehdoo.com</p>
        <nav className="flex gap-4">
          <Link href="/garden" className="hover:text-foreground">
            Garden
          </Link>
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms
          </Link>
        </nav>
      </footer>
    </main>
  );
}

import Link from "next/link";
import type { OccasionContent } from "@/lib/occasion-content";
import { getAllOccasions, getOccasionFaqs, getSampleMessages } from "@/lib/occasion-content";

/**
 * The one reusable template behind every /wishes/[slug] occasion page — see
 * app/wishes/[slug]/page.tsx. Driven entirely by OCCASION_CONTENT + the
 * product's own MESSAGE_TEMPLATES data (src/lib/occasion-content.ts), so
 * adding an 11th occasion is a data change here, not a new page component.
 */
export function OccasionLandingPage({ occasion }: { occasion: OccasionContent }) {
  const samples = getSampleMessages(occasion.occasionId);
  const faqs = getOccasionFaqs(occasion);
  const otherOccasions = getAllOccasions().filter((o) => o.slug !== occasion.slug);
  const createHref = `/?type=${occasion.occasionId}`;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Kehdoo
        </Link>
        <span>/</span>
        <Link href="/wishes" className="hover:text-foreground">
          Wishes
        </Link>
        <span>/</span>
        <span className="text-foreground/80 truncate">{occasion.label}</span>
      </nav>

      <article className="mt-8">
        <span className="text-5xl leading-none">{occasion.emoji}</span>
        <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
          {occasion.heroHeadline.split(" ").slice(0, -1).join(" ")}{" "}
          <span className="italic shimmer-text">{occasion.heroHeadline.split(" ").slice(-1)}</span>
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{occasion.heroSubheadline}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href={createHref}
            className="btn-3d inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold"
          >
            Create your {occasion.label.toLowerCase()} card →
          </Link>
          <span className="text-xs text-muted-foreground">Free, no sign-up needed</span>
        </div>

        {occasion.keywords.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Related searches">
            {occasion.keywords.map((keyword) => (
              <li
                key={keyword}
                className="rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[11px] text-muted-foreground"
              >
                {keyword}
              </li>
            ))}
          </ul>
        )}

        {samples.length > 0 && (
          <section className="mt-14" aria-labelledby="samples-heading">
            <h2 id="samples-heading" className="font-serif text-2xl">
              Sample {occasion.label.toLowerCase()}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Real messages from the Kehdoo card creator — pick one as a starting point or write your own.
            </p>
            <div className="mt-6 space-y-4">
              {samples.map((template) => (
                <div
                  key={template.id}
                  className="rounded-[1.5rem] border border-border/60 bg-card/70 p-5 backdrop-blur"
                  style={{ boxShadow: "var(--shadow-soft)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {template.label}
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-foreground/85">{template.text}</p>
                </div>
              ))}
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
            href={createHref}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90"
          >
            Create your {occasion.label.toLowerCase()} card →
          </Link>
        </div>

        <section className="mt-14" aria-labelledby="other-occasions-heading">
          <h2 id="other-occasions-heading" className="text-sm font-semibold text-muted-foreground">
            Other occasions
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {otherOccasions.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/wishes/${other.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <span>{other.emoji}</span>
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

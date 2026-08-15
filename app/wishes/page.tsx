import type { Metadata } from "next";
import Link from "next/link";
import { getAllOccasions } from "@/lib/occasion-content";
import { absoluteUrl } from "@/lib/site-config";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Wishes & Greeting Cards by Occasion",
  description:
    "Browse animated greeting cards by occasion — birthday, thank you, anniversary, congratulations, and more. Free, no sign-up required.",
  alternates: { canonical: absoluteUrl("/wishes") },
};

export default function WishesHubPage() {
  const occasions = getAllOccasions();

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
          Wishes for every <span className="italic shimmer-text">occasion</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Pick an occasion below for sample messages and a ready-to-go card — or start from scratch on the
          home page.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {occasions.map((occasion) => (
            <Link
              key={occasion.slug}
              href={`/wishes/${occasion.slug}`}
              className="flex items-center gap-3 rounded-[1.5rem] border border-border/60 bg-card/70 p-5 backdrop-blur transition hover:border-border"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <span className="text-3xl leading-none">{occasion.emoji}</span>
              <div>
                <p className="font-serif text-lg">{occasion.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{occasion.heroSubheadline}</p>
              </div>
            </Link>
          ))}
        </div>
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

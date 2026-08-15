import type { Metadata } from "next";
import Link from "next/link";
import { PenLine } from "lucide-react";
import { GardenChrome } from "@/components/garden/GardenChrome";
import { GardenFeedGrid } from "@/components/garden/GardenFeedGrid";
import { getAllPredefinedLetters } from "@/lib/garden-letters-content";
import { getAllGardenLandingContent } from "@/lib/garden-landing-content";
import { absoluteUrl } from "@/lib/site-config";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "The Garden — Letters, Decorated with Flowers",
  description:
    "A garden of heartfelt letters, each decorated with an illustrated flower cluster. Read one, or write and share your own.",
  alternates: { canonical: absoluteUrl("/garden") },
};

export default function GardenPage() {
  const letters = getAllPredefinedLetters();

  return (
    <GardenChrome>
      <main className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <span>←</span> <span className="font-serif text-base">Kehdoo</span>
          </Link>
          <Link
            href="/garden/write"
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background hover:opacity-90"
          >
            <PenLine className="h-3.5 w-3.5" />
            Write a letter
          </Link>
        </div>

        <div className="mt-10 text-center">
          <h1 className="font-serif text-5xl leading-tight md:text-6xl">
            The <span className="italic shimmer-text">garden</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
            A few letters to read, each with its own little bouquet — or write and share one of your own.
          </p>
        </div>

        <GardenFeedGrid letters={letters} />

        <section className="mx-auto mt-20 max-w-3xl" aria-labelledby="ideas-heading">
          <h2 id="ideas-heading" className="text-center text-sm font-semibold text-muted-foreground">
            Not sure what to write? Try one of these
          </h2>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {getAllGardenLandingContent().map((idea) => (
              <li key={idea.slug}>
                <Link
                  href={`/garden/write/${idea.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3.5 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  {idea.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </GardenChrome>
  );
}

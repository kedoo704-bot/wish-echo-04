import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGardenLetterById } from "@/lib/get-garden-letter";
import { getAllPredefinedSlugs, getPredefinedLetterBySlug } from "@/lib/garden-letters-content";
import { GardenLetterCard, type LetterDisplay } from "@/components/garden/GardenLetterCard";
import { GardenShareBar } from "@/components/garden/GardenShareBar";
import { GardenChrome } from "@/components/garden/GardenChrome";
import { absoluteUrl } from "@/lib/site-config";

type Props = { params: Promise<{ id: string }> };

export const revalidate = 300;

// Only the pre-defined letters are statically generated — a custom (DB)
// letter's id isn't known at build time, so it renders on-demand instead
// (same fallback behavior as app/c/[id]).
export function generateStaticParams() {
  return getAllPredefinedSlugs().map((slug) => ({ id: slug }));
}

async function resolveLetter(id: string): Promise<LetterDisplay | null> {
  const predefined = getPredefinedLetterBySlug(id);
  if (predefined) {
    return { message: predefined.message, to: predefined.to, from: predefined.from, flowerSeed: predefined.flowerSeed };
  }

  const custom = await getGardenLetterById(id);
  if (custom) {
    return { message: custom.message, to: custom.to_label, from: custom.from_label, flowerSeed: custom.flower_seed };
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const letter = await resolveLetter(id);
  if (!letter) return { title: "Letter not found", robots: { index: false } };

  const excerpt = letter.message.length > 140 ? `${letter.message.slice(0, 140)}…` : letter.message;
  const isPredefined = Boolean(getPredefinedLetterBySlug(id));

  return {
    title: "A letter from the Garden",
    description: excerpt,
    // Pre-defined letters are real site content and indexable; custom
    // letters behave like a regular Kehdoo card — a private link, not
    // meant to surface in search.
    robots: isPredefined ? undefined : { index: false, follow: true },
    alternates: { canonical: absoluteUrl(`/garden/${id}`) },
  };
}

export default async function GardenLetterPage({ params }: Props) {
  const { id } = await params;
  const letter = await resolveLetter(id);
  if (!letter) notFound();

  return (
    <GardenChrome>
      <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <Link
          href="/garden"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <span>←</span> <span className="font-serif text-base">The Garden</span>
        </Link>

        <div className="relative mx-auto mt-10 max-w-sm">
          <GardenLetterCard letter={letter} animateOpen />
          <GardenShareBar url={absoluteUrl(`/garden/${id}`)} />
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/garden/write"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90"
          >
            Write your own letter →
          </Link>
        </div>
      </main>
    </GardenChrome>
  );
}

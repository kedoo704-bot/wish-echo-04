"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { GardenLetterCard } from "@/components/garden/GardenLetterCard";
import type { PredefinedLetter } from "@/lib/garden-letters-content";

/**
 * Client-side search + animated grid over the (small, static) pre-defined
 * letter set — not a server query, since these letters are content, not a
 * database. Deliberately doesn't search custom letters: those aren't
 * listed publicly at all (see app/garden/write), so there's nothing to
 * search there.
 */
export function GardenFeedGrid({ letters }: { letters: PredefinedLetter[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return letters;
    return letters.filter(
      (l) =>
        l.message.toLowerCase().includes(q) ||
        l.to.toLowerCase().includes(q) ||
        l.from.toLowerCase().includes(q)
    );
  }, [letters, query]);

  return (
    <div>
      <div className="mx-auto mt-10 max-w-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search letters..."
            aria-label="Search letters"
            className="w-full rounded-full border border-border/60 bg-card/80 py-3 pl-11 pr-4 text-sm text-foreground outline-none backdrop-blur placeholder:text-muted-foreground/70 focus:border-border"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-14 text-center text-sm text-muted-foreground">No letters match &quot;{query}&quot;.</p>
      ) : (
        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((letter, i) => (
            // Entrance animation and hover-transform both need the `transform`
            // property, so they're split across two elements — an animation
            // with fill-mode: both otherwise pins `transform` at its final
            // keyframe value indefinitely, silently blocking the hover
            // transform from ever applying (same fix as FlowerIcon/note tilt).
            <div
              key={letter.slug}
              className="animate-garden-card-in"
              style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }}
            >
              <Link
                href={`/garden/${letter.slug}`}
                className="block transition-transform duration-300 hover:-translate-y-1.5 hover:scale-[1.02]"
              >
                <GardenLetterCard
                  letter={{ message: letter.message, to: letter.to, from: letter.from, flowerSeed: letter.flowerSeed }}
                  compact
                />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

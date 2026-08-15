import { Gloria_Hallelujah } from "next/font/google";
import { FlowerIcon } from "@/lib/flower-shapes";
import { generateBouquet } from "@/lib/garden-bouquet";

const handwriting = Gloria_Hallelujah({ subsets: ["latin"], weight: "400" });

const ENVELOPE_LIGHT = "oklch(0.82 0.045 80)";
const ENVELOPE_FLAP = "oklch(0.74 0.05 72)";
const ENVELOPE_LINE = "oklch(0.55 0.05 65)";

/** Minimal shape this card needs — deliberately not the DB row type, so it
 *  renders both pre-defined (static) and custom (DB) letters the same way. */
export type LetterDisplay = {
  message: string;
  to?: string | null;
  from?: string | null;
  flowerSeed: number;
};

/**
 * An envelope with a bold flower cluster growing up out of its flap, and
 * the letter's note tucked into the opening — the Garden feature's core
 * visual. Kraft envelope shape + flowers, in Kehdoo's own palette (not
 * GardenLetters' artwork).
 *
 * The flower cluster is absolutely positioned, overlapping upward out of
 * the envelope's box rather than taking its own layout space — that keeps
 * the envelope+note the one sized/anchored box regardless of how tall the
 * bouquet renders, which is what GardenShareBar's floating button is
 * positioned against.
 *
 * `compact` trims the message and shrinks type for grid use.
 * `animateOpen` plays the flap-open + note-rise entrance once on mount —
 * used on the single-letter page, not the feed grid (there, the whole card
 * gets the lighter stagger-in instead — see GardenFeedGrid).
 */
export function GardenLetterCard({
  letter,
  compact = false,
  animateOpen = false,
}: {
  letter: LetterDisplay;
  compact?: boolean;
  animateOpen?: boolean;
}) {
  const bouquet = generateBouquet(letter.flowerSeed);
  // Small deterministic tilt so notes don't all sit perfectly straight —
  // derived from the seed, not re-randomized on every render.
  const tilt = ((letter.flowerSeed % 7) - 3) * 0.6;

  return (
    <div className="relative">
      {/* Flowers — behind the note in stacking order (painted first) so
          only the portion above the note's top edge reads as "peeking
          out"; the stems naturally disappear behind the note below that. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-16 h-20 md:-top-20 md:h-24"
      >
        {bouquet.map((spec, i) => (
          <FlowerIcon key={i} spec={spec} heightClassName="h-full" index={i} />
        ))}
      </div>

      <div className="relative">
        <svg viewBox="0 0 200 170" className="block w-full" aria-hidden="true">
          <rect x="8" y="40" width="184" height="122" rx="14" fill={ENVELOPE_LIGHT} />
          <g className={animateOpen ? "animate-garden-flap-open" : undefined}>
            <polygon points="8,40 100,108 192,40" fill={ENVELOPE_FLAP} />
            <path d="M 8 40 L 100 108 L 192 40" fill="none" stroke={ENVELOPE_LINE} strokeWidth="1.5" strokeLinejoin="round" />
          </g>
          <rect x="8" y="40" width="184" height="122" rx="14" fill="none" stroke={ENVELOPE_LINE} strokeWidth="1.5" opacity="0.45" />
        </svg>

        {/* Static tilt lives on this outer element; the rise-in animation
            (also a `transform`) goes on the inner one below — an animation
            replaces the whole `transform` value on whatever element it's
            applied to, so stacking both on one element would drop the tilt
            the moment the animation finished (same fix as FlowerIcon). */}
        <div
          className="absolute inset-x-[8%] top-[8%] rounded-2xl bg-card/95 shadow-lg"
          style={{ transform: `rotate(${tilt}deg)`, boxShadow: "var(--shadow-soft)" }}
        >
          <div
            className={`rounded-2xl p-4 text-center backdrop-blur ${animateOpen ? "animate-garden-note-rise" : ""}`}
          >
            <p
              className={`${handwriting.className} whitespace-pre-wrap text-foreground/90 ${
                compact ? "line-clamp-4 text-sm leading-snug" : "text-lg leading-relaxed"
              }`}
            >
              {letter.message}
            </p>
            {letter.from && (
              <p className={`${handwriting.className} mt-2 text-right text-xs text-muted-foreground`}>
                — {letter.from.slice(0, 28)}
              </p>
            )}
          </div>
        </div>

        {/* Rendered outside the envelope SVG/note stack, never at risk of
            being covered by a tall note (long messages push the note's own
            height well past the flap on purpose, matching the reference). */}
        {letter.to && (
          <p
            className={`${handwriting.className} -mt-1 truncate rounded-b-2xl px-4 pb-2 pt-4 text-xs text-foreground/60`}
            style={{ background: ENVELOPE_LIGHT }}
          >
            To: {letter.to}
          </p>
        )}
      </div>
    </div>
  );
}

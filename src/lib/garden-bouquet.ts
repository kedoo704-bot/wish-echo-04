import type { FlowerKind, FlowerSpec } from "@/lib/flower-shapes";

/**
 * Deterministic flower arrangement generator. A garden letter stores a
 * single integer `flower_seed` (assigned once at creation) rather than a
 * full arrangement — this function regenerates the same-looking bouquet
 * from that seed every time, so the visual is stable across reloads
 * without needing its own storage.
 */

// mulberry32 — small, fast, deterministic PRNG. Good enough for decorative
// arrangement variety; not used for anything security-sensitive.
function mulberry32(seed: number) {
  let s = seed;
  return function random() {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const KINDS: FlowerKind[] = ["rose", "sunflower", "lotus"];

// Base/highlight color pairs per kind, in Kehdoo's oklch range — a rose
// stays in the red/pink family, a sunflower in yellow/gold, a lotus in
// soft pink/white, so the seed only randomizes shade, not the flower's
// identity color.
const PALETTE: Record<FlowerKind, Array<{ petal: string; petalLight: string }>> = {
  rose: [
    { petal: "oklch(0.5 0.19 15)", petalLight: "oklch(0.75 0.14 20)" },
    { petal: "oklch(0.55 0.2 350)", petalLight: "oklch(0.8 0.12 10)" },
    { petal: "oklch(0.45 0.17 8)", petalLight: "oklch(0.7 0.15 25)" },
  ],
  sunflower: [
    { petal: "oklch(0.68 0.17 55)", petalLight: "oklch(0.86 0.15 90)" },
    { petal: "oklch(0.65 0.19 45)", petalLight: "oklch(0.88 0.14 95)" },
  ],
  lotus: [
    { petal: "oklch(0.78 0.09 350)", petalLight: "oklch(0.96 0.02 340)" },
    { petal: "oklch(0.82 0.06 340)", petalLight: "oklch(0.97 0.01 20)" },
  ],
};

export function generateBouquet(seed: number, count = 5): FlowerSpec[] {
  const rand = mulberry32(seed);
  const flowers: FlowerSpec[] = [];

  for (let i = 0; i < count; i++) {
    // Evenly spaced base position with jitter, so flowers spread across the
    // width but never clump or overlap heavily.
    // Kept clear of the top-right corner (6–78%, not 6–94%) — that's where
    // GardenShareBar's floating copy-link button sits on the detail page.
    const slot = (i + 0.5) / count;
    const x = Math.min(78, Math.max(6, slot * 88 + (rand() - 0.5) * (60 / count)));
    const kind = KINDS[Math.floor(rand() * KINDS.length)];
    const colors = PALETTE[kind][Math.floor(rand() * PALETTE[kind].length)];

    flowers.push({
      x,
      rotate: (rand() - 0.5) * 18,
      scale: 0.8 + rand() * 0.34,
      stemLength: 20 + rand() * 16,
      kind,
      variance: rand(),
      ...colors,
    });
  }

  return flowers.sort((a, b) => a.x - b.x);
}

/** A small integer seed, assigned once when a letter is created. */
export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}

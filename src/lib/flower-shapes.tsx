import { useId } from "react";

/**
 * Illustrated flower primitives — rose, sunflower, lotus — drawn as
 * layered, gradient-shaded SVG (not flat single-color shapes), original
 * artwork in Kehdoo's own palette. See garden-bouquet.ts for the seeded
 * arrangement generator that uses these, and
 * src/components/garden/GardenLetterCard.tsx for where they're composed
 * with the envelope. No business logic — safe to reuse anywhere a small
 * illustrated flower is wanted.
 */

export type FlowerKind = "rose" | "sunflower" | "lotus";

export type FlowerSpec = {
  x: number; // percent, 0–100, left position within the container
  rotate: number; // degrees, applied at the base so the stem leans
  scale: number;
  stemLength: number; // SVG units from the baseline up to the bloom
  petal: string; // base petal color (oklch)
  petalLight: string; // highlight/gradient-end color (oklch)
  kind: FlowerKind;
  /** 0–1, drives bloom-in stagger delay and sway animation duration variance. */
  variance: number;
};

export const STEM_COLOR = "oklch(0.6 0.1 148)";
export const LEAF_COLOR = "oklch(0.66 0.11 142)";

const ICON_W = 46;
const ICON_H = 64;

function Rose({ petal, petalLight, gid }: { petal: string; petalLight: string; gid: string }) {
  const grad = `${gid}-rose`;
  const petals = [
    { r: 12, o: 0.75 },
    { r: 10, o: 0.6 },
    { r: 7.5, o: 0.45 },
    { r: 5.5, o: 0.3 },
    { r: 3.5, o: 0.15 },
  ];
  return (
    <g>
      <defs>
        <radialGradient id={grad} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={petalLight} />
          <stop offset="100%" stopColor={petal} />
        </radialGradient>
      </defs>
      {petals.map((p, i) => (
        <g key={i} transform={`rotate(${i * 46})`}>
          {[0, 1, 2].map((j) => (
            <path
              key={j}
              d={`M 0 0 C ${p.r * 0.9} -${p.r * 0.5}, ${p.r} ${p.r * 0.7}, 0 ${p.r * 1.35} C -${p.r} ${p.r * 0.7}, -${p.r * 0.9} -${p.r * 0.5}, 0 0 Z`}
              fill={`url(#${grad})`}
              opacity={0.92 - i * 0.05}
              transform={`rotate(${j * 120})`}
              stroke={petal}
              strokeWidth="0.3"
              strokeOpacity="0.4"
            />
          ))}
        </g>
      ))}
      <circle r="3" fill={petalLight} opacity="0.9" />
    </g>
  );
}

function Sunflower({ petal, petalLight, gid }: { petal: string; petalLight: string; gid: string }) {
  const grad = `${gid}-sun`;
  const discGrad = `${gid}-disc`;
  const petalCount = 16;
  const seeds = Array.from({ length: 26 }, (_, i) => {
    const angle = i * 137.5 * (Math.PI / 180); // phyllotaxis spiral, like a real sunflower head
    const r = 0.72 * Math.sqrt(i);
    return { x: Math.cos(angle) * r, y: Math.sin(angle) * r };
  });

  return (
    <g>
      <defs>
        <linearGradient id={grad} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={petal} />
          <stop offset="100%" stopColor={petalLight} />
        </linearGradient>
        <radialGradient id={discGrad} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="oklch(0.42 0.06 75)" />
          <stop offset="100%" stopColor="oklch(0.25 0.04 60)" />
        </radialGradient>
      </defs>
      {Array.from({ length: petalCount }, (_, i) => (i * 360) / petalCount).map((deg) => (
        <path
          key={deg}
          d="M -2.9 -4 Q 0 -17 0 -20 Q 0 -17 2.9 -4 Q 0 -2 -2.9 -4 Z"
          fill={`url(#${grad})`}
          transform={`rotate(${deg})`}
        />
      ))}
      <circle r="8.5" fill={`url(#${discGrad})`} />
      {seeds.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r="0.6" fill="oklch(0.32 0.03 60)" opacity="0.7" />
      ))}
    </g>
  );
}

function Lotus({ petal, petalLight, gid }: { petal: string; petalLight: string; gid: string }) {
  const grad = `${gid}-lotus`;
  const outer = [-64, -38, -14, 14, 38, 64];
  const inner = [-30, 0, 30];

  return (
    <g>
      <defs>
        <linearGradient id={grad} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={petal} />
          <stop offset="100%" stopColor={petalLight} />
        </linearGradient>
      </defs>
      {outer.map((deg) => (
        <path
          key={deg}
          d="M 0 1 C -6 -6.5 -4.5 -17 0 -23 C 4.5 -17 6 -6.5 0 1 Z"
          fill={`url(#${grad})`}
          opacity="0.88"
          transform={`rotate(${deg})`}
        />
      ))}
      {inner.map((deg) => (
        <path
          key={deg}
          d="M 0 0 C -4 -8 -3.3 -16 0 -20.5 C 3.3 -16 4 -8 0 0 Z"
          fill={petalLight}
          transform={`rotate(${deg})`}
        />
      ))}
      <circle r="3.4" fill="oklch(0.78 0.13 105)" />
    </g>
  );
}

/** One flower + stem + a small leaf, as a self-contained SVG icon with its
 *  own bloom-in and hover-sway animation. */
export function FlowerIcon({
  spec,
  heightClassName,
  index = 0,
}: {
  spec: FlowerSpec;
  heightClassName: string;
  index?: number;
}) {
  const gid = useId();
  const top = -spec.stemLength;
  const bloomDelay = 0.15 + index * 0.09 + spec.variance * 0.15;
  const swayDuration = 3.4 + spec.variance * 1.8;

  return (
    <svg
      viewBox={`${-ICON_W / 2} ${-ICON_H} ${ICON_W} ${ICON_H}`}
      className={`absolute bottom-0 w-[44px] overflow-visible md:w-[54px] ${heightClassName}`}
      style={{
        // Static positioning only — the bloom-in animation lives on the
        // inner <g> below. A CSS animation replaces the whole `transform`
        // value for the duration it runs (and, with fill-mode both, keeps
        // its own final value forever after) — putting it on this same
        // element would silently discard this positioning transform once
        // the animation finished.
        left: `${spec.x}%`,
        transform: `translateX(-50%) rotate(${spec.rotate}deg) scale(${spec.scale})`,
      }}
    >
      <g
        style={{
          animation: `garden-bloom 0.7s cubic-bezier(0.34,1.56,0.64,1) ${bloomDelay}s both`,
          transformOrigin: "0px 0px",
        }}
      >
        <path d={`M 0 0 L 0 ${top}`} stroke={STEM_COLOR} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path
          d={`M -0.5 ${top * 0.5} Q -8 ${top * 0.38} -9.5 ${top * 0.2}`}
          stroke={LEAF_COLOR}
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
        <g transform={`translate(0, ${top})`}>
          <g
            style={{
              animation: `garden-sway ${swayDuration}s ease-in-out ${spec.variance}s infinite`,
              transformOrigin: "0px 8px",
            }}
          >
            {spec.kind === "rose" && <Rose petal={spec.petal} petalLight={spec.petalLight} gid={gid} />}
            {spec.kind === "sunflower" && <Sunflower petal={spec.petal} petalLight={spec.petalLight} gid={gid} />}
            {spec.kind === "lotus" && <Lotus petal={spec.petal} petalLight={spec.petalLight} gid={gid} />}
          </g>
        </g>
      </g>
    </svg>
  );
}

/** A row of FlowerIcons, positioned to peek up over the top edge of a container. */
export function FlowerCluster({ flowers, heightClassName }: { flowers: FlowerSpec[]; heightClassName: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 z-10 ${heightClassName}`}>
      {flowers.map((spec, i) => (
        <FlowerIcon key={i} spec={spec} heightClassName="h-full" index={i} />
      ))}
    </div>
  );
}

"use client";

import { useRef } from "react";
import { BG_GRADIENTS, MESSAGE_TYPES } from "@/lib/wish";

type Props = {
  type: string;
  to: string;
  from: string;
  message: string;
  bg: string;
  theme: string;
  photo?: string;
  photoY?: number;
  onPhotoDrag?: (y: number) => void;
};

const BG_EMOJI: Record<string, string[]> = {
  hearts: ["💗", "💖", "💕"],
  floral: ["🌸", "🌺", "🌷"],
  confetti: ["🎉", "✨", "🎊"],
  sunrise: ["☀️", "✨", "🌅"],
  balloons: ["🎈", "🎂", "🎉"],
  stars: ["⭐", "✨", "💫"],
  gradient: [],
};

const DECOR_POSITIONS = [
  { left: "10%", top: "13%", size: 24 },
  { right: "11%", top: "20%", size: 28 },
  { left: "16%", top: "32%", size: 20 },
];

export function WishPreview({ type, to, from, message, bg, photo, photoY = 0, onPhotoDrag }: Props) {
  const t = MESSAGE_TYPES.find((m) => m.id === type) ?? MESSAGE_TYPES[0];
  const emojis = BG_EMOJI[bg] ?? [];
  const dragRef = useRef<{ startY: number; startPhotoY: number } | null>(null);

  const startDrag = (clientY: number) => {
    if (!onPhotoDrag) return;
    dragRef.current = { startY: clientY, startPhotoY: photoY };
  };

  const moveDrag = (clientY: number) => {
    if (!dragRef.current || !onPhotoDrag) return;
    const dy = clientY - dragRef.current.startY;
    // Drag down → pull photo down → reveal top of photo → decrease photoY
    const newY = Math.max(0, Math.min(100, dragRef.current.startPhotoY - dy * 0.5));
    onPhotoDrag(Math.round(newY));
  };

  const endDrag = () => { dragRef.current = null; };

  return (
    <div
      className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/70 backdrop-blur-md"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="absolute inset-0 -z-0 opacity-90" style={{ background: BG_GRADIENTS[bg] ?? "var(--gradient-mesh)" }} />
      {emojis.map((e, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute z-0 select-none"
          style={{
            ...DECOR_POSITIONS[i % DECOR_POSITIONS.length],
            fontSize: `${DECOR_POSITIONS[i % DECOR_POSITIONS.length].size}px`,
            opacity: 0.22,
            filter: "drop-shadow(0 6px 14px rgba(160,40,80,0.18))",
            animation: `floaty ${6 + (i % 4)}s ease-in-out ${(i % 5) * 0.4}s infinite`,
          }}
        >
          {e}
        </span>
      ))}

      {photo && type === "fathers-day" ? (
        <div
          aria-hidden
          className={`absolute inset-x-0 top-0 z-0 h-[55%]${onPhotoDrag ? " cursor-grab select-none touch-none active:cursor-grabbing" : ""}`}
          onMouseDown={(e) => startDrag(e.clientY)}
          onMouseMove={(e) => moveDrag(e.clientY)}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchStart={(e) => startDrag(e.touches[0].clientY)}
          onTouchMove={(e) => moveDrag(e.touches[0].clientY)}
          onTouchEnd={endDrag}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${photo})`,
              backgroundSize: "auto 150%",
              backgroundPosition: `center ${photoY}%`,
              backgroundRepeat: "no-repeat",
              opacity: 0.65,
              filter: "blur(0.5px) saturate(1.1)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-card" />
          {onPhotoDrag && (
            <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
              <span className="rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-medium text-white/90 backdrop-blur-sm">
                drag to reposition
              </span>
            </div>
          )}
        </div>
      ) : photo ? (
        <div className="absolute right-4 top-4 z-20 h-14 w-14 overflow-hidden rounded-full ring-2 ring-primary/40 shadow-lg">
          <img src={photo} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}

      <div className="relative z-10 px-7 py-10 text-center md:px-10 md:py-14">
        {type !== "fathers-day" && (
          <div aria-hidden="true" className="text-5xl md:text-6xl" style={{ animation: "floaty 5s ease-in-out infinite" }}>{t.emoji}</div>
        )}
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">{t.label}</p>
        {to ? (
          <h2 className="mt-5 font-serif text-4xl leading-[1.05] md:text-5xl">
            Dear <span className="italic shimmer-text">{to}</span>,
          </h2>
        ) : (
          <h2 className="mt-5 font-serif text-4xl italic leading-[1.05] text-muted-foreground/60 md:text-5xl">Dear …</h2>
        )}
        <p className="mx-auto mt-5 max-w-md whitespace-pre-wrap font-serif text-lg leading-snug text-foreground/90 md:text-xl">
          {message || <span className="text-muted-foreground/60 italic">your words will bloom here…</span>}
        </p>
        {from && <p className="mt-6 font-serif text-base italic text-muted-foreground">— with love, {from}</p>}
      </div>
    </div>
  );
}

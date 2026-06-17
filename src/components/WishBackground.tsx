const EMOJI_MAP: Record<string, string[]> = {
  hearts: ["💗", "💖", "💕", "❤️", "🩷"],
  floral: ["🌸", "🌺", "🌷", "🌹", "🌼"],
  confetti: ["🎉", "🎊", "✨", "🌟", "🎀"],
  sunrise: ["☀️", "🌅", "✨", "🌤️"],
  balloons: ["🎈", "🎉", "🎂", "🥂"],
  stars: ["⭐", "✨", "🌟", "💫", "🪩"],
  gradient: [],
};

export function WishBackground({ bg, dense = true }: { bg: string; dense?: boolean }) {
  const emojis = EMOJI_MAP[bg] ?? [];
  const count = dense ? 36 : 18;
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" style={{ background: "var(--gradient-warm)" }}>
      <div className="absolute inset-0" style={{ background: "var(--gradient-mesh)", animation: "drift 18s ease-in-out infinite" }} />
      {emojis.length > 0 && Array.from({ length: count }, (_, i) => {
        const e = emojis[i % emojis.length];
        const left = (i * 37 + 7) % 100;
        const top = (i * 53 + 11) % 100;
        const delay = (i % 9) * 0.5;
        const dur = 7 + (i % 6);
        const size = 16 + ((i * 11) % 34);
        const opacity = 0.35 + ((i * 7) % 50) / 100;
        return (
          <span
            key={i}
            className="absolute select-none"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              fontSize: `${size}px`,
              opacity,
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
              animation: `floaty ${dur}s ease-in-out ${delay}s infinite`,
            }}
          >
            {e}
          </span>
        );
      })}
    </div>
  );
}

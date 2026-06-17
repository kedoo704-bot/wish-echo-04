const EMOJI_MAP: Record<string, string[]> = {
  hearts: ["💗", "💖", "💕", "❤️"],
  floral: ["🌸", "🌺", "🌷", "🌹"],
  confetti: ["🎉", "🎊", "✨", "🌟"],
  sunrise: ["☀️", "🌅", "✨"],
  balloons: ["🎈", "🎉", "🎂"],
  stars: ["⭐", "✨", "🌟", "💫"],
  gradient: [],
};

export function WishBackground({ bg }: { bg: string }) {
  const emojis = EMOJI_MAP[bg] ?? [];
  if (emojis.length === 0) {
    return <div className="pointer-events-none fixed inset-0 -z-10" style={{ background: "var(--gradient-warm)" }} />;
  }
  const items = Array.from({ length: 28 }, (_, i) => {
    const e = emojis[i % emojis.length];
    const left = (i * 37) % 100;
    const top = (i * 53) % 100;
    const delay = (i % 7) * 0.6;
    const dur = 8 + (i % 5);
    const size = 18 + ((i * 7) % 28);
    return (
      <span
        key={i}
        className="absolute select-none opacity-70"
        style={{
          left: `${left}%`,
          top: `${top}%`,
          fontSize: `${size}px`,
          animation: `floaty ${dur}s ease-in-out ${delay}s infinite`,
        }}
      >
        {e}
      </span>
    );
  });
  return (
    <>
      <style>{`@keyframes floaty {
        0%,100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-24px) rotate(8deg); }
      }`}</style>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" style={{ background: "var(--gradient-warm)" }}>
        {items}
      </div>
    </>
  );
}

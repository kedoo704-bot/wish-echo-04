/**
 * The greeting card surface shared by saved-card views and previews.
 * Purely presentational.
 */
export function GreetingCard({
  emoji,
  label,
  to,
  from,
  message,
  photoSrc,
  revealed,
}: {
  emoji: string;
  label: string;
  to?: string;
  from?: string;
  message: string;
  photoSrc?: string | null;
  revealed: boolean;
}) {
  return (
    <article
      className={`greeting-card relative overflow-hidden rounded-[2.5rem] border border-border/60 bg-card/85 p-8 text-center shadow-2xl backdrop-blur-md transition-all duration-700 md:p-14 ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      }`}
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      {photoSrc && (
        <div className="greeting-card-item absolute right-6 top-6 h-20 w-20 overflow-hidden rounded-full ring-[3px] ring-primary/30 shadow-xl">
          <img src={photoSrc} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div
        aria-hidden="true"
        className="greeting-card-item greeting-card-emoji"
        style={{ animation: "floaty 4s ease-in-out infinite" }}
      >
        {emoji}
      </div>
      <p className="greeting-card-item mt-5 text-[10px] font-semibold uppercase tracking-[0.38em] text-muted-foreground">
        {label}
      </p>
      {to && (
        <h1 className="greeting-card-item greeting-card-title mt-7 font-serif leading-[1.05]">
          Dear <span className="italic shimmer-text">{to}</span>,
        </h1>
      )}
      <p className="greeting-card-item greeting-card-message selectable mx-auto mt-7 max-w-xl whitespace-pre-wrap font-serif leading-relaxed text-foreground/90">
        {message}
      </p>
      {from && (
        <p className="greeting-card-item mt-10 font-serif text-xl italic text-muted-foreground">— with love, {from}</p>
      )}
      <div className="greeting-card-item mx-auto mt-10 h-px w-20 bg-border/60" />
      <p className="greeting-card-item mt-4 font-serif text-sm italic text-muted-foreground/70">
        Jo dil mein hai, Kehdoo.
      </p>
    </article>
  );
}

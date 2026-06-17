import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MESSAGE_TYPES, TONES, THEMES, BACKGROUNDS, encodeWish } from "@/lib/wish";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kehdoo — Jo dil mein hai, Kehdoo" },
      { name: "description", content: "Turn a few words into a gorgeous animated greeting page. Share via WhatsApp, social or QR. No login, no backend — just a link." },
    ],
  }),
  component: Index,
});

function Chip({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm transition-all border ${
        active
          ? "bg-foreground text-background border-foreground shadow-sm"
          : "bg-card/70 text-foreground/80 border-border hover:border-foreground/40"
      }`}
    >
      {children}
    </button>
  );
}

function Index() {
  const navigate = useNavigate();
  const [type, setType] = useState<string>(MESSAGE_TYPES[0].id);
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<string>(TONES[1]);
  const [theme, setTheme] = useState<string>(THEMES[0]);
  const [bg, setBg] = useState<string>(BACKGROUNDS[0]);

  const currentType = useMemo(() => MESSAGE_TYPES.find((m) => m.id === type)!, [type]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = encodeWish({ type, to, from, message: message || `${currentType.emoji} ${currentType.label}`, theme, bg });
    navigate({ to: "/w/$token", params: { token } });
  };

  return (
    <main className="min-h-screen px-6 py-8 md:px-12 lg:px-16">
      <header className="flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full text-lg" style={{ background: "var(--gradient-accent)" }}>✦</span>
          <span className="font-serif text-xl font-semibold tracking-tight">Kehdoo</span>
        </a>
        <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
          <a href="#thank-you" className="hover:text-foreground">Thank you</a>
          <a href="#birthday" className="hover:text-foreground">Birthday</a>
          <a href="#congrats" className="hover:text-foreground">Congrats</a>
          <a href="#morning" className="hover:text-foreground">Good morning</a>
        </nav>
      </header>

      <section className="mt-10 grid items-start gap-12 lg:mt-16 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            No login. No backend. Just a link.
          </span>
          <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Jo dil mein hai,
            <br />
            <span className="italic" style={{ backgroundImage: "var(--gradient-accent)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              Kehdoo.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-base text-muted-foreground md:text-lg">
            Kehdoo turns a few words into a personal greeting page — animated, gorgeous, and ready to share via WhatsApp, social, or QR code.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {MESSAGE_TYPES.slice(0, 8).map((m) => (
              <Chip key={m.id} active={type === m.id} onClick={() => setType(m.id)}>
                <span className="mr-1.5">{m.emoji}</span>{m.label}
              </Chip>
            ))}
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl border border-border bg-card/85 p-6 shadow-[0_30px_80px_-30px_rgba(180,80,60,0.25)] backdrop-blur md:p-8"
        >
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary"
          >
            {MESSAGE_TYPES.map((m) => (
              <option key={m.id} value={m.id}>{m.emoji} {m.label}</option>
            ))}
          </select>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">To</label>
              <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Their name"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">From</label>
              <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Your name"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your message</label>
            <span className="text-xs text-muted-foreground">{message.length} chars</span>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 600))}
            rows={4}
            placeholder="Write something from the heart…"
            className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {TONES.map((t) => (
              <Chip key={t} active={tone === t} onClick={() => setTone(t)}>✦ {t}</Chip>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Theme</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary">
                {THEMES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Background</label>
              <select value={bg} onChange={(e) => setBg(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary">
                {BACKGROUNDS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-7 w-full rounded-xl px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--gradient-accent)" }}
          >
            ✦ Generate shareable link
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">Nothing is stored. The full message lives inside the URL.</p>
        </form>
      </section>

      <footer className="mt-20 flex flex-col items-center justify-between gap-2 border-t border-border/60 pt-6 text-sm text-muted-foreground md:flex-row">
        <p>© Kehdoo — made with care.</p>
        <p>Everything lives in the link. We never store your messages.</p>
      </footer>
    </main>
  );
}

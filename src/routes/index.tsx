import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MESSAGE_TYPES, TONES, THEMES, BACKGROUNDS, encodeWish } from "@/lib/wish";
import { WishPreview } from "@/components/WishPreview";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kehdoo — Jo dil mein hai, Kehdoo" },
      { name: "description", content: "Turn a few words into a gorgeous animated greeting page. Share via WhatsApp, social or QR. No login, no backend — just a link." },
    ],
  }),
  component: Index,
});

function Chip({ children, active, onClick, small = false }: { children: React.ReactNode; active?: boolean; onClick?: () => void; small?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border transition-all ${small ? "px-3 py-1 text-xs" : "px-3.5 py-1.5 text-sm"} ${
        active
          ? "border-foreground bg-foreground text-background shadow-sm"
          : "border-border bg-card/60 text-foreground/75 hover:border-foreground/40 hover:bg-card"
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, children, right }: { label: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</label>
        {right}
      </div>
      <div className="mt-2">{children}</div>
    </div>
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
    const token = encodeWish({
      type,
      to,
      from,
      message: message || `${currentType.emoji} ${currentType.label}`,
      theme,
      bg,
    });
    navigate({ to: "/w/$token", params: { token } });
  };

  const inputCls = "w-full rounded-2xl border border-border bg-background/80 px-4 py-3 text-base outline-none transition focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/15";

  return (
    <main className="relative min-h-screen px-5 pb-16 pt-6 md:px-10 md:pt-8 lg:px-16">
      {/* Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-2xl text-lg text-primary-foreground shadow-md" style={{ background: "var(--gradient-accent)" }}>✦</span>
          <div className="leading-tight">
            <div className="font-serif text-2xl">Kehdoo</div>
            <div className="-mt-0.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">kehdoo.com</div>
          </div>
        </a>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#types" className="hover:text-foreground">Occasions</a>
          <a href="#create" className="rounded-full bg-foreground px-4 py-2 text-background hover:opacity-90">Create a wish</a>
        </nav>
      </header>

      {/* Hero + split-screen creator */}
      <section id="create" className="mx-auto mt-10 grid max-w-7xl items-start gap-10 lg:mt-14 lg:grid-cols-[1.05fr_1fr]">
        {/* LEFT: Form */}
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            No login. No backend. Everything lives in the link.
          </span>
          <h1 className="mt-5 font-serif text-[3.2rem] leading-[0.95] tracking-tight md:text-[4.5rem] lg:text-[5.5rem]">
            Jo dil mein hai,
            <br />
            <span className="italic shimmer-text">Kehdoo.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base text-muted-foreground md:text-lg">
            Craft a gorgeous, animated greeting in seconds. Share the link on WhatsApp, Instagram, or print it as a QR — your words bloom on the other side.
          </p>

          <form onSubmit={onSubmit} className="mt-8 rounded-[2rem] border border-border/60 bg-card/80 p-5 backdrop-blur-md md:p-7" style={{ boxShadow: "var(--shadow-soft)" }}>
            {/* Occasion chips */}
            <div id="types" className="-mx-1 flex flex-wrap gap-1.5">
              {MESSAGE_TYPES.map((m) => (
                <Chip key={m.id} active={type === m.id} onClick={() => setType(m.id)}>
                  <span className="mr-1.5">{m.emoji}</span>{m.label}
                </Chip>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="To">
                <input value={to} onChange={(e) => setTo(e.target.value.slice(0, 40))} placeholder="Their name" className={inputCls} />
              </Field>
              <Field label="From">
                <input value={from} onChange={(e) => setFrom(e.target.value.slice(0, 40))} placeholder="Your name" className={inputCls} />
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Your message" right={<span className="text-[10px] text-muted-foreground">{message.length}/600</span>}>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 600))}
                  rows={4}
                  placeholder={`Write something from the heart… e.g. "Thank you for always being there."`}
                  className={`${inputCls} resize-none`}
                />
              </Field>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {TONES.map((t) => (
                  <Chip key={t} small active={tone === t} onClick={() => setTone(t)}>{t}</Chip>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Theme">
                <div className="flex flex-wrap gap-1.5">
                  {THEMES.map((t) => (
                    <Chip key={t} small active={theme === t} onClick={() => setTheme(t)}>{t}</Chip>
                  ))}
                </div>
              </Field>
              <Field label="Background">
                <div className="flex flex-wrap gap-1.5">
                  {BACKGROUNDS.map((b) => (
                    <Chip key={b} small active={bg === b} onClick={() => setBg(b)}>{b}</Chip>
                  ))}
                </div>
              </Field>
            </div>

            <button
              type="submit"
              className="group mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-2xl"
              style={{ background: "var(--gradient-accent)", boxShadow: "var(--shadow-glow)" }}
            >
              <span>Generate shareable link</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">Nothing is stored. The full message lives inside the URL.</p>
          </form>
        </div>

        {/* RIGHT: Live Preview */}
        <div className="animate-rise lg:sticky lg:top-8" style={{ animationDelay: "0.1s" }}>
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Live preview</span>
            <span className="text-[10px] text-muted-foreground">updates as you type</span>
          </div>
          <WishPreview type={type} to={to} from={from} message={message} bg={bg} theme={theme} />
          <div className="mt-3 flex items-center justify-center gap-2 px-1 text-[11px] text-muted-foreground">
            <span>✦</span><span>This is what they'll see when they open your link.</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto mt-24 max-w-6xl">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Three steps</p>
          <h2 className="mt-2 font-serif text-4xl md:text-5xl">From feeling to shared in under a minute.</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { n: "01", t: "Write", d: "Pick an occasion, name them, write the words you've been holding back.", e: "✍️" },
            { n: "02", t: "Style", d: "Choose the theme and animated background that matches the moment.", e: "🎨" },
            { n: "03", t: "Share", d: "Get a beautiful link instantly. WhatsApp it, post it, print a QR — it just works.", e: "💌" },
          ].map((s) => (
            <div key={s.n} className="group relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/70 p-6 backdrop-blur transition hover:-translate-y-1" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="absolute -right-4 -top-4 text-7xl opacity-10 transition group-hover:scale-110">{s.e}</div>
              <div className="font-serif text-3xl italic shimmer-text">{s.n}</div>
              <h3 className="mt-2 font-serif text-2xl">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Occasions grid */}
      <section className="mx-auto mt-24 max-w-6xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">For every moment</p>
            <h2 className="mt-2 font-serif text-4xl md:text-5xl">A wish for every kind of heart.</h2>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {MESSAGE_TYPES.filter((m) => m.id !== "custom").map((m) => (
            <button
              key={m.id}
              onClick={() => { setType(m.id); document.getElementById("create")?.scrollIntoView({ behavior: "smooth" }); }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-5 text-left backdrop-blur transition hover:-translate-y-1 hover:border-primary/40"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="text-3xl transition group-hover:scale-110">{m.emoji}</div>
              <div className="mt-3 font-serif text-xl">{m.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">Open this template →</div>
            </button>
          ))}
        </div>
      </section>

      {/* Tagline strip */}
      <section className="mx-auto mt-24 max-w-5xl rounded-[2rem] border border-border/60 bg-card/60 p-10 text-center backdrop-blur md:p-14" style={{ boxShadow: "var(--shadow-soft)" }}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">Kehdoo</p>
        <p className="mt-3 font-serif text-3xl italic leading-tight md:text-5xl">
          Don't let the words sit inside.
          <br />
          <span className="shimmer-text">Jo dil mein hai, Kehdoo.</span>
        </p>
        <a href="#create" className="mt-7 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90">
          Create your wish →
        </a>
      </section>

      <footer className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row">
        <p>© Kehdoo · kehdoo.com — made with 💗</p>
        <p>Everything lives in the link. We never store your messages.</p>
      </footer>
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MESSAGE_TYPES,
  THEMES,
  BACKGROUNDS,
  MESSAGE_TEMPLATES,
  encodeWish,
  type Template,
} from "@/lib/wish";
import { compressImage, toSrc } from "@/lib/image-compress";
import { WishPreview } from "@/components/WishPreview";

/* ─── tiny primitives ─────────────────────────────────────────────────── */

function OccasionChip({
  active,
  emoji,
  label,
  onClick,
}: {
  active: boolean;
  emoji: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-all ${
        active
          ? "border-foreground bg-foreground text-background shadow-sm"
          : "border-border bg-card/60 text-foreground/75 hover:border-foreground/40 hover:bg-card"
      }`}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </button>
  );
}

function TemplateCard({
  template,
  active,
  onClick,
}: {
  template: Template;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition-all ${
        active
          ? "border-primary/60 bg-primary/5 ring-2 ring-primary/20"
          : "border-border/60 bg-card/60 hover:border-primary/30 hover:bg-card"
      }`}
    >
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {template.label}
        </span>
        {active && (
          <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">
            Selected ✓
          </span>
        )}
      </div>
      <p className="line-clamp-2 text-sm leading-relaxed text-foreground/80">{template.text}</p>
    </button>
  );
}

function StyleChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition-all ${
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card/60 text-foreground/70 hover:border-foreground/40"
      }`}
    >
      {children}
    </button>
  );
}

/* ─── main component ──────────────────────────────────────────────────── */

export default function WishCreator() {
  const router = useRouter();
  const [type, setType] = useState<string>(MESSAGE_TYPES[0].id);
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>(THEMES[0]);
  const [bg, setBg] = useState<string>(BACKGROUNDS[0].id);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);

  const currentType = useMemo(() => MESSAGE_TYPES.find((m) => m.id === type)!, [type]);
  const templates = MESSAGE_TEMPLATES[type] ?? [];

  const handleOccasionChange = (id: string) => {
    setType(id);
    setSelectedTemplateId(null);
    setMessage("");
  };

  const handleTemplateSelect = (t: Template) => {
    if (selectedTemplateId === t.id) {
      setSelectedTemplateId(null);
      setMessage("");
    } else {
      setSelectedTemplateId(t.id);
      setMessage(t.text);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoLoading(true);
    try {
      const compressed = await compressImage(file);
      setPhoto(compressed);
    } catch {
      /* silently ignore compression errors */
    } finally {
      setPhotoLoading(false);
      e.target.value = "";
    }
  };

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
    const photoParam = photo ? `&img=${photo}` : "";
    router.push(`/w?t=${token}${photoParam}`);
  };

  const inputCls =
    "w-full rounded-2xl border border-border bg-background/80 px-4 py-3 text-base outline-none transition focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/15";

  return (
    <main className="relative min-h-screen px-5 pb-20 pt-6 md:px-10 lg:px-16">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className="grid h-10 w-10 place-items-center rounded-2xl text-lg text-primary-foreground shadow-md"
            style={{ background: "var(--gradient-accent)" }}
          >
            ✦
          </span>
          <div className="leading-tight">
            <div className="font-serif text-2xl">Kehdoo</div>
            <div className="-mt-0.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              kehdoo.com
            </div>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#occasions" className="hover:text-foreground transition-colors">Occasions</a>
          <a
            href="#create"
            className="rounded-full bg-foreground px-4 py-2 text-background hover:opacity-90 transition-opacity"
          >
            Create a wish
          </a>
        </nav>
      </header>

      {/* ── Hero (full-width, centered, compact) ───────────────────────── */}
      <section className="mx-auto mt-10 max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          No login. No backend. Everything lives in the link.
        </span>
        <h1 className="mt-5 font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
          Jo dil mein hai,
          <br />
          <span className="italic shimmer-text">Kehdoo.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
          Craft a gorgeous, animated greeting in seconds. Share the link on WhatsApp, Instagram,
          or print it as a QR — your words bloom on the other side.
        </p>
      </section>

      {/* ── Creator: two columns, aligned at top ───────────────────────── */}
      <section
        id="create"
        className="mx-auto mt-10 grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-12"
      >
        {/* LEFT ── Form ─────────────────────────────────────────────────── */}
        <div className="animate-rise">
          <form
            onSubmit={onSubmit}
            className="rounded-[2rem] border border-border/60 bg-card/80 p-5 backdrop-blur-md md:p-7"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >

            {/* 1. Occasion */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
                Occasion
              </p>
              <div className="flex flex-wrap gap-2">
                {MESSAGE_TYPES.map((m) => (
                  <OccasionChip
                    key={m.id}
                    active={type === m.id}
                    emoji={m.emoji}
                    label={m.label}
                    onClick={() => handleOccasionChange(m.id)}
                  />
                ))}
              </div>
            </div>

            {/* 2. Templates */}
            <div className="mt-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
                Start with a template <span className="normal-case font-normal tracking-normal text-muted-foreground/60">— or write your own below</span>
              </p>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {templates.map((t) => (
                  <TemplateCard
                    key={t.id}
                    template={t}
                    active={selectedTemplateId === t.id}
                    onClick={() => handleTemplateSelect(t)}
                  />
                ))}
              </div>
            </div>

            {/* 3. Photo upload */}
            <div className="mt-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
                Add a photo <span className="normal-case font-normal tracking-normal text-muted-foreground/60">— personalises the greeting card</span>
              </p>
              {!photo ? (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/70 bg-card/40 px-4 py-5 transition hover:border-primary/40 hover:bg-card/60">
                  {photoLoading ? (
                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
                  ) : (
                    <>
                      <span className="text-2xl">📷</span>
                      <span className="text-sm font-medium text-foreground/70">Click to upload a photo</span>
                      <span className="text-[11px] text-muted-foreground">JPG, PNG, WEBP — auto-compressed for the URL</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
              ) : (
                <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card/60 p-3">
                  <img
                    src={toSrc(photo)}
                    alt="Uploaded"
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/30"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Photo added ✓</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">Will appear on your greeting card download</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhoto(null)}
                    className="flex-shrink-0 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:text-foreground"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* 4. To / From */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  To
                </label>
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value.slice(0, 40))}
                  placeholder="Their name"
                  className={`${inputCls} mt-2`}
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  From
                </label>
                <input
                  value={from}
                  onChange={(e) => setFrom(e.target.value.slice(0, 40))}
                  placeholder="Your name"
                  className={`${inputCls} mt-2`}
                />
              </div>
            </div>

            {/* 5. Message */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Your message
                </label>
                <span className="text-[10px] text-muted-foreground">{message.length}/600</span>
              </div>
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value.slice(0, 600));
                  if (selectedTemplateId) setSelectedTemplateId(null);
                }}
                rows={5}
                placeholder={`Write from the heart… or pick a template above.`}
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* 6. Style */}
            <div className="mt-5 grid grid-cols-2 gap-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2">
                  Theme
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {THEMES.map((t) => (
                    <StyleChip key={t} active={theme === t} onClick={() => setTheme(t)}>
                      {t}
                    </StyleChip>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2">
                  Background
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {BACKGROUNDS.map((b) => (
                    <StyleChip key={b.id} active={bg === b.id} onClick={() => setBg(b.id)}>
                      {b.emoji} {b.label}
                    </StyleChip>
                  ))}
                </div>
              </div>
            </div>

            {/* 7. CTA */}
            <button
              type="submit"
              className="group mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: "var(--gradient-accent)", boxShadow: "var(--shadow-glow)" }}
            >
              <span>Generate shareable link</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Nothing is stored. The full message lives inside the URL.
            </p>
          </form>
        </div>

        {/* RIGHT ── Preview ──────────────────────────────────────────────── */}
        <div className="animate-rise lg:sticky lg:top-8" style={{ animationDelay: "0.08s" }}>
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Live preview
            </span>
            <span className="text-[10px] text-muted-foreground">updates as you type</span>
          </div>
          <WishPreview type={type} to={to} from={from} message={message} bg={bg} theme={theme} photo={photo ?? undefined} />
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            ✦ This is what they'll see when they open your link.
          </p>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────── */}
      <section id="how" className="mx-auto mt-28 max-w-5xl">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Three steps
          </p>
          <h2 className="mt-2 font-serif text-4xl md:text-5xl">
            From feeling to shared in under a minute.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { n: "01", t: "Write", d: "Pick an occasion, choose a template, personalise with names and your own words.", e: "✍️" },
            { n: "02", t: "Style", d: "Pick the theme and animated background that fits the moment.", e: "🎨" },
            { n: "03", t: "Share", d: "Get a shareable link instantly. WhatsApp, Instagram, QR — it just works.", e: "💌" },
          ].map((s) => (
            <div
              key={s.n}
              className="group relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/70 p-6 backdrop-blur transition hover:-translate-y-1"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="absolute -right-3 -top-3 text-7xl opacity-10 transition group-hover:scale-110">
                {s.e}
              </div>
              <div className="font-serif text-3xl italic shimmer-text">{s.n}</div>
              <h3 className="mt-2 font-serif text-2xl">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Occasions grid ─────────────────────────────────────────────── */}
      <section id="occasions" className="mx-auto mt-24 max-w-5xl">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            For every moment
          </p>
          <h2 className="mt-2 font-serif text-4xl md:text-5xl">A wish for every kind of heart.</h2>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {MESSAGE_TYPES.filter((m) => m.id !== "custom").map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                handleOccasionChange(m.id);
                document.getElementById("create")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-5 text-left backdrop-blur transition hover:-translate-y-1 hover:border-primary/40"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="text-3xl transition group-hover:scale-110">{m.emoji}</div>
              <div className="mt-3 font-serif text-xl">{m.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">Use this template →</div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Tagline strip ──────────────────────────────────────────────── */}
      <section
        className="mx-auto mt-24 max-w-4xl rounded-[2rem] border border-border/60 bg-card/60 p-10 text-center backdrop-blur md:p-14"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
          Kehdoo
        </p>
        <p className="mt-3 font-serif text-3xl italic leading-tight md:text-4xl">
          Don't let the words sit inside.
          <br />
          <span className="shimmer-text">Jo dil mein hai, Kehdoo.</span>
        </p>
        <a
          href="#create"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90"
        >
          Create your wish →
        </a>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row">
        <p>© Kehdoo · kehdoo.com — made with 💗</p>
        <nav className="flex gap-5">
          <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
        </nav>
      </footer>
    </main>
  );
}

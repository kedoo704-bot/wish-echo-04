"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MESSAGE_TYPES,
  BACKGROUNDS,
  MESSAGE_TEMPLATES,
  type Template,
} from "@/lib/wish";
import { toSrc } from "@/lib/image-compress";
import { WishPreview } from "@/components/WishPreview";
import { saveCard } from "@/lib/cards";
import { createClient } from "@/lib/supabase/client";
import AuthButton from "@/components/AuthButton";

/* ─── Step dot indicator ─────────────────────────────────────────────────── */

function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="inline-block rounded-full transition-all duration-300"
          style={{
            width: i === step ? 24 : 8,
            height: 8,
            background:
              i === step
                ? "var(--gradient-accent)"
                : i < step
                ? "oklch(0.55 0.21 350 / 0.5)"
                : "oklch(0.55 0.21 350 / 0.2)",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Occasion card ──────────────────────────────────────────────────────── */

function OccasionCard({
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
      className={`touch-card h-full w-full flex flex-col items-center justify-center gap-2 rounded-[1.75rem] border p-4 transition-all duration-150 active:scale-[0.97] ${
        active
          ? "border-primary/50 bg-primary/8 shadow-[0_0_0_3px_oklch(0.55_0.21_350/0.15)]"
          : "border-border/60 bg-card/80 backdrop-blur"
      }`}
      style={active ? { boxShadow: "var(--shadow-glow)" } : { boxShadow: "var(--shadow-soft)" }}
    >
      <span className="text-4xl leading-none">{emoji}</span>
      <span className="font-serif text-base leading-tight text-center">{label}</span>
    </button>
  );
}

/* ─── Template card ──────────────────────────────────────────────────────── */

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
      className={`touch-card w-full rounded-[1.75rem] border p-4 text-left transition-all duration-150 active:scale-[0.97] ${
        active
          ? "border-primary/60 bg-primary/5 ring-2 ring-primary/20"
          : "border-border/60 bg-card/80 backdrop-blur hover:border-primary/30"
      }`}
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <span className="inline-block rounded-full border border-border/60 bg-muted px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {template.label}
      </span>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-foreground/80">{template.text}</p>
      {active && (
        <p className="mt-1.5 text-[10px] font-semibold text-primary uppercase tracking-wide">
          Selected ✓
        </p>
      )}
    </button>
  );
}

/* ─── Background swatch ──────────────────────────────────────────────────── */

function BgSwatch({
  id,
  emoji,
  label,
  active,
  onClick,
}: {
  id: string;
  emoji: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`touch-card flex flex-shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 transition-all duration-150 active:scale-[0.97] ${
        active
          ? "border-primary/60 bg-primary/10 ring-2 ring-primary/25"
          : "border-border/60 bg-card/80 backdrop-blur"
      }`}
      style={{ width: 72, height: 72 }}
    >
      <span className="text-2xl leading-none">{emoji}</span>
      <span className="text-[10px] font-medium text-muted-foreground leading-none">{label}</span>
    </button>
  );
}

/* ─── Auto-growing textarea ──────────────────────────────────────────────── */

function AutoTextarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value.slice(0, 600))}
      rows={4}
      placeholder={placeholder}
      className="w-full resize-none rounded-2xl border border-border bg-background/80 px-4 py-3 text-base outline-none transition focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/15"
      style={{ overflow: "hidden" }}
    />
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function WishCreator() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const TOTAL_STEPS = 4;

  const [type, setType] = useState<string>(MESSAGE_TYPES[0].id);
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [bg, setBg] = useState<string>(BACKGROUNDS[0].id);
  const [photo, setPhoto] = useState<string | null>(null); // object URL for preview
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [authUser, setAuthUser] = useState<{
    email?: string;
    user_metadata?: { avatar_url?: string; full_name?: string };
  } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setAuthUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setAuthUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const currentType = useMemo(
    () => MESSAGE_TYPES.find((m) => m.id === type)!,
    [type]
  );
  const templates = MESSAGE_TEMPLATES[type] ?? [];

  const handleOccasionSelect = (id: string) => {
    setType(id);
    setSelectedTemplateId(null);
    setMessage("");
    setStep(1);
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photo) URL.revokeObjectURL(photo);
    setPhoto(URL.createObjectURL(file));
    setPhotoFile(file);
    e.target.value = "";
  };

  const onSubmit = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const id = await saveCard(
        {
          type,
          to,
          from,
          message: message || `${currentType.emoji} ${currentType.label}`,
          theme: "Elegant",
          bg,
        },
        photoFile,
        user?.id ?? null
      );
      router.push(`/c/${id}`);
    } catch (err) {
      console.error("Failed to save card:", err);
      setSaving(false);
    }
  };

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
  };

  const inputCls =
    "w-full rounded-2xl border border-border bg-background/80 px-4 py-3.5 text-base outline-none transition focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/15 placeholder:text-muted-foreground/50";

  return (
    <>
      {/* ── Mobile full-viewport wizard / Desktop phone-frame ──────────── */}
      <div className="relative h-[100dvh] overflow-hidden md:flex md:h-screen md:items-center md:justify-center md:bg-gradient-to-br md:from-background md:to-muted/20">

        {/* Phone frame on desktop */}
        <div
          className="relative h-[100dvh] w-full overflow-hidden bg-background md:h-[780px] md:max-w-[480px] md:rounded-[3rem] md:border md:border-border/60"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >

          {/* ── Steps container ─────────────────────────────────────────── */}
          <div className="relative h-full w-full overflow-hidden">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute inset-0 flex flex-col"
                style={{
                  transform: `translateX(${(i - step) * 100}%)`,
                  transition: "transform 500ms cubic-bezier(0.32, 0.72, 0, 1)",
                  willChange: "transform",
                }}
              >
                {i === 0 && (
                  <StepOccasion
                    type={type}
                    onSelect={handleOccasionSelect}
                  />
                )}
                {i === 1 && (
                  <StepMessage
                    currentType={currentType}
                    templates={templates}
                    selectedTemplateId={selectedTemplateId}
                    message={message}
                    onTemplateSelect={handleTemplateSelect}
                    onMessageChange={(v) => {
                      setMessage(v);
                      if (selectedTemplateId) setSelectedTemplateId(null);
                    }}
                  />
                )}
                {i === 2 && (
                  <StepPersonal
                    to={to}
                    from={from}
                    photo={photo}
                    photoLoading={photoLoading}
                    onToChange={(v) => setTo(v.slice(0, 40))}
                    onFromChange={(v) => setFrom(v.slice(0, 40))}
                    onPhotoUpload={handlePhotoUpload}
                    onPhotoRemove={() => { if (photo) URL.revokeObjectURL(photo); setPhoto(null); setPhotoFile(null); }}
                    inputCls={inputCls}
                  />
                )}
                {i === 3 && (
                  <StepStyle
                    bg={bg}
                    type={type}
                    to={to}
                    from={from}
                    message={message}
                    photo={photo}
                    saving={saving}
                    onBgChange={setBg}
                    onSubmit={onSubmit}
                  />
                )}
              </div>
            ))}
          </div>

          {/* ── Top bar (overlays all steps) ────────────────────────────── */}
          <div className="safe-top pointer-events-none absolute inset-x-0 top-0 z-50 flex items-center justify-between gap-3 px-5 pt-4 pb-3">
            <button
              type="button"
              onClick={goBack}
              className={`pointer-events-auto flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border/60 bg-background/80 backdrop-blur text-lg transition active:scale-95 ${
                step === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              ←
            </button>

            <StepDots step={step} total={TOTAL_STEPS} />

            <div className="pointer-events-auto flex-shrink-0">
              <AuthButton user={authUser} compact />
            </div>
          </div>

          {/* ── Bottom CTA (steps 1, 2, 3) ──────────────────────────────── */}
          {step > 0 && step < 3 && (
            <div className="safe-bottom pointer-events-none absolute inset-x-0 bottom-0 z-50 px-5 pb-6 pt-4">
              <div
                className="pointer-events-auto"
                style={{
                  background:
                    "linear-gradient(to top, var(--background) 60%, transparent)",
                  paddingTop: 16,
                }}
              >
                <button
                  type="button"
                  onClick={goNext}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-primary-foreground transition-all active:scale-[0.98] active:brightness-95"
                  style={{
                    background: "var(--gradient-accent)",
                    boxShadow: "var(--shadow-glow)",
                  }}
                >
                  Continue
                  <span>→</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── Step 0: Occasion ───────────────────────────────────────────────────── */

function StepOccasion({
  type,
  onSelect,
}: {
  type: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex h-full flex-col px-5" style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 72px)", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)" }}>
      <div className="flex-shrink-0 pb-4">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="grid h-8 w-8 place-items-center rounded-xl text-sm text-primary-foreground shadow"
            style={{ background: "var(--gradient-accent)" }}
          >
            ✦
          </span>
          <div className="leading-none">
            <div className="font-serif text-xl">Kehdoo</div>
            <div className="text-[10px] text-muted-foreground italic">Jo dil mein hai, Kehdoo.</div>
          </div>
        </div>
        <h1 className="font-serif text-3xl leading-tight">What's the occasion?</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tap to select and continue</p>
      </div>
      <div
        className="flex-1 grid grid-cols-3 gap-3 min-h-0"
        style={{ gridTemplateRows: "repeat(3, 1fr)" }}
      >
        {MESSAGE_TYPES.map((m) => (
          <OccasionCard
            key={m.id}
            active={type === m.id}
            emoji={m.emoji}
            label={m.label}
            onClick={() => onSelect(m.id)}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Step 1: Message ────────────────────────────────────────────────────── */

function StepMessage({
  currentType,
  templates,
  selectedTemplateId,
  message,
  onTemplateSelect,
  onMessageChange,
}: {
  currentType: { emoji: string; label: string };
  templates: Template[];
  selectedTemplateId: string | null;
  message: string;
  onTemplateSelect: (t: Template) => void;
  onMessageChange: (v: string) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="safe-top flex-shrink-0 pt-20 px-5 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl leading-none">{currentType.emoji}</span>
          <h1 className="font-serif text-3xl leading-tight">Your message</h1>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Pick a template or write your own
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-32 space-y-3">
        {templates.map((t) => (
          <TemplateCard
            key={t.id}
            template={t}
            active={selectedTemplateId === t.id}
            onClick={() => onTemplateSelect(t)}
          />
        ))}

        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-border/60" />
          <span className="text-xs text-muted-foreground">or write your own</span>
          <div className="h-px flex-1 bg-border/60" />
        </div>

        <div>
          <AutoTextarea
            value={message}
            onChange={onMessageChange}
            placeholder="Write from the heart…"
          />
          <div className="mt-1.5 flex justify-end">
            <span className="text-[11px] text-muted-foreground">{message.length}/600</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 2: Personal ───────────────────────────────────────────────────── */

function StepPersonal({
  to,
  from,
  photo,
  photoLoading,
  onToChange,
  onFromChange,
  onPhotoUpload,
  onPhotoRemove,
  inputCls,
}: {
  to: string;
  from: string;
  photo: string | null;
  photoLoading: boolean;
  onToChange: (v: string) => void;
  onFromChange: (v: string) => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoRemove: () => void;
  inputCls: string;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="safe-top flex-shrink-0 pt-20 px-5 pb-4">
        <h1 className="font-serif text-3xl leading-tight">Make it personal</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Add names and a photo</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-32 space-y-4">
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            To
          </label>
          <input
            value={to}
            onChange={(e) => onToChange(e.target.value)}
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
            onChange={(e) => onFromChange(e.target.value)}
            placeholder="Your name"
            className={`${inputCls} mt-2`}
          />
        </div>

        <div className="pt-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
            Photo
          </p>
          {!photo ? (
            <label className="touch-card flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.75rem] border-2 border-dashed border-border/70 bg-card/40 px-4 py-8 transition active:scale-[0.97] hover:border-primary/40 hover:bg-card/60">
              {photoLoading ? (
                <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-border border-t-foreground" />
              ) : (
                <>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-border/60 bg-muted/50 text-3xl">
                    📷
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground/80">Tap to add a photo</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Appears as your profile on the card
                    </p>
                  </div>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={onPhotoUpload} />
            </label>
          ) : (
            <div className="flex items-center gap-4 rounded-[1.75rem] border border-border/60 bg-card/80 p-4 backdrop-blur">
              <img
                src={toSrc(photo)}
                alt="Uploaded"
                className="h-16 w-16 flex-shrink-0 rounded-full object-cover ring-2 ring-primary/30"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Photo added ✓</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Will appear on your card
                </p>
              </div>
              <button
                type="button"
                onClick={onPhotoRemove}
                className="flex-shrink-0 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground active:scale-95"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 3: Style + Preview ────────────────────────────────────────────── */

function StepStyle({
  bg,
  type,
  to,
  from,
  message,
  photo,
  saving,
  onBgChange,
  onSubmit,
}: {
  bg: string;
  type: string;
  to: string;
  from: string;
  message: string;
  photo: string | null;
  saving: boolean;
  onBgChange: (id: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="safe-top flex-shrink-0 pt-20 px-5 pb-3">
        <h1 className="font-serif text-3xl leading-tight">Style + Preview</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Pick a background, then share</p>
      </div>

      <div className="flex-shrink-0 px-5 pb-3">
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: "none" }}>
          {BACKGROUNDS.map((b) => (
            <BgSwatch
              key={b.id}
              id={b.id}
              emoji={b.emoji}
              label={b.label}
              active={bg === b.id}
              onClick={() => onBgChange(b.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-36">
        <WishPreview
          type={type}
          to={to}
          from={from}
          message={message}
          bg={bg}
          theme="Elegant"
          photo={photo ?? undefined}
        />
      </div>

      {/* Bottom CTA for step 3 */}
      <div className="safe-bottom pointer-events-none absolute inset-x-0 bottom-0 z-50 px-5 pb-6 pt-4">
        <div
          className="pointer-events-auto"
          style={{
            background: "linear-gradient(to top, var(--background) 60%, transparent)",
            paddingTop: 16,
          }}
        >
          <button
            type="button"
            onClick={onSubmit}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-primary-foreground transition-all active:scale-[0.98] active:brightness-95 disabled:opacity-70"
            style={{
              background: "var(--gradient-accent)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            {saving ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                <span>Saving…</span>
              </>
            ) : (
              <>
                <span>✦ Create &amp; Share</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

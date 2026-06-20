import { Check } from "lucide-react";
import type { Template } from "@/lib/wish";

export function StepHeader({
  labels,
  step,
}: {
  labels: readonly string[];
  step: number;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <span>{labels[step]}</span>
        <span>
          {step + 1}/{labels.length}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {labels.map((label, index) => (
          <div
            key={label}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index <= step ? "bg-primary" : "bg-border/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function OccasionOption({
  active,
  emoji,
  label,
  onClick,
  wide = false,
}: {
  active: boolean;
  emoji: string;
  label: string;
  onClick: () => void;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`touch-card relative flex min-h-[76px] items-center gap-2.5 rounded-2xl border px-3 py-3.5 text-left transition ${
        wide ? "col-span-2" : ""
      } ${
        active
          ? "border-primary/60 bg-primary/10 ring-2 ring-primary/15"
          : "border-border/70 bg-card/80 active:bg-card"
      }`}
      style={{ boxShadow: active ? "var(--shadow-glow)" : "var(--shadow-soft)" }}
    >
      <span
        aria-hidden="true"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-muted/70 text-2xl leading-none"
      >
        {emoji}
      </span>
      <span className="min-w-0 flex-1 whitespace-normal text-balance pr-4 text-[15px] font-semibold leading-tight text-foreground">
        {label}
      </span>
      {active && <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />}
    </button>
  );
}

export function TemplateOption({
  template,
  active,
  collapsed = false,
  onClick,
}: {
  template: Template;
  active: boolean;
  collapsed?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`touch-card w-full overflow-hidden rounded-2xl border text-left transition ${
        active
          ? "border-primary/60 bg-primary/10 ring-2 ring-primary/15"
          : "border-border/70 bg-card/80"
      } ${collapsed ? "px-3.5 py-3" : "p-4"}`}
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-border/60 bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {template.label}
        </span>
        {active && <Check className="h-4 w-4 shrink-0 text-primary" />}
      </div>
      <p className={`mt-2 text-[13px] leading-5 text-foreground/78 ${collapsed || !active ? "line-clamp-2" : ""}`}>
        {template.text}
      </p>
    </button>
  );
}

export function BackgroundOption({
  emoji,
  label,
  active,
  onClick,
}: {
  emoji: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`touch-card flex h-[72px] w-[74px] shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border transition ${
        active ? "border-primary/60 bg-primary/10 ring-2 ring-primary/15" : "border-border/70 bg-card/80"
      }`}
    >
      <span aria-hidden="true" className="text-2xl leading-none">
        {emoji}
      </span>
      <span className="max-w-full truncate px-1 text-[10px] font-medium text-muted-foreground">
        {label}
      </span>
    </button>
  );
}

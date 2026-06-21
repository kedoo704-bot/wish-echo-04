import { useMemo, useState } from "react";
import { Camera, X } from "lucide-react";
import { BACKGROUNDS, MESSAGE_TYPES, type Template } from "@/lib/wish";
import { MAX_MESSAGE_LENGTH } from "@/lib/limits";
import { WishPreview } from "@/components/WishPreview";
import {
  BackgroundOption,
  OccasionOption,
  TemplateOption,
} from "@/components/wish-creator/CreatorControls";

export function OccasionStep({
  type,
  onSelect,
}: {
  type: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <div className="mb-5">
        <h1 className="font-serif text-[34px] leading-[1.02]">What&apos;s the occasion?</h1>
        <p className="mt-2 text-[14px] leading-6 text-muted-foreground">
          Choose the closest feeling. You can still make it personal next.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {MESSAGE_TYPES.map((item) => (
          <OccasionOption
            key={item.id}
            active={type === item.id}
            emoji={item.emoji}
            label={item.label}
            onClick={() => onSelect(item.id)}
            wide={item.id === "custom"}
          />
        ))}
      </div>
    </div>
  );
}

export function MessageStep({
  currentType,
  message,
  selectedTemplateId,
  templates,
  onMessageChange,
  onTemplateSelect,
}: {
  currentType: { emoji: string; label: string };
  message: string;
  selectedTemplateId: string | null;
  templates: Template[];
  onMessageChange: (value: string) => void;
  onTemplateSelect: (template: Template) => void;
}) {
  const [templatesOpen, setTemplatesOpen] = useState(true);
  const [composerPulse, setComposerPulse] = useState(false);
  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId) ?? null,
    [selectedTemplateId, templates]
  );
  const composerFocused = Boolean(selectedTemplate && !templatesOpen);

  const focusComposer = () => {
    setTemplatesOpen(false);
    setComposerPulse(true);
    window.setTimeout(() => setComposerPulse(false), 520);
  };

  const chooseTemplate = (template: Template) => {
    const selectingCurrent = selectedTemplateId === template.id;

    if (selectingCurrent) {
      focusComposer();
      return;
    }

    onTemplateSelect(template);
    focusComposer();
  };

  const expandTemplates = () => setTemplatesOpen(true);

  return (
    <div>
      <div className="mb-5 flex items-start gap-3">
        <span
          aria-hidden="true"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-muted/80 text-3xl"
        >
          {currentType.emoji}
        </span>
        <div className="min-w-0">
          <h1 className="font-serif text-[32px] leading-[1.05]">Write the wish</h1>
          <p className="mt-1 text-[14px] leading-5 text-muted-foreground">
            Pick a starting point or write your own.
          </p>
        </div>
      </div>

      <div
        className={`grid transition-[grid-template-rows,opacity,transform] duration-300 ease-out ${
          templatesOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] -translate-y-2 opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="space-y-2.5 pb-1">
            {templates.map((template) => (
              <TemplateOption
                key={template.id}
                template={template}
                active={selectedTemplateId === template.id}
                onClick={() => chooseTemplate(template)}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedTemplate && !templatesOpen && (
        <div className="animate-template-chip mb-4">
          <TemplateOption
            template={selectedTemplate}
            active
            collapsed
            onClick={expandTemplates}
          />
        </div>
      )}

      {!selectedTemplate && !templatesOpen && (
        <button
          type="button"
          onClick={expandTemplates}
          className="animate-template-chip mb-4 h-11 rounded-2xl border border-border/70 bg-card/80 px-4 text-sm font-semibold text-foreground shadow-sm transition active:scale-95"
        >
          Templates
        </button>
      )}

      <div
        className={`my-5 flex items-center gap-3 transition-all duration-300 ${
          composerFocused ? "my-3 opacity-70" : ""
        }`}
      >
        <div className="h-px flex-1 bg-border/70" />
        <span className="text-xs text-muted-foreground">
          {composerFocused ? "make it yours" : "or write your own"}
        </span>
        <div className="h-px flex-1 bg-border/70" />
      </div>

      <label htmlFor="wish-message" className="sr-only">
        Your message
      </label>
      <textarea
        id="wish-message"
        value={message}
        onChange={(event) => {
          onMessageChange(event.target.value);
          if (templatesOpen) focusComposer();
        }}
        onFocus={focusComposer}
        rows={composerFocused ? 8 : 5}
        placeholder="Write from the heart..."
        className={`w-full resize-none rounded-3xl border bg-card/90 px-4 py-4 text-[16px] leading-6 outline-none transition-[min-height,border-color,box-shadow,background-color,transform] duration-300 ease-out ${
          composerFocused
            ? "min-h-[244px] border-primary/70 ring-4 ring-primary/10"
            : "min-h-[148px] border-border/80 focus:min-h-[190px] focus:border-primary/70 focus:ring-4 focus:ring-primary/10"
        } ${composerPulse ? "animate-composer-focus" : ""}`}
        style={{ boxShadow: composerFocused ? "var(--shadow-glow)" : "var(--shadow-soft)" }}
      />
      <p className="mt-2 text-right text-[11px] text-muted-foreground">
        {message.length}/{MAX_MESSAGE_LENGTH}
      </p>
    </div>
  );
}

export function DetailsStep({
  from,
  photo,
  to,
  onFromChange,
  onPhotoRemove,
  onPhotoUpload,
  onToChange,
}: {
  from: string;
  photo: string | null;
  to: string;
  onFromChange: (value: string) => void;
  onPhotoRemove: () => void;
  onPhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToChange: (value: string) => void;
}) {
  return (
    <div>
      <div className="mb-5">
        <h1 className="font-serif text-[32px] leading-[1.05]">Make it personal</h1>
        <p className="mt-2 text-[14px] leading-6 text-muted-foreground">
          Names and a photo are optional. Keep it simple if you want to send fast.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            To
          </span>
          <input
            value={to}
            onChange={(event) => onToChange(event.target.value)}
            placeholder="Their name"
            className="mt-2 h-[52px] w-full rounded-2xl border border-border/80 bg-card/85 px-4 text-[16px] outline-none transition focus:border-primary/70 focus:ring-4 focus:ring-primary/10"
          />
        </label>

        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            From
          </span>
          <input
            value={from}
            onChange={(event) => onFromChange(event.target.value)}
            placeholder="Your name"
            className="mt-2 h-[52px] w-full rounded-2xl border border-border/80 bg-card/85 px-4 text-[16px] outline-none transition focus:border-primary/70 focus:ring-4 focus:ring-primary/10"
          />
        </label>

        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Photo
          </span>
          {!photo ? (
            <label className="touch-card mt-2 flex min-h-[126px] cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border/80 bg-card/60 px-4 py-6 text-center transition active:scale-[0.99]">
              <span className="grid h-[52px] w-[52px] place-items-center rounded-full bg-muted/80 text-muted-foreground">
                <Camera className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-sm font-semibold">Add a photo</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  Cropped and compressed before upload
                </span>
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={onPhotoUpload} />
            </label>
          ) : (
            <div className="mt-2 flex items-center gap-3 rounded-3xl border border-border/70 bg-card/85 p-3">
              <img
                src={photo}
                alt="Selected"
                className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-2 ring-primary/20"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Photo added</p>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                  It will appear on the card preview.
                </p>
              </div>
              <button
                type="button"
                onClick={onPhotoRemove}
                className="grid h-9 w-9 place-items-center rounded-full border border-border/70 text-muted-foreground transition active:scale-95"
                aria-label="Remove photo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PreviewStep({
  bg,
  from,
  message,
  photo,
  to,
  type,
  onBgChange,
}: {
  bg: string;
  from: string;
  message: string;
  photo: string | null;
  to: string;
  type: string;
  onBgChange: (id: string) => void;
}) {
  return (
    <div>
      <div className="mb-4">
        <h1 className="font-serif text-[32px] leading-[1.05]">Preview and send</h1>
        <p className="mt-2 text-[14px] leading-6 text-muted-foreground">
          Choose a background, then create your share link.
        </p>
      </div>

      <div data-horizontal-scroll="true" className="app-bleed-gutter mb-4 overflow-x-auto pb-2">
        <div className="flex gap-2.5">
          {BACKGROUNDS.map((item) => (
            <BackgroundOption
              key={item.id}
              emoji={item.emoji}
              label={item.label}
              active={bg === item.id}
              onClick={() => onBgChange(item.id)}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[360px]">
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
    </div>
  );
}

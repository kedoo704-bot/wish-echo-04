"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { GardenLetterCard } from "@/components/garden/GardenLetterCard";
import { saveGardenLetter } from "@/lib/garden";
import { randomSeed } from "@/lib/garden-bouquet";
import { GARDEN_LABEL_MAX_LENGTH, GARDEN_MESSAGE_MAX_LENGTH } from "@/lib/garden-schema";
import { containsProfanityIn } from "@/lib/profanity";

export function GardenWriteForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  // Stable for the life of this draft so the preview's flowers don't
  // reshuffle on every keystroke — the server assigns the real seed at save.
  const [previewSeed] = useState(() => randomSeed());

  const preview = useMemo(
    () => ({
      message: message.trim() || "Write something heartfelt, then watch it bloom.",
      to: to.trim() || null,
      from: from.trim() || null,
      flowerSeed: previewSeed,
    }),
    [message, to, from, previewSeed]
  );

  const submit = async () => {
    setError("");
    if (!message.trim()) {
      setError("Write a message first.");
      return;
    }
    if (containsProfanityIn([message, to, from])) {
      setError("That message can't be shared — please rephrase it.");
      return;
    }

    setSaving(true);
    try {
      const id = await saveGardenLetter({ message: message.trim(), to: to.trim(), from: from.trim() });
      router.push(`/garden/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the letter. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="mx-auto max-w-sm">
        <GardenLetterCard letter={preview} />
      </div>

      <div className="mx-auto mt-8 max-w-sm space-y-4">
        <div>
          <label htmlFor="letter-message" className="text-xs font-medium text-muted-foreground">
            Your letter
          </label>
          <textarea
            id="letter-message"
            value={message}
            onChange={(event) => setMessage(event.target.value.slice(0, GARDEN_MESSAGE_MAX_LENGTH))}
            placeholder="Write whatever's on your heart..."
            rows={4}
            className="mt-1.5 w-full resize-none rounded-2xl border border-border/60 bg-card/70 p-4 text-sm leading-relaxed text-foreground outline-none backdrop-blur placeholder:text-muted-foreground/70 focus:border-border"
          />
          <p className="mt-1 text-right text-[11px] text-muted-foreground">
            {message.length}/{GARDEN_MESSAGE_MAX_LENGTH}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="letter-to" className="text-xs font-medium text-muted-foreground">
              To (optional)
            </label>
            <input
              id="letter-to"
              value={to}
              onChange={(event) => setTo(event.target.value.slice(0, GARDEN_LABEL_MAX_LENGTH))}
              placeholder="a stranger, bestie..."
              className="mt-1.5 w-full rounded-xl border border-border/60 bg-card/70 px-3 py-2.5 text-sm text-foreground outline-none backdrop-blur placeholder:text-muted-foreground/70 focus:border-border"
            />
          </div>
          <div>
            <label htmlFor="letter-from" className="text-xs font-medium text-muted-foreground">
              Sign as (optional)
            </label>
            <input
              id="letter-from"
              value={from}
              onChange={(event) => setFrom(event.target.value.slice(0, GARDEN_LABEL_MAX_LENGTH))}
              placeholder="Anonymous"
              className="mt-1.5 w-full rounded-xl border border-border/60 bg-card/70 px-3 py-2.5 text-sm text-foreground outline-none backdrop-blur placeholder:text-muted-foreground/70 focus:border-border"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-[13px] leading-5 text-destructive">
            {error}
          </p>
        )}

        <p className="text-[11px] leading-relaxed text-muted-foreground">
          This creates a shareable link, like a Kehdoo card — anyone with the link can read it, but it
          isn&apos;t listed publicly in the garden.
        </p>

        <button
          type="button"
          onClick={submit}
          disabled={saving}
          className="btn-3d flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-semibold"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating your letter
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Create and share
            </>
          )}
        </button>
      </div>
    </div>
  );
}

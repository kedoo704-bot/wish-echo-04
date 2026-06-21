"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronUp, Volume2, VolumeX } from "lucide-react";
import { MESSAGE_TYPES } from "@/lib/wish";
import { WishBackground } from "@/components/WishBackground";
import { GreetingCard } from "@/components/GreetingCard";
import { BrandLogo } from "@/components/BrandLogo";
import { incrementViews, getPhotoUrl, type CardRow } from "@/lib/cards";

const CHIME_NOTES = [261.63, 329.63, 392, 523.25, 349.23, 440];

type AudioState = {
  context: AudioContext;
  gain: GainNode;
  oscillator: OscillatorNode;
  timer: number;
};

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

type EnvelopePhase = "idle" | "flap-opening" | "card-rising" | "revealed";

export default function CardDisplay({ card }: { card: CardRow }) {
  const wish = card.payload;
  const typeMeta = MESSAGE_TYPES.find((m) => m.id === wish.type) ?? MESSAGE_TYPES[0];
  const photoUrl = card.photo_path ? getPhotoUrl(card.photo_path) : null;

  const [phase, setPhase] = useState<EnvelopePhase>("idle");
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<AudioState | null>(null);
  const touchStartY = useRef<number>(0);

  useEffect(() => {
    const viewKey = `kehdoo:viewed:${card.id}`;
    const trackView = () => {
      if (sessionStorage.getItem(viewKey)) return;
      sessionStorage.setItem(viewKey, "1");
      incrementViews(card.id);
    };

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => void;
    };
    if (idleWindow.requestIdleCallback) {
      idleWindow.requestIdleCallback(trackView, { timeout: 1500 });
    } else {
      setTimeout(trackView, 500);
    }

    return () => stopAudio();
  }, [card.id]);

  const stopAudio = () => {
    const state = audioRef.current;
    if (!state) return;

    window.clearInterval(state.timer);
    const now = state.context.currentTime;
    state.gain.gain.cancelScheduledValues(now);
    state.gain.gain.setValueAtTime(Math.max(state.gain.gain.value, 0.0001), now);
    state.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    window.setTimeout(() => {
      state.oscillator.stop();
      state.context.close();
    }, 560);
    audioRef.current = null;
  };

  const startAudio = async () => {
    if (audioRef.current) return;

    const audioWindow = window as AudioWindow;
    const AudioCtor = audioWindow.AudioContext || audioWindow.webkitAudioContext;
    if (!AudioCtor) return;

    const context = new AudioCtor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    let index = 0;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(CHIME_NOTES[0], context.currentTime);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.7);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();

    const timer = window.setInterval(() => {
      index = (index + 1) % CHIME_NOTES.length;
      oscillator.frequency.setTargetAtTime(CHIME_NOTES[index], context.currentTime, 0.18);
    }, 1400);

    audioRef.current = { context, gain, oscillator, timer };
    setMuted(false);
  };

  const unwrap = async () => {
    if (phase !== "idle") return;
    setPhase("flap-opening");
    await startAudio();
    window.setTimeout(() => setPhase("card-rising"), 280);
    window.setTimeout(() => setPhase("revealed"), 760);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartY.current - e.changedTouches[0].clientY;
    if (delta > 40) unwrap();
  };

  const toggleAudio = () => {
    const state = audioRef.current;
    if (!state) return;

    const now = state.context.currentTime;
    state.gain.gain.cancelScheduledValues(now);
    if (muted) {
      state.gain.gain.setValueAtTime(0.0001, now);
      state.gain.gain.exponentialRampToValueAtTime(0.12, now + 0.5);
      setMuted(false);
      return;
    }

    state.gain.gain.setValueAtTime(Math.max(state.gain.gain.value, 0.0001), now);
    state.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    setMuted(true);
  };

  const startClean = () => {
    stopAudio();
    window.location.assign("/");
  };

  return (
    <main className="relative min-h-[100dvh] overflow-hidden px-5 pb-28 pt-20 md:px-8 md:pb-32 md:pt-24">
      <WishBackground bg={wish.bg} />

      <div className="safe-top pointer-events-none fixed inset-x-0 top-0 z-40 px-5 pt-4 md:px-8">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="inline-flex rounded-full border border-white/60 bg-background/82 px-3.5 py-2 shadow-lg backdrop-blur-xl">
            <BrandLogo className="h-8 w-auto max-w-[128px] object-contain" priority />
          </div>
          {phase === "revealed" && audioRef.current && (
            <button
              type="button"
              onClick={toggleAudio}
              className="btn-glass pointer-events-auto grid h-11 w-11 place-items-center rounded-full text-foreground"
              aria-label={muted ? "Turn sound on" : "Mute sound"}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-12rem)] w-full max-w-2xl flex-col justify-center gap-5">
        <section className="recipient-stage relative">
          {phase !== "revealed" && (
            <div
              className="envelope-scene"
              onClick={unwrap}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && unwrap()}
              aria-label="Open the envelope"
              style={{ touchAction: "none" }}
            >
              <div className="envelope-body">
                <div className="envelope-interior" />
                <div className="envelope-fold-bottom" />
                <div className="envelope-fold-left" />
                <div className="envelope-fold-right" />
                <div className={`envelope-flap${phase !== "idle" ? " is-open" : ""}`} />
                <div className={`envelope-card-teaser${phase === "card-rising" ? " is-rising" : ""}`}>
                  <span className="teaser-emoji">{typeMeta.emoji}</span>
                  <span className="teaser-label">{typeMeta.label}</span>
                  {wish.to && <span className="teaser-to">Dear {wish.to}</span>}
                </div>
              </div>

              {phase === "idle" && (
                <div className="envelope-prompt">
                  <ChevronUp className="envelope-prompt-icon" />
                  <span>Swipe up or tap to open</span>
                </div>
              )}
            </div>
          )}

          <div className={phase === "revealed" ? "recipient-card-unwrapped" : "pointer-events-none opacity-0"}>
            <GreetingCard
              emoji={typeMeta.emoji}
              label={typeMeta.label}
              to={wish.to}
              from={wish.from}
              message={wish.message}
              photoSrc={photoUrl}
              revealed={phase === "revealed"}
            />
          </div>
        </section>

        {phase === "revealed" && (
          <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
            <section className="recipient-love-strip mx-auto flex max-w-2xl items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">Love this card?</p>
                <p className="truncate text-xs text-white/58">Make your own Kehdoo in a minute.</p>
              </div>
              <button
                type="button"
                onClick={startClean}
                className="btn-3d h-10 shrink-0 rounded-full px-4 text-sm font-semibold"
              >
                Kehdoo
              </button>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

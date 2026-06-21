"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronUp, Gift, Volume2, VolumeX } from "lucide-react";
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

// Father's Day: 3-stage envelope animation
// Stage 1 "opening"  — flap opens, card rises out of envelope
// Stage 2 "revealing" — card flips open to show content, envelope slides down and closes
// Stage 3 "revealed"  — final state
type FDPhase = "idle" | "opening" | "revealing" | "revealed";

export default function CardDisplay({ card }: { card: CardRow }) {
  const wish = card.payload;
  const typeMeta = MESSAGE_TYPES.find((m) => m.id === wish.type) ?? MESSAGE_TYPES[0];
  const photoUrl = card.photo_path ? getPhotoUrl(card.photo_path) : null;
  const isFathersDay = wish.type === "fathers-day";

  // Father's Day state
  const [fdPhase, setFdPhase] = useState<FDPhase>("idle");

  // Standard state (all other occasions — original experience)
  const [revealed, setRevealed] = useState(false);
  const [coverLeaving, setCoverLeaving] = useState(false);

  const [muted, setMuted] = useState(false);
  const audioRef = useRef<AudioState | null>(null);
  const mp3Ref = useRef<HTMLAudioElement | null>(null);
  const touchStartY = useRef<number>(0);

  const isRevealed = isFathersDay ? fdPhase === "revealed" : revealed;

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
    if (mp3Ref.current) {
      mp3Ref.current.pause();
      mp3Ref.current.currentTime = 0;
      mp3Ref.current = null;
    }

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
    if (isFathersDay) {
      if (mp3Ref.current) return;
      const audio = new Audio("/papa_meri_jaan.mp3");
      audio.loop = true;
      audio.volume = 0.85;
      mp3Ref.current = audio;
      await audio.play().catch(() => {});
      setMuted(false);
      return;
    }

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

  // Father's Day: 3-stage reveal
  // t=0    → opening  (flap opens 420ms, card rises 520ms with 280ms delay)
  // t=900  → revealing (card flips in 700ms, envelope exits 550ms)
  // t=1650 → revealed
  const unwrapFD = async () => {
    if (fdPhase !== "idle") return;
    setFdPhase("opening");
    await startAudio();
    window.setTimeout(() => setFdPhase("revealing"), 900);
    window.setTimeout(() => setFdPhase("revealed"), 1650);
  };

  // Standard: original "tap & unwrap" cover
  const unwrap = async () => {
    if (revealed || coverLeaving) return;
    setCoverLeaving(true);
    await startAudio();
    window.setTimeout(() => setRevealed(true), 680);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEndFD = (e: React.TouchEvent) => {
    if (touchStartY.current - e.changedTouches[0].clientY > 40) unwrapFD();
  };

  const toggleAudio = () => {
    if (isFathersDay) {
      const mp3 = mp3Ref.current;
      if (!mp3) return;
      if (muted) { mp3.volume = 0.85; setMuted(false); }
      else        { mp3.volume = 0;    setMuted(true); }
      return;
    }

    const state = audioRef.current;
    if (!state) return;
    const now = state.context.currentTime;
    state.gain.gain.cancelScheduledValues(now);
    if (muted) {
      state.gain.gain.setValueAtTime(0.0001, now);
      state.gain.gain.exponentialRampToValueAtTime(0.12, now + 0.5);
      setMuted(false);
    } else {
      state.gain.gain.setValueAtTime(Math.max(state.gain.gain.value, 0.0001), now);
      state.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      setMuted(true);
    }
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
          {isRevealed && (audioRef.current || mp3Ref.current) && (
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

          {isFathersDay ? (
            <>
              {/* ── Father's Day: Envelope scene ── */}
              {fdPhase !== "revealed" && (
                <div
                  className={`envelope-scene${fdPhase === "revealing" ? " is-exiting" : ""}`}
                  onClick={unwrapFD}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEndFD}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && unwrapFD()}
                  aria-label="Open the envelope"
                  style={{ touchAction: "none" }}
                >
                  <div className="envelope-body">
                    <div className="envelope-interior" />
                    <div className="envelope-fold-bottom" />
                    <div className="envelope-fold-left" />
                    <div className="envelope-fold-right" />
                    <div className={`envelope-flap${fdPhase !== "idle" ? " is-open" : ""}`} />
                    <div className={`envelope-card-teaser${fdPhase === "opening" ? " is-rising" : ""}`}>
                      <span className="teaser-emoji">{typeMeta.emoji}</span>
                      <span className="teaser-label">{typeMeta.label}</span>
                      {wish.to && <span className="teaser-to">Dear {wish.to}</span>}
                    </div>
                  </div>
                  {fdPhase === "idle" && (
                    <div className="envelope-prompt">
                      <ChevronUp className="envelope-prompt-icon" />
                      <span>Swipe up or tap to open</span>
                    </div>
                  )}
                </div>
              )}

              {/* ── Father's Day: Card content (flip in, then static) ── */}
              <div
                className={
                  fdPhase === "revealing" ? "fd-card-flip-in" :
                  fdPhase === "revealed"  ? "fd-card-shown" :
                  "pointer-events-none opacity-0"
                }
              >
                <GreetingCard
                  emoji={typeMeta.emoji}
                  label={typeMeta.label}
                  to={wish.to}
                  from={wish.from}
                  message={wish.message}
                  photoSrc={photoUrl}
                  revealed={fdPhase === "revealing" || fdPhase === "revealed"}
                />
              </div>
            </>
          ) : (
            <>
              {/* ── Standard: original gradient cover ── */}
              {!revealed && (
                <button
                  type="button"
                  onClick={unwrap}
                  className={`recipient-cover touch-card${coverLeaving ? " is-leaving" : ""}`}
                  aria-label="Tap and unwrap the greeting"
                >
                  <span className="recipient-glow recipient-glow-one" />
                  <span className="recipient-glow recipient-glow-two" />
                  <span className="recipient-cover-inner">
                    <span className="grid h-16 w-16 place-items-center rounded-3xl bg-white/18 text-white shadow-2xl backdrop-blur-md">
                      <Gift className="h-8 w-8 animate-gift-bounce" />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/70">
                      A Kehdoo for you
                    </span>
                    <span className="font-serif text-[clamp(2.6rem,14cqw,5.4rem)] leading-[0.92] text-white">
                      Open this feeling
                    </span>
                    <span className="max-w-[25rem] text-sm leading-6 text-white/78">
                      A little message is waiting behind the sleeve.
                    </span>
                    <span className="recipient-pulse-line" />
                    <span className="rounded-full bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-primary shadow-xl">
                      Tap & unwrap
                    </span>
                  </span>
                </button>
              )}

              {/* ── Standard: card reveal ── */}
              <div className={revealed ? "recipient-card-unwrapped" : "pointer-events-none opacity-0"}>
                <GreetingCard
                  emoji={typeMeta.emoji}
                  label={typeMeta.label}
                  to={wish.to}
                  from={wish.from}
                  message={wish.message}
                  photoSrc={photoUrl}
                  revealed={revealed}
                />
              </div>
            </>
          )}
        </section>

        {isRevealed && (
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

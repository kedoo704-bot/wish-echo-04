"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "kehdoo-garden-theme";

const DAY_SKY =
  "radial-gradient(1200px 600px at 8% -5%, oklch(0.92 0.09 95 / 0.9), transparent 60%), linear-gradient(180deg, oklch(0.93 0.05 235) 0%, oklch(0.95 0.03 210) 45%, oklch(0.97 0.02 150) 100%)";

const NIGHT_SKY =
  "radial-gradient(900px 500px at 85% -10%, oklch(0.32 0.06 280 / 0.7), transparent 60%), linear-gradient(180deg, oklch(0.18 0.04 265) 0%, oklch(0.22 0.05 270) 55%, oklch(0.26 0.05 260) 100%)";

// A handful of small radial-gradient dots, tiled — cheap CSS-only starfield,
// only visible against the dark night sky.
const STARS =
  "radial-gradient(1.4px 1.4px at 12% 18%, white, transparent), " +
  "radial-gradient(1px 1px at 34% 62%, white, transparent), " +
  "radial-gradient(1.6px 1.6px at 58% 12%, white, transparent), " +
  "radial-gradient(1px 1px at 73% 45%, white, transparent), " +
  "radial-gradient(1.2px 1.2px at 88% 70%, white, transparent), " +
  "radial-gradient(1px 1px at 22% 82%, white, transparent), " +
  "radial-gradient(1.3px 1.3px at 46% 30%, white, transparent), " +
  "radial-gradient(1px 1px at 95% 20%, white, transparent)";

/**
 * Sky background + day/night toggle, scoped to the Garden pages only — not
 * tied to any site-wide theme. Wrap each Garden page's content in this.
 */
export function GardenChrome({ children }: { children: React.ReactNode }) {
  const [night, setNight] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setNight(stored === "night");
    setReady(true);
  }, []);

  const toggle = () => {
    const next = !night;
    setNight(next);
    window.localStorage.setItem(STORAGE_KEY, next ? "night" : "day");
  };

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 transition-opacity duration-700"
        style={{
          background: night ? `${STARS}, ${NIGHT_SKY}` : DAY_SKY,
          backgroundSize: night ? "220px 220px, auto, auto" : "auto",
          opacity: ready ? 1 : 0,
        }}
      />

      <button
        type="button"
        onClick={toggle}
        aria-label={night ? "Switch to day" : "Switch to night"}
        title={night ? "Switch to day" : "Switch to night"}
        className="fixed right-4 top-4 z-50 grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-card/80 text-foreground shadow-lg backdrop-blur transition hover:bg-card active:scale-95 md:right-6 md:top-6"
      >
        {night ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </button>

      {children}
    </div>
  );
}

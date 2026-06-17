export const MESSAGE_TYPES = [
  { id: "thank-you", label: "Thank You", emoji: "💖" },
  { id: "sorry", label: "Sorry", emoji: "🌸" },
  { id: "good-morning", label: "Good Morning", emoji: "☀️" },
  { id: "congrats", label: "Congratulations", emoji: "🎉" },
  { id: "birthday", label: "Happy Birthday", emoji: "🎂" },
  { id: "get-well", label: "Get Well Soon", emoji: "🌿" },
  { id: "miss-you", label: "Miss You", emoji: "💌" },
  { id: "best-wishes", label: "Best Wishes", emoji: "✨" },
  { id: "custom", label: "Custom", emoji: "💫" },
] as const;

export const TONES = ["Professional", "Emotional", "Friend", "Family", "Teacher"] as const;
export const THEMES = ["Elegant", "Romantic", "Playful", "Minimal", "Festive", "Nature"] as const;
export const BACKGROUNDS = ["hearts", "gradient", "floral", "confetti", "sunrise", "balloons", "stars"] as const;

export type WishPayload = {
  type: string;
  to: string;
  from: string;
  message: string;
  theme: string;
  bg: string;
};

export function encodeWish(p: WishPayload): string {
  const json = JSON.stringify(p);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeWish(s: string): WishPayload | null {
  try {
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(b64)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

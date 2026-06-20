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

export const THEMES = ["Elegant", "Romantic", "Playful", "Minimal", "Festive", "Nature"] as const;

export const BACKGROUNDS: Array<{ id: string; label: string; emoji: string }> = [
  { id: "hearts", label: "Hearts", emoji: "💗" },
  { id: "gradient", label: "Gradient", emoji: "🌅" },
  { id: "floral", label: "Floral", emoji: "🌸" },
  { id: "confetti", label: "Confetti", emoji: "🎊" },
  { id: "sunrise", label: "Sunrise", emoji: "☀️" },
  { id: "balloons", label: "Balloons", emoji: "🎈" },
  { id: "stars", label: "Stars", emoji: "⭐" },
];

/**
 * Each background has its own gradient so the picker produces a visibly
 * different mood (previously every option shared one mesh and "gradient"
 * rendered nothing distinct). Shared by the live preview and the full page.
 */
export const BG_GRADIENTS: Record<string, string> = {
  hearts:
    "radial-gradient(700px 500px at 18% 12%, oklch(0.88 0.13 350 / 0.7), transparent 60%), radial-gradient(600px 460px at 85% 90%, oklch(0.86 0.12 10 / 0.6), transparent 62%), linear-gradient(180deg, oklch(0.985 0.012 350), oklch(0.95 0.04 350))",
  gradient:
    "radial-gradient(800px 520px at 10% 0%, oklch(0.86 0.14 30 / 0.7), transparent 60%), radial-gradient(700px 520px at 95% 100%, oklch(0.82 0.14 320 / 0.65), transparent 62%), linear-gradient(140deg, oklch(0.93 0.08 60), oklch(0.9 0.09 350))",
  floral:
    "radial-gradient(640px 480px at 20% 18%, oklch(0.88 0.12 350 / 0.6), transparent 60%), radial-gradient(620px 480px at 82% 84%, oklch(0.9 0.1 150 / 0.55), transparent 62%), linear-gradient(180deg, oklch(0.985 0.012 340), oklch(0.95 0.04 150))",
  confetti:
    "radial-gradient(620px 460px at 12% 10%, oklch(0.86 0.15 30 / 0.62), transparent 58%), radial-gradient(620px 460px at 88% 18%, oklch(0.85 0.14 200 / 0.55), transparent 60%), radial-gradient(680px 520px at 50% 100%, oklch(0.86 0.14 320 / 0.55), transparent 64%), linear-gradient(180deg, oklch(0.98 0.02 90), oklch(0.95 0.04 320))",
  sunrise:
    "radial-gradient(820px 540px at 50% -8%, oklch(0.9 0.13 70 / 0.8), transparent 60%), radial-gradient(640px 500px at 90% 95%, oklch(0.84 0.14 35 / 0.6), transparent 62%), linear-gradient(180deg, oklch(0.97 0.05 80), oklch(0.93 0.08 40))",
  balloons:
    "radial-gradient(640px 480px at 16% 14%, oklch(0.85 0.13 250 / 0.6), transparent 60%), radial-gradient(620px 480px at 86% 88%, oklch(0.86 0.13 350 / 0.58), transparent 62%), linear-gradient(180deg, oklch(0.98 0.02 250), oklch(0.95 0.04 300))",
  // Light twilight-lavender (not a dark night sky) so dark card text stays
  // legible in the live preview as well as on the page background.
  stars:
    "radial-gradient(760px 520px at 22% 16%, oklch(0.82 0.1 290 / 0.65), transparent 60%), radial-gradient(680px 520px at 84% 88%, oklch(0.8 0.11 265 / 0.6), transparent 62%), linear-gradient(180deg, oklch(0.95 0.03 285), oklch(0.9 0.06 280))",
};

export type WishPayload = {
  type: string;
  to: string;
  from: string;
  message: string;
  theme: string;
  bg: string;
};

export type Template = {
  id: string;
  label: string;
  text: string;
};

export const MESSAGE_TEMPLATES: Record<string, Template[]> = {
  "thank-you": [
    {
      id: "ty-1",
      label: "Heartfelt",
      text: "What you did for me means more than I can put into words. Thank you for showing up, for caring, and for being exactly who you are. I carry your kindness with me always. 💖",
    },
    {
      id: "ty-2",
      label: "Warm & Personal",
      text: "Okay I need to say this properly — you are one of the most generous, thoughtful people I know. Thank you for everything you did. I genuinely don't know what I'd do without you. 🥹",
    },
    {
      id: "ty-3",
      label: "Professional",
      text: "I wanted to take a moment to express my sincere gratitude for your support. Your generosity has made a meaningful difference, and I truly appreciate everything you've done.",
    },
  ],
  "sorry": [
    {
      id: "sr-1",
      label: "Sincere",
      text: "I've been carrying this and I need you to know — I'm truly sorry. I hurt you, and that was wrong. No excuses. I hope with time you can find it in your heart to forgive me. 🌸",
    },
    {
      id: "sr-2",
      label: "Direct",
      text: "I messed up. I know it, and I'm sorry. I value you and what we have too much to let this sit between us. Please know I'm working on being better.",
    },
    {
      id: "sr-3",
      label: "Thoughtful",
      text: "I've been reflecting on what happened and I owe you a real apology. I'm sorry for the hurt I caused. You matter to me more than I sometimes show, and I want to make things right.",
    },
  ],
  "good-morning": [
    {
      id: "gm-1",
      label: "Bright & Cheerful",
      text: "Good morning! ☀️ Just wanted to start your day by reminding you how amazing you are. Go get 'em today — the world's lucky to have you.",
    },
    {
      id: "gm-2",
      label: "Gentle",
      text: "Wishing you a morning as beautiful as you are. May your coffee be strong, your day be peaceful, and your heart be light. Good morning! ☀️",
    },
    {
      id: "gm-3",
      label: "Motivating",
      text: "Good morning! Today is full of possibilities. I believe in your ability to make the most of every moment. Rise and shine — you've got this. 🌅",
    },
  ],
  "congrats": [
    {
      id: "cg-1",
      label: "Celebratory",
      text: "YOU DID IT!!! 🎉 I'm so incredibly proud of you — all the hard work, the late nights, the moments you wanted to give up and didn't. This moment is YOURS. Celebrate big!!",
    },
    {
      id: "cg-2",
      label: "Warm Pride",
      text: "Congratulations! Watching you achieve this fills my heart with so much pride. You've worked so hard and you deserve every bit of this success. We're all cheering for you! 🎊",
    },
    {
      id: "cg-3",
      label: "Professional",
      text: "Warmest congratulations on this well-deserved achievement. Your dedication and hard work have brought you to this milestone — this is truly a moment to be proud of.",
    },
  ],
  "birthday": [
    {
      id: "bd-1",
      label: "Joyful",
      text: "HAPPY BIRTHDAY!! 🎂 Today is YOUR day and I want you to celebrate every second of it. You deserve all the cake, all the love, and all the joy in the world. I'm so glad you exist!!",
    },
    {
      id: "bd-2",
      label: "Warm & Loving",
      text: "Happy Birthday! Another year of you in this world is truly something to celebrate. May this year bring you more joy, more love, and every dream you've been holding in your heart. 🌟",
    },
    {
      id: "bd-3",
      label: "Elegant",
      text: "May this birthday mark the beginning of your most beautiful year yet. Wishing you health, happiness, and the courage to chase everything your heart desires. Happy Birthday! ✨",
    },
  ],
  "get-well": [
    {
      id: "gw-1",
      label: "Caring",
      text: "Hey — I just wanted you to know I'm thinking of you. 🌿 Take all the rest you need. Your only job right now is to heal. I'm here if you need anything at all.",
    },
    {
      id: "gw-2",
      label: "Gentle",
      text: "Sending you so much love right now. Be gentle with yourself, rest as much as you need, and know that we're all rooting for your recovery. You'll be back on your feet soon. 💚",
    },
    {
      id: "gw-3",
      label: "Encouraging",
      text: "I know this is hard, but you are stronger than you know. Take it one day at a time, let yourself be cared for, and trust that brighter days are on the way. Thinking of you. 🌿",
    },
  ],
  "miss-you": [
    {
      id: "my-1",
      label: "Heartfelt",
      text: "I miss you more than I thought it was possible to miss someone. The little things remind me of you constantly. Sending you all my love across the distance. 💌",
    },
    {
      id: "my-2",
      label: "Light & Warm",
      text: "Okay I'm just going to say it — I miss you!! Can we please sort out the time and distance situation?? Thinking about you and sending all the hugs. 🥹",
    },
    {
      id: "my-3",
      label: "Family",
      text: "Every gathering feels a little incomplete without you. We miss your laugh, your presence, and just... you. Can't wait until we're together again. Lots of love. 💗",
    },
  ],
  "best-wishes": [
    {
      id: "bw-1",
      label: "Uplifting",
      text: "Wishing you all the best as you step into this new chapter! ✨ I have no doubt you're going to absolutely shine. You've got this — and I'm cheering for you every step of the way.",
    },
    {
      id: "bw-2",
      label: "Thoughtful",
      text: "As you begin this new journey, I want you to know how much I believe in you. May it bring you joy, growth, and everything you've been hoping for. My best wishes go with you always. ✨",
    },
    {
      id: "bw-3",
      label: "Professional",
      text: "Wishing you all the very best in this exciting new endeavour. Your talent and dedication are sure to take you far. I look forward to hearing about all the wonderful things ahead.",
    },
  ],
  "custom": [
    {
      id: "cu-1",
      label: "From the heart",
      text: "Some things are too important to leave unsaid. I wanted you to know — from the bottom of my heart — how much you mean to me. 💫",
    },
    {
      id: "cu-2",
      label: "Simple & True",
      text: "I know I don't say this enough, but I just wanted you to know: you matter to me. A lot. Thank you for being you. 💗",
    },
    {
      id: "cu-3",
      label: "Thoughtful",
      text: "I've been meaning to say this for a while. Life moves fast and we don't always get a chance to tell people what they mean to us. So here I am, telling you. ✨",
    },
  ],
};


import type { WishPayload } from "./wish";

/* ─── Per-occasion card configs ─────────────────────────────────────── */

type CardConfig = {
  bg: [string, string, string];
  frame: string;
  titleColor: string;
  bodyColor: string;
  mutedColor: string;
  cornerEmoji: [string, string, string, string];
  scatter: string[];
};

const CONFIGS: Record<string, CardConfig> = {
  "thank-you": {
    bg: ["#FFF0F5", "#FFE0EE", "#FFD6E8"],
    frame: "#E84393",
    titleColor: "#3B0023",
    bodyColor: "#4A0030",
    mutedColor: "#9B4D6C",
    cornerEmoji: ["💗", "🌸", "🌷", "💐"],
    scatter: ["💗", "💖", "🌸", "✿", "❀"],
  },
  "sorry": {
    bg: ["#F5F0FF", "#EDE0FF", "#E2D4FF"],
    frame: "#7C3AED",
    titleColor: "#2D0064",
    bodyColor: "#3B0080",
    mutedColor: "#7C50B0",
    cornerEmoji: ["🌸", "🌷", "🕊️", "🌿"],
    scatter: ["🌸", "🌷", "✿", "🌙", "🪷"],
  },
  "good-morning": {
    bg: ["#FFFBEB", "#FFF3C4", "#FFE88A"],
    frame: "#D97706",
    titleColor: "#2C1400",
    bodyColor: "#3A1A00",
    mutedColor: "#92600A",
    cornerEmoji: ["☀️", "🌤️", "🌻", "✨"],
    scatter: ["☀️", "✨", "🌤️", "⭐", "🌟"],
  },
  "congrats": {
    bg: ["#FFFEF0", "#FEFCE8", "#FEFACC"],
    frame: "#B45309",
    titleColor: "#1A1200",
    bodyColor: "#2A1E00",
    mutedColor: "#8B6914",
    cornerEmoji: ["🎊", "⭐", "🏆", "🌟"],
    scatter: ["🎊", "✨", "⭐", "🌟", "🎉"],
  },
  "birthday": {
    bg: ["#FFF0F8", "#FFE0F4", "#FFD6F0"],
    frame: "#EC4899",
    titleColor: "#2A0018",
    bodyColor: "#380020",
    mutedColor: "#8B3060",
    cornerEmoji: ["🎂", "🎈", "🎊", "🎉"],
    scatter: ["🎈", "🎉", "🎊", "✨", "⭐"],
  },
  "get-well": {
    bg: ["#F0FDF4", "#DCFCE7", "#C8F7D8"],
    frame: "#059669",
    titleColor: "#002616",
    bodyColor: "#003820",
    mutedColor: "#2D7A5E",
    cornerEmoji: ["🌿", "🌱", "🍃", "🌺"],
    scatter: ["🌿", "🌱", "🍃", "🌸", "✿"],
  },
  "miss-you": {
    bg: ["#EFF6FF", "#DBEAFE", "#BFDBFE"],
    frame: "#3B82F6",
    titleColor: "#0A1628",
    bodyColor: "#0F1F38",
    mutedColor: "#3A6090",
    cornerEmoji: ["💌", "🌙", "⭐", "💫"],
    scatter: ["💌", "🌙", "⭐", "💫", "✨"],
  },
  "best-wishes": {
    bg: ["#F0FDFA", "#CCFBF1", "#A7F3E8"],
    frame: "#0D9488",
    titleColor: "#002622",
    bodyColor: "#003830",
    mutedColor: "#2A7A72",
    cornerEmoji: ["✨", "🌟", "⭐", "💫"],
    scatter: ["✨", "🌟", "⭐", "💫", "🌠"],
  },
  "custom": {
    bg: ["#FFF7ED", "#FFE8CC", "#FFDCA8"],
    frame: "#EA580C",
    titleColor: "#280800",
    bodyColor: "#3A1200",
    mutedColor: "#8B4020",
    cornerEmoji: ["💫", "✨", "🌟", "⭐"],
    scatter: ["💫", "✨", "🌟", "⭐", "🌠"],
  },
};

const DEFAULT_CONFIG = CONFIGS["custom"];

/* ─── Helpers ────────────────────────────────────────────────────────── */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}


function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const paragraphs = text.split("\n");
  const lines: string[] = [];
  for (const para of paragraphs) {
    if (!para.trim()) { lines.push(""); continue; }
    const words = para.split(" ");
    let line = "";
    for (const word of words) {
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

function rrect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ─── Card dimensions ────────────────────────────────────────────────── */

const CW = 1400; // logical width
const CH = 900;  // logical height

/* ─── Main renderer ──────────────────────────────────────────────────── */

export async function renderGreetingCard(
  canvas: HTMLCanvasElement,
  wish: WishPayload,
  emoji: string,
  occasionLabel: string,
  photo?: string | null,
): Promise<void> {
  canvas.width = CW * 2;
  canvas.height = CH * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(2, 2);

  const cfg = CONFIGS[wish.type] ?? DEFAULT_CONFIG;
  const cx = CW / 2;
  const SERIF = "Georgia, serif";
  const SANS = "system-ui, sans-serif";

  /* ── 1. Background ─────────────────────────────────────────────────── */
  const bgGrad = ctx.createLinearGradient(0, 0, CW * 0.7, CH);
  bgGrad.addColorStop(0, cfg.bg[0]);
  bgGrad.addColorStop(0.55, cfg.bg[1]);
  bgGrad.addColorStop(1, cfg.bg[2]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, CW, CH);

  /* ── 2. Noise texture ──────────────────────────────────────────────── */
  for (let i = 0; i < 5000; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.045})`;
    ctx.fillRect(Math.random() * CW, Math.random() * CH, 1, 1);
  }

  /* ── 3. Background scattered emoji ────────────────────────────────── */
  const scatterPositions = [
    [0.06, 0.09], [0.16, 0.80], [0.94, 0.07], [0.87, 0.90],
    [0.50, 0.03], [0.28, 0.94], [0.72, 0.92], [0.04, 0.52],
    [0.96, 0.50], [0.11, 0.36], [0.89, 0.28], [0.42, 0.06],
    [0.62, 0.96], [0.20, 0.62], [0.80, 0.68],
  ] as [number, number][];

  ctx.save();
  ctx.globalAlpha = 0.11;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  scatterPositions.forEach(([rx, ry], i) => {
    const sz = [28, 22, 18, 24, 20][i % 5];
    ctx.font = `${sz}px serif`;
    ctx.fillText(cfg.scatter[i % cfg.scatter.length], rx * CW, ry * CH);
  });
  ctx.globalAlpha = 1;
  ctx.restore();

  /* ── 4. Outer border ──────────────────────────────────────────────── */
  const pad = 28;
  ctx.save();
  ctx.strokeStyle = cfg.frame;
  ctx.lineWidth = 2.5;
  ctx.globalAlpha = 0.45;
  rrect(ctx, pad, pad, CW - pad * 2, CH - pad * 2, 20);
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.2;
  rrect(ctx, pad + 10, pad + 10, CW - (pad + 10) * 2, CH - (pad + 10) * 2, 14);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.restore();

  /* ── 5. Corner emoji ──────────────────────────────────────────────── */
  ctx.font = "38px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const c = cfg.cornerEmoji;
  ctx.fillText(c[0], 66, 66);
  ctx.fillText(c[1], CW - 66, 66);
  ctx.fillText(c[2], 66, CH - 66);
  ctx.fillText(c[3], CW - 66, CH - 66);

  /* ── 6. Left accent stripe ──────────────────────────────────────────  */
  ctx.save();
  const stripeGrad = ctx.createLinearGradient(0, 0, 180, 0);
  stripeGrad.addColorStop(0, cfg.frame + "28");
  stripeGrad.addColorStop(1, "transparent");
  ctx.fillStyle = stripeGrad;
  ctx.fillRect(pad + 2, pad + 2, 180, CH - (pad + 2) * 2);
  ctx.restore();

  /* ── 6.5. Photo portrait (optional) ─────────────────────────────── */
  if (photo) {
    try {
      const photoSrc = (() => {
        if (photo.startsWith("http") || photo.startsWith("data:")) return photo;
        const b64 = photo.replace(/-/g, "+").replace(/_/g, "/");
        const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
        return `data:image/jpeg;base64,${padded}`;
      })();
      const photoImg = await loadImage(photoSrc);
      const pr = 65;
      const px = CW - 160;
      const py = 165;

      /* drop shadow */
      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, pr + 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.fill();

      /* outer decorative ring */
      ctx.beginPath();
      ctx.arc(px, py, pr + 7, 0, Math.PI * 2);
      ctx.strokeStyle = cfg.frame;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.25;
      ctx.stroke();

      /* clip + draw image */
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.clip();
      const { width: iw, height: ih } = photoImg;
      const scale = Math.max((pr * 2) / iw, (pr * 2) / ih);
      const sw = iw * scale;
      const sh = ih * scale;
      ctx.globalAlpha = 1;
      ctx.drawImage(photoImg, px - sw / 2, py - sh / 2, sw, sh);
      ctx.restore();

      /* inner accent ring on top of image */
      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.strokeStyle = cfg.frame;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.75;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();
    } catch {
      /* photo failed to load — skip silently */
    }
  }

  /* ── 7. Emoji focal point ─────────────────────────────────────────── */
  /* Glow halo */
  const halo = ctx.createRadialGradient(cx, 144, 0, cx, 144, 72);
  halo.addColorStop(0, cfg.frame + "30");
  halo.addColorStop(1, "transparent");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(cx, 144, 72, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = "90px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, cx, 144);

  /* ── 8. Occasion label ────────────────────────────────────────────── */
  ctx.save();
  ctx.font = `700 11.5px ${SANS}`;
  ctx.fillStyle = cfg.frame;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.globalAlpha = 0.8;
  // Letter-spacing workaround for canvas: space out manually
  const label = occasionLabel.toUpperCase();
  const spaced = label.split("").join("  ");
  ctx.fillText(spaced, cx, 212);
  ctx.globalAlpha = 1;
  ctx.restore();

  /* Ornament divider */
  const divY = 245;
  ctx.save();
  ctx.strokeStyle = cfg.frame;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.3;
  ctx.beginPath(); ctx.moveTo(cx - 170, divY); ctx.lineTo(cx - 36, divY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 36, divY); ctx.lineTo(cx + 170, divY); ctx.stroke();
  ctx.globalAlpha = 0.65;
  ctx.restore();
  ctx.font = "16px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = cfg.frame;
  ctx.fillText("✦", cx, divY);

  /* ── 9. Content: Dear line ────────────────────────────────────────── */
  let curY = 278;

  if (wish.to) {
    ctx.font = `italic 50px ${SERIF}`;
    ctx.fillStyle = cfg.titleColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(`Dear ${wish.to},`, cx, curY);
    curY += 68;
  }

  /* ── 10. Message ─────────────────────────────────────────────────── */
  if (wish.message) {
    ctx.font = `400 23px ${SERIF}`;
    ctx.fillStyle = cfg.bodyColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const rawLines = wrapText(ctx, wish.message, 840);
    const maxLines = 7;
    const lines = rawLines.slice(0, maxLines);
    if (rawLines.length > maxLines) {
      lines[maxLines - 1] = lines[maxLines - 1].slice(0, -2).trimEnd() + "…";
    }

    lines.forEach((l, i) => ctx.fillText(l, cx, curY + i * 35));
    curY += lines.length * 35 + 14;
  }

  /* ── 11. Sender ──────────────────────────────────────────────────── */
  if (wish.from) {
    const fromY = Math.max(curY + 10, CH - 148);
    ctx.font = `italic 22px ${SERIF}`;
    ctx.fillStyle = cfg.mutedColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(`— with love, ${wish.from}`, cx, fromY);
  }

  /* ── 12. Footer bar ──────────────────────────────────────────────── */
  const footY = CH - 62;

  ctx.save();
  ctx.strokeStyle = cfg.frame;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.2;
  ctx.beginPath();
  ctx.moveTo(pad + 14, footY);
  ctx.lineTo(CW - pad - 14, footY);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.restore();

  ctx.font = `400 12px ${SANS}`;
  ctx.fillStyle = cfg.mutedColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.globalAlpha = 0.5;
  ctx.fillText("Jo dil mein hai, Kehdoo.  ·  kehdoo.com", cx, footY + 10);
  ctx.globalAlpha = 1;

  /* Seal */
  const sx = CW - 72, sy = footY + 18;
  ctx.save();
  ctx.beginPath();
  ctx.arc(sx, sy, 20, 0, Math.PI * 2);
  ctx.strokeStyle = cfg.frame;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.45;
  ctx.stroke();
  ctx.font = "17px serif";
  ctx.fillStyle = cfg.frame;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✦", sx, sy);
  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ─── Export helpers ─────────────────────────────────────────────────── */

export async function getCardAsBlob(
  wish: WishPayload,
  emoji: string,
  occasionLabel: string,
  photo?: string | null,
): Promise<Blob> {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  await renderGreetingCard(canvas, wish, emoji, occasionLabel, photo);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas blob failed"))),
      "image/png",
      1.0,
    );
  });
}

export async function downloadCardAsPng(
  wish: WishPayload,
  emoji: string,
  occasionLabel: string,
  photo?: string | null,
): Promise<void> {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  await renderGreetingCard(canvas, wish, emoji, occasionLabel, photo);
  const a = document.createElement("a");
  a.download = `kehdoo-${wish.type}-card.png`;
  a.href = canvas.toDataURL("image/png", 1.0);
  a.click();
}

export async function printCard(
  wish: WishPayload,
  emoji: string,
  occasionLabel: string,
  photo?: string | null,
): Promise<void> {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  await renderGreetingCard(canvas, wish, emoji, occasionLabel, photo);
  const dataUrl = canvas.toDataURL("image/png", 1.0);

  const win = window.open("", "_blank", "width=1000,height=720");
  if (!win) { alert("Please allow pop-ups to print the card."); return; }

  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Kehdoo · ${occasionLabel} Card</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#f0ede8;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;font-family:system-ui,sans-serif}
    img{max-width:calc(100vw - 40px);max-height:calc(100vh - 120px);object-fit:contain;border-radius:14px;box-shadow:0 12px 60px rgba(0,0,0,0.2)}
    .bar{display:flex;gap:10px}
    button{padding:10px 24px;border:none;border-radius:99px;cursor:pointer;font-size:13px;font-weight:600;transition:opacity .15s}
    button:hover{opacity:.8}
    .p{background:#111;color:#fff}
    .c{background:#e2ddd8;color:#333}
    @media print{.bar{display:none}body{background:white;padding:0}img{max-width:100%;max-height:100%;border-radius:0;box-shadow:none}@page{size:landscape;margin:6mm}}
  </style>
</head>
<body>
  <img src="${dataUrl}" alt="Kehdoo greeting card">
  <div class="bar">
    <button class="p" onclick="window.print()">🖨 Print · Save as PDF</button>
    <button class="c" onclick="window.close()">Close</button>
  </div>
</body>
</html>`);
  win.document.close();
}

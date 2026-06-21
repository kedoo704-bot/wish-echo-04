import type { WishPayload } from "./wish";

/* ─── Helpers ────────────────────────────────────────────────────────── */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const para of text.split("\n")) {
    if (!para.trim()) { lines.push(""); continue; }
    let line = "";
    for (const word of para.split(" ")) {
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

function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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

function decodePhoto(photo: string): string {
  if (photo.startsWith("http") || photo.startsWith("data:")) return photo;
  const b64 = photo.replace(/-/g, "+").replace(/_/g, "/");
  return `data:image/jpeg;base64,${b64 + "=".repeat((4 - (b64.length % 4)) % 4)}`;
}

/* ─── Card dimensions ────────────────────────────────────────────────── */

const CW = 1080; // canvas logical width
const CH = 1350; // canvas logical height

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

  const isFD = wish.type === "fathers-day";
  const SERIF = "Georgia, serif";
  const SANS = "system-ui, sans-serif";

  // Card geometry
  const CP = 48; // padding from canvas edge to card
  const CX = CP, CY = CP;
  const CDW = CW - CP * 2; // 984
  const CDH = CH - CP * 2; // 1254
  const CR = 50;            // corner radius
  const cx = CW / 2;        // horizontal centre

  // Colours (approximate web card tokens)
  const DARK   = "#281520";
  const MUTED  = "#9C7A8E";
  const PINK   = "#C83060";

  /* ── 1. Page background (approximates --gradient-warm) ──────────────── */
  ctx.fillStyle = "#FAF6F3";
  ctx.fillRect(0, 0, CW, CH);

  const g1 = ctx.createRadialGradient(CW * 0.88, -80, 0, CW * 0.88, -80, 700);
  g1.addColorStop(0, "rgba(255,200,165,0.60)");
  g1.addColorStop(1, "transparent");
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, CW, CH);

  const g2 = ctx.createRadialGradient(-60, CH * 1.08, 0, -60, CH * 1.08, 700);
  g2.addColorStop(0, "rgba(250,175,215,0.50)");
  g2.addColorStop(1, "transparent");
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, CW, CH);

  /* ── 2. Card shadow + white background ──────────────────────────────── */
  ctx.save();
  ctx.shadowColor = "rgba(160,40,100,0.18)";
  ctx.shadowBlur   = 55;
  ctx.shadowOffsetY = 16;
  rrect(ctx, CX, CY, CDW, CDH, CR);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.restore();

  ctx.save();
  rrect(ctx, CX, CY, CDW, CDH, CR);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.restore();

  /* ── 3. Father's Day blurred photo background ───────────────────────── */
  // Photo zone: top 50% of card. Fully visible 0-25%, fading 25-50%.
  // Matches CSS: opacity 0.55, blur 3px, maskImage black 25% → transparent 50%.
  const PHOTO_H = Math.round(CDH * 0.50); // 627 px

  if (photo && isFD) {
    try {
      const photoImg = await loadImage(decodePhoto(photo));
      ctx.save();

      // Clip to top of card, rounded at top corners only
      ctx.beginPath();
      ctx.moveTo(CX + CR, CY);
      ctx.lineTo(CX + CDW - CR, CY);
      ctx.quadraticCurveTo(CX + CDW, CY, CX + CDW, CY + CR);
      ctx.lineTo(CX + CDW, CY + PHOTO_H);
      ctx.lineTo(CX, CY + PHOTO_H);
      ctx.lineTo(CX, CY + CR);
      ctx.quadraticCurveTo(CX, CY, CX + CR, CY);
      ctx.closePath();
      ctx.clip();

      // Draw blurred photo, cover-fitted, respecting photoY
      ctx.filter = "blur(3px)";
      ctx.globalAlpha = 0.55;
      const { width: iw, height: ih } = photoImg;
      const scale = Math.max(CDW / iw, PHOTO_H / ih);
      const sw = iw * scale, sh = ih * scale;
      const drawX = CX + (CDW - sw) / 2;
      const photoYFrac = (wish.photoY ?? 0) / 100;
      const drawY = CY + (PHOTO_H - sh) * photoYFrac; // cover-position matching CSS background-position
      ctx.drawImage(photoImg, drawX, drawY, sw, sh);
      ctx.filter = "none";
      ctx.globalAlpha = 1;

      // Fade to white: visible 0-25% of card, fading 25-50% of card
      const fade = ctx.createLinearGradient(0, CY, 0, CY + PHOTO_H);
      fade.addColorStop(0,    "rgba(255,255,255,0)");
      fade.addColorStop(0.50, "rgba(255,255,255,0)"); // 25% of card / 50% zone = 0.50
      fade.addColorStop(1,    "rgba(255,255,255,0.98)");
      ctx.fillStyle = fade;
      ctx.fillRect(CX, CY, CDW, PHOTO_H);

      ctx.restore();
    } catch { /* photo failed — skip */ }
  }

  /* ── 4. Non-FD photo circle (top-right corner of card) ─────────────── */
  if (photo && !isFD) {
    try {
      const photoImg = await loadImage(decodePhoto(photo));
      const pr = 46, px = CX + CDW - 76, py = CY + 76;
      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.clip();
      const { width: iw, height: ih } = photoImg;
      const scale = Math.max((pr * 2) / iw, (pr * 2) / ih);
      const sw = iw * scale, sh = ih * scale;
      ctx.drawImage(photoImg, px - sw / 2, py - sh / 2, sw, sh);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.strokeStyle = PINK;
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 0.35;
      ctx.stroke();
      ctx.globalAlpha = 1;
    } catch { /* photo failed — skip */ }
  }

  /* ── 5. Content (label → dear → message → from → tagline) ──────────── */
  let curY = CY + 52;

  // Emoji (non-FD only)
  if (!isFD && emoji) {
    ctx.font = "72px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(emoji, cx, curY);
    curY += 90;
  }

  // Occasion label — small tracked caps
  ctx.save();
  ctx.font = `600 13px ${SANS}`;
  ctx.fillStyle = MUTED;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.globalAlpha = 0.85;
  ctx.fillText(occasionLabel.toUpperCase().split("").join("  "), cx, curY);
  ctx.restore();
  curY += 36;

  // "Dear [name]," — name rendered in pink
  if (wish.to) {
    const fs = 60;
    ctx.font = `italic ${fs}px ${SERIF}`;
    ctx.textBaseline = "top";
    const dW = ctx.measureText("Dear ").width;
    const nW = ctx.measureText(wish.to).width;
    const cW = ctx.measureText(",").width;
    const startX = Math.max(CX + 20, (CW - dW - nW - cW) / 2);
    ctx.textAlign = "left";
    ctx.fillStyle = DARK;  ctx.fillText("Dear ", startX, curY);
    ctx.fillStyle = PINK;  ctx.fillText(wish.to, startX + dW, curY);
    ctx.fillStyle = DARK;  ctx.fillText(",", startX + dW + nW, curY);
    curY += Math.round(fs * 1.25);
  }

  // Message body
  if (wish.message) {
    curY += 24;
    const mfs = 26;
    const lineH = Math.round(mfs * 1.6);
    const maxW = CDW * 0.78;
    ctx.font = `${mfs}px ${SERIF}`;
    ctx.fillStyle = DARK;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.globalAlpha = 0.92;
    const lines = wrapText(ctx, wish.message, maxW);
    const cap = 9;
    const vis = lines.slice(0, cap);
    if (lines.length > cap) vis[cap - 1] = vis[cap - 1].trimEnd().slice(0, -1) + "…";
    vis.forEach((l, i) => ctx.fillText(l, cx, curY + i * lineH));
    curY += vis.length * lineH;
    ctx.globalAlpha = 1;
  }

  // "— with love, [from]"
  if (wish.from) {
    curY += 32;
    ctx.font = `italic 22px ${SERIF}`;
    ctx.fillStyle = MUTED;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(`— with love, ${wish.from}`, cx, curY);
    curY += 34;
  }

  // Divider + tagline
  const divY = Math.max(curY + 40, CY + CDH - 88);
  ctx.save();
  ctx.strokeStyle = MUTED;
  ctx.lineWidth = 0.8;
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.moveTo(cx - 40, divY);
  ctx.lineTo(cx + 40, divY);
  ctx.stroke();
  ctx.globalAlpha = 0.55;
  ctx.font = `italic 15px ${SERIF}`;
  ctx.fillStyle = MUTED;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("Jo dil mein hai, Kehdoo.", cx, divY + 14);
  ctx.restore();
}

/* ─── Export helpers ─────────────────────────────────────────────────── */

export async function downloadCardAsPng(
  wish: WishPayload,
  emoji: string,
  occasionLabel: string,
  photo?: string | null,
): Promise<void> {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  await renderGreetingCard(canvas, wish, emoji, occasionLabel, photo);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Canvas blob failed"))),
      "image/png",
      1.0,
    ),
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.download = `kehdoo-${wish.type}-card.png`;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
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

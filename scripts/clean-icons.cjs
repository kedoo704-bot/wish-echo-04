/**
 * One-off: strip the opaque white background from the brand icons.
 * Flood-fills near-white from the four corners (stops at the pink shape, so the
 * enclosed white logo is preserved) → clean transparent rounded corners.
 * Apple/maskable icons are then flattened onto brand pink for full bleed.
 */
const sharp = require("sharp");

const PINK = { r: 253, g: 83, b: 95 };
const DIR = "public/brand";

async function cleanedMaster(srcPath) {
  const { data, info } = await sharp(srcPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const idx = (x, y) => (y * w + x) * c;
  const isWhite = (i) => data[i] >= 200 && data[i + 1] >= 200 && data[i + 2] >= 200 && data[i + 3] >= 128;
  const visited = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => {
    const vi = y * w + x;
    if (!visited[vi] && isWhite(idx(x, y))) {
      visited[vi] = 1;
      stack.push(x, y);
    }
  };
  push(0, 0);
  push(w - 1, 0);
  push(0, h - 1);
  push(w - 1, h - 1);
  while (stack.length) {
    const y = stack.pop();
    const x = stack.pop();
    data[idx(x, y) + 3] = 0;
    if (x + 1 < w) push(x + 1, y);
    if (x - 1 >= 0) push(x - 1, y);
    if (y + 1 < h) push(x, y + 1);
    if (y - 1 >= 0) push(x, y - 1);
  }
  return sharp(Buffer.from(data), { raw: { width: w, height: h, channels: c } }).png().toBuffer();
}

(async () => {
  const buf = await cleanedMaster(`${DIR}/icon-512.png`);

  // Transparent-corner rounded icons (favicon + PWA any-purpose).
  await sharp(buf).png().toFile(`${DIR}/icon-512.png`);
  await sharp(buf).resize(192, 192).png().toFile(`${DIR}/icon-192.png`);
  await sharp(buf).resize(32, 32).png().toFile(`${DIR}/favicon-32.png`);

  // Full-bleed pink squares (Apple rounds its own; maskable safe-zone).
  await sharp(buf).resize(180, 180).flatten({ background: PINK }).png().toFile(`${DIR}/apple-touch-icon.png`);
  await sharp(buf).resize(512, 512).flatten({ background: PINK }).png().toFile(`${DIR}/maskable-icon-512.png`);

  console.log("icons cleaned");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

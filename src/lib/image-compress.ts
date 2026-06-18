const MAX_DIM = 140;   // px — keeps base64 output under ~3.5 KB
const QUALITY = 0.28;  // JPEG quality

/**
 * Resizes + compresses an image File/Blob using Canvas.
 * Returns raw base64 (no data-URL prefix) for compact URL storage.
 */
export async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width: w, height: h } = img;
      const scale = Math.min(MAX_DIM / w, MAX_DIM / h, 1);
      w = Math.round(w * scale);
      h = Math.round(h * scale);

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;

      // Smooth downscaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);

      const dataUrl = canvas.toDataURL("image/jpeg", QUALITY);
      // Strip prefix and convert to base64url (URL-safe, no padding)
      const b64url = dataUrl
        .replace(/^data:image\/jpeg;base64,/, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
      resolve(b64url);
    };

    img.onerror = reject;
    img.src = url;
  });
}

/** Reconstruct a usable src — handles blob:, https:, data: URLs and legacy base64url */
export function toSrc(raw: string): string {
  if (raw.startsWith("blob:") || raw.startsWith("http") || raw.startsWith("data:")) return raw;
  const b64 = raw.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  return `data:image/jpeg;base64,${padded}`;
}

/** Convert raw base64url string to a Blob for uploading */
export function toBlob(raw: string): Blob {
  const b64 = raw.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: "image/jpeg" });
}

/** Estimated URL byte length added by the photo param */
export function estimateUrlBytes(raw: string): number {
  return raw.length + 6; // "&img=".length + 1
}

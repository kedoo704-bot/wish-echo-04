"use client";

/** Converts the VAPID public key (base64url) into the Uint8Array pushManager.subscribe() wants. */
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

export function pushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window &&
    Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
  );
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Timed out waiting for ${label}`)), ms)),
  ]);
}

export type SubscribeResult = "subscribed" | "denied" | "unsupported" | "error";

/**
 * Requests notification permission and subscribes this browser to be
 * notified when `cardId` is first opened — see app/api/cards/[id]/subscribe
 * and app/api/cards/[id]/view (which triggers the actual send).
 *
 * Doesn't assume anything else already registered the service worker —
 * PwaRegister.tsx only does that in production builds (deliberately, to
 * avoid stale-cache confusion in dev), so this registers/waits for its own
 * registration here. Everything is timeout-guarded: a stuck service worker
 * or a browser that silently never resolves `.ready` must not leave the
 * "Notify me" button hung on "Enabling…" forever with no feedback.
 */
export async function subscribeToCardOpenAlert(cardId: string): Promise<SubscribeResult> {
  if (!pushSupported()) return "unsupported";

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return "denied";

    await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    const registration = await withTimeout(navigator.serviceWorker.ready, 8000, "the service worker");

    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
    const subscription =
      (await registration.pushManager.getSubscription()) ??
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      }));

    const json = subscription.toJSON();
    const res = await withTimeout(
      fetch(`/api/cards/${cardId}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
      }),
      8000,
      "the save request"
    );
    if (!res.ok) return "error";

    return "subscribed";
  } catch (err) {
    console.error("[push] subscribe failed:", err);
    return "error";
  }
}

import "server-only";
import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";

let configured = false;

function ensureConfigured(): boolean {
  if (configured) return true;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return false;

  webpush.setVapidDetails("mailto:hello@kehdoo.com", publicKey, privateKey);
  configured = true;
  return true;
}

/**
 * Notify whoever subscribed to this card's "let me know when it's opened"
 * (see app/api/cards/[id]/subscribe). Best-effort: a recipient opening a
 * card must never fail or slow down because push delivery had a problem.
 * Expired/unsubscribed endpoints (410/404 from the push service) are
 * pruned so we stop retrying them.
 */
export async function notifyCardOpened(cardId: string, shareUrl: string): Promise<void> {
  if (!ensureConfigured()) return;

  const admin = createAdminClient();
  if (!admin) return;

  const { data: subs } = await admin
    .from("card_push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .eq("card_id", cardId);
  if (!subs || subs.length === 0) return;

  const payload = JSON.stringify({
    title: "Your Kehdoo was just opened 💌",
    body: "Someone just read what you wrote.",
    url: shareUrl,
  });

  const staleIds: number[] = [];

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
      } catch (err) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) staleIds.push(sub.id as number);
      }
    })
  );

  if (staleIds.length > 0) {
    await admin.from("card_push_subscriptions").delete().in("id", staleIds);
  }
}

import type { WishPayload } from "@/lib/wish";
import { createOptionalClient } from "@/lib/supabase/client";

export type CardRow = {
  id: string;
  payload: WishPayload;
  photo_path: string | null;
  view_count: number;
  created_by: string | null;
  created_at: string;
};

const BUCKET = "card-photos";

/**
 * Public URL for a stored card photo. Reads are RLS-allowed, so the anon
 * client can resolve the URL on either the client or server.
 */
export function getPhotoUrl(path: string): string {
  const supabase = createOptionalClient();
  if (!supabase) return "";
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/**
 * Create a card via the secure server route. The client never inserts rows or
 * uploads to storage directly. The server validates, derives ownership from
 * the session, re-encodes the photo, and persists via Supabase service role.
 */
export async function saveCard(payload: WishPayload, photoFile: File | null): Promise<string> {
  const form = new FormData();
  form.set("payload", JSON.stringify(payload));
  if (photoFile) form.set("file", photoFile);

  const res = await fetch("/api/cards", { method: "POST", body: form });
  if (!res.ok) {
    throw new Error(`Card creation failed (${res.status})`);
  }
  const data = (await res.json()) as { id: string };
  return data.id;
}

/** Best-effort view increment via the server. */
export async function incrementViews(id: string): Promise<void> {
  try {
    await fetch(`/api/cards/${id}/view`, { method: "POST", keepalive: true });
  } catch {
    // Non-critical.
  }
}

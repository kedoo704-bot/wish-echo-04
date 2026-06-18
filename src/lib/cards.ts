import type { WishPayload } from "@/lib/wish";
import { nanoid } from "@/lib/nanoid";
import { createClient } from "@/lib/supabase/client";

export type CardRow = {
  id: string;
  payload: WishPayload;
  photo_path: string | null;
  view_count: number;
  created_by: string | null;
  created_at: string;
};

const BUCKET = "card-photos";

async function uploadPhotoViaApi(file: File, cardId: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("cardId", cardId);
  const res = await fetch("/api/upload-photo", { method: "POST", body: formData });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(error ?? "Upload failed");
  }
  const { path } = await res.json();
  return path;
}

export function getPhotoUrl(path: string): string {
  const supabase = createClient();
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function saveCard(
  payload: WishPayload,
  photoFile: File | null,
  userId: string | null
): Promise<string> {
  const supabase = createClient();
  const id = nanoid(8);

  const photo_path = photoFile ? await uploadPhotoViaApi(photoFile, id) : null;

  const { error } = await supabase.from("cards").insert({
    id,
    payload,
    photo_path,
    created_by: userId,
  });

  if (error) throw error;
  return id;
}

export async function getCard(id: string): Promise<CardRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as CardRow;
}

export async function incrementViews(id: string): Promise<void> {
  const supabase = createClient();
  await supabase.rpc("increment_card_views", { card_id: id });
}

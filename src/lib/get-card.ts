import { cache } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { CardRow } from "@/lib/cards";

let readClient: SupabaseClient | null | undefined;

function getReadClient(): SupabaseClient | null {
  if (readClient !== undefined) return readClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    readClient = null;
    return readClient;
  }

  readClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return readClient;
}

/**
 * Request-deduplicated, cookieless card read. `generateMetadata` and the page
 * component call this for the same id within one render — `cache` collapses
 * them into a single Supabase query. Avoiding cookies keeps the card route
 * statically cacheable (ISR) instead of forcing dynamic rendering. Reads use
 * the anon key and are guarded by RLS (public select only).
 */
export const getCardById = cache(async (id: string): Promise<CardRow | null> => {
  const supabase = getReadClient();
  if (!supabase) return null;

  const { data, error } = await supabase.from("cards").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data as CardRow;
});

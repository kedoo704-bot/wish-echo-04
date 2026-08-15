import { cache } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { GardenLetterRow } from "@/lib/garden";

let readClient: SupabaseClient | null | undefined;

function getReadClient(): SupabaseClient | null {
  if (readClient !== undefined) return readClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    readClient = null;
    return readClient;
  }

  readClient = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return readClient;
}

/**
 * Request-deduplicated, cookieless letter read — mirrors src/lib/get-card.ts.
 * Only custom (DB-backed) letters go through this; pre-defined letters are
 * static content, see src/lib/garden-letters-content.ts.
 */
export const getGardenLetterById = cache(async (id: string): Promise<GardenLetterRow | null> => {
  const supabase = getReadClient();
  if (!supabase) return null;

  const { data, error } = await supabase.from("garden_letters").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data as GardenLetterRow;
});

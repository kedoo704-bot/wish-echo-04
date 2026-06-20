import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Server-only: it bypasses RLS, so it must never
 * be imported into a client component. Used exclusively by validated server
 * routes for card writes, view increments, and storage uploads.
 */
let adminClient: SupabaseClient | null | undefined;

export function createAdminClient(): SupabaseClient | null {
  if (adminClient !== undefined) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    adminClient = null;
    return adminClient;
  }

  adminClient = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}

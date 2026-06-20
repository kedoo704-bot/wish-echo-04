import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Cheap guard against scripted view inflation.
  const limit = rateLimit(`view:${clientIp(req)}:${id}`, 1, 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const admin = createAdminClient();
  if (!admin || !id) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  try {
    const { error } = await admin.rpc("increment_card_view", { card_id: id });
    if (error) {
      const { data } = await admin
        .from("cards")
        .select("view_count")
        .eq("id", id)
        .single<{ view_count: number }>();

      await admin
        .from("cards")
        .update({ view_count: (data?.view_count ?? 0) + 1 })
        .eq("id", id);
    }
  } catch {
    // View counting is best-effort; never surface an error to the recipient.
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

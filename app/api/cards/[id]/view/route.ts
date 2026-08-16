import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { notifyCardOpened } from "@/lib/push-server";
import { absoluteUrl } from "@/lib/site-config";

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
    // Read the count *before* incrementing so we can tell whether this
    // request is the first-ever view — that's the only one worth notifying
    // the sender about; every view after that would just be noise.
    const { data: before } = await admin
      .from("cards")
      .select("view_count")
      .eq("id", id)
      .single<{ view_count: number }>();
    const isFirstView = (before?.view_count ?? 0) === 0;

    const { error } = await admin.rpc("increment_card_view", { card_id: id });
    if (error) {
      await admin
        .from("cards")
        .update({ view_count: (before?.view_count ?? 0) + 1 })
        .eq("id", id);
    }

    if (isFirstView) {
      // Best-effort, never blocks the response to the recipient opening
      // the card — fire and forget.
      void notifyCardOpened(id, absoluteUrl(`/share/${id}`));
    }
  } catch {
    // View counting is best-effort; never surface an error to the recipient.
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

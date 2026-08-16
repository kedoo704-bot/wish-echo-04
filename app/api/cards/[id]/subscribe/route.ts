import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const subscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

type Params = { params: Promise<{ id: string }> };

/**
 * Saves a "notify me when this card is opened" push subscription. Anyone
 * holding the card id can subscribe — the same trust boundary /share/[id]
 * already relies on (no separate ownership check), and this only ever
 * reveals "the card was opened", never its content.
 */
export async function POST(req: Request, { params }: Params) {
  const limit = rateLimit(`push-sub:${clientIp(req)}`, 20, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Supabase service role is not configured." }, { status: 503 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = subscriptionSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid subscription." }, { status: 422 });
  }

  const { data: card } = await admin.from("cards").select("id").eq("id", id).single();
  if (!card) {
    return NextResponse.json({ error: "Card not found." }, { status: 404 });
  }

  const { error } = await admin.from("card_push_subscriptions").upsert(
    {
      card_id: id,
      endpoint: result.data.endpoint,
      p256dh: result.data.keys.p256dh,
      auth: result.data.keys.auth,
    },
    { onConflict: "card_id,endpoint" }
  );
  if (error) {
    return NextResponse.json({ error: "Could not save subscription." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

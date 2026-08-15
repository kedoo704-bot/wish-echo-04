import { NextResponse } from "next/server";
import { nanoid } from "@/lib/nanoid";
import { gardenLetterSchema, validateGardenLetter } from "@/lib/garden-schema";
import { randomSeed } from "@/lib/garden-bouquet";
import { createAdminClient } from "@/lib/supabase/admin";
import { createOptionalClient } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

function hasSupabaseSessionCookie(req: Request): boolean {
  const cookie = req.headers.get("cookie");
  return Boolean(cookie?.includes("sb-") && cookie.includes("auth-token"));
}

export async function POST(req: Request) {
  const limit = rateLimit(`garden:${clientIp(req)}`, 10, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Supabase service role is not configured." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = gardenLetterSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid letter.", issues: result.error.flatten() },
      { status: 422 }
    );
  }

  const check = validateGardenLetter(result.data);
  if (!check.ok) {
    return NextResponse.json({ error: check.reason }, { status: 422 });
  }

  // Posting is anonymous — no sign-in required. If the visitor happens to
  // already be signed in (e.g. they also use the main creator), attach
  // their id anyway; it's unused today but harmless to keep for later.
  let createdBy: string | null = null;
  if (hasSupabaseSessionCookie(req)) {
    const supabase = await createOptionalClient();
    const {
      data: { user },
    } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
    createdBy = user?.id ?? null;
  }

  const id = nanoid(8);
  try {
    const { error } = await admin.from("garden_letters").insert({
      id,
      message: result.data.message,
      to_label: result.data.to || null,
      from_label: result.data.from || null,
      flower_seed: randomSeed(),
      created_by: createdBy,
    });
    if (error) throw error;
  } catch {
    return NextResponse.json({ error: "Could not post the letter." }, { status: 500 });
  }

  return NextResponse.json({ id }, { status: 201 });
}

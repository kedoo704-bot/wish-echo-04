import { NextResponse } from "next/server";
import { nanoid } from "@/lib/nanoid";
import { wishSchema, MAX_PHOTO_BYTES } from "@/lib/wish-schema";
import { createAdminClient } from "@/lib/supabase/admin";
import { createOptionalClient } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const BUCKET = "card-photos";
const PHOTO_MAX_DIM = 800;

function hasSupabaseSessionCookie(req: Request): boolean {
  const cookie = req.headers.get("cookie");
  return Boolean(cookie?.includes("sb-") && cookie.includes("auth-token"));
}

export async function POST(req: Request) {
  const limit = rateLimit(`cards:${clientIp(req)}`, 20, 10 * 60 * 1000);
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

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const rawPayload = form.get("payload");
  if (typeof rawPayload !== "string") {
    return NextResponse.json({ error: "Missing payload." }, { status: 400 });
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawPayload);
  } catch {
    return NextResponse.json({ error: "Payload is not valid JSON." }, { status: 400 });
  }

  const result = wishSchema.safeParse(parsedJson);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid card data.", issues: result.error.flatten() },
      { status: 422 }
    );
  }
  const payload = result.data;

  // Identity comes from the verified session, never from the client.
  let createdBy: string | null = null;
  if (hasSupabaseSessionCookie(req)) {
    const supabase = await createOptionalClient();
    const {
      data: { user },
    } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
    createdBy = user?.id ?? null;
  }

  const id = nanoid(8);
  let photoPath: string | null = null;
  const file = form.get("file");

  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Photo must be an image." }, { status: 415 });
    }
    if (file.size > MAX_PHOTO_BYTES) {
      return NextResponse.json({ error: "Photo is too large." }, { status: 413 });
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    let processed: Buffer;
    try {
      const sharp = (await import("sharp")).default;
      processed = await sharp(inputBuffer)
        .rotate()
        .resize(PHOTO_MAX_DIM, PHOTO_MAX_DIM, { fit: "cover", position: "attention" })
        .webp({ quality: 82 })
        .toBuffer();
    } catch {
      return NextResponse.json({ error: "Could not process that image." }, { status: 422 });
    }

    photoPath = `${id}.webp`;
    const { error } = await admin.storage.from(BUCKET).upload(photoPath, processed, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: true,
    });
    if (error) {
      return NextResponse.json({ error: "Photo upload failed." }, { status: 502 });
    }
  }

  try {
    const { error } = await admin.from("cards").insert({
      id,
      payload,
      photo_path: photoPath,
      created_by: createdBy,
    });
    if (error) throw error;
  } catch {
    return NextResponse.json({ error: "Could not save the card." }, { status: 500 });
  }

  return NextResponse.json({ id }, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "card-photos";
const MAX_DIM = 800;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const cardId = formData.get("cardId") as string | null;

  if (!file || !cardId) {
    return NextResponse.json({ error: "Missing file or cardId" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const processed = await sharp(buffer)
    .resize(MAX_DIM, MAX_DIM, { fit: "cover", position: "attention" })
    .webp({ quality: 85 })
    .toBuffer();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const path = `${cardId}.webp`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, processed, {
    contentType: "image/webp",
    upsert: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ path });
}

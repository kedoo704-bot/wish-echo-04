import { ImageResponse } from "next/og";
import { MESSAGE_TYPES } from "@/lib/wish";
import { getCardById } from "@/lib/get-card";
import { getShareDescription, getShareTitle } from "@/lib/share";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PHOTO_BUCKET = "card-photos";

function getPublicPhotoUrl(path: string | null): string | null {
  if (!SUPABASE_URL || !path) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${PHOTO_BUCKET}/${encodeURIComponent(path)}`;
}

async function getPhotoDataUrl(path: string | null): Promise<string | null> {
  const url = getPublicPhotoUrl(path);
  if (!url) return null;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type") || "image/webp";
    const bytes = Buffer.from(await response.arrayBuffer());
    return `data:${contentType};base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const card = await getCardById(id);
  const wish = card?.payload;
  const typeMeta = wish
    ? (MESSAGE_TYPES.find((item) => item.id === wish.type) ?? MESSAGE_TYPES[0])
    : MESSAGE_TYPES[0];
  const title = wish ? getShareTitle(wish) : "A wish for you";
  const description = wish ? getShareDescription(wish) : "Someone sent you a mesmerising greeting";

  const logoUrl = new URL("/brand/main-logo-lockup.png", siteConfig.url).toString();
  const photoUrl = await getPhotoDataUrl(card?.photo_path ?? null);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #fff8f7 0%, #fde8ef 48%, #f7edf5 100%)",
          color: "#241326",
          fontFamily: "Georgia, serif",
          padding: "58px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img src={logoUrl} alt="Kehdoo" style={{ width: 214, height: "auto" }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              border: "1px solid rgba(194, 84, 126, 0.28)",
              borderRadius: 999,
              padding: "12px 20px",
              color: "#9d3864",
              fontFamily: "system-ui",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            <span style={{ fontSize: 34, lineHeight: 1 }}>{typeMeta.emoji}</span>
            <span>{typeMeta.label}</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 34,
            border: "1px solid rgba(194, 84, 126, 0.25)",
            background: "rgba(255, 255, 255, 0.72)",
            borderRadius: 38,
            padding: photoUrl ? "34px 42px" : "48px 58px",
            boxShadow: "0 32px 90px rgba(125, 50, 88, 0.16)",
          }}
        >
          {photoUrl ? (
            <img
              src={photoUrl}
              alt=""
              style={{
                width: 216,
                height: 216,
                objectFit: "cover",
                borderRadius: 38,
                boxShadow: "0 24px 60px rgba(125, 50, 88, 0.18)",
              }}
            />
          ) : (
            <img src={logoUrl} alt="" style={{ width: 420, height: "auto" }} />
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: title.length > 54 ? 45 : 54,
                lineHeight: 1.08,
                color: "#241326",
              }}
            >
              {title}
            </div>
            <div
              style={{
                marginTop: 20,
                fontFamily: "system-ui",
                fontSize: 27,
                lineHeight: 1.42,
                color: "#63465c",
                maxWidth: photoUrl ? 590 : 900,
              }}
            >
              {description}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#8c6077",
            fontFamily: "system-ui",
            fontSize: 22,
          }}
        >
          <span>Jo dil mein hai, Kehdoo.</span>
          <span>kehdoo.com</span>
        </div>
      </div>
    ),
    size
  );
}

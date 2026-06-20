import { ImageResponse } from "next/og";
import { MESSAGE_TYPES } from "@/lib/wish";
import { getCardById } from "@/lib/get-card";
import { getShareDescription, getShareTitle } from "@/lib/share";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://kehdoo.com";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const card = await getCardById(id);
  const wish = card?.payload;
  const typeMeta = wish
    ? (MESSAGE_TYPES.find((item) => item.id === wish.type) ?? MESSAGE_TYPES[0])
    : MESSAGE_TYPES[0];
  const title = wish ? getShareTitle(wish) : "A wish for you";
  const description = wish ? getShareDescription(wish) : "Someone sent you a mesmerising greeting";

  const logoUrl = new URL("/brand/main-logo-lockup.png", BASE).toString();

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
            flexDirection: "column",
            justifyContent: "center",
            border: "1px solid rgba(194, 84, 126, 0.25)",
            background: "rgba(255, 255, 255, 0.72)",
            borderRadius: 38,
            padding: "48px 58px",
            boxShadow: "0 32px 90px rgba(125, 50, 88, 0.16)",
          }}
        >
          <div
            style={{
              fontSize: title.length > 54 ? 48 : 58,
              lineHeight: 1.08,
              color: "#241326",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 22,
              fontFamily: "system-ui",
              fontSize: 28,
              lineHeight: 1.45,
              color: "#63465c",
              maxWidth: 900,
            }}
          >
            {description}
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

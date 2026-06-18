import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";
import { MESSAGE_TYPES } from "@/lib/wish";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase.from("cards").select("payload").eq("id", id).single();

  const wish = data?.payload;
  const typeMeta = wish
    ? (MESSAGE_TYPES.find((m) => m.id === wish.type) ?? MESSAGE_TYPES[0])
    : MESSAGE_TYPES[0];

  const preview = wish?.message
    ? wish.message.length > 140
      ? wish.message.slice(0, 140) + "…"
      : wish.message
    : "";

  // Load Instrument Serif for brand feel
  const fontRes = await fetch(
    "https://fonts.gstatic.com/s/instrumentserif/v1/Qw3MZRtWGQv3moy7mgnMPnCqsVBFDwNB.woff"
  ).catch(() => null);
  const fontData = fontRes ? await fontRes.arrayBuffer() : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fce8f0 0%, #f5d0e8 40%, #ede0f8 100%)",
          fontFamily: fontData ? "Instrument Serif" : "Georgia, serif",
          padding: "64px 80px",
          position: "relative",
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "oklch(0.88 0.12 30 / 0.45)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -80,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "oklch(0.85 0.14 350 / 0.4)",
            filter: "blur(60px)",
          }}
        />

        {/* Card box */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "rgba(255,255,255,0.75)",
            borderRadius: 40,
            padding: "48px 64px",
            maxWidth: 900,
            width: "100%",
            boxShadow: "0 32px 80px rgba(180,60,120,0.18)",
            border: "1px solid rgba(220,160,190,0.4)",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Emoji */}
          <div style={{ fontSize: 96, lineHeight: 1 }}>{typeMeta.emoji}</div>

          {/* Occasion label */}
          <div
            style={{
              marginTop: 12,
              fontSize: 14,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#b05080",
              fontFamily: "system-ui",
              fontWeight: 600,
            }}
          >
            {typeMeta.label}
          </div>

          {/* To */}
          {wish?.to && (
            <div
              style={{
                marginTop: 20,
                fontSize: 52,
                color: "#1a1020",
                lineHeight: 1.1,
                textAlign: "center",
              }}
            >
              Dear <span style={{ fontStyle: "italic", color: "#c0406a" }}>{wish.to}</span>,
            </div>
          )}

          {/* Message preview */}
          {preview && (
            <div
              style={{
                marginTop: 16,
                fontSize: 28,
                color: "#3a2030",
                lineHeight: 1.5,
                textAlign: "center",
                maxWidth: 700,
                fontStyle: "italic",
              }}
            >
              {preview}
            </div>
          )}

          {/* From */}
          {wish?.from && (
            <div
              style={{
                marginTop: 20,
                fontSize: 22,
                color: "#7a4060",
                fontStyle: "italic",
              }}
            >
              — with love, {wish.from}
            </div>
          )}
        </div>

        {/* Branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 28,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(120deg, #e0507a, #e88050, #d4a060)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: "white",
            }}
          >
            ✦
          </div>
          <span style={{ fontSize: 24, color: "#5a2040", letterSpacing: "-0.01em" }}>
            Kehdoo
          </span>
          <span style={{ fontSize: 16, color: "#9a6080", fontStyle: "italic" }}>
            · Jo dil mein hai, Kehdoo.
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: "Instrument Serif", data: fontData, style: "normal" }]
        : [],
    }
  );
}

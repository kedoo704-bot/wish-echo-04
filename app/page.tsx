import type { Metadata } from "next";
import WishCreator from "@/components/WishCreator";
import StructuredData from "@/components/StructuredData";
import { organizationLd, webAppLd } from "@/lib/seo";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://kehdoo.com";

export const metadata: Metadata = {
  title: "Kehdoo - Jo dil mein hai, Kehdoo",
  description:
    "Turn a few words into a gorgeous animated greeting page. Share via WhatsApp, social, or QR. No sign-up required.",
  alternates: { canonical: `${BASE}/` },
  openGraph: {
    title: "Kehdoo - Jo dil mein hai, Kehdoo",
    description: "Turn a few words into a gorgeous, animated greeting you can share instantly.",
    type: "website",
    siteName: "Kehdoo",
    url: `${BASE}/`,
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kehdoo - Jo dil mein hai, Kehdoo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kehdoo - Jo dil mein hai, Kehdoo",
    description: "Turn a few words into a gorgeous, animated greeting you can share instantly.",
    images: ["/brand/og-image.png"],
  },
};

export default function HomePage() {
  return (
    <>
      <StructuredData data={webAppLd} />
      <StructuredData data={organizationLd} />
      <WishCreator />
    </>
  );
}

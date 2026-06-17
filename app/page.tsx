import type { Metadata } from "next";
import WishCreator from "@/components/WishCreator";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://kehdoo.com";

export const metadata: Metadata = {
  title: "Kehdoo — Jo dil mein hai, Kehdoo",
  description:
    "Turn a few words into a gorgeous animated greeting page. Share via WhatsApp, social or QR. No login, no backend — just a link.",
  alternates: { canonical: `${BASE}/` },
  openGraph: {
    title: "Kehdoo — Jo dil mein hai, Kehdoo",
    description: "Turn a few words into a gorgeous, animated greeting you can share instantly.",
    type: "website",
    siteName: "Kehdoo",
    url: `${BASE}/`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Kehdoo — Jo dil mein hai, Kehdoo",
    description: "Turn a few words into a gorgeous, animated greeting you can share instantly.",
  },
};

export default function HomePage() {
  return <WishCreator />;
}

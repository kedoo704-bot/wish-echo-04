import type { Metadata } from "next";
import WishCreator from "@/components/WishCreator";
import StructuredData from "@/components/StructuredData";
import { organizationLd, webAppLd } from "@/lib/seo";
import { siteConfig, absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Kehdoo - Jo dil mein hai, Kehdoo",
  description: siteConfig.description,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: "Kehdoo - Jo dil mein hai, Kehdoo",
    description: "Turn a few words into a gorgeous, animated greeting you can share instantly.",
    type: "website",
    siteName: siteConfig.name,
    url: absoluteUrl("/"),
    images: [
      {
        url: siteConfig.ogImage,
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
    images: [siteConfig.ogImage],
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

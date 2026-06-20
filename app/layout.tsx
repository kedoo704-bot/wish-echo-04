import type { Metadata, Viewport } from "next";
import AppMotion from "@/components/AppMotion";
import PwaRegister from "@/components/PwaRegister";
import "./globals.css";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://kehdoo.com";

export const metadata: Metadata = {
  applicationName: "Kehdoo",
  title: "Kehdoo — Jo dil mein hai, Kehdoo",
  description:
    "Turn a few words into a gorgeous animated greeting page. Share via WhatsApp, social or QR.",
  metadataBase: new URL(BASE),
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Kehdoo",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Kehdoo — Jo dil mein hai, Kehdoo",
    description: "Turn a few words into a gorgeous, animated greeting you can share instantly.",
    type: "website",
    siteName: "Kehdoo",
    url: BASE,
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
    title: "Kehdoo — Jo dil mein hai, Kehdoo",
    description: "Turn a few words into a gorgeous, animated greeting you can share instantly.",
    images: ["/brand/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#f8e8ee",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain">
        <PwaRegister />
        <AppMotion>{children}</AppMotion>
      </body>
    </html>
  );
}

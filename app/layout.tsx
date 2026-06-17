import type { Metadata } from "next";
import "./globals.css";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://kehdoo.com";

export const metadata: Metadata = {
  title: "Kehdoo — Jo dil mein hai, Kehdoo",
  description:
    "Turn a few words into a gorgeous animated greeting page. Share via WhatsApp, social or QR. No login, no backend — just a link.",
  metadataBase: new URL(BASE),
  openGraph: {
    title: "Kehdoo — Jo dil mein hai, Kehdoo",
    description: "Turn a few words into a gorgeous, animated greeting you can share instantly.",
    type: "website",
    siteName: "Kehdoo",
    url: BASE,
  },
  twitter: {
    card: "summary_large_image",
    title: "Kehdoo — Jo dil mein hai, Kehdoo",
    description: "Turn a few words into a gorgeous, animated greeting you can share instantly.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#f8e8ee" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain">{children}</body>
    </html>
  );
}

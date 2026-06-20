import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MESSAGE_TYPES } from "@/lib/wish";
import CardDisplay from "@/components/CardDisplay";
import { getCardById } from "@/lib/get-card";
import { getShareDescription, getShareImage, getShareTitle } from "@/lib/share";

type Props = { params: Promise<{ id: string }> };

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://kehdoo.com";

// Card content is immutable; serve from the ISR cache and refresh hourly.
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const card = await getCardById(id);
  if (!card) return { title: "Wish not found - Kehdoo", robots: { index: false } };

  const type = MESSAGE_TYPES.find((item) => item.id === card.payload.type) ?? MESSAGE_TYPES[0];
  const title = getShareTitle(card.payload);
  const description = getShareDescription(card.payload);
  const url = `${BASE}/c/${id}`;
  const image = getShareImage();

  return {
    title,
    description,
    // Personal greetings are not search content. Keep names out of the index.
    robots: { index: false, follow: true },
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Kehdoo",
      url,
      images: [{ url: image, width: 1200, height: 630, alt: `${type.label} wish by Kehdoo` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function CardPage({ params }: Props) {
  const { id } = await params;
  const card = await getCardById(id);
  if (!card) notFound();

  return <CardDisplay card={card} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CreatorCardDisplay } from "@/components/CreatorCardDisplay";
import { getCardById } from "@/lib/get-card";
import { absoluteUrl } from "@/lib/site-config";

type Props = { params: Promise<{ id: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const card = await getCardById(id);

  return {
    title: card ? "Share your Kehdoo card" : "Card not found - Kehdoo",
    description: "Copy, share, or download your Kehdoo greeting.",
    robots: { index: false, follow: false },
  };
}

export default async function CreatorSharePage({ params }: Props) {
  const { id } = await params;
  const card = await getCardById(id);
  if (!card) notFound();

  return <CreatorCardDisplay card={card} recipientUrl={absoluteUrl(`/c/${id}`)} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MESSAGE_TYPES } from "@/lib/wish";
import CardDisplay from "@/components/CardDisplay";
import type { CardRow } from "@/lib/cards";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("cards").select("payload").eq("id", id).single();
  if (!data) return { title: "Wish not found · Kehdoo" };

  const type = MESSAGE_TYPES.find((m) => m.id === data.payload.type) ?? MESSAGE_TYPES[0];
  const to = data.payload.to ? ` for ${data.payload.to}` : "";

  return {
    title: `${type.emoji} A ${type.label} wish${to} · Kehdoo`,
    description: "Someone sent you a beautiful greeting on Kehdoo.",
    openGraph: {
      title: `${type.emoji} A ${type.label} wish${to} · Kehdoo`,
      description: "Someone sent you a beautiful greeting.",
    },
  };
}

export default async function CardPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  return <CardDisplay card={data as CardRow} />;
}

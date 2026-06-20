"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MESSAGE_TYPES } from "@/lib/wish";
import { WishBackground } from "@/components/WishBackground";
import { GreetingCard } from "@/components/GreetingCard";
import { ShareActions } from "@/components/ShareActions";
import { BrandLogo } from "@/components/BrandLogo";
import { getPhotoUrl, type CardRow } from "@/lib/cards";

export function CreatorCardDisplay({ card, recipientUrl }: { card: CardRow; recipientUrl: string }) {
  const wish = card.payload;
  const typeMeta = MESSAGE_TYPES.find((m) => m.id === wish.type) ?? MESSAGE_TYPES[0];
  const photoUrl = card.photo_path ? getPhotoUrl(card.photo_path) : null;
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const revealTimer = setTimeout(() => setRevealed(true), 220);
    return () => clearTimeout(revealTimer);
  }, []);

  return (
    <main className="relative min-h-[100dvh] pb-40">
      <WishBackground bg={wish.bg} />

      <div className="safe-top pointer-events-none absolute inset-x-0 top-0 z-50 px-5 pt-4">
        <Link
          href="/"
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3.5 py-2 text-sm font-medium backdrop-blur-md transition active:scale-95 hover:bg-background/95"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <span aria-hidden="true">←</span>
          <BrandLogo className="h-7 w-auto max-w-[110px] object-contain" />
        </Link>
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-5 pt-20 md:px-8">
        <GreetingCard
          emoji={typeMeta.emoji}
          label={typeMeta.label}
          to={wish.to}
          from={wish.from}
          message={wish.message}
          photoSrc={photoUrl}
          revealed={revealed}
        />
      </div>

      <ShareActions
        wish={wish}
        emoji={typeMeta.emoji}
        label={typeMeta.label}
        photo={photoUrl}
        revealed={revealed}
        shareUrl={recipientUrl}
        note="Your share link is ready"
      />
    </main>
  );
}

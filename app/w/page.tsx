import type { Metadata } from "next";
import { Suspense } from "react";
import WishDisplay from "@/components/WishDisplay";

export const metadata: Metadata = {
  title: "A wish for you ✦ Kehdoo",
  description: "Someone sent you a beautiful greeting on Kehdoo.",
  openGraph: {
    title: "A wish for you ✦ Kehdoo",
    description: "Someone sent you a beautiful greeting.",
  },
};

export default function WishPage() {
  return (
    <Suspense fallback={null}>
      <WishDisplay />
    </Suspense>
  );
}

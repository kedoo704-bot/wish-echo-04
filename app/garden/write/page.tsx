import type { Metadata } from "next";
import Link from "next/link";
import { GardenWriteForm } from "@/components/garden/GardenWriteForm";
import { GardenChrome } from "@/components/garden/GardenChrome";

export const metadata: Metadata = {
  title: "Write a Letter",
  robots: { index: false, follow: false },
};

// Anonymous, like the rest of the Garden — no sign-in required to post.
export default function GardenWritePage() {
  return (
    <GardenChrome>
      <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <Link
          href="/garden"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <span>←</span> <span className="font-serif text-base">The Garden</span>
        </Link>

        <div className="mt-10 text-center">
          <h1 className="font-serif text-4xl leading-tight md:text-5xl">
            Plant a <span className="italic shimmer-text">letter</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Write something heartfelt. You'll get a shareable link, decorated with its own bouquet.
          </p>
        </div>

        <GardenWriteForm />
      </main>
    </GardenChrome>
  );
}

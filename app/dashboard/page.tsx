import { redirect } from "next/navigation";
import Link from "next/link";
import { createOptionalClient } from "@/lib/supabase/server";
import { MESSAGE_TYPES } from "@/lib/wish";
import type { CardRow } from "@/lib/cards";
import { BrandLogo } from "@/components/BrandLogo";

export const metadata = { title: "My Cards · Kehdoo" };

export default async function DashboardPage() {
  const supabase = await createOptionalClient();
  if (!supabase) redirect("/");
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/?signin=1");

  const { data: cards } = await supabase
    .from("cards")
    .select("*")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen px-5 py-10 md:px-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span
              className="hidden"
              style={{ background: "var(--gradient-accent)" }}
            >
              ✦
            </span>
            <div className="leading-tight">
              <BrandLogo className="h-12 w-auto max-w-[170px] object-contain" priority />
            </div>
          </Link>
          <Link
            href="/"
            className="rounded-full bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 transition-opacity"
          >
            + New card
          </Link>
        </div>

        {/* Title */}
        <div className="mt-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Your cards
          </p>
          <h1 className="mt-1 font-serif text-4xl">
            {user.user_metadata?.full_name
              ? `${user.user_metadata.full_name}'s wishes`
              : "My wishes"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {cards?.length ?? 0} card{cards?.length !== 1 ? "s" : ""} created
          </p>
        </div>

        {/* Cards grid */}
        {!cards?.length ? (
          <div className="mt-16 rounded-[2rem] border border-border/60 bg-card/60 p-12 text-center">
            <div className="text-5xl">💌</div>
            <p className="mt-4 font-serif text-2xl">No cards yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first wish and it will appear here.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90"
            >
              Create a wish →
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(cards as CardRow[]).map((card) => {
              const typeMeta = MESSAGE_TYPES.find((m) => m.id === card.payload.type) ?? MESSAGE_TYPES[0];
              const date = new Date(card.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <Link
                  key={card.id}
                  href={`/share/${card.id}`}
                  className="group rounded-[1.75rem] border border-border/60 bg-card/70 p-5 backdrop-blur transition hover:-translate-y-1 hover:border-primary/40"
                  style={{ boxShadow: "var(--shadow-soft)" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="text-3xl">{typeMeta.emoji}</div>
                    <span className="rounded-full border border-border/60 px-2.5 py-0.5 text-[10px] text-muted-foreground">
                      {card.view_count} view{card.view_count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {typeMeta.label}
                    </p>
                    {card.payload.to && (
                      <p className="mt-1 font-serif text-xl">To {card.payload.to}</p>
                    )}
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {card.payload.message}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-[11px] text-muted-foreground">{date}</p>
                    <span className="text-xs text-primary opacity-0 transition group-hover:opacity-100">
                      Manage →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

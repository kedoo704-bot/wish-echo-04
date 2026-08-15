"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Flower2, Info, LayoutGrid, LogOut, MoreVertical, Shield } from "lucide-react";
import { createOptionalClient } from "@/lib/supabase/client";

type AuthUser = {
  email?: string;
  user_metadata?: { avatar_url?: string; full_name?: string };
} | null;

type Props = {
  user?: AuthUser;
};

const itemClass =
  "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-foreground transition hover:bg-muted active:scale-[0.98]";

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default function OverflowMenu({ user = null }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const supabaseEnabled =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const signIn = async () => {
    const supabase = createOptionalClient();
    if (!supabase) return;
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const signOut = async () => {
    const supabase = createOptionalClient();
    if (!supabase) return;
    setLoading(true);
    await supabase.auth.signOut();
    setOpen(false);
    router.refresh();
  };

  const name = user?.user_metadata?.full_name ?? user?.email ?? "";
  const avatar = user?.user_metadata?.avatar_url;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Menu"
        aria-haspopup="menu"
        aria-expanded={open}
        className="grid h-10 w-10 place-items-center rounded-full text-foreground/70 transition hover:bg-muted hover:text-foreground active:scale-95"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      {open && (
        <div
          role="menu"
          className="animate-pop absolute right-2.5 top-12 z-50 w-64 origin-top-right rounded-2xl border border-border/70 bg-popover p-2 text-popover-foreground"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          {user && (
            <>
              <div className="flex items-center gap-3 px-3 py-2.5">
                {avatar ? (
                  <img src={avatar} alt="" className="h-9 w-9 rounded-full ring-2 ring-border" />
                ) : (
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-muted text-xs font-semibold text-foreground/70">
                    {name.slice(0, 2).toUpperCase() || "?"}
                  </span>
                )}
                <span className="min-w-0 truncate text-sm font-medium text-foreground">{name}</span>
              </div>
              <Link href="/dashboard" role="menuitem" onClick={() => setOpen(false)} className={itemClass}>
                <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                My cards
              </Link>
              <div className="my-1 h-px bg-border/60" />
            </>
          )}

          {!user && supabaseEnabled && (
            <>
              <button type="button" role="menuitem" onClick={signIn} disabled={loading} className={`${itemClass} disabled:opacity-60`}>
                <GoogleIcon />
                Sign in with Google
              </button>
              <div className="my-1 h-px bg-border/60" />
            </>
          )}

          <Link href="/garden" role="menuitem" onClick={() => setOpen(false)} className={itemClass}>
            <Flower2 className="h-4 w-4 text-muted-foreground" />
            Garden
          </Link>
          <Link href="/about" role="menuitem" onClick={() => setOpen(false)} className={itemClass}>
            <Info className="h-4 w-4 text-muted-foreground" />
            About
          </Link>
          <Link href="/privacy" role="menuitem" onClick={() => setOpen(false)} className={itemClass}>
            <Shield className="h-4 w-4 text-muted-foreground" />
            Privacy
          </Link>
          <Link href="/terms" role="menuitem" onClick={() => setOpen(false)} className={itemClass}>
            <FileText className="h-4 w-4 text-muted-foreground" />
            Terms
          </Link>

          {user && (
            <>
              <div className="my-1 h-px bg-border/60" />
              <button type="button" role="menuitem" onClick={signOut} disabled={loading} className={`${itemClass} disabled:opacity-60`}>
                <LogOut className="h-4 w-4 text-muted-foreground" />
                Sign out
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

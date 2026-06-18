"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  user: { email?: string; user_metadata?: { avatar_url?: string; full_name?: string } } | null;
  compact?: boolean;
};

export default function AuthButton({ user, compact = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  if (user) {
    if (compact) {
      const avatar = user.user_metadata?.avatar_url;
      const initials = (user.user_metadata?.full_name ?? user.email ?? "?")
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
      return (
        <a
          href="/dashboard"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-border transition active:scale-95"
          title="My cards"
        >
          {avatar ? (
            <img src={avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs font-semibold text-foreground/70">{initials}</span>
          )}
        </a>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <a
          href="/dashboard"
          className="hidden text-sm text-muted-foreground hover:text-foreground transition-colors md:block"
        >
          My cards
        </a>
        {user.user_metadata?.avatar_url && (
          <img
            src={user.user_metadata.avatar_url}
            alt=""
            className="h-8 w-8 rounded-full ring-2 ring-border"
          />
        )}
        <button
          onClick={signOut}
          disabled={loading}
          className="rounded-full border border-border px-3.5 py-1.5 text-xs text-muted-foreground transition hover:text-foreground disabled:opacity-50"
        >
          Sign out
        </button>
      </div>
    );
  }

  if (compact) {
    return (
      <button
        onClick={signIn}
        disabled={loading}
        aria-label="Sign in with Google"
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border bg-card/80 backdrop-blur transition active:scale-95 disabled:opacity-60"
      >
        {loading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground" />
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={signIn}
      disabled={loading}
      className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm backdrop-blur transition hover:bg-card disabled:opacity-60"
    >
      {loading ? (
        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-border border-t-foreground" />
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      )}
      <span>Sign in</span>
    </button>
  );
}

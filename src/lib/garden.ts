export type GardenLetterRow = {
  id: string;
  message: string;
  to_label: string | null;
  from_label: string | null;
  flower_seed: number;
  created_by: string;
  reported_count: number;
  hidden: boolean;
  created_at: string;
};

/**
 * Create a letter via the secure server route — mirrors src/lib/cards.ts's
 * saveCard. The client never inserts rows directly; the server validates,
 * checks auth + profanity, and persists via the Supabase service role.
 */
export async function saveGardenLetter(input: { message: string; to?: string; from?: string }): Promise<string> {
  const res = await fetch("/api/garden", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? `Could not post that letter (${res.status}).`);
  }

  const data = (await res.json()) as { id: string };
  return data.id;
}

/** Best-effort report — flags a letter for manual review, doesn't hide it immediately. */
export async function reportGardenLetter(id: string): Promise<void> {
  try {
    await fetch(`/api/garden/${id}/report`, { method: "POST", keepalive: true });
  } catch {
    // Non-critical.
  }
}

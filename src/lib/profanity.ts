/**
 * Basic blocklist-based profanity filter for the Garden feature's public
 * letters. First line of defense only — combined with the report button
 * (see app/api/garden/[id]/report/route.ts) for anything the list misses.
 * No imports, safe in any runtime (used client-side for immediate feedback
 * and server-side as the authoritative check before anything is persisted).
 */

// Deliberately terse — common English profanity/slurs, not an exhaustive
// list. Matched as whole words (word-boundary), case-insensitive, with
// simple leetspeak substitutions normalized away first.
const BLOCKLIST = [
  "fuck", "shit", "bitch", "asshole", "bastard", "cunt", "dick", "piss",
  "slut", "whore", "faggot", "nigger", "nigga", "retard", "rape",
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[@4]/g, "a")
    .replace(/[3€]/g, "e")
    .replace(/[1!|]/g, "i")
    .replace(/[0]/g, "o")
    .replace(/[$5]/g, "s")
    .replace(/[7]/g, "t");
}

export function containsProfanity(text: string): boolean {
  const normalized = normalize(text);
  return BLOCKLIST.some((word) => new RegExp(`\\b${word}\\b`, "i").test(normalized));
}

export function containsProfanityIn(fields: Array<string | undefined | null>): boolean {
  return fields.some((f) => f && containsProfanity(f));
}

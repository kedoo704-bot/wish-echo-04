import { z } from "zod";
import { containsProfanityIn } from "@/lib/profanity";

/** Own limits — deliberately not shared with wish-schema.ts/limits.ts; a
 *  parallel stream with its own tuning, even where values happen to match. */
export const GARDEN_MESSAGE_MAX_LENGTH = 320;
export const GARDEN_LABEL_MAX_LENGTH = 40;

/**
 * Single source of truth for what a valid garden letter looks like. Used on
 * the client for UX and — critically — on the server before anything is
 * persisted, so a crafted request can never write oversized, malformed, or
 * (best-effort) profane data. flower_seed is never client-supplied — the
 * server assigns it at creation.
 */
export const gardenLetterSchema = z.object({
  message: z.string().trim().min(1).max(GARDEN_MESSAGE_MAX_LENGTH),
  to: z.string().trim().max(GARDEN_LABEL_MAX_LENGTH).optional(),
  from: z.string().trim().max(GARDEN_LABEL_MAX_LENGTH).optional(),
});

export type GardenLetterInput = z.infer<typeof gardenLetterSchema>;

export function validateGardenLetter(input: GardenLetterInput):
  | { ok: true }
  | { ok: false; reason: string } {
  if (containsProfanityIn([input.message, input.to, input.from])) {
    return { ok: false, reason: "That message can't be shared — please rephrase it." };
  }
  return { ok: true };
}

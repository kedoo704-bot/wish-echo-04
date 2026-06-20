import { z } from "zod";
import { BACKGROUNDS, MESSAGE_TYPES, THEMES } from "@/lib/wish";
import { MAX_MESSAGE_LENGTH, MAX_NAME_LENGTH } from "@/lib/limits";

export { MAX_NAME_LENGTH, MAX_MESSAGE_LENGTH, MAX_PHOTO_BYTES } from "@/lib/limits";

const TYPE_IDS = MESSAGE_TYPES.map((t) => t.id) as [string, ...string[]];
const BG_IDS = BACKGROUNDS.map((b) => b.id) as [string, ...string[]];
const THEME_IDS = THEMES as readonly string[];

/**
 * Single source of truth for what a valid wish looks like. Used on the client
 * for UX and — critically — on the server before anything is persisted, so a
 * crafted request can never write oversized or malformed data.
 */
export const wishSchema = z.object({
  type: z.enum(TYPE_IDS),
  to: z.string().trim().max(MAX_NAME_LENGTH).default(""),
  from: z.string().trim().max(MAX_NAME_LENGTH).default(""),
  message: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH),
  theme: z
    .string()
    .max(40)
    .refine((v) => THEME_IDS.includes(v), { message: "Unknown theme" })
    .default("Elegant"),
  bg: z.enum(BG_IDS),
});

export type WishInput = z.infer<typeof wishSchema>;

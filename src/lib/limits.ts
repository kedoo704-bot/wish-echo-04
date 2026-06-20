/** Shared input limits — the single source of truth for client UX and server
 *  validation. No imports here so it's safe in any runtime. */
export const MAX_NAME_LENGTH = 40;
export const MAX_MESSAGE_LENGTH = 600;
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

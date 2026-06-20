import { MESSAGE_TYPES, type WishPayload } from "@/lib/wish";

function clean(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function getWishType(payload: Pick<WishPayload, "type">) {
  return MESSAGE_TYPES.find((item) => item.id === payload.type) ?? MESSAGE_TYPES[0];
}

export function getRecipientName(payload: Pick<WishPayload, "to">): string {
  return payload.to ? clean(payload.to) : "You";
}

export function getShareTitle(payload: WishPayload): string {
  const type = getWishType(payload).label;
  return `A ${type} wish for ${getRecipientName(payload)} - kehdoo`;
}

export function getShareDescription(payload: WishPayload): string {
  return payload.from
    ? `${clean(payload.from)} sent you a mesmerising greeting`
    : "Someone sent you a mesmerising greeting";
}

export function getShareText(url: string): string {
  return `You've got a kehdoo: ${url}`;
}

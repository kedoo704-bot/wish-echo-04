/**
 * Safely serializes an object for a <script type="application/ld+json"> tag.
 * JSON.stringify does not escape `</`, which allows HTML injection when the
 * serialized data ever includes content that isn't 100% hardcoded (markdown,
 * CMS, user input). Cheap to always use, even where current callers are
 * app-controlled — it's the safe default that survives the next edit.
 */
export function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/<\//g, "<\\/");
}

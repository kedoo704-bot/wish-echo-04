/**
 * Renders JSON-LD structured data. Server component — emitted into the HTML so
 * search engines and answer/generative engines (AEO/GEO) can parse and cite it.
 */
export default function StructuredData({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Content is app-controlled (no user input), so this is safe.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

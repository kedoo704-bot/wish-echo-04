import Script from "next/script";

/**
 * GTM as a marketing-managed pixel loader, separate from PostHog (product
 * analytics). Keep the boundary clean: PostHog owns product events
 * (wish_created, card_share_clicked, ...), GTM is purely for pixels the
 * marketing team wants to add/change without a code deploy — don't duplicate
 * the same event into both.
 *
 * Reads the container ID from env rather than hardcoding it, so this file is
 * safe to reuse across environments/projects without editing source. Renders
 * nothing (no network request at all) until NEXT_PUBLIC_GTM_ID is set.
 */
export function GoogleTagManager() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  if (!gtmId) return null;

  return (
    <>
      {/* noscript fallback — kept immediately after <body> opens */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
      {/* strategy="afterInteractive": loads after the page is interactive,
          not blocking initial render/LCP. */}
      <Script
        id="gtm"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
        }}
      />
    </>
  );
}

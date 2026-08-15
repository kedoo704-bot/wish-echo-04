import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StructuredData from "@/components/StructuredData";
import { OccasionLandingPage } from "@/components/OccasionLandingPage";
import { getAllOccasionSlugs, getOccasionBySlug, getOccasionFaqs } from "@/lib/occasion-content";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllOccasionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const occasion = getOccasionBySlug(slug);
  if (!occasion) return { title: "Not Found" };

  const url = absoluteUrl(`/wishes/${slug}`);

  return {
    title: occasion.metaTitle,
    description: occasion.metaDescription,
    keywords: occasion.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: occasion.metaTitle,
      description: occasion.metaDescription,
      type: "website",
      siteName: siteConfig.name,
      url,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: occasion.metaTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: occasion.metaTitle,
      description: occasion.metaDescription,
      images: [siteConfig.ogImage],
    },
  };
}

export default async function OccasionPage({ params }: Props) {
  const { slug } = await params;
  const occasion = getOccasionBySlug(slug);
  if (!occasion) notFound();

  const url = absoluteUrl(`/wishes/${slug}`);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Wishes", item: absoluteUrl("/wishes") },
      { "@type": "ListItem", position: 3, name: occasion.label, item: url },
    ],
  };

  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: occasion.metaTitle,
    description: occasion.metaDescription,
    url,
    isPartOf: { "@type": "WebPage", "@id": absoluteUrl("/wishes") },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: getOccasionFaqs(occasion).map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <StructuredData data={breadcrumbLd} />
      <StructuredData data={pageLd} />
      <StructuredData data={faqLd} />
      <OccasionLandingPage occasion={occasion} />
    </>
  );
}

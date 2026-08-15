import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StructuredData from "@/components/StructuredData";
import { GardenLandingPage } from "@/components/GardenLandingPage";
import {
  getAllGardenLandingSlugs,
  getGardenLandingBySlug,
  getGardenLandingFaqs,
} from "@/lib/garden-landing-content";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllGardenLandingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = getGardenLandingBySlug(slug);
  if (!content) return { title: "Not Found" };

  const url = absoluteUrl(`/garden/write/${slug}`);

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords: content.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      type: "website",
      siteName: siteConfig.name,
      url,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: content.metaTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: content.metaTitle,
      description: content.metaDescription,
      images: [siteConfig.ogImage],
    },
  };
}

export default async function GardenLandingRoute({ params }: Props) {
  const { slug } = await params;
  const content = getGardenLandingBySlug(slug);
  if (!content) notFound();

  const url = absoluteUrl(`/garden/write/${slug}`);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Garden", item: absoluteUrl("/garden") },
      { "@type": "ListItem", position: 3, name: content.label, item: url },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: getGardenLandingFaqs(content).map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <StructuredData data={breadcrumbLd} />
      <StructuredData data={faqLd} />
      <GardenLandingPage content={content} />
    </>
  );
}

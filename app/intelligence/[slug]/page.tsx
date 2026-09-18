import type { Metadata } from "next";

import IntelligenceReportClient from "./IntelligenceReportClient";
import {
  parseIntelligenceArticleUrl,
} from "@/lib/services/intelligenceIdentity";

type IntelligencePageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    u?: string | string[];
  }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: IntelligencePageProps): Promise<Metadata> {
  const { slug } = await params;
  const query = await searchParams;
  const parsed = parseIntelligenceArticleUrl(query.u);

  if (!parsed.ok) {
    return {
      title: "Story unavailable",
      robots: { index: false, follow: false },
    };
  }

  const search = new URLSearchParams({ u: parsed.articleUrl });
  const canonicalPath = `/intelligence/${slug}?${search.toString()}`;

  return {
    title: "60-second brief",
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function IntelligenceReportPage({
  params,
  searchParams,
}: IntelligencePageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const parsed = parseIntelligenceArticleUrl(query.u);

  return (
    <IntelligenceReportClient
      slug={slug}
      articleUrl={parsed.ok ? parsed.articleUrl : null}
      parseError={parsed.ok ? null : parsed.reason}
    />
  );
}

import type { Article } from "@/app/types/article";

import {
  gatherStorySources,
  type RankedArticle,
} from "./multiSource";

const MAX_EVIDENCE_SOURCES = 6;
const MAX_DESCRIPTION_LENGTH = 1_200;
const MAX_PRIMARY_CONTENT_LENGTH = 8_000;

export type EvidenceSource = {
  index: number;
  title: string;
  description: string;
  url: string;
  sourceName: string;
  publishedAt: string;
  isPrimary: boolean;
  isRated: boolean;
  reliability: number | null;
  factualReporting: number | null;
};

export type EvidenceContext = {
  primaryArticle: {
    title: string;
    description: string;
    content: string;
    url: string;
    sourceName: string;
    publishedAt: string;
  };

  sources: EvidenceSource[];

  sourceCount: number;
  independentSourceCount: number;
  ratedSourceCount: number;

  promptContext: string;
};

type BuildEvidenceContextOptions = {
  primaryContent?: string;
};

function cleanText(
  value: string | null | undefined
): string {
  return (value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateText(
  value: string,
  maxLength: number
): string {
  const cleaned = cleanText(value);

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return `${cleaned.slice(0, maxLength).trim()}…`;
}

function getSourceName(
  article: Article
): string {
  return cleanText(article.source?.name) || "Unknown source";
}

function getPublishedAt(
  article: Article
): string {
  return cleanText(article.publishedAt);
}

function createEvidenceSource(
  rankedSource: RankedArticle,
  index: number
): EvidenceSource {
  const {
    article,
    sourceRating,
    isPrimary,
  } = rankedSource;

  return {
    index: index + 1,

    title: cleanText(article.title),

    description: truncateText(
      article.description ?? "",
      MAX_DESCRIPTION_LENGTH
    ),

    url: cleanText(article.url),

    sourceName: getSourceName(article),

    publishedAt: getPublishedAt(article),

    isPrimary,

    isRated: sourceRating.isRated,

    reliability: sourceRating.isRated
      ? sourceRating.reliability
      : null,

    factualReporting: sourceRating.isRated
      ? sourceRating.factualReporting
      : null,
  };
}

function countIndependentSources(
  sources: EvidenceSource[]
): number {
  const publishers = new Set(
    sources
      .map((source) =>
        source.sourceName
          .toLowerCase()
          .trim()
      )
      .filter(Boolean)
  );

  return publishers.size;
}

function buildPromptContext(
  primaryArticle: Article,
  sources: EvidenceSource[],
  primaryContent: string
): string {
  const sections: string[] = [];

  sections.push(
    [
      "PRIMARY ARTICLE",
      `Title: ${cleanText(primaryArticle.title)}`,
      `Publisher: ${getSourceName(primaryArticle)}`,
      `Published: ${
        getPublishedAt(primaryArticle) || "Unknown"
      }`,
      `URL: ${cleanText(primaryArticle.url)}`,
      `Description: ${
        truncateText(
          primaryArticle.description ?? "",
          MAX_DESCRIPTION_LENGTH
        ) || "Not available"
      }`,
    ].join("\n")
  );

  const normalizedContent = truncateText(
    primaryContent,
    MAX_PRIMARY_CONTENT_LENGTH
  );

  if (normalizedContent) {
    sections.push(
      [
        "PRIMARY ARTICLE CONTENT",
        normalizedContent,
      ].join("\n")
    );
  }

  if (sources.length > 0) {
    const sourceSections = sources.map(
      (source) => {
        const rating =
          source.isRated &&
          source.reliability !== null &&
          source.factualReporting !== null
            ? `Reliability: ${source.reliability}/100 | Factual reporting: ${source.factualReporting}/100`
            : "Reliability: Not independently rated";

        return [
          `SOURCE ${source.index}${
            source.isPrimary
              ? " — PRIMARY"
              : ""
          }`,
          `Publisher: ${source.sourceName}`,
          `Title: ${source.title}`,
          `Published: ${
            source.publishedAt ||
            "Unknown"
          }`,
          `Description: ${
            source.description ||
            "Not available"
          }`,
          rating,
          `URL: ${source.url}`,
        ].join("\n");
      }
    );

    sections.push(
      [
        "RELATED SOURCE EVIDENCE",
        ...sourceSections,
      ].join("\n\n")
    );
  }

  sections.push(
    [
      "EVIDENCE RULES",
      "- Treat the primary article as one source, not as established truth.",
      "- Distinguish facts supported by multiple sources from claims reported by only one source.",
      "- Do not invent agreement, disagreement, quotations, events, statistics, or source positions.",
      "- When evidence is incomplete, uncertain, or conflicting, state that clearly.",
      "- Source reliability metadata is a supporting signal, not proof that an individual claim is true.",
      "- Base conclusions only on the evidence provided in this context.",
    ].join("\n")
  );

  return sections.join("\n\n---\n\n");
}

export async function buildEvidenceContext(
  primaryArticle: Article,
  options: BuildEvidenceContextOptions = {}
): Promise<EvidenceContext> {
  const rankedSources =
    await gatherStorySources(primaryArticle);

  const selectedSources = rankedSources
    .slice(0, MAX_EVIDENCE_SOURCES)
    .map(createEvidenceSource);

  const sourceCount =
    selectedSources.length;

  const independentSourceCount =
    countIndependentSources(
      selectedSources
    );

  const ratedSourceCount =
    selectedSources.filter(
      (source) => source.isRated
    ).length;

  const primaryContent =
    options.primaryContent ?? "";

  return {
    primaryArticle: {
      title: cleanText(
        primaryArticle.title
      ),

      description: cleanText(
        primaryArticle.description
      ),

      content: truncateText(
        primaryContent,
        MAX_PRIMARY_CONTENT_LENGTH
      ),

      url: cleanText(
        primaryArticle.url
      ),

      sourceName:
        getSourceName(primaryArticle),

      publishedAt:
        getPublishedAt(primaryArticle),
    },

    sources: selectedSources,

    sourceCount,
    independentSourceCount,
    ratedSourceCount,

    promptContext:
      buildPromptContext(
        primaryArticle,
        selectedSources,
        primaryContent
      ),
  };
}
import type { Article } from "@/app/types/article";

import {
  gatherStorySources,
  type RankedArticle,
} from "./multiSource";

import {
  calculateSourceConsensus,
  type SourceConsensus,
} from "./sourceConsensus";

const MAX_EVIDENCE_SOURCES = 6;
const MAX_DESCRIPTION_LENGTH = 1_200;
const MAX_PRIMARY_CONTENT_LENGTH = 8_000;

export type EvidenceSource = {
  sourceId: string;
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

  sourceConsensus: SourceConsensus;

  promptContext: string;
};

type BuildEvidenceContextOptions = {
  primaryContent?: string;
  rankedSources?: RankedArticle[];
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

  return `${cleaned
    .slice(0, maxLength)
    .trim()}…`;
}

function getSourceName(
  article: Article
): string {
  return (
    cleanText(article.source?.name) ||
    "Unknown source"
  );
}

function getPublishedAt(
  article: Article
): string {
  return cleanText(
    article.publishedAt
  );
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
    sourceId: `S${index + 1}`,
    index: index + 1,

    title:
      cleanText(article.title),

    description:
      truncateText(
        article.description ?? "",
        MAX_DESCRIPTION_LENGTH
      ),

    url:
      cleanText(article.url),

    sourceName:
      getSourceName(article),

    publishedAt:
      getPublishedAt(article),

    isPrimary,

    isRated:
      sourceRating.isRated,

    reliability:
      sourceRating.isRated
        ? sourceRating.reliability
        : null,

    factualReporting:
      sourceRating.isRated
        ? sourceRating.factualReporting
        : null,
  };
}

function countIndependentSources(
  sources: EvidenceSource[]
): number {
  const publishers =
    new Set(
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

function formatScore(
  value: number | null
): string {
  return value === null
    ? "Unavailable"
    : `${value}/100`;
}

function buildPromptContext(
  primaryArticle: Article,
  sources: EvidenceSource[],
  primaryContent: string,
  sourceConsensus: SourceConsensus
): string {
  const sections: string[] = [];

  sections.push(
    [
      "PRIMARY ARTICLE",
      `Title: ${cleanText(
        primaryArticle.title
      )}`,
      `Publisher: ${getSourceName(
        primaryArticle
      )}`,
      `Published: ${
        getPublishedAt(
          primaryArticle
        ) || "Unknown"
      }`,
      `URL: ${cleanText(
        primaryArticle.url
      )}`,
      `Description: ${
        truncateText(
          primaryArticle.description ??
            "",
          MAX_DESCRIPTION_LENGTH
        ) || "Not available"
      }`,
    ].join("\n")
  );

  const normalizedContent =
    truncateText(
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
    const sourceSections =
      sources.map(
        (source) => {
          const rating =
            source.isRated &&
            source.reliability !==
              null &&
            source.factualReporting !==
              null
              ? `Reliability: ${source.reliability}/100 | Factual reporting: ${source.factualReporting}/100`
              : "Reliability: Not independently rated";

          return [
            `SOURCE ID: ${source.sourceId}${
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

    sections.push(
      [
        "VALID SOURCE IDS",
        "Use only these IDs in brief evidence arrays:",
        ...sources.map(
          (source) =>
            `${source.sourceId} | ${source.sourceName}`
        ),
      ].join("\n")
    );
  }

  sections.push(
    [
      "SOURCE CONSENSUS SIGNALS",
      `Sources reviewed: ${sourceConsensus.sourceCount}`,
      `Rated sources: ${sourceConsensus.ratedSourceCount}`,
      `Average reliability: ${formatScore(
        sourceConsensus.averageReliability
      )}`,
      `Average factual reporting: ${formatScore(
        sourceConsensus.averageFactualReporting
      )}`,
      `Source quality: ${formatScore(
        sourceConsensus.sourceQualityScore
      )}`,
      `Reporting alignment: ${formatScore(
        sourceConsensus.reportingAgreement
      )}`,
      `Political source distribution: Left ${sourceConsensus.politicalDistribution.left}, Center ${sourceConsensus.politicalDistribution.center}, Right ${sourceConsensus.politicalDistribution.right}, Mixed/Unrated ${sourceConsensus.politicalDistribution.mixed}`,
    ].join("\n")
  );

  sections.push(
    [
      "IMPORTANT CONSENSUS INTERPRETATION",
      "- Reporting alignment measures similarity in the major facts and themes described by independent publishers.",
      "- Reporting alignment does not prove that every claim is true.",
      "- A high reporting-alignment score must not be described as full factual verification.",
      "- Source quality and political distribution are context signals, not proof of truth.",
      "- When reporting agreement is unavailable, do not invent or estimate cross-source agreement.",
    ].join("\n")
  );

  sections.push(
    [
      "EVIDENCE RULES",
      "- Treat the primary article as one source, not as established truth.",
      "- Distinguish facts supported by multiple sources from claims reported by only one source.",
      "- Do not invent agreement, disagreement, quotations, events, statistics, or source positions.",
      "- When evidence is incomplete, uncertain, or conflicting, state that clearly.",
      "- Source reliability metadata is a supporting signal, not proof that an individual claim is true.",
      "- Base conclusions only on the evidence provided in this context.",
      "- When citing brief evidence, use only the SOURCE ID values listed above (S1, S2, …).",
      "- Support fragments must be copied from that source's Title or Description only.",
      "- Do not copy from PRIMARY ARTICLE CONTENT for brief support fragments.",
      "- Multiple sources covering the same event is not the same as corroboration of a specific fact.",
      "- Do not describe corroborated reporting as proven truth.",
    ].join("\n")
  );

  return sections.join(
    "\n\n---\n\n"
  );
}

export async function buildEvidenceContext(
  primaryArticle: Article,
  options: BuildEvidenceContextOptions = {}
): Promise<EvidenceContext> {
  const rankedSources =
    options.rankedSources ??
    (await gatherStorySources(
      primaryArticle
    ));

  const selectedRankedSources =
    rankedSources.slice(
      0,
      MAX_EVIDENCE_SOURCES
    );

  const selectedSources =
    selectedRankedSources.map(
      createEvidenceSource
    );

  const sourceConsensus =
    calculateSourceConsensus(
      selectedRankedSources
    );

  const sourceCount =
    selectedSources.length;

  const independentSourceCount =
    countIndependentSources(
      selectedSources
    );

  const ratedSourceCount =
    selectedSources.filter(
      (source) =>
        source.isRated
    ).length;

  const primaryContent =
    options.primaryContent ?? "";

  return {
    primaryArticle: {
      title:
        cleanText(
          primaryArticle.title
        ),

      description:
        cleanText(
          primaryArticle.description
        ),

      content:
        truncateText(
          primaryContent,
          MAX_PRIMARY_CONTENT_LENGTH
        ),

      url:
        cleanText(
          primaryArticle.url
        ),

      sourceName:
        getSourceName(
          primaryArticle
        ),

      publishedAt:
        getPublishedAt(
          primaryArticle
        ),
    },

    sources:
      selectedSources,

    sourceCount,

    independentSourceCount,

    ratedSourceCount,

    sourceConsensus,

    promptContext:
      buildPromptContext(
        primaryArticle,
        selectedSources,
        primaryContent,
        sourceConsensus
      ),
  };
}
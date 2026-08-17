import type { Article } from "@/app/types/article";

import {
  getSourceRating,
  type SourceRating,
} from "./sourceRanking";

const MAX_SOURCES = 6;
const SOURCE_GATHER_TIMEOUT_MS = 7_000;

const MIN_RELEVANCE_SCORE = 12;

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "been",
  "but",
  "by",
  "for",
  "from",
  "has",
  "have",
  "he",
  "her",
  "his",
  "in",
  "into",
  "is",
  "it",
  "its",
  "of",
  "on",
  "or",
  "said",
  "says",
  "she",
  "that",
  "the",
  "their",
  "they",
  "this",
  "to",
  "was",
  "were",
  "will",
  "with",
]);

export type RankedArticle = {
  article: Article;
  sourceRating: SourceRating;
  isPrimary: boolean;
};

type ScoredArticle = RankedArticle & {
  relevanceScore: number;
  rankingScore: number;
};

function normalizeText(
  value: string | null | undefined
): string {
  return (value ?? "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getKeywords(
  value: string
): string[] {
  return Array.from(
    new Set(
      normalizeText(value)
        .split(" ")
        .filter(
          (word) =>
            word.length >= 3 &&
            !STOP_WORDS.has(word)
        )
    )
  );
}

function createPrimarySource(
  primaryArticle: Article
): RankedArticle {
  return {
    article: primaryArticle,

    sourceRating: getSourceRating(
      primaryArticle.source.name
    ),

    isPrimary: true,
  };
}

function normalizeSourceName(
  article: Article
): string {
  return normalizeText(
    article.source?.name
  );
}

function removeDuplicateArticles(
  articles: Article[]
): Article[] {
  const seenUrls =
    new Set<string>();

  const seenTitles =
    new Set<string>();

  return articles.filter(
    (article) => {
      const normalizedUrl =
        normalizeText(article.url);

      const normalizedTitle =
        normalizeText(article.title);

      if (
        !normalizedUrl ||
        !normalizedTitle
      ) {
        return false;
      }

      if (
        seenUrls.has(
          normalizedUrl
        ) ||
        seenTitles.has(
          normalizedTitle
        )
      ) {
        return false;
      }

      seenUrls.add(
        normalizedUrl
      );

      seenTitles.add(
        normalizedTitle
      );

      return true;
    }
  );
}

function calculateKeywordOverlap(
  article: Article,
  primaryKeywords: string[]
): number {
  if (
    primaryKeywords.length === 0
  ) {
    return 0;
  }

  const articleText =
    `${article.title} ${article.description ?? ""}`;

  const articleKeywords =
    new Set(
      getKeywords(articleText)
    );

  const sharedKeywords =
    primaryKeywords.filter(
      (keyword) =>
        articleKeywords.has(
          keyword
        )
    );

  return (
    sharedKeywords.length /
    primaryKeywords.length
  );
}

function calculateTitleSimilarity(
  article: Article,
  primaryArticle: Article
): number {
  const primaryTitleKeywords =
    getKeywords(
      primaryArticle.title
    );

  if (
    primaryTitleKeywords.length === 0
  ) {
    return 0;
  }

  const articleTitleKeywords =
    new Set(
      getKeywords(
        article.title
      )
    );

  const sharedTitleKeywords =
    primaryTitleKeywords.filter(
      (keyword) =>
        articleTitleKeywords.has(
          keyword
        )
    );

  return (
    sharedTitleKeywords.length /
    primaryTitleKeywords.length
  );
}

function calculateRelevanceScore(
  article: Article,
  primaryArticle: Article
): number {
  if (
    article.url ===
    primaryArticle.url
  ) {
    return 100;
  }

  const primaryKeywords =
    getKeywords(
      `${primaryArticle.title} ${
        primaryArticle.description ??
        ""
      }`
    );

  const keywordOverlap =
    calculateKeywordOverlap(
      article,
      primaryKeywords
    );

  const titleSimilarity =
    calculateTitleSimilarity(
      article,
      primaryArticle
    );

  /*
   * Title similarity is weighted more
   * heavily because it is usually the
   * strongest signal that two articles
   * describe the same event.
   */
  return Math.round(
    titleSimilarity * 65 +
      keywordOverlap * 35
  );
}

function calculateRankingScore(
  relevanceScore: number,
  sourceRating: SourceRating
): number {
  /*
   * Relevance dominates the ranking.
   *
   * Source quality is only used as a
   * secondary signal when PoliticalPulse
   * actually maintains a verified rating.
   */
  const relevanceContribution =
    relevanceScore * 0.8;

  const sourceQualityContribution =
    sourceRating.isRated
      ? (
          sourceRating.reliability +
          sourceRating.factualReporting
        ) /
        2 *
        0.2
      : 50 * 0.2;

  return Math.round(
    relevanceContribution +
      sourceQualityContribution
  );
}

function scoreArticles(
  articles: Article[],
  primaryArticle: Article
): ScoredArticle[] {
  return articles
    .map((article) => {
      const sourceRating =
        getSourceRating(
          article.source.name
        );

      const isPrimary =
        article.url ===
        primaryArticle.url;

      const relevanceScore =
        calculateRelevanceScore(
          article,
          primaryArticle
        );

      const rankingScore =
        isPrimary
          ? 1000
          : calculateRankingScore(
              relevanceScore,
              sourceRating
            );

      return {
        article,
        sourceRating,
        isPrimary,
        relevanceScore,
        rankingScore,
      };
    })
    .filter(
      (source) =>
        source.isPrimary ||
        source.relevanceScore >=
          MIN_RELEVANCE_SCORE
    )
    .sort(
      (a, b) =>
        b.rankingScore -
        a.rankingScore
    );
}

function selectDiverseSources(
  scoredArticles: ScoredArticle[],
  primaryArticle: Article
): RankedArticle[] {
  const selected:
    RankedArticle[] = [];

  const usedPublishers =
    new Set<string>();

  const primary =
    scoredArticles.find(
      (source) =>
        source.isPrimary
    ) ??
    {
      ...createPrimarySource(
        primaryArticle
      ),
      relevanceScore: 100,
      rankingScore: 1000,
    };

  selected.push({
    article:
      primary.article,
    sourceRating:
      primary.sourceRating,
    isPrimary: true,
  });

  const primaryPublisher =
    normalizeSourceName(
      primary.article
    );

  if (primaryPublisher) {
    usedPublishers.add(
      primaryPublisher
    );
  }

  /*
   * First pass:
   * prefer independent publishers.
   */
  for (const source of scoredArticles) {
    if (
      selected.length >=
      MAX_SOURCES
    ) {
      break;
    }

    if (source.isPrimary) {
      continue;
    }

    const publisher =
      normalizeSourceName(
        source.article
      );

    if (
      !publisher ||
      usedPublishers.has(
        publisher
      )
    ) {
      continue;
    }

    selected.push({
      article:
        source.article,
      sourceRating:
        source.sourceRating,
      isPrimary: false,
    });

    usedPublishers.add(
      publisher
    );
  }

  /*
   * Second pass:
   * if fewer than MAX_SOURCES were found,
   * allow additional articles from an
   * already-used publisher rather than
   * discarding relevant coverage.
   */
  if (
    selected.length <
    MAX_SOURCES
  ) {
    const selectedUrls =
      new Set(
        selected.map(
          (source) =>
            source.article.url
        )
      );

    for (const source of scoredArticles) {
      if (
        selected.length >=
        MAX_SOURCES
      ) {
        break;
      }

      if (
        source.isPrimary ||
        selectedUrls.has(
          source.article.url
        )
      ) {
        continue;
      }

      selected.push({
        article:
          source.article,
        sourceRating:
          source.sourceRating,
        isPrimary: false,
      });

      selectedUrls.add(
        source.article.url
      );
    }
  }

  return selected;
}

function rankArticles(
  articles: Article[],
  primaryArticle: Article
): RankedArticle[] {
  const scoredArticles =
    scoreArticles(
      articles,
      primaryArticle
    );

  return selectDiverseSources(
    scoredArticles,
    primaryArticle
  );
}

export async function gatherStorySources(
  primaryArticle: Article
): Promise<RankedArticle[]> {
  const controller =
    new AbortController();

  const timeoutId =
    setTimeout(() => {
      controller.abort();
    }, SOURCE_GATHER_TIMEOUT_MS);

  const query =
    encodeURIComponent(
      primaryArticle.title.trim()
    );

  try {
    const response =
      await fetch(
        `/api/news?mode=related&q=${query}`,
        {
          signal:
            controller.signal,
        }
      );

    if (!response.ok) {
      return [
        createPrimarySource(
          primaryArticle
        ),
      ];
    }

    const data =
      (await response.json()) as {
        articles?: unknown;
      };

    const relatedArticles:
      Article[] =
      Array.isArray(
        data.articles
      )
        ? data.articles
        : [];

    const combined =
      removeDuplicateArticles([
        primaryArticle,
        ...relatedArticles,
      ]);

    const rankedArticles =
      rankArticles(
        combined,
        primaryArticle
      );

    console.info(
      "PoliticalPulse source selection:",
      {
        primarySource:
          primaryArticle.source.name,

        relatedCandidates:
          relatedArticles.length,

        uniqueCandidates:
          combined.length,

        selectedSources:
          rankedArticles.map(
            (source) => ({
              source:
                source.article
                  .source.name,

              rated:
                source.sourceRating
                  .isRated,

              primary:
                source.isPrimary,
            })
          ),
      }
    );

    return rankedArticles.length > 0
      ? rankedArticles
      : [
          createPrimarySource(
            primaryArticle
          ),
        ];
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name ===
        "AbortError"
    ) {
      console.warn(
        `Related-source gathering exceeded ${SOURCE_GATHER_TIMEOUT_MS}ms. Continuing with the primary article.`
      );
    } else {
      console.error(
        "Failed to gather multi-source intelligence:",
        error
      );
    }

    return [
      createPrimarySource(
        primaryArticle
      ),
    ];
  } finally {
    clearTimeout(timeoutId);
  }
}
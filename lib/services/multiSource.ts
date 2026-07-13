import type { Article } from "@/app/types/article";

import {
  getSourceRating,
  type SourceRating,
} from "./sourceRanking";

const MAX_SOURCES = 6;
const SOURCE_GATHER_TIMEOUT_MS = 4_000;

export type RankedArticle = {
  article: Article;
  sourceRating: SourceRating;
  isPrimary: boolean;
};

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

function removeDuplicateArticles(
  articles: Article[]
): Article[] {
  const seen = new Set<string>();

  return articles.filter((article) => {
    const normalizedUrl =
      article.url?.trim().toLowerCase() ?? "";

    const normalizedTitle =
      article.title.trim().toLowerCase();

    const key =
      normalizedUrl || normalizedTitle;

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });
}

function rankArticles(
  articles: Article[],
  primaryArticle: Article
): RankedArticle[] {
  return articles
    .map((article) => ({
      article,

      sourceRating: getSourceRating(
        article.source.name
      ),

      isPrimary:
        article.url === primaryArticle.url,
    }))
    .sort((a, b) => {
      if (a.isPrimary && !b.isPrimary) {
        return -1;
      }

      if (!a.isPrimary && b.isPrimary) {
        return 1;
      }

      return (
        b.sourceRating.reliability -
        a.sourceRating.reliability
      );
    })
    .slice(0, MAX_SOURCES);
}

export async function gatherStorySources(
  primaryArticle: Article
): Promise<RankedArticle[]> {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, SOURCE_GATHER_TIMEOUT_MS);

  const query = encodeURIComponent(
    primaryArticle.title.trim()
  );

  try {
    const response = await fetch(
      `/api/news?mode=related&q=${query}`,
      {
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      return [
        createPrimarySource(primaryArticle),
      ];
    }

    const data = (await response.json()) as {
      articles?: unknown;
    };

    const relatedArticles: Article[] =
      Array.isArray(data.articles)
        ? data.articles
        : [];

    const combined =
      removeDuplicateArticles([
        primaryArticle,
        ...relatedArticles,
      ]);

    const rankedArticles = rankArticles(
      combined,
      primaryArticle
    );

    return rankedArticles.length > 0
      ? rankedArticles
      : [createPrimarySource(primaryArticle)];
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
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
      createPrimarySource(primaryArticle),
    ];
  } finally {
    clearTimeout(timeoutId);
  }
}
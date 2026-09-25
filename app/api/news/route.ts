import { analyzeNewsApiPool, curateHomepageFeed } from "@/lib/services/homepageCuration";
import { acquireHomepageCandidates } from "@/lib/services/newsAcquisition";
import { fetchNewsSearch, resolveNewsProvider } from "@/lib/services/newsProvider";
import { logOps } from "@/lib/ops/log";
import { enforcePublicEndpointGuard } from "@/lib/security/guardRequest";
import { RATE_LIMIT_BUCKETS } from "@/lib/security/rateLimit";

const DEFAULT_PAGE_SIZE = 100;
const MAX_HOMEPAGE_ARTICLES = 30;

const RELATED_FETCH_SIZE = 25;
const RELATED_RETURN_SIZE = 12;

const MAX_SEARCH_QUERY_LENGTH = 500;

const RELATED_STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "been",
  "being",
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

const POLITICAL_NEWS_QUERY = [
  "(",
  '"White House"',
  "OR Congress",
  "OR Senate",
  'OR "House of Representatives"',
  'OR "Supreme Court"',
  'OR "federal government"',
  'OR "state legislature"',
  'OR "public policy"',
  "OR election",
  "OR president",
  "OR governor",
  "OR legislation",
  "OR diplomacy",
  "OR sanctions",
  "OR tariffs",
  "OR immigration",
  ")",
].join(" ");

const GLOBAL_IMPORTANCE_TERMS = [
  "war ",
  "invasion",
  "ceasefire",
  "airstrike",
  "missile",
  "nuclear",
  "nato",
  "earthquake",
  "hurricane",
  "pandemic",
  "coup",
];

const STRONG_POLITICAL_TERMS = [
  "white house",
  "congress",
  "congressional",
  "senate",
  "senator",
  "house of representatives",
  "representative",
  "supreme court",
  "federal government",
  "state government",
  "state legislature",
  "legislature",
  "legislation",
  "lawmakers",
  "president",
  "vice president",
  "governor",
  "administration",
  "election",
  "electoral",
  "ballot",
  "voting",
  "voters",
  "democrat",
  "democratic party",
  "republican",
  "republican party",
  "public policy",
  "foreign policy",
  "immigration policy",
  "government shutdown",
  "executive order",
  "constitutional",
  "constitution",
  "sanctions",
  "diplomacy",
  "tariffs",
  "parliament",
  "prime minister",
];

const EXCLUDED_TERMS = [
  "marketing campaign",
  "advertising campaign",
  "email campaign",
  "brand campaign",
  "social media campaign",
  "multi-channel campaign",
  "product launch",
  "press release",
  "sponsored content",
  "shopping",
  "retail",
  "podcast studio",
  "software platform",
  "artificial intelligence tool",
  "celebrity",
  "entertainment",
  "movie",
  "television series",
  "album",
  "concert",
  "rapper",
  "box office",
  "nba",
  "nfl",
  "mlb",
  "nhl",
  "basketball",
  "football",
  "baseball",
  "hockey",
  "soccer",
  "fantasy sports",
  "free agency",
  "team rumors",
  "trade rumors",
];

type NewsApiArticle = {
  source?: {
    id?: string | null;
    name?: string | null;
  };

  author?: string | null;
  title?: string | null;
  description?: string | null;
  url?: string | null;
  urlToImage?: string | null;
  publishedAt?: string | null;
  content?: string | null;
  acquisitionPools?: string[];
};

function cleanSearchQuery(
  value: string | null
): string {
  if (!value) {
    return "";
  }

  return value
    .replace(
      /[^\p{L}\p{N}\s'"()-]/gu,
      " "
    )
    .replace(/\s+/g, " ")
    .trim()
    .slice(
      0,
      MAX_SEARCH_QUERY_LENGTH
    );
}

function buildRelatedQuery(
  rawQuery: string
): string {
  const cleaned =
    cleanSearchQuery(rawQuery);

  if (!cleaned) {
    return "";
  }

  const words = cleaned
    .replace(/["()]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

  const meaningfulWords =
    words.filter((word) => {
      const normalized =
        word.toLowerCase();

      return (
        normalized.length >= 3 &&
        !RELATED_STOP_WORDS.has(
          normalized
        )
      );
    });

  const uniqueWords =
    Array.from(
      new Set(meaningfulWords)
    );

  /*
   * multiSource.ts already reduces the
   * original headline into a focused set
   * of story-identifying keywords.
   *
   * Keep the NewsAPI query broad enough
   * to retrieve alternate coverage of
   * the same event.
   *
   * PoliticalPulse performs its own
   * relevance scoring, deduplication,
   * source-quality analysis, and
   * publisher-diversity selection after
   * NewsAPI returns the candidate pool.
   */
  const selectedWords =
    uniqueWords.slice(0, 8);

  if (selectedWords.length === 0) {
    return cleaned;
  }

  return selectedWords.join(" ");
}

function getDurationMs(
  startedAt: number
): number {
  return Math.round(
    performance.now() - startedAt
  );
}

function isNewsApiArticle(
  value: unknown
): value is NewsApiArticle {
  return (
    value !== null &&
    typeof value === "object"
  );
}

function getArticleText(
  article: NewsApiArticle
): string {
  return [
    article.title,
    article.description,
  ]
    .filter(
      (value): value is string =>
        typeof value === "string"
    )
    .join(" ")
    .toLowerCase();
}

function isUsableArticle(
  article: NewsApiArticle
): boolean {
  const title =
    article.title?.trim();

  const url =
    article.url?.trim();

  if (
    !title ||
    !url ||
    title === "[Removed]"
  ) {
    return false;
  }

  return true;
}

function isPoliticalArticle(
  article: NewsApiArticle
): boolean {
  const articleText =
    getArticleText(article);

  const containsExcludedTerm =
    EXCLUDED_TERMS.some((term) =>
      articleText.includes(term)
    );

  if (containsExcludedTerm) {
    return false;
  }

  return STRONG_POLITICAL_TERMS.some(
    (term) =>
      articleText.includes(term)
  );
}

function isGloballyImportantArticle(
  article: NewsApiArticle
): boolean {
  const articleText =
    getArticleText(article);

  return GLOBAL_IMPORTANCE_TERMS.some(
    (term) => articleText.includes(term)
  );
}

function isHomepageCandidate(
  article: NewsApiArticle
): boolean {
  if (!isUsableArticle(article)) {
    return false;
  }

  const articleText =
    getArticleText(article);

  const containsExcludedTerm =
    EXCLUDED_TERMS.some((term) =>
      articleText.includes(term)
    );

  if (containsExcludedTerm) {
    return false;
  }

  const pools = article.acquisitionPools ?? [];

  if (
    pools.includes("us-headlines") ||
    pools.includes("world")
  ) {
    return true;
  }

  return (
    isPoliticalArticle(article) ||
    isGloballyImportantArticle(article)
  );
}

const NEAR_DUPLICATE_STOP_WORDS = new Set([
  ...RELATED_STOP_WORDS,
  "after",
  "amid",
  "over",
  "new",
  "latest",
  "just",
  "could",
  "would",
  "may",
  "says",
  "say",
]);

function getTitleTokens(
  title: string
): string[] {
  return Array.from(
    new Set(
      title
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .split(/\s+/)
        .map((word) => word.trim())
        .filter(
          (word) =>
            word.length >= 3 &&
            !NEAR_DUPLICATE_STOP_WORDS.has(word)
        )
    )
  );
}

function isNearDuplicateTitle(
  leftTitle: string,
  rightTitle: string
): boolean {
  const leftTokens = getTitleTokens(leftTitle);
  const rightTokens = getTitleTokens(rightTitle);

  if (
    leftTokens.length < 4 ||
    rightTokens.length < 4
  ) {
    return false;
  }

  const rightTokenSet = new Set(rightTokens);

  const overlapCount = leftTokens.filter(
    (token) => rightTokenSet.has(token)
  ).length;

  const smallerSetSize = Math.min(
    leftTokens.length,
    rightTokens.length
  );

  return (
    overlapCount >= 4 &&
    overlapCount / smallerSetSize >= 0.72
  );
}

/*
 * Keeps the first article in a near-duplicate
 * cluster. Homepage articles are already
 * newest-first from the news provider, so later wire
 * copies of the same event are dropped from
 * the homepage feed only.
 */
function filterNearDuplicateStories(
  articles: NewsApiArticle[]
): NewsApiArticle[] {
  const keptArticles: NewsApiArticle[] = [];

  for (const article of articles) {
    const title = article.title?.trim();

    if (!title) {
      continue;
    }

    const isNearDuplicate = keptArticles.some(
      (existingArticle) =>
        isNearDuplicateTitle(
          existingArticle.title ?? "",
          title
        )
    );

    if (!isNearDuplicate) {
      keptArticles.push(article);
    }
  }

  return keptArticles;
}

function deduplicateArticles(
  articles: NewsApiArticle[]
): NewsApiArticle[] {
  const seenUrls =
    new Set<string>();

  const seenTitles =
    new Set<string>();

  return articles.filter(
    (article) => {
      const normalizedUrl =
        article.url
          ?.trim()
          .toLowerCase() ?? "";

      const normalizedTitle =
        article.title
          ?.trim()
          .toLowerCase() ?? "";

      if (
        !normalizedUrl ||
        !normalizedTitle ||
        seenUrls.has(
          normalizedUrl
        ) ||
        seenTitles.has(
          normalizedTitle
        )
      ) {
        return false;
      }

      seenUrls.add(normalizedUrl);
      seenTitles.add(
        normalizedTitle
      );

      return true;
    }
  );
}

function prepareHomepageArticles(
  articles: unknown[]
): ReturnType<typeof curateHomepageFeed> {
  const usable = articles
    .filter(isNewsApiArticle)
    .filter(isUsableArticle);
  const candidates = deduplicateArticles(
    usable.filter(isHomepageCandidate)
  );

  console.info(
    "NewsAPI candidate pool:",
    analyzeNewsApiPool(usable)
  );
  console.info(
    "Homepage candidate filter:",
    analyzeNewsApiPool(candidates)
  );

  const curated = curateHomepageFeed(candidates).slice(
    0,
    MAX_HOMEPAGE_ARTICLES
  );

  console.info(
    "Homepage curation:",
    curated.slice(0, 8).map((article, index) => ({
      slot:
        index === 0
          ? "lead"
          : index < 5
            ? `big-${index}`
            : `trending-${index - 4}`,
      title: article.title,
      category: article.curation?.category,
        source: article.source.name,
        score: article.curation?.score,
        pools: article.curation?.acquisitionPools,
        reason: article.curation?.selectionReason,
    }))
  );

  return curated;
}

function prepareRelatedArticles(
  articles: unknown[]
): NewsApiArticle[] {
  return deduplicateArticles(
    articles
      .filter(isNewsApiArticle)
      .filter(isUsableArticle)
  ).slice(
    0,
    RELATED_RETURN_SIZE
  );
}

export async function GET(
  request: Request
) {
  const blocked = enforcePublicEndpointGuard(request, {
    bucket: RATE_LIMIT_BUCKETS.news,
  });

  if (blocked) {
    return blocked;
  }

  const routeStartedAt =
    performance.now();

  try {
    const provider = resolveNewsProvider();

    if (!provider.ok) {
      return Response.json(
        {
          status: "error",
          code: provider.code,
          message: provider.message,
          articles: [],
        },
        {
          status: 500,
        }
      );
    }

    const requestUrl =
      new URL(request.url);

    const isRelatedMode =
      requestUrl.searchParams.get(
        "mode"
      ) === "related";

    const rawQuery =
      requestUrl.searchParams.get(
        "q"
      );

    if (isRelatedMode) {
      const relatedQuery =
        buildRelatedQuery(
          rawQuery ?? ""
        );

      if (!relatedQuery) {
        return Response.json(
          {
            status: "error",

            code:
              "missingQuery",

            message:
              "A search query is required when mode is related.",

            articles: [],
          },
          {
            status: 400,
          }
        );
      }

      console.info(
        "PoliticalPulse related-news query:",
        {
          originalQuery:
            rawQuery,

          relatedQuery,
        }
      );

      const newsApiStartedAt =
        performance.now();

      const result = await fetchNewsSearch({
        q: relatedQuery,
        language: "en",
        sortBy: "relevancy",
        pageSize: RELATED_FETCH_SIZE,
      });

      const newsApiFetchMs =
        getDurationMs(
          newsApiStartedAt
        );

      if (result.status < 200 || result.status >= 300) {
        console.error(
          "Related news request failed:",
          {
            status: result.status,
            rateLimited: result.rateLimited,
            newsApiFetchMs,
          }
        );

        if (result.rateLimited) {
          logOps("newsapi_failed", "news", "related-429");
        }

        return Response.json(
          {
            status: "error",
            code: result.rateLimited ? "rateLimited" : "newsApiError",
            message:
              "The Angle Report could not retrieve news.",
            articles: [],
            rateLimited: result.rateLimited,
          },
          {
            status: result.status || 502,
          }
        );
      }

      const rawArticles = result.articles;
      const articles = prepareRelatedArticles(rawArticles);

      console.info(
        "PoliticalPulse news performance:",
        {
          mode: "related",

          rawArticleCount:
            rawArticles.length,

          articleCount:
            articles.length,

          totalResults:
            result.totalResults,

          newsApiFetchMs,

          totalRouteMs:
            getDurationMs(
              routeStartedAt
            ),
        }
      );

      return Response.json({
        status: "ok",

        totalResults:
          articles.length,

        articles,
      });
    }

    const acquisitionStartedAt =
      performance.now();

    const acquired =
      await acquireHomepageCandidates();

    const articles =
      prepareHomepageArticles(
        acquired.articles
      );

    console.info(
      "PoliticalPulse news performance:",
      {
        mode: "homepage",

        acquisition: acquired.diagnostics,

        articleCount:
          articles.length,

        newsApiFetchMs:
          getDurationMs(
            acquisitionStartedAt
          ),

        totalRouteMs:
          getDurationMs(
            routeStartedAt
          ),
      }
    );

    return Response.json({
      status: "ok",

      totalResults:
        articles.length,

      articles,

      rateLimited:
        acquired.diagnostics.rateLimited === true,

      servedFromLastGood:
        acquired.diagnostics.servedFromLastGood === true,
    });
  } catch {
    logOps("unexpected", "news", "generation");

    return Response.json(
      {
        status: "error",

        code:
          "internalError",

        message:
          "The Angle Report could not retrieve news at this time.",

        articles: [],
      },
      {
        status: 500,
      }
    );
  }
}
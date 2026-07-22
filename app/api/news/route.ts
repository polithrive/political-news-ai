const NEWS_API_BASE_URL =
  "https://newsapi.org/v2";

const DEFAULT_PAGE_SIZE = 40;
const MAX_HOMEPAGE_ARTICLES = 10;
const RELATED_PAGE_SIZE = 8;
const MAX_SEARCH_QUERY_LENGTH = 200;

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

type NewsApiErrorResponse = {
  status?: string;
  code?: string;
  message?: string;
};

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
};

function cleanSearchQuery(
  value: string | null
): string {
  if (!value) {
    return "";
  }

  return value
    .replace(
      /[^\p{L}\p{N}\s'"-]/gu,
      " "
    )
    .replace(/\s+/g, " ")
    .trim()
    .slice(
      0,
      MAX_SEARCH_QUERY_LENGTH
    );
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

function deduplicateArticles(
  articles: NewsApiArticle[]
): NewsApiArticle[] {
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();

  return articles.filter((article) => {
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
      seenUrls.has(normalizedUrl) ||
      seenTitles.has(normalizedTitle)
    ) {
      return false;
    }

    seenUrls.add(normalizedUrl);
    seenTitles.add(normalizedTitle);

    return true;
  });
}

function prepareHomepageArticles(
  articles: unknown[]
): NewsApiArticle[] {
  return deduplicateArticles(
    articles
      .filter(isNewsApiArticle)
      .filter(isUsableArticle)
      .filter(isPoliticalArticle)
  ).slice(0, MAX_HOMEPAGE_ARTICLES);
}

function prepareRelatedArticles(
  articles: unknown[]
): NewsApiArticle[] {
  return deduplicateArticles(
    articles
      .filter(isNewsApiArticle)
      .filter(isUsableArticle)
  ).slice(0, RELATED_PAGE_SIZE);
}

async function fetchNewsApi(
  endpoint: string,
  apiKey: string
): Promise<Response> {
  return fetch(endpoint, {
    headers: {
      "X-Api-Key": apiKey,
    },

    next: {
      revalidate: 300,
    },
  });
}

export async function GET(
  request: Request
) {
  const routeStartedAt =
    performance.now();

  try {
    const apiKey =
      process.env.NEWS_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          status: "error",
          code: "missingApiKey",
          message:
            "NEWS_API_KEY is not configured.",
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

    const query = cleanSearchQuery(
      requestUrl.searchParams.get("q")
    );

    let newsApiUrl: URL;

    if (isRelatedMode) {
      if (!query) {
        return Response.json(
          {
            status: "error",
            code: "missingQuery",
            message:
              "A search query is required when mode is related.",
            articles: [],
          },
          {
            status: 400,
          }
        );
      }

      newsApiUrl = new URL(
        `${NEWS_API_BASE_URL}/everything`
      );

      newsApiUrl.searchParams.set(
        "q",
        query
      );

      newsApiUrl.searchParams.set(
        "searchIn",
        "title,description"
      );

      newsApiUrl.searchParams.set(
        "language",
        "en"
      );

      newsApiUrl.searchParams.set(
        "sortBy",
        "relevancy"
      );

      newsApiUrl.searchParams.set(
        "pageSize",
        String(RELATED_PAGE_SIZE)
      );
    } else {
      newsApiUrl = new URL(
        `${NEWS_API_BASE_URL}/everything`
      );

      newsApiUrl.searchParams.set(
        "q",
        POLITICAL_NEWS_QUERY
      );

      newsApiUrl.searchParams.set(
        "searchIn",
        "title,description"
      );

      newsApiUrl.searchParams.set(
        "language",
        "en"
      );

      newsApiUrl.searchParams.set(
        "sortBy",
        "publishedAt"
      );

      newsApiUrl.searchParams.set(
        "pageSize",
        String(DEFAULT_PAGE_SIZE)
      );
    }

    const newsApiStartedAt =
      performance.now();

    const response =
      await fetchNewsApi(
        newsApiUrl.toString(),
        apiKey
      );

    const newsApiFetchMs =
      getDurationMs(
        newsApiStartedAt
      );

    const data =
      (await response.json()) as
        NewsApiErrorResponse & {
          articles?: unknown[];
          totalResults?: number;
        };

    if (!response.ok) {
      console.error(
        "NewsAPI request failed:",
        {
          status: response.status,
          code: data.code,
          message: data.message,
          newsApiFetchMs,
        }
      );

      return Response.json(
        {
          status: "error",
          code:
            data.code ??
            "newsApiError",
          message:
            data.message ??
            "PoliticalPulse could not retrieve news.",
          articles: [],
        },
        {
          status: response.status,
        }
      );
    }

    const rawArticles =
      Array.isArray(data.articles)
        ? data.articles
        : [];

    const articles = isRelatedMode
      ? prepareRelatedArticles(
          rawArticles
        )
      : prepareHomepageArticles(
          rawArticles
        );

    console.info(
      "PoliticalPulse news performance:",
      {
        mode: isRelatedMode
          ? "related"
          : "political",
        rawArticleCount:
          rawArticles.length,
        articleCount:
          articles.length,
        newsApiFetchMs,
        totalRouteMs:
          getDurationMs(
            routeStartedAt
          ),
      }
    );

    return Response.json({
      status: "ok",
      totalResults: articles.length,
      articles,
    });
  } catch (error) {
    console.error(
      "News API route error:",
      {
        error,
        totalRouteMs:
          getDurationMs(
            routeStartedAt
          ),
      }
    );

    return Response.json(
      {
        status: "error",
        code: "internalError",
        message:
          "PoliticalPulse could not retrieve news at this time.",
        articles: [],
      },
      {
        status: 500,
      }
    );
  }
}
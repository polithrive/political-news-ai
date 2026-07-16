const NEWS_API_BASE_URL =
  "https://newsapi.org/v2";

const DEFAULT_PAGE_SIZE = 10;
const RELATED_PAGE_SIZE = 8;
const MAX_SEARCH_QUERY_LENGTH = 200;

type NewsApiErrorResponse = {
  status?: string;
  code?: string;
  message?: string;
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
      console.warn(
        "PoliticalPulse news performance:",
        {
          outcome: "missing-api-key",
          totalRouteMs:
            getDurationMs(
              routeStartedAt
            ),
        }
      );

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

    const mode =
      requestUrl.searchParams.get(
        "mode"
      );

    const query = cleanSearchQuery(
      requestUrl.searchParams.get("q")
    );

    let newsApiUrl: URL;

    if (mode === "related") {
      if (!query) {
        console.warn(
          "PoliticalPulse news performance:",
          {
            mode: "related",
            outcome: "missing-query",
            totalRouteMs:
              getDurationMs(
                routeStartedAt
              ),
          }
        );

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
        `${NEWS_API_BASE_URL}/top-headlines`
      );

      newsApiUrl.searchParams.set(
        "country",
        "us"
      );

      newsApiUrl.searchParams.set(
        "category",
        "general"
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

    const parseStartedAt =
      performance.now();

    const data =
      (await response.json()) as
        NewsApiErrorResponse & {
          articles?: unknown[];
          totalResults?: number;
        };

    const responseParseMs =
      getDurationMs(
        parseStartedAt
      );

    if (!response.ok) {
      console.error(
        "NewsAPI request failed:",
        {
          status: response.status,
          code: data.code,
          message: data.message,
          mode:
            mode === "related"
              ? "related"
              : "headlines",
          newsApiFetchMs,
          responseParseMs,
          totalRouteMs:
            getDurationMs(
              routeStartedAt
            ),
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

    const articles =
      Array.isArray(data.articles)
        ? data.articles
        : [];

    const totalRouteMs =
      getDurationMs(
        routeStartedAt
      );

    console.info(
      "PoliticalPulse news performance:",
      {
        mode:
          mode === "related"
            ? "related"
            : "headlines",
        articleCount:
          articles.length,
        newsApiFetchMs,
        responseParseMs,
        totalRouteMs,
      }
    );

    return Response.json({
      status: "ok",

      totalResults:
        typeof data.totalResults ===
        "number"
          ? data.totalResults
          : 0,

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
const NEWS_API_BASE_URL = "https://newsapi.org/v2";
const DEFAULT_PAGE_SIZE = 10;
const RELATED_PAGE_SIZE = 8;
const MAX_SEARCH_QUERY_LENGTH = 200;

type NewsApiErrorResponse = {
  status?: string;
  code?: string;
  message?: string;
};

function cleanSearchQuery(value: string | null): string {
  if (!value) {
    return "";
  }

  return value
    .replace(/[^\p{L}\p{N}\s'"-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_SEARCH_QUERY_LENGTH);
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

export async function GET(request: Request) {
  try {
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          status: "error",
          code: "missingApiKey",
          message: "NEWS_API_KEY is not configured.",
          articles: [],
        },
        { status: 500 }
      );
    }

    const requestUrl = new URL(request.url);
    const mode = requestUrl.searchParams.get("mode");
    const query = cleanSearchQuery(
      requestUrl.searchParams.get("q")
    );

    let newsApiUrl: URL;

    if (mode === "related") {
      if (!query) {
        return Response.json(
          {
            status: "error",
            code: "missingQuery",
            message:
              "A search query is required when mode is related.",
            articles: [],
          },
          { status: 400 }
        );
      }

      newsApiUrl = new URL(
        `${NEWS_API_BASE_URL}/everything`
      );

      newsApiUrl.searchParams.set("q", query);
      newsApiUrl.searchParams.set("language", "en");
      newsApiUrl.searchParams.set("sortBy", "relevancy");
      newsApiUrl.searchParams.set(
        "pageSize",
        String(RELATED_PAGE_SIZE)
      );
    } else {
      newsApiUrl = new URL(
        `${NEWS_API_BASE_URL}/top-headlines`
      );

      newsApiUrl.searchParams.set("country", "us");
      newsApiUrl.searchParams.set("category", "general");
      newsApiUrl.searchParams.set(
        "pageSize",
        String(DEFAULT_PAGE_SIZE)
      );
    }

    const response = await fetchNewsApi(
      newsApiUrl.toString(),
      apiKey
    );

    const data =
      (await response.json()) as NewsApiErrorResponse & {
        articles?: unknown[];
        totalResults?: number;
      };

    if (!response.ok) {
      console.error("NewsAPI request failed:", {
        status: response.status,
        code: data.code,
        message: data.message,
      });

      return Response.json(
        {
          status: "error",
          code: data.code ?? "newsApiError",
          message:
            data.message ??
            "PoliticalPulse could not retrieve news.",
          articles: [],
        },
        { status: response.status }
      );
    }

    return Response.json({
      status: "ok",
      totalResults:
        typeof data.totalResults === "number"
          ? data.totalResults
          : 0,
      articles: Array.isArray(data.articles)
        ? data.articles
        : [],
    });
  } catch (error) {
    console.error("News API route error:", error);

    return Response.json(
      {
        status: "error",
        code: "internalError",
        message:
          "PoliticalPulse could not retrieve news at this time.",
        articles: [],
      },
      { status: 500 }
    );
  }
}
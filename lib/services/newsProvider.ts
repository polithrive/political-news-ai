export type NewsProviderName = "newsapi" | "gnews";

export const GNEWS_MAX_ARTICLES_PER_REQUEST = 25;

export type NormalizedProviderArticle = {
  title?: string | null;
  description?: string | null;
  url?: string | null;
  urlToImage?: string | null;
  publishedAt?: string | null;
  source?: {
    id?: string | null;
    name?: string | null;
  };
  author?: string | null;
  content?: string | null;
};

export type NewsListFetchResult = {
  articles: NormalizedProviderArticle[];
  totalResults: number;
  rateLimited: boolean;
  status: number;
};

export type NewsSearchRequest = {
  q: string;
  language?: string;
  sortBy?: "publishedAt" | "popularity" | "relevancy";
  pageSize: number;
  searchIn?: string;
  excludeDomains?: string;
};

export type NewsHeadlinesRequest = {
  country: string;
  pageSize: number;
};

type ResolvedNewsProvider =
  | { ok: true; name: NewsProviderName; apiKey: string }
  | { ok: false; code: "invalidProvider" | "missingApiKey"; message: string };

const NEWSAPI_BASE_URL = "https://newsapi.org/v2";
const GNEWS_BASE_URL = "https://gnews.io/api/v4";
const NEWS_CACHE_SECONDS = 300;

type GNewsArticle = {
  title?: string | null;
  description?: string | null;
  content?: string | null;
  url?: string | null;
  image?: string | null;
  publishedAt?: string | null;
  source?: {
    name?: string | null;
    url?: string | null;
  };
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== "object") {
    return null;
  }

  return value as Record<string, unknown>;
}

export function normalizeGNewsArticle(
  value: unknown
): NormalizedProviderArticle | null {
  const article = asRecord(value);

  if (!article) {
    return null;
  }

  const source = asRecord(article.source);
  const title =
    typeof article.title === "string" ? article.title : null;
  const url = typeof article.url === "string" ? article.url : null;

  if (!title?.trim() || !url?.trim()) {
    return null;
  }

  const image =
    typeof article.image === "string" ? article.image : "";

  return {
    title,
    description:
      typeof article.description === "string" ? article.description : "",
    url,
    urlToImage: image,
    publishedAt:
      typeof article.publishedAt === "string" ? article.publishedAt : "",
    source: {
      name:
        typeof source?.name === "string" && source.name.trim()
          ? source.name
          : "",
    },
    content: typeof article.content === "string" ? article.content : null,
  };
}

function capPageSize(pageSize: number, provider: NewsProviderName): number {
  const requested = Number.isFinite(pageSize)
    ? Math.max(1, Math.floor(pageSize))
    : 1;

  if (provider === "gnews") {
    return Math.min(requested, GNEWS_MAX_ARTICLES_PER_REQUEST);
  }

  return requested;
}

export function resolveNewsProvider(): ResolvedNewsProvider {
  const raw = process.env.NEWS_PROVIDER?.trim().toLowerCase() ?? "";

  if (raw && raw !== "gnews" && raw !== "newsapi") {
    return {
      ok: false,
      code: "invalidProvider",
      message: "NEWS_PROVIDER must be newsapi or gnews.",
    };
  }

  const name: NewsProviderName = raw === "gnews" ? "gnews" : "newsapi";
  const apiKey =
    name === "gnews"
      ? process.env.GNEWS_API_KEY?.trim()
      : process.env.NEWS_API_KEY?.trim();

  if (!apiKey) {
    return {
      ok: false,
      code: "missingApiKey",
      message:
        name === "gnews"
          ? "GNEWS_API_KEY is not configured."
          : "NEWS_API_KEY is not configured.",
    };
  }

  return { ok: true, name, apiKey };
}

function isRateLimited(
  status: number,
  payload: Record<string, unknown> | null
): boolean {
  if (status === 429) {
    return true;
  }

  const code = payload?.code;
  const errors = payload?.errors;

  if (code === "rateLimited") {
    return true;
  }

  if (Array.isArray(errors)) {
    return errors.some((entry) =>
      String(entry).toLowerCase().includes("rate")
    );
  }

  return false;
}

async function fetchJson(
  url: URL,
  init: RequestInit
): Promise<{ status: number; payload: Record<string, unknown> | null }> {
  const response = await fetch(url.toString(), {
    ...init,
    next: {
      revalidate: NEWS_CACHE_SECONDS,
    },
  });

  let payload: Record<string, unknown> | null = null;

  try {
    payload = asRecord(await response.json());
  } catch {
    payload = null;
  }

  return { status: response.status, payload };
}

function emptyResult(status: number, rateLimited: boolean): NewsListFetchResult {
  return {
    articles: [],
    totalResults: 0,
    rateLimited,
    status,
  };
}

export async function fetchTopHeadlines(
  request: NewsHeadlinesRequest
): Promise<NewsListFetchResult> {
  const provider = resolveNewsProvider();

  if (!provider.ok) {
    return emptyResult(500, false);
  }

  const pageSize = capPageSize(request.pageSize, provider.name);

  if (provider.name === "gnews") {
    const url = new URL(`${GNEWS_BASE_URL}/top-headlines`);
    url.searchParams.set("country", request.country);
    url.searchParams.set("lang", "en");
    url.searchParams.set("max", String(pageSize));
    url.searchParams.set("apikey", provider.apiKey);

    const { status, payload } = await fetchJson(url, { method: "GET" });
    const rateLimited = isRateLimited(status, payload);

    if (status < 200 || status >= 300) {
      return emptyResult(status, rateLimited);
    }

    const articles = Array.isArray(payload?.articles)
      ? payload.articles
          .map((article) => normalizeGNewsArticle(article))
          .filter((article): article is NormalizedProviderArticle => Boolean(article))
      : [];

    return {
      articles,
      totalResults:
        typeof payload?.totalArticles === "number"
          ? payload.totalArticles
          : articles.length,
      rateLimited,
      status,
    };
  }

  const url = new URL(`${NEWSAPI_BASE_URL}/top-headlines`);
  url.searchParams.set("country", request.country);
  url.searchParams.set("pageSize", String(pageSize));

  const { status, payload } = await fetchJson(url, {
    method: "GET",
    headers: {
      "X-Api-Key": provider.apiKey,
    },
  });
  const rateLimited = isRateLimited(status, payload);

  if (status < 200 || status >= 300) {
    return emptyResult(status, rateLimited);
  }

  const articles = Array.isArray(payload?.articles)
    ? (payload.articles as NormalizedProviderArticle[])
    : [];

  return {
    articles,
    totalResults:
      typeof payload?.totalResults === "number"
        ? payload.totalResults
        : articles.length,
    rateLimited,
    status,
  };
}

export async function fetchNewsSearch(
  request: NewsSearchRequest
): Promise<NewsListFetchResult> {
  const provider = resolveNewsProvider();

  if (!provider.ok) {
    return emptyResult(500, false);
  }

  const pageSize = capPageSize(request.pageSize, provider.name);

  if (provider.name === "gnews") {
    const url = new URL(`${GNEWS_BASE_URL}/search`);
    url.searchParams.set("q", request.q);
    url.searchParams.set("lang", request.language || "en");
    url.searchParams.set("max", String(pageSize));
    url.searchParams.set(
      "sortby",
      request.sortBy === "publishedAt" ? "publishedAt" : "relevance"
    );

    if (request.searchIn) {
      url.searchParams.set("in", request.searchIn);
    }

    url.searchParams.set("apikey", provider.apiKey);

    const { status, payload } = await fetchJson(url, { method: "GET" });
    const rateLimited = isRateLimited(status, payload);

    if (status < 200 || status >= 300) {
      return emptyResult(status, rateLimited);
    }

    const articles = Array.isArray(payload?.articles)
      ? payload.articles
          .map((article) => normalizeGNewsArticle(article))
          .filter((article): article is NormalizedProviderArticle => Boolean(article))
      : [];

    return {
      articles,
      totalResults:
        typeof payload?.totalArticles === "number"
          ? payload.totalArticles
          : articles.length,
      rateLimited,
      status,
    };
  }

  const url = new URL(`${NEWSAPI_BASE_URL}/everything`);
  url.searchParams.set("q", request.q);
  url.searchParams.set("language", request.language || "en");
  url.searchParams.set("sortBy", request.sortBy || "publishedAt");
  url.searchParams.set("pageSize", String(pageSize));

  if (request.searchIn) {
    url.searchParams.set("searchIn", request.searchIn);
  }

  if (request.excludeDomains) {
    url.searchParams.set("excludeDomains", request.excludeDomains);
  }

  const { status, payload } = await fetchJson(url, {
    method: "GET",
    headers: {
      "X-Api-Key": provider.apiKey,
    },
  });
  const rateLimited = isRateLimited(status, payload);

  if (status < 200 || status >= 300) {
    return emptyResult(status, rateLimited);
  }

  const articles = Array.isArray(payload?.articles)
    ? (payload.articles as NormalizedProviderArticle[])
    : [];

  return {
    articles,
    totalResults:
      typeof payload?.totalResults === "number"
        ? payload.totalResults
        : articles.length,
    rateLimited,
    status,
  };
}

export const NEWS_PROVIDER_CACHE_SECONDS = NEWS_CACHE_SECONDS;

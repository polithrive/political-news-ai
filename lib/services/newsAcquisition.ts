import type { HomepageArticleInput } from "@/lib/services/homepageCuration";

export type AcquisitionPool = "us-headlines" | "discovery" | "world";

export type AcquiredArticle = HomepageArticleInput & {
  acquisitionPools: AcquisitionPool[];
};

const NEWS_API_BASE_URL = "https://newsapi.org/v2";
const NEWS_CACHE_SECONDS = 300;

const AGGREGATOR_EXCLUDE_DOMAINS = "biztoc.com,slashdot.org";

const DISCOVERY_QUERY = [
  "(",
  '"White House"',
  "OR Congress",
  "OR Senate",
  'OR "Supreme Court"',
  "OR election",
  "OR legislation",
  'OR "federal reserve"',
  "OR inflation",
  "OR economy",
  'OR "artificial intelligence"',
  "OR healthcare",
  'OR "public health"',
  "OR immigration",
  "OR tariffs",
  ")",
].join(" ");

/*
 * NewsAPI developer plans do not expose a general
 * world top-headlines endpoint (country=us is the
 * national spine; world country codes would be one
 * request per country). This pool uses durable
 * institutions, diplomacy, humanitarian, and disaster
 * vocabulary instead of a hard-coded war list.
 * Limitation: local stories can still match terms
 * like "sanctions"; the curation engine must demote
 * obscure foreign-local items.
 */
const WORLD_QUERY = [
  "(",
  '"United Nations"',
  "OR NATO",
  "OR diplomacy",
  'OR "foreign minister"',
  "OR sanctions",
  "OR ceasefire",
  "OR humanitarian",
  "OR embassy",
  "OR summit",
  'OR "security council"',
  "OR earthquake",
  "OR hurricane",
  "OR cyclone",
  'OR "world bank"',
  'OR "international court"',
  'OR "red cross"',
  'OR "world health"',
  ")",
].join(" ");

type NewsApiListResponse = {
  status?: string;
  code?: string;
  message?: string;
  articles?: unknown[];
  totalResults?: number;
};

async function fetchNewsApi(
  url: string,
  apiKey: string
): Promise<NewsApiListResponse> {
  const response = await fetch(url, {
    headers: {
      "X-Api-Key": apiKey,
    },
    next: {
      revalidate: NEWS_CACHE_SECONDS,
    },
  });

  const data = (await response.json()) as NewsApiListResponse;

  if (!response.ok) {
    console.error("NewsAPI pool request failed:", {
      url,
      status: response.status,
      code: data.code,
      message: data.message,
    });
    return { articles: [], totalResults: 0 };
  }

  return data;
}

function asArticle(
  value: unknown,
  pool: AcquisitionPool
): AcquiredArticle | null {
  if (value === null || typeof value !== "object") {
    return null;
  }

  const article = value as HomepageArticleInput;
  const title = article.title?.trim();
  const url = article.url?.trim();

  if (!title || !url || title === "[Removed]") {
    return null;
  }

  return {
    ...article,
    acquisitionPools: [pool],
  };
}

function collectPool(
  articles: unknown[] | undefined,
  pool: AcquisitionPool
): AcquiredArticle[] {
  if (!Array.isArray(articles)) {
    return [];
  }

  return articles
    .map((article) => asArticle(article, pool))
    .filter((article): article is AcquiredArticle => Boolean(article));
}

function mergeAcquiredArticles(
  pools: Record<AcquisitionPool, AcquiredArticle[]>
): AcquiredArticle[] {
  const byUrl = new Map<string, AcquiredArticle>();

  (Object.keys(pools) as AcquisitionPool[]).forEach((pool) => {
    for (const article of pools[pool]) {
      const key = article.url?.trim().toLowerCase() ?? "";

      if (!key) {
        continue;
      }

      const existing = byUrl.get(key);

      if (!existing) {
        byUrl.set(key, {
          ...article,
          acquisitionPools: [pool],
        });
        continue;
      }

      if (!existing.acquisitionPools.includes(pool)) {
        existing.acquisitionPools.push(pool);
      }
    }
  });

  return Array.from(byUrl.values());
}

export type AcquisitionDiagnostics = {
  requestCount: number;
  cacheSeconds: number;
  poolCounts: Record<AcquisitionPool, number>;
  uniqueToPool: Record<AcquisitionPool, number>;
  rawTotal: number;
  afterDedupe: number;
};

export async function acquireHomepageCandidates(apiKey: string): Promise<{
  articles: AcquiredArticle[];
  diagnostics: AcquisitionDiagnostics;
}> {
  const usHeadlinesUrl = new URL(`${NEWS_API_BASE_URL}/top-headlines`);
  usHeadlinesUrl.searchParams.set("country", "us");
  usHeadlinesUrl.searchParams.set("pageSize", "50");

  const discoveryUrl = new URL(`${NEWS_API_BASE_URL}/everything`);
  discoveryUrl.searchParams.set("q", DISCOVERY_QUERY);
  discoveryUrl.searchParams.set("searchIn", "title,description");
  discoveryUrl.searchParams.set("language", "en");
  discoveryUrl.searchParams.set("sortBy", "publishedAt");
  discoveryUrl.searchParams.set("pageSize", "80");
  discoveryUrl.searchParams.set("excludeDomains", AGGREGATOR_EXCLUDE_DOMAINS);

  const worldUrl = new URL(`${NEWS_API_BASE_URL}/everything`);
  worldUrl.searchParams.set("q", WORLD_QUERY);
  worldUrl.searchParams.set("searchIn", "title,description");
  worldUrl.searchParams.set("language", "en");
  worldUrl.searchParams.set("sortBy", "popularity");
  worldUrl.searchParams.set("pageSize", "40");
  worldUrl.searchParams.set("excludeDomains", AGGREGATOR_EXCLUDE_DOMAINS);

  const [usHeadlines, discovery, world] = await Promise.all([
    fetchNewsApi(usHeadlinesUrl.toString(), apiKey),
    fetchNewsApi(discoveryUrl.toString(), apiKey),
    fetchNewsApi(worldUrl.toString(), apiKey),
  ]);

  const pools = {
    "us-headlines": collectPool(usHeadlines.articles, "us-headlines"),
    discovery: collectPool(discovery.articles, "discovery"),
    world: collectPool(world.articles, "world"),
  };

  const merged = mergeAcquiredArticles(pools);
  const uniqueToPool: Record<AcquisitionPool, number> = {
    "us-headlines": 0,
    discovery: 0,
    world: 0,
  };

  for (const article of merged) {
    if (article.acquisitionPools.length === 1) {
      uniqueToPool[article.acquisitionPools[0]] += 1;
    }
  }

  const diagnostics: AcquisitionDiagnostics = {
    requestCount: 3,
    cacheSeconds: NEWS_CACHE_SECONDS,
    poolCounts: {
      "us-headlines": pools["us-headlines"].length,
      discovery: pools.discovery.length,
      world: pools.world.length,
    },
    uniqueToPool,
    rawTotal:
      pools["us-headlines"].length +
      pools.discovery.length +
      pools.world.length,
    afterDedupe: merged.length,
  };

  console.info("Homepage acquisition:", diagnostics);

  return {
    articles: merged,
    diagnostics,
  };
}

export const NEWS_ACQUISITION_CACHE_SECONDS = NEWS_CACHE_SECONDS;

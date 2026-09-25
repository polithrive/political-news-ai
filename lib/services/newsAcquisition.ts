import type { HomepageArticleInput } from "@/lib/services/homepageCuration";
import { logOps } from "@/lib/ops/log";
import {
  GNEWS_MAX_ARTICLES_PER_REQUEST,
  fetchNewsSearch,
  fetchTopHeadlines,
  resolveNewsProvider,
} from "@/lib/services/newsProvider";

export type AcquisitionPool = "us-headlines" | "discovery" | "world";

export type AcquiredArticle = HomepageArticleInput & {
  acquisitionPools: AcquisitionPool[];
};

const NEWS_CACHE_SECONDS = 300;
const NEWSAPI_US_HEADLINES_PAGE_SIZE = 50;
const NEWSAPI_DISCOVERY_PAGE_SIZE = 80;
const NEWSAPI_WORLD_PAGE_SIZE = 40;

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
  rateLimited?: boolean;
};

let lastSuccessfulArticles: AcquiredArticle[] = [];
let lastRateLimitedAt = 0;

const RATE_LIMIT_COOLDOWN_MS = 15 * 60 * 1000;

async function fetchPool(
  pool: AcquisitionPool,
  request:
    | { kind: "headlines"; country: string; pageSize: number }
    | {
        kind: "search";
        q: string;
        sortBy: "publishedAt" | "popularity" | "relevancy";
        pageSize: number;
        searchIn?: string;
        excludeDomains?: string;
      }
): Promise<NewsApiListResponse> {
  const result =
    request.kind === "headlines"
      ? await fetchTopHeadlines({
          country: request.country,
          pageSize: request.pageSize,
        })
      : await fetchNewsSearch({
          q: request.q,
          language: "en",
          sortBy: request.sortBy,
          pageSize: request.pageSize,
          searchIn: request.searchIn,
          excludeDomains: request.excludeDomains,
        });

  if (result.status < 200 || result.status >= 300) {
    logOps(
      "newsapi_failed",
      "news",
      result.rateLimited ? `${pool}-429` : `${pool}-${result.status}`
    );
  }

  return {
    articles: result.articles,
    totalResults: result.totalResults,
    rateLimited: result.rateLimited,
  };
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
  rateLimited?: boolean;
  servedFromLastGood?: boolean;
};

function emptyPoolCounts(): Record<AcquisitionPool, number> {
  return {
    "us-headlines": 0,
    discovery: 0,
    world: 0,
  };
}

export async function acquireHomepageCandidates(): Promise<{
  articles: AcquiredArticle[];
  diagnostics: AcquisitionDiagnostics;
}> {
  const provider = resolveNewsProvider();

  if (!provider.ok) {
    return {
      articles: lastSuccessfulArticles,
      diagnostics: {
        requestCount: 0,
        cacheSeconds: NEWS_CACHE_SECONDS,
        poolCounts: emptyPoolCounts(),
        uniqueToPool: emptyPoolCounts(),
        rawTotal: lastSuccessfulArticles.length,
        afterDedupe: lastSuccessfulArticles.length,
        servedFromLastGood: lastSuccessfulArticles.length > 0,
      },
    };
  }

  const usPageSize =
    provider.name === "gnews"
      ? GNEWS_MAX_ARTICLES_PER_REQUEST
      : NEWSAPI_US_HEADLINES_PAGE_SIZE;
  const discoveryPageSize =
    provider.name === "gnews"
      ? GNEWS_MAX_ARTICLES_PER_REQUEST
      : NEWSAPI_DISCOVERY_PAGE_SIZE;
  const worldPageSize =
    provider.name === "gnews"
      ? GNEWS_MAX_ARTICLES_PER_REQUEST
      : NEWSAPI_WORLD_PAGE_SIZE;
  const inRateLimitCooldown =
    lastRateLimitedAt > 0 &&
    Date.now() - lastRateLimitedAt < RATE_LIMIT_COOLDOWN_MS;

  if (inRateLimitCooldown && lastSuccessfulArticles.length > 0) {
    console.info("Homepage acquisition: serving last-good snapshot during rate-limit cooldown.");

    return {
      articles: lastSuccessfulArticles,
      diagnostics: {
        requestCount: 0,
        cacheSeconds: NEWS_CACHE_SECONDS,
        poolCounts: emptyPoolCounts(),
        uniqueToPool: emptyPoolCounts(),
        rawTotal: lastSuccessfulArticles.length,
        afterDedupe: lastSuccessfulArticles.length,
        rateLimited: true,
        servedFromLastGood: true,
      },
    };
  }

  const [usHeadlines, discovery, world] = await Promise.all([
    fetchPool("us-headlines", {
      kind: "headlines",
      country: "us",
      pageSize: usPageSize,
    }),
    fetchPool("discovery", {
      kind: "search",
      q: DISCOVERY_QUERY,
      sortBy: "publishedAt",
      pageSize: discoveryPageSize,
      searchIn: "title,description",
      excludeDomains: AGGREGATOR_EXCLUDE_DOMAINS,
    }),
    fetchPool("world", {
      kind: "search",
      q: WORLD_QUERY,
      sortBy: "popularity",
      pageSize: worldPageSize,
      searchIn: "title,description",
      excludeDomains: AGGREGATOR_EXCLUDE_DOMAINS,
    }),
  ]);

  const rateLimited = Boolean(
    usHeadlines.rateLimited ||
      discovery.rateLimited ||
      world.rateLimited
  );

  if (rateLimited) {
    lastRateLimitedAt = Date.now();
  }

  const pools = {
    "us-headlines": collectPool(usHeadlines.articles, "us-headlines"),
    discovery: collectPool(discovery.articles, "discovery"),
    world: collectPool(world.articles, "world"),
  };

  let merged = mergeAcquiredArticles(pools);
  let servedFromLastGood = false;

  if (merged.length > 0) {
    lastSuccessfulArticles = merged;
  } else if (lastSuccessfulArticles.length > 0) {
    merged = lastSuccessfulArticles;
    servedFromLastGood = true;
    console.info("Homepage acquisition: provider returned no articles; serving last-good snapshot.");
  }
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
    rateLimited,
    servedFromLastGood,
  };

  console.info("Homepage acquisition:", diagnostics);

  return {
    articles: merged,
    diagnostics,
  };
}

export const NEWS_ACQUISITION_CACHE_SECONDS = NEWS_CACHE_SECONDS;

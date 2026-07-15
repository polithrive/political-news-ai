import type { Article } from "@/app/types/article";
import type { IntelligenceGraph } from "@/app/types/intelligenceGraph";

const GRAPH_CACHE_PREFIX =
  "politicalpulse:intelligence-graph";

const GRAPH_CACHE_VERSION = "v1";

const GRAPH_CACHE_TTL_MS =
  1000 * 60 * 60 * 6;

type CachedIntelligenceGraph = {
  version: string;
  cachedAt: number;
  expiresAt: number;
  graph: IntelligenceGraph;
};

function normalizeCacheValue(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, "");
}

function createArticleIdentifier(
  article: Article
): string {
  const normalizedTitle =
    normalizeCacheValue(
      article.title || "untitled"
    );

  const normalizedSource =
    normalizeCacheValue(
      article.source?.name ||
        "unknown-source"
    );

  return `${normalizedSource}:${normalizedTitle}`;
}

function createCacheKey(
  article: Article
): string {
  return [
    GRAPH_CACHE_PREFIX,
    GRAPH_CACHE_VERSION,
    encodeURIComponent(
      createArticleIdentifier(article)
    ),
  ].join(":");
}

function isSessionStorageAvailable(): boolean {
  try {
    return (
      typeof window !== "undefined" &&
      window.sessionStorage !== undefined
    );
  } catch {
    return false;
  }
}

function isCachedIntelligenceGraph(
  value: unknown
): value is CachedIntelligenceGraph {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return false;
  }

  const candidate =
    value as Partial<CachedIntelligenceGraph>;

  return (
    candidate.version ===
      GRAPH_CACHE_VERSION &&
    typeof candidate.cachedAt === "number" &&
    typeof candidate.expiresAt === "number" &&
    candidate.graph !== null &&
    typeof candidate.graph === "object"
  );
}

export function getCachedIntelligenceGraph(
  article: Article
): IntelligenceGraph | null {
  if (!isSessionStorageAvailable()) {
    return null;
  }

  const cacheKey =
    createCacheKey(article);

  try {
    const cachedValue =
      window.sessionStorage.getItem(
        cacheKey
      );

    if (!cachedValue) {
      console.info(
        "PoliticalPulse graph cache miss:",
        cacheKey
      );

      return null;
    }

    const parsedValue: unknown =
      JSON.parse(cachedValue);

    if (
      !isCachedIntelligenceGraph(
        parsedValue
      )
    ) {
      window.sessionStorage.removeItem(
        cacheKey
      );

      return null;
    }

    if (
      Date.now() >=
      parsedValue.expiresAt
    ) {
      window.sessionStorage.removeItem(
        cacheKey
      );

      return null;
    }

    console.info(
      "PoliticalPulse graph cache hit:",
      cacheKey
    );

    return parsedValue.graph;
  } catch (error) {
    console.warn(
      "PoliticalPulse could not read the cached Intelligence Graph:",
      error
    );

    return null;
  }
}

export function cacheIntelligenceGraph(
  article: Article,
  graph: IntelligenceGraph
): void {
  if (!isSessionStorageAvailable()) {
    return;
  }

  const cacheKey =
    createCacheKey(article);

  const cachedAt = Date.now();

  const cachedGraph: CachedIntelligenceGraph = {
    version: GRAPH_CACHE_VERSION,
    cachedAt,
    expiresAt:
      cachedAt + GRAPH_CACHE_TTL_MS,
    graph,
  };

  try {
    window.sessionStorage.setItem(
      cacheKey,
      JSON.stringify(cachedGraph)
    );

    console.info(
      "PoliticalPulse Intelligence Graph cached:",
      cacheKey
    );
  } catch (error) {
    console.warn(
      "PoliticalPulse could not cache the Intelligence Graph:",
      error
    );
  }
}

export function removeCachedIntelligenceGraph(
  article: Article
): void {
  if (!isSessionStorageAvailable()) {
    return;
  }

  try {
    window.sessionStorage.removeItem(
      createCacheKey(article)
    );
  } catch (error) {
    console.warn(
      "PoliticalPulse could not remove the cached Intelligence Graph:",
      error
    );
  }
}
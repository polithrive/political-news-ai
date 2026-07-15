import type { Article } from "@/app/types/article";
import type { IntelligenceReport } from "@/app/types/report";

const REPORT_CACHE_PREFIX =
  "politicalpulse:intelligence-report";

const REPORT_CACHE_VERSION = "v2";

const REPORT_CACHE_TTL_MS =
  1000 * 60 * 60 * 6;

type CachedReport = {
  version: string;
  cachedAt: number;
  expiresAt: number;
  report: IntelligenceReport;
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
  const articleIdentifier =
    createArticleIdentifier(article);

  return [
    REPORT_CACHE_PREFIX,
    REPORT_CACHE_VERSION,
    encodeURIComponent(articleIdentifier),
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

function isCachedReport(
  value: unknown
): value is CachedReport {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return false;
  }

  const candidate =
    value as Partial<CachedReport>;

  return (
    candidate.version ===
      REPORT_CACHE_VERSION &&
    typeof candidate.cachedAt === "number" &&
    typeof candidate.expiresAt === "number" &&
    candidate.report !== null &&
    typeof candidate.report === "object"
  );
}

export function getCachedReport(
  article: Article
): IntelligenceReport | null {
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
        "PoliticalPulse report cache miss:",
        cacheKey
      );

      return null;
    }

    const parsedValue: unknown =
      JSON.parse(cachedValue);

    if (!isCachedReport(parsedValue)) {
      window.sessionStorage.removeItem(
        cacheKey
      );

      console.info(
        "PoliticalPulse removed an invalid cached report:",
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

      console.info(
        "PoliticalPulse removed an expired cached report:",
        cacheKey
      );

      return null;
    }

    console.info(
      "PoliticalPulse report cache hit:",
      cacheKey
    );

    return parsedValue.report;
  } catch (error) {
    console.warn(
      "PoliticalPulse could not read the cached intelligence report:",
      error
    );

    try {
      window.sessionStorage.removeItem(
        cacheKey
      );
    } catch {
      // Storage is unavailable. Nothing else to do.
    }

    return null;
  }
}

export function cacheReport(
  article: Article,
  report: IntelligenceReport
): void {
  if (!isSessionStorageAvailable()) {
    return;
  }

  const cacheKey =
    createCacheKey(article);

  const cachedAt = Date.now();

  const cachedReport: CachedReport = {
    version: REPORT_CACHE_VERSION,
    cachedAt,
    expiresAt:
      cachedAt +
      REPORT_CACHE_TTL_MS,
    report,
  };

  try {
    window.sessionStorage.setItem(
      cacheKey,
      JSON.stringify(cachedReport)
    );

    console.info(
      "PoliticalPulse report cached:",
      cacheKey
    );
  } catch (error) {
    console.warn(
      "PoliticalPulse could not cache the intelligence report:",
      error
    );
  }
}

export function removeCachedReport(
  article: Article
): void {
  if (!isSessionStorageAvailable()) {
    return;
  }

  const cacheKey =
    createCacheKey(article);

  try {
    window.sessionStorage.removeItem(
      cacheKey
    );

    console.info(
      "PoliticalPulse cached report removed:",
      cacheKey
    );
  } catch (error) {
    console.warn(
      "PoliticalPulse could not remove the cached intelligence report:",
      error
    );
  }
}
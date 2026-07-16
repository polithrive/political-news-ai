import type { AnalysisResult } from "@/app/types/analysis";
import type { Article } from "@/app/types/article";

const PREVIEW_CACHE_PREFIX =
  "politicalpulse:homepage-preview";

const PREVIEW_CACHE_VERSION = "v1";

const PREVIEW_CACHE_TTL_MS =
  1000 * 60 * 60 * 6;

type CachedPreview = {
  version: string;
  cachedAt: number;
  expiresAt: number;
  preview: AnalysisResult;
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
    PREVIEW_CACHE_PREFIX,
    PREVIEW_CACHE_VERSION,
    encodeURIComponent(
      createArticleIdentifier(article)
    ),
  ].join(":");
}

function isLocalStorageAvailable(): boolean {
  try {
    return (
      typeof window !== "undefined" &&
      window.localStorage !== undefined
    );
  } catch {
    return false;
  }
}

function isCachedPreview(
  value: unknown
): value is CachedPreview {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return false;
  }

  const candidate =
    value as Partial<CachedPreview>;

  return (
    candidate.version ===
      PREVIEW_CACHE_VERSION &&
    typeof candidate.cachedAt === "number" &&
    typeof candidate.expiresAt === "number" &&
    candidate.preview !== null &&
    typeof candidate.preview === "object"
  );
}

export function getCachedPreview(
  article: Article
): AnalysisResult | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  const cacheKey =
    createCacheKey(article);

  try {
    const cachedValue =
      window.localStorage.getItem(
        cacheKey
      );

    if (!cachedValue) {
      return null;
    }

    const parsedValue: unknown =
      JSON.parse(cachedValue);

    if (!isCachedPreview(parsedValue)) {
      window.localStorage.removeItem(
        cacheKey
      );

      return null;
    }

    if (
      Date.now() >=
      parsedValue.expiresAt
    ) {
      window.localStorage.removeItem(
        cacheKey
      );

      return null;
    }

    return parsedValue.preview;
  } catch (error) {
    console.warn(
      "PoliticalPulse could not read a cached homepage preview:",
      error
    );

    try {
      window.localStorage.removeItem(
        cacheKey
      );
    } catch {
      // Storage is unavailable.
    }

    return null;
  }
}

export function cachePreview(
  article: Article,
  preview: AnalysisResult
): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  const cacheKey =
    createCacheKey(article);

  const cachedAt = Date.now();

  const cachedPreview: CachedPreview = {
    version: PREVIEW_CACHE_VERSION,
    cachedAt,
    expiresAt:
      cachedAt +
      PREVIEW_CACHE_TTL_MS,
    preview,
  };

  try {
    window.localStorage.setItem(
      cacheKey,
      JSON.stringify(cachedPreview)
    );
  } catch (error) {
    console.warn(
      "PoliticalPulse could not cache a homepage preview:",
      error
    );
  }
}

export function removeCachedPreview(
  article: Article
): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    window.localStorage.removeItem(
      createCacheKey(article)
    );
  } catch (error) {
    console.warn(
      "PoliticalPulse could not remove a cached homepage preview:",
      error
    );
  }
}
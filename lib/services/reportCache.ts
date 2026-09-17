import type { Article } from "@/app/types/article";
import type { IntelligenceReport } from "@/app/types/report";

const REPORT_CACHE_PREFIX =
  "politicalpulse:intelligence-report";

const REPORT_CACHE_VERSION = "v4";

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
    .replace(
      /[^\p{L}\p{N}\s]/gu,
      ""
    );
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
    encodeURIComponent(
      articleIdentifier
    ),
  ].join(":");
}

function isBrowser(): boolean {
  return typeof window !==
    "undefined";
}

function getLocalStorage():
  | Storage
  | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function getSessionStorage():
  | Storage
  | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    return window.sessionStorage;
  } catch {
    return null;
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
    typeof candidate.cachedAt ===
      "number" &&
    typeof candidate.expiresAt ===
      "number" &&
    candidate.report !== null &&
    typeof candidate.report ===
      "object"
  );
}

function parseCachedReport(
  storage: Storage,
  cacheKey: string
): CachedReport | null {
  const cachedValue =
    storage.getItem(cacheKey);

  if (!cachedValue) {
    return null;
  }

  const parsedValue: unknown =
    JSON.parse(cachedValue);

  if (
    !isCachedReport(parsedValue)
  ) {
    storage.removeItem(
      cacheKey
    );

    return null;
  }

  if (
    Date.now() >=
    parsedValue.expiresAt
  ) {
    storage.removeItem(
      cacheKey
    );

    return null;
  }

  return parsedValue;
}

export function getCachedReport(
  article: Article
): IntelligenceReport | null {
  const cacheKey =
    createCacheKey(article);

  const localStorage =
    getLocalStorage();

  /*
   * Primary cache:
   * persistent across refreshes,
   * navigation, tabs, and browser restarts.
   */
  if (localStorage) {
    try {
      const cachedReport =
        parseCachedReport(
          localStorage,
          cacheKey
        );

      if (cachedReport) {
        console.info(
          "PoliticalPulse persistent report cache hit:",
          cacheKey
        );

        return cachedReport.report;
      }
    } catch (error) {
      console.warn(
        "PoliticalPulse could not read the persistent report cache:",
        error
      );
    }
  }

  const sessionStorage =
    getSessionStorage();

  /*
   * Backward-compatible fallback.
   *
   * If an existing report is found in
   * sessionStorage, migrate it into
   * localStorage automatically.
   */
  if (sessionStorage) {
    try {
      const cachedReport =
        parseCachedReport(
          sessionStorage,
          cacheKey
        );

      if (cachedReport) {
        console.info(
          "PoliticalPulse session report cache hit:",
          cacheKey
        );

        if (localStorage) {
          try {
            localStorage.setItem(
              cacheKey,
              JSON.stringify(
                cachedReport
              )
            );

            console.info(
              "PoliticalPulse migrated report cache to persistent storage:",
              cacheKey
            );
          } catch (error) {
            console.warn(
              "PoliticalPulse could not migrate the report cache:",
              error
            );
          }
        }

        return cachedReport.report;
      }
    } catch (error) {
      console.warn(
        "PoliticalPulse could not read the session report cache:",
        error
      );
    }
  }

  console.info(
    "PoliticalPulse report cache miss:",
    cacheKey
  );

  return null;
}

export function cacheReport(
  article: Article,
  report: IntelligenceReport
): void {
  const cacheKey =
    createCacheKey(article);

  const cachedAt =
    Date.now();

  const cachedReport:
    CachedReport = {
    version:
      REPORT_CACHE_VERSION,

    cachedAt,

    expiresAt:
      cachedAt +
      REPORT_CACHE_TTL_MS,

    report,
  };

  const serializedReport =
    JSON.stringify(
      cachedReport
    );

  const localStorage =
    getLocalStorage();

  if (localStorage) {
    try {
      localStorage.setItem(
        cacheKey,
        serializedReport
      );

      console.info(
        "PoliticalPulse report cached persistently:",
        cacheKey
      );

      return;
    } catch (error) {
      console.warn(
        "PoliticalPulse could not persist the intelligence report:",
        error
      );
    }
  }

  /*
   * Fall back to sessionStorage if
   * persistent browser storage is
   * unavailable or full.
   */
  const sessionStorage =
    getSessionStorage();

  if (sessionStorage) {
    try {
      sessionStorage.setItem(
        cacheKey,
        serializedReport
      );

      console.info(
        "PoliticalPulse report cached for this session:",
        cacheKey
      );
    } catch (error) {
      console.warn(
        "PoliticalPulse could not cache the intelligence report:",
        error
      );
    }
  }
}

export function removeCachedReport(
  article: Article
): void {
  const cacheKey =
    createCacheKey(article);

  const localStorage =
    getLocalStorage();

  if (localStorage) {
    try {
      localStorage.removeItem(
        cacheKey
      );
    } catch (error) {
      console.warn(
        "PoliticalPulse could not remove the persistent cached report:",
        error
      );
    }
  }

  const sessionStorage =
    getSessionStorage();

  if (sessionStorage) {
    try {
      sessionStorage.removeItem(
        cacheKey
      );
    } catch (error) {
      console.warn(
        "PoliticalPulse could not remove the session cached report:",
        error
      );
    }
  }

  console.info(
    "PoliticalPulse cached report removed:",
    cacheKey
  );
}
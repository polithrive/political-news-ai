import type { Article } from "@/app/types/article";

const SELECTED_ARTICLE_KEY =
  "politicalpulse_selected_article";

function getLocalStorage():
  | Storage
  | null {
  if (typeof window === "undefined") {
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
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function parseArticle(
  value: string | null
): Article | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      value
    ) as Article;

    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof parsed.title !== "string"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveSelectedArticle(
  article: Article
): void {
  const serializedArticle =
    JSON.stringify(article);

  const localStorage =
    getLocalStorage();

  if (localStorage) {
    try {
      localStorage.setItem(
        SELECTED_ARTICLE_KEY,
        serializedArticle
      );
    } catch {
      // Fall back to session storage.
    }
  }

  const sessionStorage =
    getSessionStorage();

  if (sessionStorage) {
    try {
      sessionStorage.setItem(
        SELECTED_ARTICLE_KEY,
        serializedArticle
      );
    } catch {
      // Storage unavailable.
    }
  }
}

export function getSelectedArticle():
  | Article
  | null {
  const localStorage =
    getLocalStorage();

  if (localStorage) {
    const article =
      parseArticle(
        localStorage.getItem(
          SELECTED_ARTICLE_KEY
        )
      );

    if (article) {
      return article;
    }
  }

  const sessionStorage =
    getSessionStorage();

  if (sessionStorage) {
    const article =
      parseArticle(
        sessionStorage.getItem(
          SELECTED_ARTICLE_KEY
        )
      );

    if (article) {
      /*
       * Migrate existing session-only
       * selections into persistent storage.
       */
      if (localStorage) {
        try {
          localStorage.setItem(
            SELECTED_ARTICLE_KEY,
            JSON.stringify(article)
          );
        } catch {
          // Ignore migration failure.
        }
      }

      return article;
    }
  }

  return null;
}
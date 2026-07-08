import type { Article } from "@/types/article";

const SELECTED_ARTICLE_KEY = "politicalpulse_selected_article";

export function saveSelectedArticle(article: Article) {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(
    SELECTED_ARTICLE_KEY,
    JSON.stringify(article)
  );
}

export function getSelectedArticle(): Article | null {
  if (typeof window === "undefined") return null;

  const storedArticle = sessionStorage.getItem(SELECTED_ARTICLE_KEY);

  if (!storedArticle) return null;

  return JSON.parse(storedArticle) as Article;
}
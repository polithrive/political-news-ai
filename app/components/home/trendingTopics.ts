import type { Article } from "@/app/types/article";

export type TickerStory = {
  article: Article;
  label: string;
};

function cleanHeadline(title: string): string {
  return title.replace(/\s+[-–—|].*$/, "").trim() || title.trim();
}

export function tickerStoriesFromArticles(
  articles: Article[],
  limit = 12
): TickerStory[] {
  const stories: TickerStory[] = [];
  const seen = new Set<string>();

  for (const article of articles.slice(0, limit)) {
    const key = article.url || article.title;
    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    stories.push({
      article,
      label: cleanHeadline(article.title),
    });
  }

  return stories;
}

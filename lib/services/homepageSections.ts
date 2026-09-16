import type { Article } from "@/app/types/article";

export const HOMEPAGE_BIG_STORY_COUNT = 4;
export const HOMEPAGE_TRENDING_COUNT = 3;

export function splitHomepageSections(articles: Article[]): {
  lead: Article | null;
  bigStories: Article[];
  trending: Article[];
  moreStories: Article[];
} {
  const lead = articles[0] ?? null;
  const bigStories = articles.slice(1, 1 + HOMEPAGE_BIG_STORY_COUNT);
  const trendingStart = 1 + HOMEPAGE_BIG_STORY_COUNT;
  const trending = articles.slice(
    trendingStart,
    trendingStart + HOMEPAGE_TRENDING_COUNT
  );
  const moreStories = articles.slice(
    trendingStart + HOMEPAGE_TRENDING_COUNT
  );

  return {
    lead,
    bigStories,
    trending,
    moreStories,
  };
}

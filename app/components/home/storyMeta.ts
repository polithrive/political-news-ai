import type { Article } from "@/app/types/article";

export function storyCategory(article: Article): string {
  if (article.curation?.category) {
    return article.curation.category;
  }

  return "Other";
}

export function relativeTime(
  publishedAt: string,
  now = Date.now()
): string {
  const published = new Date(publishedAt);
  if (Number.isNaN(published.getTime())) {
    return "";
  }

  const diffMs = now - published.getTime();
  const minutes = Math.max(0, Math.round(diffMs / 60000));

  if (minutes < 60) {
    return `${Math.max(1, minutes)}m ago`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

const NAMED_TOPICS = [
  "U.S. Politics",
  "World",
  "Economy",
  "Technology",
  "Health",
  "Business",
];

export function matchesTopicFilter(
  article: Article,
  filter: string
): boolean {
  if (filter === "All") {
    return true;
  }

  const category = storyCategory(article);

  if (filter === "More") {
    return !NAMED_TOPICS.includes(category);
  }

  return category === filter;
}

import type { Article } from "@/app/types/article";

const CATEGORY_RULES: { label: string; keywords: string[] }[] = [
  {
    label: "U.S. Politics",
    keywords: [
      "united states",
      "u.s.",
      "washington",
      "white house",
      "congress",
      "senate",
      "trump",
      "biden",
    ],
  },
  {
    label: "World",
    keywords: [
      "ukraine",
      "russia",
      "china",
      "israel",
      "gaza",
      "europe",
      "nato",
      "india",
      "iran",
    ],
  },
  {
    label: "Economy",
    keywords: [
      "economy",
      "inflation",
      "market",
      "fed ",
      "tariff",
      "trade",
      "jobs",
      "gdp",
    ],
  },
  {
    label: "Technology",
    keywords: [
      "tech",
      "ai ",
      "artificial intelligence",
      "software",
      "cyber",
      "apple",
      "google",
    ],
  },
  {
    label: "Health",
    keywords: ["health", "hospital", "vaccine", "fda", "medical", "covid"],
  },
  {
    label: "Business",
    keywords: ["business", "company", "ceo", "earnings", "merger", "startup"],
  },
];

export function storyCategory(article: Article): string {
  const haystack = `${article.title} ${article.description}`.toLowerCase();

  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((keyword) => haystack.includes(keyword))) {
      return rule.label;
    }
  }

  return "Politics";
}

export function relativeTime(
  publishedAt: string,
  now = Date.now()
): string {
  const published = new Date(publishedAt);
  if (Number.isNaN(published.getTime())) {
    return "";
  }

  const diffMs = Date.now() - published.getTime();
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

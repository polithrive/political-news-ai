import type { Article } from "@/app/types/article";

export async function getLatestNews(): Promise<Article[]> {
  const response = await fetch("/api/news");

  if (!response.ok) {
    throw new Error("Failed to fetch news.");
  }

  const data = await response.json();

  return data.articles || [];
}
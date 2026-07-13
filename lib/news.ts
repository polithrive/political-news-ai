import type { Article } from "@/app/types/article";

const NEWS_REQUEST_TIMEOUT_MS = 15_000;

type NewsApiResponse = {
  articles?: Article[];
  error?: string;
  message?: string;
};

export async function getLatestNews(): Promise<Article[]> {
  const controller = new AbortController();

  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, NEWS_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch("/api/news", {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    const data = (await response.json()) as NewsApiResponse;

    if (!response.ok) {
      throw new Error(
        data.error ||
          data.message ||
          `Failed to fetch news. Status: ${response.status}`
      );
    }

    if (!Array.isArray(data.articles)) {
      throw new Error(
        "The news API returned an invalid articles response."
      );
    }

    return data.articles;
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      throw new Error(
        "The live news request timed out. Please try again."
      );
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
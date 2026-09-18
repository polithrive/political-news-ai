import {
  assertSafePublicHttpUrl,
  isBlockedHostname,
} from "@/lib/security/publicUrl";

export type ExtractedArticle = {
  url: string;
  title: string;
  content: string;
  description: string;
  author: string;
  image: string;
  published: string;
  source: string;
};

export function normalizeArticleUrl(input: string) {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new Error("Article URL is required.");
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(trimmed);
  } catch {
    throw new Error("Please enter a valid article URL.");
  }

  assertSafePublicHttpUrl(parsedUrl);

  parsedUrl.hash = "";

  return parsedUrl.toString();
}

export function toSafePublicArticleUrl(candidate: string, fallback: string) {
  try {
    const normalized = normalizeArticleUrl(candidate);
    const parsed = new URL(normalized);

    if (isBlockedHostname(parsed.hostname)) {
      return fallback;
    }

    return normalized;
  } catch {
    return fallback;
  }
}

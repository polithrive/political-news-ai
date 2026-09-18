import { createSlug } from "@/lib/createSlug";
import { tryBuildStoryKey } from "@/lib/services/storyKey";

export const INTELLIGENCE_URL_PARAM = "u";

export type IntelligenceUrlParseResult =
  | { ok: true; articleUrl: string }
  | { ok: false; reason: "missing" | "malformed" };

export function canonicalArticleUrl(input: string): string | null {
  const trimmed = input.trim();

  if (!trimmed) {
    return null;
  }

  return tryBuildStoryKey(trimmed);
}

export function articleUrlsMatch(left: string, right: string): boolean {
  const leftKey = canonicalArticleUrl(left);
  const rightKey = canonicalArticleUrl(right);

  return Boolean(leftKey && rightKey && leftKey === rightKey);
}

export function intelligenceSlug(title: string): string {
  return createSlug(title) || "story";
}

export function createIntelligenceHref(input: {
  title: string;
  url: string;
}): string | null {
  const articleUrl = canonicalArticleUrl(input.url);

  if (!articleUrl) {
    return null;
  }

  const slug = intelligenceSlug(input.title);
  const search = new URLSearchParams({
    [INTELLIGENCE_URL_PARAM]: articleUrl,
  });

  return `/intelligence/${slug}?${search.toString()}`;
}

export function parseIntelligenceArticleUrl(
  raw: string | string[] | null | undefined
): IntelligenceUrlParseResult {
  const value = Array.isArray(raw) ? raw[0] : raw;

  if (typeof value !== "string" || !value.trim()) {
    return { ok: false, reason: "missing" };
  }

  const articleUrl = canonicalArticleUrl(value);

  if (!articleUrl) {
    return { ok: false, reason: "malformed" };
  }

  return { ok: true, articleUrl };
}

export function intelligenceSlugMatchesTitle(
  slug: string,
  title: string
): boolean {
  return intelligenceSlug(title) === slug;
}

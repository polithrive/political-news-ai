import { extract } from "@extractus/article-extractor";

import { fetchPublicArticleHtml } from "@/lib/security/ssrf";
import {
  normalizeArticleUrl,
  toSafePublicArticleUrl,
  type ExtractedArticle,
} from "@/lib/services/articleExtractor";

function cleanText(value?: string | null) {
  return value?.trim() ?? "";
}

export async function extractArticle(
  inputUrl: string
): Promise<ExtractedArticle | null> {
  const url = normalizeArticleUrl(inputUrl);

  try {
    const fetched = await fetchPublicArticleHtml(url);
    const article = await extract(fetched.html, {
      contentLengthThreshold: 300,
      descriptionLengthThreshold: 100,
    });

    if (!article) {
      return null;
    }

    const title = cleanText(article.title);
    const content = cleanText(article.content);
    const description = cleanText(article.description);

    if (!title || (!content && !description)) {
      return null;
    }

    const resolvedUrl = toSafePublicArticleUrl(
      cleanText(article.url) || fetched.finalUrl,
      fetched.finalUrl
    );

    return {
      url: resolvedUrl,
      title,
      content,
      description,
      author: cleanText(article.author),
      image: cleanText(article.image),
      published: cleanText(article.published),
      source:
        cleanText(article.source) ||
        new URL(resolvedUrl).hostname.replace(/^www\./, ""),
    };
  } catch (error) {
    console.error("Article extraction failed:", {
      url,
      error,
    });

    return null;
  }
}

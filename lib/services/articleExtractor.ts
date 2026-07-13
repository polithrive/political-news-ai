import { extract } from "@extractus/article-extractor";

export async function extractArticle(url: string) {
  try {
    const article = await extract(url);

    if (!article) {
      return null;
    }

    return {
      title: article.title ?? "",
      content: article.content ?? "",
      description: article.description ?? "",
      author: article.author ?? "",
      image: article.image ?? "",
      published: article.published ?? "",
    };
  } catch (error) {
    console.error("Article extraction failed:", error);

    return null;
  }
}
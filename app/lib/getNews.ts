import { fetchTopHeadlines, resolveNewsProvider } from "@/lib/services/newsProvider";

export type Article = {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
};

export async function getNews(): Promise<Article[]> {
  const provider = resolveNewsProvider();

  if (!provider.ok || provider.name !== "newsapi") {
    return [];
  }

  const result = await fetchTopHeadlines({
    country: "us",
    pageSize: 10,
  });

  return result.articles.map((article) => ({
    title: article.title ?? "",
    description: article.description ?? "",
    url: article.url ?? "",
    urlToImage: article.urlToImage ?? "",
    publishedAt: article.publishedAt ?? "",
    source: {
      name: article.source?.name ?? "",
    },
  }));
}

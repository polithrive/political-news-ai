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
  const response = await fetch("http://localhost:3000/api/news", {
    cache: "no-store",
  });

  const data = await response.json();

  return data.articles || [];
}
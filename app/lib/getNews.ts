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
  const response = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&category=general&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`,
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  return data.articles || [];
}
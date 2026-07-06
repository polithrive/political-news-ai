"use client";

import { useEffect, useState } from "react";

type Article = {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
};

export default function LiveNews() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [summaries, setSummaries] = useState<Record<number, string>>({});

  useEffect(() => {
    async function getNews() {
      const response = await fetch("/api/news");
      const data = await response.json();
      const articlesList = data.articles || [];

      setArticles(articlesList);

      articlesList.slice(0, 6).forEach(async (article: Article, index: number) => {
        const summaryResponse = await fetch("/api/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: article.title,
            description: article.description,
          }),
        });

        if (!summaryResponse.ok) {
  setSummaries((prev) => ({
    ...prev,
    [index]: "AI summary failed to generate.",
  }));
  return;
}

const summaryData = await summaryResponse.json();

        setSummaries((prev) => ({
          ...prev,
          [index]: summaryData.summary,
        }));
      });
    }

    getNews();
  }, []);

  if (articles.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold mb-6">Live News</h2>
        <p className="text-gray-400">Loading live articles...</p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <h2 className="text-3xl font-bold mb-6">Live News</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.slice(0, 6).map((article, index) => (
          <div
            key={article.url}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-red-500 transition"
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="mb-5 h-48 w-full rounded-xl object-cover"
              />
            )}

            <p className="text-red-500 font-semibold text-sm uppercase">
              {article.source.name}
            </p>

            <p className="text-gray-500 text-sm mt-1">
              Published: {new Date(article.publishedAt).toLocaleString()}
            </p>

            <p className="inline-block mt-3 rounded-full bg-slate-800 px-3 py-1 text-sm text-gray-300">
              General News
            </p>

            <p className="inline-block ml-2 mt-3 rounded-full bg-slate-800 px-3 py-1 text-sm text-gray-300">
              Perspective: Neutral
            </p>

            <h3 className="text-2xl font-bold mt-4">{article.title}</h3>

            <p className="text-gray-400 mt-4">{article.description}</p>

            <div className="mt-5 rounded-xl bg-slate-800 p-4">
              <p className="text-sm font-semibold text-red-500">AI SUMMARY</p>
              <p className="mt-2 text-sm text-gray-300">
                {summaries[index] || "Generating AI summary..."}
              </p>
            </div>

            <a
              href={`/article/${index + 1}`}
              className="inline-block mt-6 bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold transition"
            >
              Read Analysis →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
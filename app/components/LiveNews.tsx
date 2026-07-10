"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { AnalysisResult } from "../types/analysis";
import type { Article } from "../types/article";

import AIAnalysisCard from "./AIAnalysisCard";

import { analyzeArticle } from "../lib/analysis";
import { getLatestNews } from "../../lib/news";
import { saveSelectedArticle } from "../../lib/selectedArticle";

export default function LiveNews() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [analysisResults, setAnalysisResults] = useState<
    Record<number, AnalysisResult>
  >({});

  useEffect(() => {
    async function loadNews() {
      const articlesList = await getLatestNews();

      setArticles(articlesList);

      articlesList.slice(0, 6).forEach(async (article, index) => {
        const analysisData = await analyzeArticle(article);

        setAnalysisResults((previousResults) => ({
          ...previousResults,
          [index]: analysisData,
        }));
      });
    }

    loadNews();
  }, []);

  if (articles.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-8 py-16">
        <h2 className="mb-6 text-3xl font-bold">
          Live News
        </h2>

        <p className="text-gray-400">
          Loading live articles...
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-8 py-16">
      <h2 className="mb-6 text-3xl font-bold">
        Live News
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 6).map((article, index) => {
          const analysis = analysisResults[index];

          return (
            <article
              key={article.url}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-red-500"
            >
              {article.urlToImage && (
                <div className="relative mb-5 h-48 w-full overflow-hidden rounded-xl">
                  <Image
                    src={article.urlToImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              <p className="text-sm font-semibold uppercase text-red-500">
                {article.source.name}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Published:{" "}
                {new Date(article.publishedAt).toLocaleString()}
              </p>

              <p className="mt-3 inline-block rounded-full bg-slate-800 px-3 py-1 text-sm text-gray-300">
                General News
              </p>

              <p className="ml-2 mt-3 inline-block rounded-full bg-slate-800 px-3 py-1 text-sm text-gray-300">
                Perspective: {analysis?.lean ?? "Analyzing..."}
              </p>

              <h3 className="mt-4 text-2xl font-bold">
                {article.title}
              </h3>

              <p className="mt-4 text-gray-400">
                {article.description}
              </p>

              {analysis ? (
                <AIAnalysisCard
                  {...analysis}
                  factCheck={
                    typeof analysis.factCheck === "string"
                      ? analysis.factCheck
                      : `${analysis.factCheck.verdict}: ${analysis.factCheck.explanation}`
                  }
                />
              ) : (
                <div className="mt-5 rounded-xl bg-slate-800 p-4">
                  <p className="text-sm font-semibold text-red-500">
                    AI ANALYSIS
                  </p>

                  <p className="mt-2 text-sm text-gray-300">
                    Generating AI analysis...
                  </p>
                </div>
              )}

              <Link
                href={`/intelligence/${index + 1}`}
                onClick={() => saveSelectedArticle(article)}
                className="mt-6 inline-block rounded-lg bg-red-600 px-5 py-2 font-semibold transition hover:bg-red-700"
              >
                Open Intelligence Report →
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
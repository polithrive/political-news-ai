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
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<
    string | null
  >(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadArticleAnalysis(
      article: Article,
      index: number
    ) {
      try {
        const analysisData =
          await analyzeArticle(article);

        if (!isCancelled) {
          setAnalysisResults((previousResults) => ({
            ...previousResults,
            [index]: analysisData,
          }));
        }
      } catch (error) {
        console.error(
          `Failed to analyze article ${index + 1}:`,
          error
        );
      }
    }

    async function loadNews() {
      try {
        setErrorMessage(null);

        const articlesList =
          await getLatestNews();

        if (isCancelled) {
          return;
        }

        if (articlesList.length === 0) {
          setErrorMessage(
            "PoliticalPulse did not receive any live articles."
          );
          return;
        }

        setArticles(articlesList);

        articlesList
          .slice(0, 6)
          .forEach((article, index) => {
            void loadArticleAnalysis(
              article,
              index
            );
          });
      } catch (error) {
        console.error(
          "Failed to load live news:",
          error
        );

        if (!isCancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "PoliticalPulse could not load live news."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadNews();

    return () => {
      isCancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-8 py-16">
        <h2 className="mb-6 text-3xl font-bold">
          Live News
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
              />
            )
          )}
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="mx-auto max-w-7xl px-8 py-16">
        <h2 className="mb-6 text-3xl font-bold">
          Live News
        </h2>

        <div className="rounded-2xl border border-red-900/60 bg-red-950/20 p-6">
          <p className="font-semibold text-red-400">
            Live news could not be loaded.
          </p>

          <p className="mt-2 text-slate-300">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-lg bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-500"
          >
            Try again
          </button>
        </div>
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
              key={article.url || `${article.title}-${index}`}
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
                {article.source?.name ||
                  "Unknown Source"}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Published:{" "}
                {article.publishedAt
                  ? new Date(
                      article.publishedAt
                    ).toLocaleString()
                  : "Date unavailable"}
              </p>

              <p className="mt-3 inline-block rounded-full bg-slate-800 px-3 py-1 text-sm text-gray-300">
                General News
              </p>

              <p className="ml-2 mt-3 inline-block rounded-full bg-slate-800 px-3 py-1 text-sm text-gray-300">
                Perspective:{" "}
                {analysis?.lean ?? "Analyzing..."}
              </p>

              <h3 className="mt-4 text-2xl font-bold">
                {article.title}
              </h3>

              <p className="mt-4 text-gray-400">
                {article.description ||
                  "No article description is available."}
              </p>

              {analysis ? (
                <AIAnalysisCard
                  {...analysis}
                  factCheck={
                    typeof analysis.factCheck ===
                    "string"
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
                onClick={() =>
                  saveSelectedArticle(article)
                }
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
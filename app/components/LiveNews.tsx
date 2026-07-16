"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { AnalysisResult } from "../types/analysis";
import type { Article } from "../types/article";

import AIAnalysisCard from "./AIAnalysisCard";

import { analyzeArticle } from "../lib/analysis";
import { getLatestNews } from "../../lib/news";
import { saveSelectedArticle } from "../../lib/selectedArticle";

const MAX_VISIBLE_ARTICLES = 6;
const IMMEDIATE_ANALYSIS_COUNT = 2;
const DEFERRED_ANALYSIS_ROOT_MARGIN = "350px";

export default function LiveNews() {
  const [articles, setArticles] =
    useState<Article[]>([]);

  const [analysisResults, setAnalysisResults] =
    useState<Record<number, AnalysisResult>>({});

  const [requestedAnalysis, setRequestedAnalysis] =
    useState<Record<number, boolean>>({});

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const requestedIndexesRef =
    useRef<Set<number>>(new Set());

  useEffect(() => {
    let isCancelled = false;

    async function loadNews() {
      try {
        setErrorMessage(null);
        setAnalysisResults({});
        setRequestedAnalysis({});

        requestedIndexesRef.current.clear();

        const articlesList =
          await getLatestNews();

        if (isCancelled) {
          return;
        }

        const visibleArticles =
          articlesList.slice(
            0,
            MAX_VISIBLE_ARTICLES
          );

        if (
          visibleArticles.length === 0
        ) {
          setErrorMessage(
            "PoliticalPulse did not receive any live articles."
          );

          return;
        }

        setArticles(visibleArticles);
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

  useEffect(() => {
    if (articles.length === 0) {
      return;
    }

    let isCancelled = false;

    async function requestAnalysis(
      index: number
    ) {
      if (
        isCancelled ||
        requestedIndexesRef.current.has(
          index
        )
      ) {
        return;
      }

      const article = articles[index];

      if (!article) {
        return;
      }

      requestedIndexesRef.current.add(
        index
      );

      setRequestedAnalysis(
        (previousState) => ({
          ...previousState,
          [index]: true,
        })
      );

      try {
        const analysisData =
          await analyzeArticle(article);

        if (!isCancelled) {
          setAnalysisResults(
            (previousResults) => ({
              ...previousResults,
              [index]: analysisData,
            })
          );
        }
      } catch (error) {
        console.error(
          `Failed to analyze article ${
            index + 1
          }:`,
          error
        );
      }
    }

    const immediateCount = Math.min(
      IMMEDIATE_ANALYSIS_COUNT,
      articles.length
    );

    for (
      let index = 0;
      index < immediateCount;
      index += 1
    ) {
      void requestAnalysis(index);
    }

    if (
      typeof IntersectionObserver ===
      "undefined"
    ) {
      for (
        let index = immediateCount;
        index < articles.length;
        index += 1
      ) {
        void requestAnalysis(index);
      }

      return () => {
        isCancelled = true;
      };
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            const indexValue =
              entry.target.getAttribute(
                "data-analysis-index"
              );

            const index = Number(
              indexValue
            );

            if (
              !Number.isInteger(index)
            ) {
              return;
            }

            observer.unobserve(
              entry.target
            );

            void requestAnalysis(index);
          });
        },
        {
          root: null,
          rootMargin:
            DEFERRED_ANALYSIS_ROOT_MARGIN,
          threshold: 0.01,
        }
      );

    const deferredCards =
      document.querySelectorAll<HTMLElement>(
        "[data-deferred-analysis='true']"
      );

    deferredCards.forEach((card) => {
      observer.observe(card);
    });

    return () => {
      isCancelled = true;
      observer.disconnect();
    };
  }, [articles]);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-8 py-16">
        <h2 className="mb-6 text-3xl font-bold">
          Live News
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({
            length: MAX_VISIBLE_ARTICLES,
          }).map((_, index) => (
            <div
              key={index}
              className="h-96 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
            />
          ))}
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
            onClick={() =>
              window.location.reload()
            }
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
        {articles.map(
          (article, index) => {
            const analysis =
              analysisResults[index];

            const isAnalysisRequested =
              Boolean(
                requestedAnalysis[index]
              );

            const isDeferred =
              index >=
              IMMEDIATE_ANALYSIS_COUNT;

            return (
              <article
                key={
                  article.url ||
                  `${article.title}-${index}`
                }
                data-analysis-index={index}
                data-deferred-analysis={
                  isDeferred
                    ? "true"
                    : "false"
                }
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-red-500"
              >
                {article.urlToImage && (
                  <div className="relative mb-5 h-48 w-full overflow-hidden rounded-xl">
                    <Image
                      src={
                        article.urlToImage
                      }
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
                  {analysis?.lean ??
                    (isAnalysisRequested
                      ? "Analyzing..."
                      : "Available on view")}
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
                      {isAnalysisRequested
                        ? "Generating AI analysis..."
                        : "AI analysis will load as this story approaches the screen."}
                    </p>
                  </div>
                )}

                <Link
                  prefetch={false}
                  href={`/intelligence/${
                    index + 1
                  }`}
                  onClick={() =>
                    saveSelectedArticle(
                      article
                    )
                  }
                  className="mt-6 inline-block rounded-lg bg-red-600 px-5 py-2 font-semibold transition hover:bg-red-700"
                >
                  Open Intelligence Report
                  →
                </Link>
              </article>
            );
          }
        )}
      </div>
    </section>
  );
}
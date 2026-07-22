"use client";

import Image from "next/image";
import Link from "next/link";

import type { AnalysisResult } from "../types/analysis";
import type { Article } from "../types/article";

import AIAnalysisCard from "./AIAnalysisCard";

import { createSlug } from "@/lib/createSlug";
import { saveSelectedArticle } from "../../lib/selectedArticle";

const MAX_VISIBLE_ARTICLES = 6;

type LiveNewsProps = {
  articles: Article[];
  analysisResults: Record<number, AnalysisResult>;
  featuredAnalysis: AnalysisResult | null;
  isLoading: boolean;
  errorMessage: string | null;
};

export default function LiveNews({
  articles,
  analysisResults,
  isLoading,
  errorMessage,
}: LiveNewsProps) {
  if (isLoading) {
    return (
      <section
        id="live-news"
        className="mx-auto max-w-7xl px-8 py-16"
      >
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
      <section
        id="live-news"
        className="mx-auto max-w-7xl px-8 py-16"
      >
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
        </div>
      </section>
    );
  }

  return (
    <section
      id="live-news"
      className="mx-auto max-w-7xl px-8 py-16"
    >
      <h2 className="mb-6 text-3xl font-bold">
        Live News
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => {
          const analysis =
  analysisResults[index] ??
  null;
          return (
            <article
              key={
                article.url ||
                `${article.title}-${index}`
              }
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
                {article.source?.name ??
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
                  "Available on view"}
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
                    Full intelligence available when opened.
                  </p>
                </div>
              )}

              <Link
                prefetch={false}
                href={`/intelligence/${createSlug(article.title)}`}
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
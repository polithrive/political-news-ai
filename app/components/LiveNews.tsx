"use client";

import Image from "next/image";
import Link from "next/link";

import type { AnalysisResult } from "../types/analysis";
import type { Article } from "../types/article";

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

type IntelligenceMetricProps = {
  label: string;
  value: string;
};

function formatPublishedDate(
  publishedAt: string | undefined
): string {
  if (!publishedAt) {
    return "Date unavailable";
  }

  const publishedDate = new Date(publishedAt);

  if (Number.isNaN(publishedDate.getTime())) {
    return "Date unavailable";
  }

  return publishedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function calculateReadingTime(
  article: Article
): number {
  const articleText = [
    article.title,
    article.description,
  ]
    .filter(Boolean)
    .join(" ");

  const wordCount = articleText
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(
    1,
    Math.ceil(wordCount / 200)
  );
}

function formatFactCheck(
  analysis: AnalysisResult
): string {
  if (typeof analysis.factCheck === "string") {
    return analysis.factCheck;
  }

  return `${analysis.factCheck.verdict}: ${analysis.factCheck.explanation}`;
}

function getLeanStyles(
  lean: string | undefined
): string {
  const normalizedLean =
    lean?.trim().toLowerCase();

  if (
    normalizedLean === "left" ||
    normalizedLean === "progressive"
  ) {
    return "border-blue-500/20 bg-blue-500/10 text-blue-300";
  }

  if (
    normalizedLean === "right" ||
    normalizedLean === "conservative"
  ) {
    return "border-red-500/20 bg-red-500/10 text-red-300";
  }

  if (
    normalizedLean === "center" ||
    normalizedLean === "centrist"
  ) {
    return "border-violet-500/20 bg-violet-500/10 text-violet-300";
  }

  return "border-slate-700 bg-slate-800 text-slate-300";
}

function IntelligenceMetric({
  label,
  value,
}: IntelligenceMetricProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-200">
        {value}
      </p>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70">
      <div className="h-48 animate-pulse bg-slate-800" />

      <div className="p-6">
        <div className="h-3 w-28 animate-pulse rounded bg-slate-800" />

        <div className="mt-5 h-7 w-full animate-pulse rounded bg-slate-800" />

        <div className="mt-3 h-7 w-4/5 animate-pulse rounded bg-slate-800" />

        <div className="mt-6 h-20 animate-pulse rounded-xl bg-slate-800" />

        <div className="mt-6 grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-12 animate-pulse rounded-lg bg-slate-800"
              />
            )
          )}
        </div>

        <div className="mt-6 h-11 animate-pulse rounded-xl bg-slate-800" />
      </div>
    </div>
  );
}

export default function LiveNews({
  articles,
  analysisResults,
  isLoading,
  errorMessage,
}: LiveNewsProps) {
  const visibleArticles = articles.slice(
    0,
    MAX_VISIBLE_ARTICLES
  );

  if (isLoading) {
    return (
      <section
        id="live-news"
        aria-labelledby="live-news-heading"
        className="border-t border-slate-900"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:py-20">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-500">
              Live Intelligence
            </p>

            <h2
              id="live-news-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Latest stories under analysis
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
              PoliticalPulse is gathering the latest
              reporting and preparing intelligence
              previews.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({
              length: MAX_VISIBLE_ARTICLES,
            }).map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section
        id="live-news"
        aria-labelledby="live-news-heading"
        className="border-t border-slate-900"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-500">
            Live Intelligence
          </p>

          <h2
            id="live-news-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Latest political intelligence
          </h2>

          <div className="mt-8 rounded-2xl border border-red-900/60 bg-red-950/20 p-6">
            <p className="font-semibold text-red-400">
              Live news could not be loaded.
            </p>

            <p className="mt-2 leading-7 text-slate-300">
              {errorMessage}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (visibleArticles.length === 0) {
    return (
      <section
        id="live-news"
        aria-labelledby="live-news-heading"
        className="border-t border-slate-900"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-500">
            Live Intelligence
          </p>

          <h2
            id="live-news-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Latest political intelligence
          </h2>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center">
            <p className="font-semibold text-white">
              No current stories are available.
            </p>

            <p className="mt-2 text-slate-400">
              New intelligence reports will appear
              here when reporting becomes available.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="live-news"
      aria-labelledby="live-news-heading"
      className="border-t border-slate-900"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:py-20">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-500">
              Live Intelligence
            </p>

            <h2
              id="live-news-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Understand what is happening now
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
              Explore the latest political stories
              with AI-generated summaries, perspective
              signals, and evidence-based analysis.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            <span>
              {visibleArticles.length} active{" "}
              {visibleArticles.length === 1
                ? "story"
                : "stories"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleArticles.map(
            (article, index) => {
              const analysis =
                analysisResults[index] ?? null;

              const sourceName =
                article.source?.name ??
                "Unknown Source";

              const readingTime =
                calculateReadingTime(article);

              const reportRoute =
                `/intelligence/${createSlug(
                  article.title
                )}`;

              return (
                <article
                  key={
                    article.url ||
                    `${article.title}-${index}`
                  }
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 transition duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-800">
                    {article.urlToImage ? (
                      <Image
                        src={article.urlToImage}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.12),transparent_65%)]">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                          PoliticalPulse
                        </p>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                      <span className="max-w-[70%] truncate rounded-full border border-white/10 bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                        {sourceName}
                      </span>

                      <span className="rounded-full border border-white/10 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-300 backdrop-blur">
                        {readingTime} min
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300">
                        Political News
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getLeanStyles(
                          analysis?.lean
                        )}`}
                      >
                        {analysis?.lean
                          ? `${analysis.lean} framing`
                          : "Perspective pending"}
                      </span>
                    </div>

                    <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                      {formatPublishedDate(
                        article.publishedAt
                      )}
                    </p>

                    <h3 className="mt-3 text-xl font-bold leading-8 text-white">
                      {article.title}
                    </h3>

                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
                      {analysis?.summary ||
                        article.description ||
                        "Open the intelligence report for a complete analysis of this story."}
                    </p>

                    <div className="mt-6 grid grid-cols-3 gap-3 border-y border-slate-800 py-5">
                      <IntelligenceMetric
                        label="Bias"
                        value={
                          analysis
                            ? `${analysis.biasScore}/100`
                            : "Pending"
                        }
                      />

                      <IntelligenceMetric
                        label="Confidence"
                        value={
                          analysis
                            ? `${analysis.confidence}%`
                            : "Pending"
                        }
                      />

                      <IntelligenceMetric
                        label="Facts"
                        value={
                          analysis
                            ? String(
                                analysis.keyFacts
                                  .length
                              )
                            : "Pending"
                        }
                      />
                    </div>

                    {analysis ? (
                      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                          Fact-check signal
                        </p>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300">
                          {formatFactCheck(
                            analysis
                          )}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-5 rounded-2xl border border-amber-500/10 bg-amber-500/5 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-400">
                          Analysis available on open
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          Open the full report to
                          review perspectives,
                          evidence, and common
                          ground.
                        </p>
                      </div>
                    )}

                    <div className="mt-auto pt-6">
                      <Link
                        prefetch={false}
                        href={reportRoute}
                        onClick={() =>
                          saveSelectedArticle(
                            article
                          )
                        }
                        className="flex w-full items-center justify-between rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                      >
                        <span>
                          Open Intelligence Report
                        </span>

                        <span aria-hidden="true">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}
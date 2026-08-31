"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import type { AnalysisResult } from "@/app/types/analysis";
import type { Article } from "@/app/types/article";
import type { IntelligencePreview } from "@/app/types/intelligencePreview";

import { createSlug } from "@/lib/createSlug";
import { saveSelectedArticle } from "@/lib/selectedArticle";

type HomeDashboardProps = {
  articles: Article[];
  analysisResults: Record<number, AnalysisResult>;
  featuredArticle: Article | null;
  featuredAnalysis: IntelligencePreview | null;
  isLoading: boolean;
  errorMessage: string | null;
  onTopicSelect: (topic: string) => void;
};

type ArticleImageProps = {
  src?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  fallbackLabel?: string;
};

type SidebarProps = {
  featuredArticle: Article | null;
};

const topics = [
  "Supreme Court",
  "Congress",
  "Immigration",
  "Economy",
  "Healthcare",
  "Foreign Policy",
];

function ArticleImage({
  src,
  sizes,
  priority = false,
  className = "object-cover",
  fallbackLabel = "PoliticalPulse",
}: ArticleImageProps) {
  const [imageFailed, setImageFailed] =
    useState(false);

  const hasUsableImage =
    Boolean(src) && !imageFailed;

  if (!hasUsableImage) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-500/10 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-xs font-black text-white shadow-lg">
            P
          </div>

          <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-red-400">
            {fallbackLabel}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src as string}
      alt=""
      fill
      priority={priority}
      unoptimized
      sizes={sizes}
      className={className}
      onError={() =>
        setImageFailed(true)
      }
    />
  );
}

function StoryLink({
  article,
  label = "Open Intelligence Report",
}: {
  article: Article;
  label?: string;
}) {
  return (
    <Link
      href={`/intelligence/${createSlug(
        article.title
      )}`}
      prefetch={false}
      onClick={() =>
        saveSelectedArticle(article)
      }
      className="inline-flex items-center gap-2 text-sm font-bold text-red-400 transition hover:text-red-300"
    >
      {label}
      <span aria-hidden="true">→</span>
    </Link>
  );
}

function MetricBar({
  value,
  tone,
}: {
  value: number;
  tone: "red" | "emerald" | "violet";
}) {
  const clampedValue = Math.max(
    0,
    Math.min(100, value)
  );

  const barClass =
    tone === "emerald"
      ? "bg-emerald-500"
      : tone === "violet"
        ? "bg-violet-500"
        : "bg-red-500";

  return (
    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
      <div
        className={`h-full rounded-full ${barClass}`}
        style={{
          width: `${Math.max(
            clampedValue,
            clampedValue > 0 ? 4 : 0
          )}%`,
        }}
      />
    </div>
  );
}

function Sidebar({
  featuredArticle,
}: SidebarProps) {
  const reportBaseHref =
    featuredArticle
      ? `/intelligence/${createSlug(
          featuredArticle.title
        )}`
      : null;

  const intelligenceItems = [
    {
      label: "Trust Score",
      section: "trust-score",
    },
    {
      label: "Perspective Analysis",
      section: "perspective-analysis",
    },
    {
      label: "Fact Check",
      section: "fact-check",
    },
    {
      label: "Source Comparison",
      section: "source-comparison",
    },
  ];

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-28 rounded-3xl border border-slate-800 bg-slate-900/50 p-4">
        <div>
          <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
            Discover
          </p>

          <div className="space-y-1">
            <Link
              href="/"
              className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/#top-stories"
              className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
            >
              Top Stories
            </Link>

            <Link
              href="/#top-stories"
              className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
            >
              Trending
            </Link>

            <Link
              href="/#topics"
              className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
            >
              Topics
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-800 pt-6">
          <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
            Intelligence
          </p>

          <div className="space-y-1">
            {intelligenceItems.map(
              (item) => {
                if (
                  !featuredArticle ||
                  !reportBaseHref
                ) {
                  return (
                    <span
                      key={item.label}
                      className="block cursor-not-allowed rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600"
                    >
                      {item.label}
                    </span>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={`${reportBaseHref}#${item.section}`}
                    prefetch={false}
                    onClick={() =>
                      saveSelectedArticle(
                        featuredArticle
                      )
                    }
                    className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                  >
                    {item.label}
                  </Link>
                );
              }
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-slate-800 pt-6">
          <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
            More
          </p>

          <div className="space-y-1">
            <Link
              href="/about"
              className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
            >
              Contact
            </Link>

            <Link
              href="/privacy"
              className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

function RightRail({
  featuredAnalysis,
}: {
  featuredAnalysis:
    | IntelligencePreview
    | null;
}) {
  const trust =
    featuredAnalysis?.trustScore ?? 0;

  const consensus =
    featuredAnalysis?.consensusScore ?? 0;

  const confidence =
    featuredAnalysis?.confidence ?? 0;

  const sourcesReviewed =
    featuredAnalysis?.sourcesReviewed ?? 0;

  return (
    <aside
      id="intelligence"
      className="space-y-5"
    >
      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-sm">
        <div className="border-b border-slate-800 px-5 py-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-red-400">
            Intelligence Snapshot
          </p>

          <h2 className="mt-1 text-lg font-extrabold text-white">
            Featured story signals
          </h2>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  Trust Score
                </p>

                <p className="mt-1 text-3xl font-extrabold text-white">
                  {trust}%
                </p>
              </div>

              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                Evidence
              </span>
            </div>

            <MetricBar
              value={trust}
              tone="emerald"
            />
          </div>

          <div className="border-t border-slate-800 pt-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  Consensus
                </p>

                <p className="mt-1 text-3xl font-extrabold text-white">
                  {consensus}%
                </p>
              </div>

              <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-300">
                Common ground
              </span>
            </div>

            <MetricBar
              value={consensus}
              tone="violet"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
          Analysis quality
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs font-bold text-slate-500">
              Confidence
            </p>

            <p className="mt-2 text-2xl font-extrabold text-white">
              {confidence}%
            </p>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-xs font-bold text-red-300">
              Sources
            </p>

            <p className="mt-2 text-2xl font-extrabold text-white">
              {sourcesReviewed}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
          What PoliticalPulse adds
        </p>

        <div className="mt-4 space-y-3">
          {[
            "Multi-source intelligence",
            "Perspective comparison",
            "Fact-check signals",
            "Common-ground analysis",
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-3"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-300">
                ✓
              </span>

              <p className="text-sm leading-6 text-slate-300">
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}

export default function HomeDashboard({
  articles,
  analysisResults,
  featuredArticle,
  featuredAnalysis,
  isLoading,
  errorMessage,
  onTopicSelect,
}: HomeDashboardProps) {
  const storyPool =
    articles.filter(
      (article) =>
        article.url !==
        featuredArticle?.url
    );

  const sideStories =
    storyPool.slice(0, 2);

  const latestStories =
    storyPool.slice(2, 8);

  return (
    <div className="mx-auto grid max-w-[1520px] gap-7 px-5 py-8 sm:px-8 xl:grid-cols-[185px_minmax(0,1fr)_290px]">
      <Sidebar
        featuredArticle={
          featuredArticle
        }
      />

      <div className="min-w-0">
        <section>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-red-400">
                Top Story
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                What matters right now
              </h1>
            </div>

            <p className="text-sm font-medium text-slate-500">
              Live political intelligence
            </p>
          </div>

          {errorMessage ? (
            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
              {errorMessage}
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.52fr)_minmax(250px,0.48fr)]">
              <article className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
                <div className="relative min-h-[455px] bg-slate-800">
                  <ArticleImage
                    src={
                      featuredArticle
                        ?.urlToImage
                    }
                    priority
                    sizes="(max-width: 1024px) 100vw, 62vw"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-slate-950/80 px-3 py-1 text-xs font-extrabold text-white backdrop-blur">
                        {featuredArticle
                          ?.source?.name ??
                          "PoliticalPulse"}
                      </span>

                      <span className="rounded-full border border-red-500/30 bg-red-500/15 px-3 py-1 text-xs font-extrabold text-red-200 backdrop-blur">
                        Featured analysis
                      </span>
                    </div>

                    <h2 className="mt-4 max-w-4xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-[2.7rem]">
                      {featuredArticle?.title ??
                        "Loading today’s top political story..."}
                    </h2>

                    <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-200 sm:text-base">
                      {featuredAnalysis
                        ?.summary ||
                        featuredArticle
                          ?.description ||
                        "PoliticalPulse is preparing the intelligence preview."}
                    </p>

                    {featuredArticle ? (
                      <div className="mt-6">
                        <Link
                          href={`/intelligence/${createSlug(
                            featuredArticle.title
                          )}`}
                          prefetch={false}
                          onClick={() =>
                            saveSelectedArticle(
                              featuredArticle
                            )
                          }
                          className="inline-flex items-center rounded-xl bg-red-600 px-5 py-3 font-bold text-white shadow-lg shadow-red-950/20 transition hover:bg-red-500"
                        >
                          Open Intelligence Report
                          <span className="ml-2">
                            →
                          </span>
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>

              <div className="grid gap-5">
                {sideStories.map(
                  (article, index) => (
                    <article
                      key={
                        article.url ||
                        `${article.title}-${index}`
                      }
                      className="group flex min-h-[218px] flex-col rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm transition hover:border-slate-700 hover:bg-slate-900"
                    >
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                          {article.source
                            ?.name ??
                            "Source"}
                        </p>

                        <h3 className="mt-3 line-clamp-3 text-xl font-extrabold leading-7 text-white">
                          {article.title}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                          {article.description ||
                            "Open the report for full analysis."}
                        </p>
                      </div>

                      <div className="mt-auto pt-4">
                        <StoryLink
                          article={article}
                          label="Open Report"
                        />
                      </div>
                    </article>
                  )
                )}

                {isLoading &&
                sideStories.length === 0 ? (
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                    <div className="h-5 w-24 animate-pulse rounded bg-slate-800" />
                    <div className="mt-4 h-6 w-full animate-pulse rounded bg-slate-800" />
                    <div className="mt-3 h-6 w-4/5 animate-pulse rounded bg-slate-800" />
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </section>

        <section
          id="top-stories"
          className="mt-12"
        >
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-red-400">
                Latest Stories
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-white">
                More stories to understand
              </h2>
            </div>

            <span className="hidden text-sm font-medium text-slate-500 sm:inline">
              {latestStories.length} stories
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {latestStories.map(
              (article, index) => {
                const analysis =
                  analysisResults[
                    index + 2
                  ];

                return (
                  <article
                    key={
                      article.url ||
                      `${article.title}-${index}`
                    }
                    className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-sm transition hover:border-slate-700 hover:bg-slate-900"
                  >
                    <div className="grid h-full sm:grid-cols-[150px_1fr]">
                      <div className="relative min-h-[165px] bg-slate-800">
                        <ArticleImage
                          src={
                            article.urlToImage
                          }
                          sizes="150px"
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" />
                      </div>

                      <div className="flex flex-col p-5">
                        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                          {article.source
                            ?.name ??
                            "Source"}
                        </p>

                        <h3 className="mt-2 line-clamp-3 text-lg font-extrabold leading-6 text-white">
                          {article.title}
                        </h3>

                        {analysis ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-slate-300">
                              Bias{" "}
                              {
                                analysis.biasScore
                              }
                              /100
                            </span>

                            <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                              Confidence{" "}
                              {
                                analysis.confidence
                              }
                              %
                            </span>
                          </div>
                        ) : null}

                        <div className="mt-auto pt-4">
                          <StoryLink
                            article={article}
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </section>

        <section
          id="topics"
          className="mt-12"
        >
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-red-400">
                Explore Topics
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-white">
                Follow the issues shaping politics
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Jump into the topics driving today&apos;s
                political conversation and open deeper
                intelligence when a story matters to you.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {topics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() =>
                    onTopicSelect(topic)
                  }
                  className="rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <RightRail
        featuredAnalysis={
          featuredAnalysis
        }
      />
    </div>
  );
}
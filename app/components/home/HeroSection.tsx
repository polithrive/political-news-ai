"use client";

import Button from "@/app/components/ui/Button";

import type { Article } from "@/app/types/article";
import type { IntelligencePreview } from "@/app/types/intelligencePreview";

import { createSlug } from "@/lib/createSlug";
import { saveSelectedArticle } from "@/lib/selectedArticle";

import IntelligencePreviewCard from "./IntelligencePreviewCard";

type HeroSectionProps = {
  featuredArticle: Article | null;
  featuredAnalysis: IntelligencePreview | null;
  isLoading: boolean;
};

function calculateReadingTime(
  article: Article | null
): number {
  if (!article) {
    return 1;
  }

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

export default function HeroSection({
  featuredArticle,
  featuredAnalysis,
  isLoading,
}: HeroSectionProps) {
  function saveFeaturedArticle() {
    if (featuredArticle) {
      saveSelectedArticle(featuredArticle);
    }
  }

  const intelligenceRoute = featuredArticle
    ? `/intelligence/${createSlug(
        featuredArticle.title
      )}`
    : "#";

  const sourceName =
    featuredArticle?.source?.name ??
    "PoliticalPulse";

  const readingTime =
    calculateReadingTime(featuredArticle);

  const intelligenceStatus =
    featuredAnalysis
      ? "AI analysis complete"
      : isLoading
        ? "Analyzing top story"
        : "Awaiting analysis";

  return (
    <section className="relative overflow-hidden border-b border-slate-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(239,68,68,0.08),transparent_35%)]"
      />

      <div className="relative mx-auto max-w-7xl px-8 py-20 lg:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>

              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-400">
                AI-Powered Political Intelligence
              </p>
            </div>

            <h1 className="mt-7 text-5xl font-bold leading-[1.08] tracking-tight text-white md:text-7xl">
              Understand Politics.

              <span className="mt-2 block text-red-500">
                Not Just Headlines.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl md:leading-9">
              PoliticalPulse transforms political
              news into AI-powered intelligence
              reports that compare perspectives,
              identify common ground, evaluate
              trust, and explain what actually
              matters.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-400">
              <span className="font-medium text-slate-300">
                Today&apos;s intelligence:
              </span>

              <span>{sourceName}</span>

              <span
                aria-hidden="true"
                className="h-1 w-1 rounded-full bg-slate-600"
              />

              <span>
                {readingTime} min overview
              </span>

              <span
                aria-hidden="true"
                className="h-1 w-1 rounded-full bg-slate-600"
              />

              <span
                className={
                  featuredAnalysis
                    ? "text-emerald-400"
                    : "text-amber-400"
                }
              >
                {intelligenceStatus}
              </span>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              {featuredArticle ? (
                <Button
                  href={intelligenceRoute}
                  variant="primary"
                  prefetch={false}
                  onClick={saveFeaturedArticle}
                >
                  Analyze Today&apos;s Top Story

                  <span
                    aria-hidden="true"
                    className="ml-2"
                  >
                    →
                  </span>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  disabled
                  className="cursor-not-allowed opacity-60"
                >
                  {isLoading
                    ? "Loading Top Story..."
                    : "Top Story Unavailable"}
                </Button>
              )}

              <Button
                href="#live-news"
                variant="outline"
              >
                Explore Live News
              </Button>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 text-sm text-slate-400 sm:grid-cols-4">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">
                  ✓
                </span>

                <span>Executive Summaries</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-emerald-400">
                  ✓
                </span>

                <span>Bias Analysis</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-emerald-400">
                  ✓
                </span>

                <span>Trust Score™</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-emerald-400">
                  ✓
                </span>

                <span>Common Ground</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <IntelligencePreviewCard
              article={featuredArticle}
              analysis={featuredAnalysis}
              isLoading={isLoading}
              onOpenReport={saveFeaturedArticle}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
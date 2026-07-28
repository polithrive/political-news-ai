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

type ProductBenefitProps = {
  title: string;
  description: string;
  icon: string;
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

function ProductBenefit({
  title,
  description,
  icon,
}: ProductBenefitProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-lg">
        <span aria-hidden="true">{icon}</span>
      </div>

      <div>
        <p className="font-semibold text-white">
          {title}
        </p>

        <p className="mt-1 text-sm leading-6 text-slate-400">
          {description}
        </p>
      </div>
    </div>
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
      ? "Analysis ready"
      : isLoading
        ? "Analyzing now"
        : "Analysis unavailable";

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-slate-900"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(239,68,68,0.10),transparent_34%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 top-24 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(520px,1.08fr)] lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-400">
                AI-Powered Political Intelligence
              </p>
            </div>

            <h1
              id="hero-heading"
              className="mt-7 max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Understand the story.

              <span className="mt-2 block text-red-500">
                See every side.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl sm:leading-9">
              PoliticalPulse turns complicated political
              news into clear intelligence reports with
              key facts, competing perspectives, trust
              signals, and common ground.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {featuredArticle ? (
                <Button
                  href={intelligenceRoute}
                  variant="primary"
                  prefetch={false}
                  onClick={saveFeaturedArticle}
                  className="justify-center sm:justify-start"
                >
                  View Today&apos;s Intelligence Report

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
                  className="cursor-not-allowed justify-center opacity-60 sm:justify-start"
                >
                  {isLoading
                    ? "Preparing Today’s Report..."
                    : "Report Unavailable"}
                </Button>
              )}

              <Button
                href="#live-news"
                variant="outline"
                className="justify-center sm:justify-start"
              >
                Browse Live News
              </Button>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-400">
              <span className="font-medium text-slate-300">
                Featured analysis
              </span>

              <span
                aria-hidden="true"
                className="h-1 w-1 rounded-full bg-slate-600"
              />

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
                    ? "font-medium text-emerald-400"
                    : "font-medium text-amber-400"
                }
              >
                {intelligenceStatus}
              </span>
            </div>

            <div className="mt-10 grid gap-6 border-t border-slate-900 pt-8 sm:grid-cols-3">
              <ProductBenefit
                icon="⚖️"
                title="Compare Perspectives"
                description="See how different viewpoints interpret the same story."
              />

              <ProductBenefit
                icon="✓"
                title="Verify the Evidence"
                description="Review confidence, sources, and conflicting reporting."
              />

              <ProductBenefit
                icon="◎"
                title="Find Common Ground"
                description="Identify agreements hidden beneath political debate."
              />
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-8 rounded-full bg-red-500/5 blur-3xl"
            />

            <div className="relative w-full max-w-2xl">
              <div className="mb-4 flex items-center justify-between px-1">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Today&apos;s Featured Report
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    A preview of the full intelligence
                    analysis
                  </p>
                </div>

                <span
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    featuredAnalysis
                      ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                      : "border-amber-500/20 bg-amber-500/5 text-amber-400"
                  }`}
                >
                  {intelligenceStatus}
                </span>
              </div>

              <IntelligencePreviewCard
                article={featuredArticle}
                analysis={featuredAnalysis}
                isLoading={isLoading}
                onOpenReport={saveFeaturedArticle}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
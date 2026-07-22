"use client";

import Link from "next/link";

import type { IntelligencePreview } from "@/app/types/intelligencePreview";
import type { Article } from "@/app/types/article";

import { createSlug } from "@/lib/createSlug";
import { saveSelectedArticle } from "@/lib/selectedArticle";

import IntelligencePreviewCard from "./IntelligencePreviewCard";

type HeroSectionProps = {
  featuredArticle: Article | null;
featuredAnalysis: IntelligencePreview | null;
  isLoading: boolean;
};

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

  return (
    <section className="mx-auto max-w-7xl px-8 py-24">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            AI-Powered Political Intelligence
          </p>

          <h1 className="mt-6 text-5xl font-bold leading-tight md:text-7xl">
            Understand Politics.
            <span className="block text-red-500">
              Not Just Headlines.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-300">
            PoliticalPulse transforms political news into AI-powered
            intelligence reports that compare perspectives, identify common
            ground, evaluate trust, and explain what actually matters.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            {featuredArticle ? (
              <Link
                href={intelligenceRoute}
                prefetch={false}
                onClick={saveFeaturedArticle}
                className="rounded-xl bg-red-600 px-6 py-4 font-semibold text-white transition hover:bg-red-500"
              >
                Analyze Today&apos;s Top Story
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-xl bg-red-600 px-6 py-4 font-semibold text-white opacity-60"
              >
                {isLoading
                  ? "Loading Top Story..."
                  : "Top Story Unavailable"}
              </button>
            )}

            <a
              href="#live-news"
              className="rounded-xl border border-slate-700 px-6 py-4 font-semibold text-white transition hover:border-slate-500"
            >
              Explore Live News
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-400">
            <div>✓ AI Executive Summaries</div>
            <div>✓ Bias Analysis</div>
            <div>✓ Trust Score™</div>
            <div>✓ Common Ground</div>
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
    </section>
  );
}
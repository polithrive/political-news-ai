"use client";

import Image from "next/image";
import Link from "next/link";

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

function formatPublishedDate(
  publishedAt: string | undefined
): string {
  if (!publishedAt) {
    return "Latest coverage";
  }

  const date = new Date(publishedAt);

  if (Number.isNaN(date.getTime())) {
    return "Latest coverage";
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

export default function HeroSection({
  featuredArticle,
  featuredAnalysis,
  isLoading,
}: HeroSectionProps) {
  function saveFeaturedArticle() {
    if (featuredArticle) {
      saveSelectedArticle(
        featuredArticle
      );
    }
  }

  const intelligenceRoute =
    featuredArticle
      ? `/intelligence/${createSlug(
          featuredArticle.title
        )}`
      : "#";

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:py-14">
        <div className="mb-7 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              Today&apos;s News
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              The story to understand right now
            </h1>
          </div>

          <Link
            href="#live-news"
            className="hidden text-sm font-bold text-blue-600 hover:text-blue-700 sm:inline"
          >
            View all stories →
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="relative min-h-[330px] overflow-hidden bg-slate-100 sm:min-h-[420px]">
              {featuredArticle?.urlToImage ? (
                <Image
                  src={
                    featuredArticle.urlToImage
                  }
                  alt=""
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-100" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 backdrop-blur">
                    {featuredArticle
                      ?.source?.name ??
                      "PoliticalPulse"}
                  </span>

                  <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                    Featured
                  </span>
                </div>

                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200">
                  {formatPublishedDate(
                    featuredArticle
                      ?.publishedAt
                  )}
                </p>

                <h2 className="mt-3 max-w-4xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                  {featuredArticle?.title ??
                    "Loading today’s featured political story..."}
                </h2>

                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200">
                  {featuredAnalysis?.summary ||
                    featuredArticle
                      ?.description ||
                    "PoliticalPulse is preparing the intelligence preview for this story."}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {featuredArticle ? (
                    <Link
                      href={intelligenceRoute}
                      prefetch={false}
                      onClick={
                        saveFeaturedArticle
                      }
                      className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      Open Intelligence Report
                      <span className="ml-2">
                        →
                      </span>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="rounded-xl bg-blue-400 px-5 py-3 font-semibold text-white opacity-70"
                    >
                      {isLoading
                        ? "Preparing report..."
                        : "Report unavailable"}
                    </button>
                  )}

                  <Link
                    href="#live-news"
                    className="inline-flex items-center rounded-xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    Browse more stories
                  </Link>
                </div>
              </div>
            </div>
          </article>

          <div className="min-w-0">
            <IntelligencePreviewCard
              article={featuredArticle}
              analysis={featuredAnalysis}
              isLoading={isLoading}
              onOpenReport={
                saveFeaturedArticle
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}

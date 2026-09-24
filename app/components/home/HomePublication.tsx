"use client";

import type { AnalysisResult } from "@/app/types/analysis";
import type { Article } from "@/app/types/article";
import type { IntelligencePreview } from "@/app/types/intelligencePreview";

import BigStoryCard from "./BigStoryCard";
import HomeHero from "./HomeHero";
import HomeRightRail from "./HomeRightRail";
import MoreStoriesList from "./MoreStoriesList";
import HomeFeatureTools from "./HomeFeatureTools";
import TheAngleModule from "./TheAngleModule";

type HomePublicationProps = {
  articles: Article[];
  bigStories?: Article[];
  trendingArticles?: Article[];
  moreStories?: Article[];
  analysisResults: Record<number, AnalysisResult>;
  featuredArticle: Article | null;
  featuredAnalysis: IntelligencePreview | null;
  isLoading: boolean;
  errorMessage: string | null;
};

export default function HomePublication({
  articles,
  bigStories = [],
  trendingArticles = [],
  moreStories = [],
  analysisResults,
  featuredArticle,
  featuredAnalysis,
  isLoading,
  errorMessage,
}: HomePublicationProps) {
  const leadArticle = featuredArticle ?? articles[0] ?? null;

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-5 px-4 py-5 sm:px-6 lg:px-7">
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-stretch">
        <div className="order-1">
          <HomeHero
            article={leadArticle}
            summary={featuredAnalysis?.summary}
            isLoading={isLoading}
          />
        </div>

        <div className="order-2 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:min-h-0">
          <HomeRightRail
            articles={trendingArticles}
            isLoading={isLoading}
          />
        </div>

        <div className="order-3 min-w-0">
          {errorMessage ? (
            <div className="rounded-xl bg-[#FF2638]/10 px-6 py-8 text-red-200">
              {errorMessage}
            </div>
          ) : (
            <section id="today" className="scroll-mt-28">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
                    The Big Stories
                  </p>
                  <p className="text-sm text-[#9CB0C5]">
                    Our top stories today, analyzed from multiple sources.
                  </p>
                </div>
                <a
                  href="#more-stories"
                  className="text-sm font-semibold text-[#55C8FF] hover:text-[#8EDCFF]"
                >
                  View all stories →
                </a>
              </div>

              {bigStories.length > 0 ? (
                <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {bigStories.map((article, index) => {
                    const articleIndex = articles.findIndex(
                      (candidate) => candidate.url === article.url
                    );
                    const preview =
                      article.url === featuredArticle?.url
                        ? featuredAnalysis
                        : articleIndex >= 0
                          ? analysisResults[articleIndex]
                          : undefined;

                    return (
                      <BigStoryCard
                        key={article.url || article.title}
                        article={article}
                        preview={preview}
                        priority={index < 2}
                      />
                    );
                  })}
                </div>
              ) : isLoading ? (
                <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="min-h-[280px] animate-pulse rounded-xl border border-[#17446D]/55 bg-[#04162C]"
                    />
                  ))}
                </div>
              ) : null}
            </section>
          )}
        </div>
      </div>

      <TheAngleModule article={leadArticle} preview={featuredAnalysis} />

      <div className="space-y-5">
        <HomeFeatureTools />

        {!errorMessage ? (
          <MoreStoriesList articles={moreStories} />
        ) : null}
      </div>
    </div>
  );
}

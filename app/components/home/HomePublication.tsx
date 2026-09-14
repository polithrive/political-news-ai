"use client";

import type { AnalysisResult } from "@/app/types/analysis";
import type { Article } from "@/app/types/article";
import type { IntelligencePreview } from "@/app/types/intelligencePreview";

import HomepageForecast from "@/app/components/forecasts/HomepageForecast";
import FeaturedHomepagePoll from "@/app/components/polls/FeaturedHomepagePoll";

import BigStoryCard from "./BigStoryCard";
import HomeHero from "./HomeHero";
import HomeRightRail from "./HomeRightRail";
import MoreStoriesList from "./MoreStoriesList";
import UnderstandAnyArticle from "./UnderstandAnyArticle";

type HomePublicationProps = {
  articles: Article[];
  analysisResults: Record<number, AnalysisResult>;
  featuredArticle: Article | null;
  featuredAnalysis: IntelligencePreview | null;
  isLoading: boolean;
  errorMessage: string | null;
};

const BIG_STORY_COUNT = 4;

export default function HomePublication({
  articles,
  analysisResults,
  featuredArticle,
  featuredAnalysis,
  isLoading,
  errorMessage,
}: HomePublicationProps) {
  const bigStories = articles.slice(0, BIG_STORY_COUNT);
  const moreStoriesPool = articles.slice(BIG_STORY_COUNT);

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-6 px-4 py-5 sm:px-6 lg:px-7">
      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <HomeHero />

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <HomeRightRail />
        </div>

        <div className="min-w-0 space-y-5">
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
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="min-h-[280px] animate-pulse rounded-xl bg-[#04162C]"
                    />
                  ))}
                </div>
              ) : null}
            </section>
          )}

          {!errorMessage ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <FeaturedHomepagePoll />
              <HomepageForecast />
            </div>
          ) : null}
        </div>
      </div>

      {!errorMessage ? (
        <MoreStoriesList
          articles={moreStoriesPool}
          previews={analysisResults}
          articleIndexOffset={BIG_STORY_COUNT}
        />
      ) : null}

      <UnderstandAnyArticle />
    </div>
  );
}

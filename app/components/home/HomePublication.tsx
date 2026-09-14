"use client";

import { useState } from "react";

import type { AnalysisResult } from "@/app/types/analysis";
import type { Article } from "@/app/types/article";
import type { IntelligencePreview } from "@/app/types/intelligencePreview";

import BigStoryCard from "./BigStoryCard";
import HomeInsightPanels from "./HomeInsightPanels";
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

const BIG_STORY_COUNT = 5;
const MORE_STORIES_PAGE_SIZE = 6;

export default function HomePublication({
  articles,
  analysisResults,
  featuredArticle,
  featuredAnalysis,
  isLoading,
  errorMessage,
}: HomePublicationProps) {
  const [visibleMoreStoryCount, setVisibleMoreStoryCount] =
    useState(MORE_STORIES_PAGE_SIZE);

  const bigStories = articles.slice(0, BIG_STORY_COUNT);
  const featured = featuredArticle ?? bigStories[0] ?? null;
  const supportingStories = bigStories.filter(
    (article) => article.url !== featured?.url
  );
  const moreStoriesPool = articles.slice(BIG_STORY_COUNT);
  const moreStories = moreStoriesPool.slice(0, visibleMoreStoryCount);

  return (
    <div>
      <div className="mx-auto w-full max-w-[1280px] px-5 py-6 sm:px-6 lg:py-8">
        <section className="max-w-3xl pb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
            Today
          </p>

          <h1 className="mt-3 max-w-3xl font-serif text-3xl font-black tracking-[-0.04em] text-pretty text-white sm:text-4xl">
            Understand today's biggest stories in minutes.
          </h1>
        </section>

        {errorMessage ? (
          <div className="rounded-2xl bg-[#FF2638]/10 px-6 py-8 text-red-200">
            {errorMessage}
          </div>
        ) : (
          <>
            <section id="today" className="scroll-mt-28">
              {featured ? (
                <BigStoryCard
                  article={featured}
                  preview={featuredAnalysis}
                  featured
                  priority
                />
              ) : isLoading ? (
                <div className="min-h-[200px] animate-pulse rounded-2xl bg-[#06172D]" />
              ) : null}

              <HomeInsightPanels
                articles={articles}
                analysisResults={analysisResults}
                featuredArticle={featured}
                featuredAnalysis={featuredAnalysis}
              />

              {supportingStories.length > 0 ? (
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {supportingStories.map((article, index) => {
                    const articleIndex = articles.findIndex(
                      (candidate) => candidate.url === article.url
                    );

                    return (
                      <BigStoryCard
                        key={article.url || article.title}
                        article={article}
                        preview={
                          articleIndex >= 0
                            ? analysisResults[articleIndex]
                            : undefined
                        }
                        priority={index < 2}
                      />
                    );
                  })}
                </div>
              ) : null}
            </section>

            <div className="mt-10">
              <MoreStoriesList
                articles={moreStories}
                previews={analysisResults}
                articleIndexOffset={BIG_STORY_COUNT}
                hasMore={
                  visibleMoreStoryCount < moreStoriesPool.length
                }
                onLoadMore={() =>
                  setVisibleMoreStoryCount(
                    (currentCount) =>
                      currentCount + MORE_STORIES_PAGE_SIZE
                  )
                }
              />
            </div>
          </>
        )}

        <div className="mt-12 border-t border-[#17446D]/40 pt-10">
          <UnderstandAnyArticle />
        </div>
      </div>
    </div>
  );
}

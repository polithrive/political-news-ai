"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { Article } from "@/app/types/article";

import {
  tickerStoriesFromArticles,
  type TickerStory,
} from "@/app/components/home/trendingTopics";
import { createSlug } from "@/lib/createSlug";
import { getLatestNews } from "@/lib/news";
import { saveSelectedArticle } from "@/lib/selectedArticle";

type TrendingTopicsBannerProps = {
  articles?: Article[];
};

export default function TrendingTopicsBanner({
  articles,
}: TrendingTopicsBannerProps) {
  const [stories, setStories] = useState<TickerStory[]>(() =>
    tickerStoriesFromArticles(articles ?? [])
  );

  useEffect(() => {
    if (articles && articles.length > 0) {
      setStories(tickerStoriesFromArticles(articles));
      return;
    }

    if (articles) {
      return;
    }

    let cancelled = false;

    void getLatestNews()
      .then((latest) => {
        if (!cancelled && latest.length > 0) {
          setStories(tickerStoriesFromArticles(latest));
        }
      })
      .catch(() => {
        /* Leave the ticker empty if the feed is unavailable. */
      });

    return () => {
      cancelled = true;
    };
  }, [articles]);

  if (stories.length === 0) {
    return (
      <div className="flex h-9 items-center border-t border-[#17446D]/35 bg-[#04162C] px-3 sm:px-4">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#55C8FF]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" aria-hidden="true" />
          Today&apos;s top stories
        </p>
        <p className="ml-4 text-[12px] text-[#9CB0C5]">Loading headlines…</p>
      </div>
    );
  }

  const loop = [...stories, ...stories];

  return (
    <div className="flex h-9 items-stretch border-t border-[#17446D]/35 bg-[#04162C]">
      <p className="flex shrink-0 items-center gap-2 border-r border-[#17446D]/40 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#55C8FF] sm:px-4">
        <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" aria-hidden="true" />
        Today&apos;s top stories
      </p>

      <div className="min-w-0 flex-1 overflow-hidden motion-reduce:overflow-x-auto">
        <div className="trending-marquee-track flex h-full w-max items-center">
          {loop.map((story, index) => (
            <span
              key={`${story.article.url || story.label}-${index}`}
              className="flex items-center"
            >
              <Link
                href={`/intelligence/${createSlug(story.article.title)}`}
                prefetch={false}
                onClick={() => saveSelectedArticle(story.article)}
                className="whitespace-nowrap px-3 text-[12px] font-medium text-[#D7E4F4] hover:text-white sm:px-4"
              >
                {story.label}
              </Link>
              <span
                className="h-1 w-1 rounded-full bg-[#3A6A96]"
                aria-hidden="true"
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { AnalysisResult } from "@/app/types/analysis";
import type { Article } from "@/app/types/article";

import { createSlug } from "@/lib/createSlug";
import { saveSelectedArticle } from "@/lib/selectedArticle";

import RelativeTime from "./RelativeTime";
import StoryImage from "./StoryImage";
import { matchesTopicFilter, storyCategory } from "./storyMeta";

const TOPIC_FILTERS = [
  "All",
  "U.S. Politics",
  "World",
  "Economy",
  "Technology",
  "Health",
  "Business",
  "More",
] as const;

type MoreStoriesListProps = {
  articles: Article[];
  previews: Record<number, AnalysisResult | undefined>;
  articleIndexOffset: number;
};

const PAGE_SIZE = 6;

export default function MoreStoriesList({
  articles,
  previews,
  articleIndexOffset,
}: MoreStoriesListProps) {
  const [filter, setFilter] =
    useState<(typeof TOPIC_FILTERS)[number]>("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(
    () => articles.filter((article) => matchesTopicFilter(article, filter)),
    [articles, filter]
  );

  const visible = filtered.slice(0, visibleCount);

  if (articles.length === 0) {
    return null;
  }

  return (
    <section id="more-stories" className="scroll-mt-28">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
            More stories
          </p>
          <p className="text-sm text-[#9CB0C5]">
            Stay informed with the latest analysis.
          </p>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {TOPIC_FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setFilter(item);
                setVisibleCount(PAGE_SIZE);
              }}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                filter === item
                  ? "bg-[#38BDF8] text-[#03111F]"
                  : "text-[#D7E4F4] hover:text-white"
              }`}
            >
              {item === "More" ? "More ▾" : item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
        {visible.map((article, index) => {
          const originalIndex = articles.findIndex(
            (candidate) => candidate.url === article.url
          );
          const preview =
            previews[
              articleIndexOffset +
                (originalIndex >= 0 ? originalIndex : index)
            ];
          const sourceCount = preview?.sourcesReviewed;

          return (
            <article
              key={article.url || `${article.title}-${index}`}
              className="grid grid-cols-[92px_minmax(0,1fr)] items-center gap-4"
            >
              <div className="relative h-[72px] overflow-hidden rounded-lg bg-[#05182E]">
                {article.urlToImage ? (
                  <StoryImage
                    src={article.urlToImage}
                    sizes="92px"
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div>
                <Link
                  href={`/intelligence/${createSlug(article.title)}`}
                  prefetch={false}
                  onClick={() => saveSelectedArticle(article)}
                  className="font-serif text-[1.05rem] font-bold leading-snug text-white hover:text-[#8EDCFF]"
                >
                  {article.title}
                </Link>
                <p className="mt-1.5 text-[12px] text-[#9CB0C5]">
                  <RelativeTime publishedAt={article.publishedAt} />
                  <span className="mx-1.5 text-[#4E6A84]">•</span>
                  {storyCategory(article)}
                  {typeof sourceCount === "number" && sourceCount > 0 ? (
                    <>
                      <span className="mx-1.5 text-[#4E6A84]">•</span>
                      {sourceCount === 1
                        ? "1 source"
                        : `${sourceCount} sources`}
                    </>
                  ) : null}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-[#9CB0C5]">
          No stories in this topic yet. Try All.
        </p>
      ) : null}

      {visibleCount < filtered.length ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((currentCount) => currentCount + PAGE_SIZE)
            }
            className="rounded-full border border-[#3A6A96] px-6 py-2.5 text-sm font-semibold text-white hover:border-[#55C8FF]"
          >
            Load more stories
          </button>
        </div>
      ) : null}
    </section>
  );
}

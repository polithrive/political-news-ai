"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Article } from "@/app/types/article";

import { trackBriefSelected } from "@/lib/analytics/track";
import { createIntelligenceHref } from "@/lib/services/intelligenceIdentity";
import { saveSelectedArticle } from "@/lib/selectedArticle";

import RelativeTime from "./RelativeTime";
import StoryBriefLink from "./StoryBriefLink";
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
};

const PAGE_SIZE = 6;

export default function MoreStoriesList({
  articles,
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
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
            More stories
          </p>
          <p className="text-sm text-[#9CB0C5]">
            More from today&apos;s feed.
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
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 md:gap-x-8">
        {visible.map((article, index) => {
          const sourceCount =
            article.curation && article.curation.clusterSize > 1
              ? article.curation.clusterSize
              : undefined;
          const href = createIntelligenceHref(article);
          const dek = article.description?.trim() || "";

          if (!href) {
            return null;
          }

          return (
            <article
              key={article.url || `${article.title}-${index}`}
              className="grid grid-cols-[120px_minmax(0,1fr)] items-start gap-4 border-b border-[#17446D]/40 py-4"
            >
              <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-[#05182E]">
                <StoryImage
                  src={article.urlToImage}
                  category={storyCategory(article)}
                  sourceCount={sourceCount}
                  sizes="120px"
                  className="object-cover object-center"
                />
              </div>

              <div className="min-w-0">
                <Link
                  href={href}
                  prefetch={false}
                  onClick={() => {
                    saveSelectedArticle(article);
                    trackBriefSelected(article.url, "home");
                  }}
                  className="font-serif text-[1.05rem] font-bold leading-snug text-white hover:text-[#8EDCFF]"
                >
                  {article.title}
                </Link>
                {dek ? (
                  <p className="mt-1 line-clamp-1 text-[13px] leading-5 text-[#9CB0C5]">
                    {dek}
                  </p>
                ) : null}
                <div className="mt-2 flex flex-wrap items-center gap-y-1">
                  <p className="text-[12px] text-[#7890AC]">
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
                  <StoryBriefLink
                    article={article}
                    label="60-sec brief"
                    className="ml-3 border-l border-[#3A6A96]/70 pl-3 text-[12px] font-semibold text-[#55C8FF] hover:text-[#8EDCFF]"
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="pt-4 text-sm text-[#9CB0C5]">
          No stories in this topic yet. Try All.
        </p>
      ) : null}

      {visibleCount < filtered.length ? (
        <div className="mt-6 flex justify-center">
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

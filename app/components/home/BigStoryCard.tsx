"use client";

import type { Article } from "@/app/types/article";

import StoryBriefLink from "./StoryBriefLink";
import StoryImage from "./StoryImage";

type StoryCardPreview = {
  summary?: string;
  whyThisMatters?: string;
};

type BigStoryCardProps = {
  article: Article;
  preview?: StoryCardPreview | null;
  featured?: boolean;
  priority?: boolean;
};

function storySummary(
  article: Article,
  preview?: StoryCardPreview | null
): string {
  return (
    preview?.summary?.trim() ||
    article.description?.trim() ||
    ""
  );
}

export default function BigStoryCard({
  article,
  preview,
  featured = false,
  priority = false,
}: BigStoryCardProps) {
  const summary = storySummary(article, preview);
  const whyItMatters = preview?.whyThisMatters?.trim();
  const sourceName = article.source?.name;

  if (featured) {
    return (
      <article className="overflow-hidden rounded-2xl border border-[#17446D]/50 bg-[#06172D]/90 lg:grid lg:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col p-5 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#55C8FF]">
            Top story
          </p>

          {sourceName ? (
            <p className="mt-3 text-[11px] font-medium tracking-wide text-[#8FB0D1]">
              {sourceName}
            </p>
          ) : null}

          <h2 className="mt-2 font-serif text-2xl font-black leading-snug tracking-[-0.03em] text-white sm:text-[1.7rem]">
            {article.title}
          </h2>

          {summary ? (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#C5D4E8]">
              {summary}
            </p>
          ) : null}

          {whyItMatters ? (
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#9CB0C5]">
              <span className="font-semibold text-[#7DD3FC]">
                Why it matters.{" "}
              </span>
              {whyItMatters}
            </p>
          ) : null}

          <div className="mt-4">
            <StoryBriefLink
              article={article}
              className="inline-flex items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#60A5FA]"
            />
          </div>
        </div>

        <div className="relative min-h-[200px] lg:min-h-[240px]">
          {article.urlToImage ? (
            <StoryImage
              src={article.urlToImage}
              priority={priority}
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B2541] to-[#020D21]" />
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-[#06172D]">
      <div className="relative h-32 overflow-hidden bg-[#0A2846]">
        {article.urlToImage ? (
          <StoryImage
            src={article.urlToImage}
            priority={priority}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B2541] to-[#020D21]" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {sourceName ? (
          <p className="text-[11px] font-medium tracking-wide text-[#7A93AA]">
            {sourceName}
          </p>
        ) : null}

        <h3 className="mt-2 font-serif text-lg font-black leading-snug tracking-[-0.02em] text-white">
          {article.title}
        </h3>

        {summary ? (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#9CB0C5]">
            {summary}
          </p>
        ) : null}

        {whyItMatters ? (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#8EA3B7]">
            <span className="font-semibold text-[#7DD3FC]">
              Why it matters.{" "}
            </span>
            {whyItMatters}
          </p>
        ) : null}

        <div className="mt-auto pt-3">
          <StoryBriefLink article={article} />
        </div>
      </div>
    </article>
  );
}

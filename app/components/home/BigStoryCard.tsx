"use client";

import type { Article } from "@/app/types/article";

import StoryBriefLink from "./StoryBriefLink";
import StoryImage from "./StoryImage";
import RelativeTime from "./RelativeTime";
import { storyCategory } from "./storyMeta";

type StoryCardPreview = {
  summary?: string;
  sourcesReviewed?: number;
};

type BigStoryCardProps = {
  article: Article;
  preview?: StoryCardPreview | null;
  priority?: boolean;
};

function storySummary(
  article: Article,
  preview?: StoryCardPreview | null
): string {
  return preview?.summary?.trim() || article.description?.trim() || "";
}

export default function BigStoryCard({
  article,
  preview,
  priority = false,
}: BigStoryCardProps) {
  const summary = storySummary(article, preview);
  const category = storyCategory(article);
  const sourceCount = preview?.sourcesReviewed;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-[#04162C]">
      <div className="relative h-40 overflow-hidden bg-[#05182E]">
        {article.urlToImage ? (
          <StoryImage
            src={article.urlToImage}
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 20vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B2541] to-[#020D21]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#04162C] via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
          <span className="rounded-md bg-[#38BDF8]/18 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7DD3FC]">
            {category}
          </span>
          <span className="text-[11px] font-medium text-[#D7E4F4]">
            <RelativeTime publishedAt={article.publishedAt} />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <h3 className="font-serif text-[1.05rem] font-bold leading-snug tracking-[-0.02em] text-white">
          {article.title}
        </h3>

        {summary ? (
          <p className="mt-2 line-clamp-3 text-[13px] leading-5 text-[#9CB0C5]">
            {summary}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-[12px]">
          {typeof sourceCount === "number" && sourceCount > 0 ? (
            <p className="text-[#7890AC]">
              {sourceCount === 1 ? "1 source" : `${sourceCount} sources`}
            </p>
          ) : (
            <span />
          )}
          <StoryBriefLink
            article={article}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#55C8FF] hover:text-[#8EDCFF]"
          />
        </div>
      </div>
    </article>
  );
}

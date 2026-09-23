"use client";

import type { Article } from "@/app/types/article";

import { trackReadOriginal } from "@/lib/analytics/track";

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
  const sourceCount =
    article.curation && article.curation.clusterSize > 1
      ? article.curation.clusterSize
      : undefined;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#17446D]/55 bg-[#04162C]">
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-[#05182E]">
        <StoryImage
          src={article.urlToImage}
          category={category}
          sourceCount={sourceCount}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 20vw"
          className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
        />
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
        <h3 className="line-clamp-3 min-h-[3.9rem] font-serif text-[1.05rem] font-bold leading-snug tracking-[-0.02em] text-white">
          {article.title}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-[13px] leading-5 text-[#9CB0C5]">
          {summary || "Open the 60-second brief for multi-source analysis."}
        </p>

        <div className="mt-auto flex min-h-[2.25rem] flex-wrap items-center gap-x-3 gap-y-2 pt-3 text-[12px]">
          {typeof sourceCount === "number" && sourceCount > 0 ? (
            <p className="text-[#7890AC]">
              {sourceCount === 1 ? "1 source" : `${sourceCount} sources`}
            </p>
          ) : null}
          <StoryBriefLink
            article={article}
            className="inline-flex items-center rounded-full bg-[#FF2638] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#FF4151]"
          />
          {article.url ? (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackReadOriginal(article.url, "home")}
              className="text-[12px] font-semibold text-[#9CB0C5] hover:text-white"
            >
              Read original →
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

"use client";

import type { AnalysisResult } from "@/app/types/analysis";
import type { Article } from "@/app/types/article";

import StoryBriefLink from "./StoryBriefLink";
import StoryImage from "./StoryImage";

type MoreStoriesListProps = {
  articles: Article[];
  previews: Record<number, AnalysisResult | undefined>;
  articleIndexOffset: number;
  hasMore: boolean;
  onLoadMore: () => void;
};

export default function MoreStoriesList({
  articles,
  previews,
  articleIndexOffset,
  hasMore,
  onLoadMore,
}: MoreStoriesListProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section id="more-stories" className="scroll-mt-28">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
          More stories
        </p>

        <h2 className="mt-2 font-serif text-3xl font-black tracking-[-0.03em] text-white">
          Keep reading
        </h2>
      </div>

      <div className="divide-y divide-[#17446D]/50">
        {articles.map((article, index) => {
          const preview = previews[articleIndexOffset + index];
          const summary =
            preview?.summary?.trim() ||
            article.description?.trim() ||
            "";

          return (
            <article
              key={article.url || `${article.title}-${index}`}
              className="grid gap-5 py-6 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-start"
            >
              <div className="relative hidden h-24 overflow-hidden rounded-xl bg-[#0A2846] sm:block">
                {article.urlToImage ? (
                  <StoryImage
                    src={article.urlToImage}
                    sizes="140px"
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div>
                {article.source?.name ? (
                  <p className="text-[11px] font-medium text-[#7A93AA]">
                    {article.source.name}
                  </p>
                ) : null}

                <h3 className="mt-1 font-serif text-xl font-bold leading-snug text-white">
                  {article.title}
                </h3>

                {summary ? (
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#9CB0C5]">
                    {summary}
                  </p>
                ) : null}

                <div className="mt-3">
                  <StoryBriefLink article={article} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {hasMore ? (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            className="rounded-xl px-6 py-3 text-sm font-semibold text-[#E2F3FF] transition hover:text-white"
          >
            Load more
          </button>
        </div>
      ) : null}
    </section>
  );
}

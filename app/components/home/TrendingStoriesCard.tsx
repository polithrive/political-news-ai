"use client";

import type { Article } from "@/app/types/article";

type TrendingStoriesCardProps = {
  articles: Article[];
  isLoading?: boolean;
};

export default function TrendingStoriesCard({
  articles,
  isLoading = false,
}: TrendingStoriesCardProps) {
  const trending = articles.slice(0, 3);

  return (
    <section className="rounded-2xl border border-[#17446D]/55 bg-[#04162C] p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55C8FF]">
        Trending today
      </p>

      {trending.length > 0 ? (
        <ol className="mt-2.5 space-y-2">
          {trending.map((article, index) => (
            <li key={article.url || `${article.title}-${index}`}>
              <a
                href={article.url || "#"}
                target={article.url ? "_blank" : undefined}
                rel={article.url ? "noopener noreferrer" : undefined}
                className="flex gap-2.5 hover:text-[#8EDCFF]"
              >
                <span className="w-4 shrink-0 font-serif text-sm font-bold text-[#55C8FF]">
                  {index + 1}
                </span>
                <span className="line-clamp-2 text-[12px] font-semibold leading-snug text-white">
                  {article.title}
                </span>
              </a>
            </li>
          ))}
        </ol>
      ) : isLoading ? (
        <div className="mt-3 space-y-2.5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-8 animate-pulse rounded bg-[#05182E]"
            />
          ))}
        </div>
      ) : (
        <p className="mt-3 text-[13px] text-[#9CB0C5]">
          Trending stories will appear when the feed loads.
        </p>
      )}
    </section>
  );
}

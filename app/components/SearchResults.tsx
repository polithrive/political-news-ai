"use client";

import type { Article } from "@/app/types/article";
import StoryBriefLink from "@/app/components/home/StoryBriefLink";

type SearchResultsProps = {
  searchTerm: string;
  articles: Article[];
};

function normalizeSearchTerm(value: string): string {
  return value.trim().toLowerCase();
}

export default function SearchResults({
  searchTerm,
  articles,
}: SearchResultsProps) {
  const normalizedSearchTerm =
    normalizeSearchTerm(searchTerm);

  if (!normalizedSearchTerm) {
    return null;
  }

  const filteredResults = articles.filter(
    (article) => {
      const searchableContent = [
        article.title,
        article.description,
        article.source?.name ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(
        normalizedSearchTerm
      );
    }
  );

  return (
    <section
      aria-labelledby="search-results-heading"
      className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
        Search
      </p>

      <h2
        id="search-results-heading"
        className="mt-3 font-serif text-3xl font-black tracking-[-0.03em] text-white"
      >
        {filteredResults.length > 0
          ? `Stories matching “${searchTerm.trim()}”`
          : `No stories matched “${searchTerm.trim()}”`}
      </h2>

      {filteredResults.length === 0 ? (
        <p className="mt-4 max-w-2xl leading-7 text-[#9CB0C5]">
          Nothing in Today’s feed uses that wording.
          Try another topic, or go back to Today.
        </p>
      ) : (
        <ul className="mt-8 space-y-6">
          {filteredResults.map((article) => (
            <li
              key={article.url || article.title}
              className="border-b border-[#17446D]/40 pb-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8FB4D3]">
                {article.source?.name}
              </p>

              <h3 className="mt-2 text-xl font-bold text-white">
                {article.title}
              </h3>

              {article.description ? (
                <p className="mt-2 max-w-3xl leading-7 text-[#9CB0C5]">
                  {article.description}
                </p>
              ) : null}

              <div className="mt-3">
                <StoryBriefLink article={article} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

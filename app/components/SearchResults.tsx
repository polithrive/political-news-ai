import { searchResults } from "../data/searchResults";

type SearchResultsProps = {
  searchTerm: string;
};

function normalizeSearchTerm(value: string): string {
  return value.trim().toLowerCase();
}

export default function SearchResults({
  searchTerm,
}: SearchResultsProps) {
  const normalizedSearchTerm =
    normalizeSearchTerm(searchTerm);

  if (!normalizedSearchTerm) {
    return null;
  }

  const filteredResults = searchResults.filter(
    (result) => {
      const searchableContent = [
        result.title,
        result.category,
        result.summary,
      ]
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(
        normalizedSearchTerm
      );
    }
  );

  const categoryCount = new Set(
    filteredResults.map(
      (result) => result.category
    )
  ).size;

  if (filteredResults.length === 0) {
    return (
      <section
        aria-labelledby="search-results-heading"
        className="border-t border-slate-900"
      >
        <div className="mx-auto max-w-5xl px-6 pb-20 sm:px-8">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-center sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-2xl">
              <span aria-hidden="true">⌕</span>
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-red-500">
              Intelligence Explorer
            </p>

            <h2
              id="search-results-heading"
              className="mt-3 text-2xl font-bold text-white sm:text-3xl"
            >
              No intelligence matched your search
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
              We could not find a current result for{" "}
              <strong className="font-semibold text-slate-200">
                &quot;{searchTerm.trim()}&quot;
              </strong>
              . Try a broader topic, politician,
              policy area, election, or government
              institution.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-slate-500">
              <span>Try:</span>

              <span className="text-slate-300">
                Congress
              </span>

              <span aria-hidden="true">•</span>

              <span className="text-slate-300">
                Healthcare
              </span>

              <span aria-hidden="true">•</span>

              <span className="text-slate-300">
                Immigration
              </span>

              <span aria-hidden="true">•</span>

              <span className="text-slate-300">
                Supreme Court
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="search-results-heading"
      className="border-t border-slate-900"
    >
      <div className="mx-auto max-w-5xl px-6 pb-20 sm:px-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
          <div className="flex flex-col gap-6 border-b border-slate-800 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-500">
                Intelligence Explorer
              </p>

              <h2
                id="search-results-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
              >
                Results for{" "}
                <span className="text-red-500">
                  &quot;{searchTerm.trim()}&quot;
                </span>
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                Review the available intelligence
                summaries related to your search.
              </p>
            </div>

            <div className="flex shrink-0 gap-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                  Results
                </p>

                <p className="mt-1 text-xl font-bold text-white">
                  {filteredResults.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                  Categories
                </p>

                <p className="mt-1 text-xl font-bold text-white">
                  {categoryCount}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7 space-y-4">
            {filteredResults.map(
              (result, index) => (
                <article
                  key={`${result.title}-${index}`}
                  className="group rounded-2xl border border-slate-800 bg-slate-950/60 p-6 transition duration-200 hover:border-slate-700 hover:bg-slate-950"
                >
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-sm font-bold text-red-400">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-red-300">
                          {result.category}
                        </span>

                        <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-600">
                          Intelligence summary
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-bold leading-8 text-white transition group-hover:text-red-400 sm:text-2xl">
                        {result.title}
                      </h3>

                      <p className="mt-3 max-w-3xl leading-7 text-slate-400">
                        {result.summary}
                      </p>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>

          <div className="mt-7 rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
            <p className="text-sm leading-6 text-slate-400">
              <span className="font-semibold text-slate-200">
                Search note:
              </span>{" "}
              These results come from the intelligence
              topics currently indexed by
              PoliticalPulse. Live article analysis is
              available in the Live Intelligence feed
              below.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
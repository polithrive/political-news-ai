import { searchResults } from "../data/searchResults";

type SearchResultsProps = {
  searchTerm: string;
};

export default function SearchResults({
  searchTerm,
}: SearchResultsProps) {
  const filteredResults = searchResults.filter((result) =>
    `${result.title} ${result.category} ${result.summary}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (!searchTerm) return null;

  if (filteredResults.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-8 py-8">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-gray-400">
            No results found for <strong>&quot;{searchTerm}&quot;</strong>.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-8 py-8">
      <h2 className="mb-6 text-3xl font-bold">Search Results</h2>

      <div className="grid gap-4">
        {filteredResults.map((result) => (
          <div
            key={result.title}
            className="rounded-xl border border-slate-800 bg-slate-900 p-5"
          >
            <p className="font-semibold text-red-500">
              {result.category}
            </p>

            <h3 className="mt-2 text-xl font-bold">
              {result.title}
            </h3>

            <p className="mt-2 text-gray-400">
              {result.summary}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
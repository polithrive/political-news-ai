import { searchResults } from "../data/searchResults";

type SearchResultsProps = {
  searchTerm: string;
};

export default function SearchResults({ searchTerm }: SearchResultsProps) {
  const filteredResults = searchResults.filter((result) =>
    `${result.title} ${result.category} ${result.summary}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (!searchTerm) return null;
  if (filteredResults.length === 0) {
  return (
    <section className="max-w-7xl mx-auto px-8 py-8">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <p className="text-gray-400">
          No results found for "{searchTerm}".
        </p>
      </div>
    </section>
  );
}

  return (
    <section className="max-w-7xl mx-auto px-8 py-8">
      <h2 className="text-3xl font-bold mb-6">Search Results</h2>

      <div className="grid gap-4">
        {filteredResults.map((result) => (
          <div
            key={result.title}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
          >
            <p className="text-red-500 font-semibold">{result.category}</p>
            <h3 className="text-xl font-bold mt-2">{result.title}</h3>
            <p className="text-gray-400 mt-2">{result.summary}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
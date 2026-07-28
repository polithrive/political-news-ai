type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

export default function SearchBar({
  searchTerm,
  setSearchTerm,
}: SearchBarProps) {
  return (
    <section className="border-t border-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-500">
            AI Intelligence Search
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Ask about any political topic
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Search current events, legislation,
            politicians, elections, court cases,
            or policy debates and instantly explore
            AI-generated intelligence reports.
          </p>
        </div>

        <div className="mt-12 rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-2xl">
              🔎
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Try 'Ukraine funding', 'Immigration bill', 'Federal Reserve', 'Big Beautiful Bill'..."
              className="flex-1 bg-transparent text-lg text-white placeholder:text-slate-500 outline-none"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {[
            "Supreme Court",
            "Congress",
            "Federal Budget",
            "Immigration",
            "Healthcare",
            "Ukraine",
          ].map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setSearchTerm(topic)}
              className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-red-500 hover:text-white"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
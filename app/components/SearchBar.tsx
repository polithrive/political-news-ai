type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

const topics = [
  "Supreme Court",
  "Congress",
  "Federal Budget",
  "Immigration",
  "Healthcare",
  "Ukraine",
];

export default function SearchBar({
  searchTerm,
  setSearchTerm,
}: SearchBarProps) {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              Explore PoliticalPulse
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Search the issue you care about
            </h2>

            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Search current events, legislation,
              politicians, elections, court cases,
              and policy debates.
            </p>
          </div>

          <div>
            <div className="rounded-2xl border border-slate-300 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  🔎
                </div>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                  placeholder="Search political topics, people, policies, or events..."
                  className="min-w-0 flex-1 bg-transparent text-base text-slate-950 placeholder:text-slate-400 outline-none"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {topics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() =>
                    setSearchTerm(topic)
                  }
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

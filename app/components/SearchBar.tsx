type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

export default function SearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
  return (
    <section className="max-w-7xl mx-auto px-8 py-8">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Search Political News</h2>

        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search for politicians, bills, elections..."
          className="w-full rounded-lg bg-slate-800 p-4 text-white outline-none border border-slate-700 focus:border-red-500"
        />
      </div>
    </section>
  );
}
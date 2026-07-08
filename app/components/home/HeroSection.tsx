export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-20">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
          AI-Powered Political Intelligence
        </p>

        <h1 className="mt-4 text-5xl md:text-7xl font-bold leading-tight">
          Understand Politics.
          <span className="block text-red-500">
            Not Just Headlines.
          </span>
        </h1>

        <p className="mt-6 text-lg leading-8 text-gray-300">
          PoliticalPulse uses AI to explain political news, compare viewpoints,
          identify common ground, and help you understand what really matters.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            🧠 AI-Powered Analysis
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            ⚖️ Unbiased Perspectives
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            🤝 Find Common Ground
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            🛡️ Fact-Based Reporting
          </div>
        </div>
      </div>
    </section>
  );
}
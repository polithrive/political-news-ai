export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-600/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl"></div>
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-8 pt-36 pb-28 text-center">

        <div className="mb-6 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2 text-sm font-semibold text-red-400">
          LIVE AI • MULTIPLE PERSPECTIVES • REAL-TIME NEWS
        </div>

        <h1 className="max-w-5xl text-6xl font-black leading-tight tracking-tight md:text-7xl">
          Understand Politics.
          <br />
          <span className="text-red-500">
            Not Just Headlines.
          </span>
        </h1>

        <p className="mt-8 max-w-3xl text-xl leading-8 text-gray-400">
          PoliticalPulse uses AI to summarize breaking political news,
          compare viewpoints across the political spectrum,
          identify potential bias, and provide the context you need
          to make informed decisions.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <button className="rounded-xl bg-red-600 px-8 py-4 text-lg font-bold transition hover:scale-105 hover:bg-red-700">
            Explore Today's News
          </button>

          <button className="rounded-xl border border-slate-700 bg-slate-900 px-8 py-4 text-lg font-bold transition hover:border-red-500 hover:bg-slate-800">
            Learn More
          </button>
        </div>

        <div className="mt-20 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur">
            <div className="text-4xl">🧠</div>
            <h3 className="mt-4 text-xl font-bold">
              AI Summaries
            </h3>
            <p className="mt-2 text-gray-400">
              Get concise, neutral summaries of today's biggest political stories.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur">
            <div className="text-4xl">⚖️</div>
            <h3 className="mt-4 text-xl font-bold">
              Perspective Analysis
            </h3>
            <p className="mt-2 text-gray-400">
              Compare how different political viewpoints frame the same story.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur">
            <div className="text-4xl">📊</div>
            <h3 className="mt-4 text-xl font-bold">
              Bias Detection
            </h3>
            <p className="mt-2 text-gray-400">
              AI highlights wording, framing, and possible bias across sources.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
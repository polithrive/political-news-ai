import type { Article } from "../../types/article";

type ReportHeaderProps = {
  article: Article;
};

export default function ReportHeader({
  article,
}: ReportHeaderProps) {
  return (
    <header className="rounded-2xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden">
      {/* Intelligence Banner */}

      <div className="border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-8 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
          PoliticalPulse
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Intelligence Report
        </h1>

        <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-400">
          <span>🧠 AI Intelligence Engine v1</span>
          <span>📅 Generated Today</span>
          <span>⏱ 5 min read</span>
        </div>
      </div>

      {/* Story */}

      <div className="p-8">
        <h2 className="text-5xl font-bold leading-tight">
          {article.title}
        </h2>

        <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-400">
          <span>
            <strong>Source:</strong> {article.source.name}
          </span>

          <span>
            <strong>Published:</strong>{" "}
            {new Date(article.publishedAt).toLocaleString()}
          </span>
        </div>

        {article.urlToImage && (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="mt-8 h-[420px] w-full rounded-2xl object-cover"
          />
        )}

        <p className="mt-8 text-lg leading-8 text-slate-300">
          {article.description}
        </p>
      </div>
    </header>
  );
}
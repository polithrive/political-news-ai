import type { Article } from "@/app/types/article";
import type { IntelligencePreview } from "@/app/types/intelligencePreview";

type IntelligencePreviewCardProps = {
  article: Article | null;
  analysis: IntelligencePreview | null;
  isLoading: boolean;
  onOpenReport: () => void;
};

export default function IntelligencePreviewCard({ article, analysis, isLoading, onOpenReport }: IntelligencePreviewCardProps) {
  const metrics = [
    ["Bias Score", analysis?.biasScore !== undefined ? `${analysis.biasScore} / 100` : "--"],
    ["Political Lean", analysis?.lean ?? "Analyzing..."],
    ["Confidence", analysis?.confidence !== undefined ? `${analysis.confidence}%` : "--"],
    ["Trust Score™", analysis?.trustScore !== undefined ? `${analysis.trustScore}%` : "--"],
    ["Consensus", analysis?.consensusScore !== undefined ? `${analysis.consensusScore}%` : "--"],
    ["Sources", analysis?.sourcesReviewed !== undefined ? `${analysis.sourcesReviewed}` : "--"],
  ];

  const factCheck =
    analysis?.factCheck && typeof analysis.factCheck === "object"
      ? analysis.factCheck.verdict
      : typeof analysis?.factCheck === "string"
        ? analysis.factCheck
        : "Pending";

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
      <article>
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.20em] text-blue-600">PoliticalPulse Intelligence</p>
              <h2 className="mt-2 text-xl font-extrabold text-slate-950">Today&apos;s Top Story</h2>
            </div>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Live Analysis</span>
          </div>
        </div>

        <div className="p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-600">{article?.source?.name ?? "PoliticalPulse"}</p>
          <h3 className="mt-3 text-2xl font-extrabold leading-8 text-slate-950">{article?.title ?? "Loading featured political story..."}</h3>
          <p className="mt-4 text-sm font-medium leading-6 text-slate-600">
            {isLoading ? "Loading today's top political intelligence..." : analysis?.summary || article?.description || "PoliticalPulse is generating intelligence for this story."}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {metrics.map(([label,value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-950">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Fact Check</p>
            <p className="mt-2 text-lg font-extrabold text-slate-950">{factCheck}</p>
          </div>

          <button type="button" onClick={onOpenReport} disabled={!article} className="mt-6 flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
            Read Full Intelligence Report <span className="ml-2">→</span>
          </button>
        </div>
      </article>
    </div>
  );
}

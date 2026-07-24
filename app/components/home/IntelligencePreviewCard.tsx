import type { Article } from "@/app/types/article";
import type { IntelligencePreview } from "@/app/types/intelligencePreview";

import Card from "@/app/components/ui/Card";

type IntelligencePreviewCardProps = {
  article: Article | null;
  analysis: IntelligencePreview | null;
  isLoading: boolean;
  onOpenReport: () => void;
};

type IntelligenceMetricProps = {
  label: string;
  value: string;
  detail: string;
};

function IntelligenceMetric({
  label,
  value,
  detail,
}: IntelligenceMetricProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-400">
        {detail}
      </p>
    </div>
  );
}

export default function IntelligencePreviewCard({
  article,
  analysis,
  isLoading,
  onOpenReport,
}: IntelligencePreviewCardProps) {
  const biasScore =
    analysis?.biasScore !== undefined
      ? `${analysis.biasScore} / 100`
      : "--";

  const confidence =
    analysis?.confidence !== undefined
      ? `${analysis.confidence}%`
      : "--";

  const trustScore =
    analysis?.trustScore !== undefined
      ? `${analysis.trustScore}%`
      : "--";

  const consensusScore =
    analysis?.consensusScore !== undefined
      ? `${analysis.consensusScore}%`
      : "--";

  const sourcesReviewed =
    analysis?.sourcesReviewed !== undefined
      ? `${analysis.sourcesReviewed}`
      : "--";

  const lean =
    analysis?.lean ?? "Analyzing...";

  const summary =
    analysis?.summary ||
    article?.description ||
    "PoliticalPulse is generating intelligence for this story.";

  const factCheck =
    analysis?.factCheck &&
    typeof analysis.factCheck === "object"
      ? analysis.factCheck.verdict
      : typeof analysis?.factCheck === "string"
        ? analysis.factCheck
        : "Pending";

  return (
    <Card
      variant="intelligence"
      className="w-full max-w-xl overflow-hidden shadow-2xl shadow-black/30"
    >
      <article>
        <div className="border-b border-slate-800 bg-slate-950/60 px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-500">
                PoliticalPulse Intelligence
              </p>

              <h2 className="mt-2 text-xl font-bold text-white">
                Today&apos;s Top Story
              </h2>
            </div>

            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              Live Analysis
            </span>
          </div>
        </div>

        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-400">
            {article?.source?.name ?? "PoliticalPulse"}
          </p>

          <h3 className="mt-3 text-xl font-bold text-white">
            {article?.title ??
              "Loading featured political story..."}
          </h3>

          <p className="mt-4 text-sm font-medium leading-6 text-slate-400">
            {isLoading
              ? "Loading today's top political intelligence..."
              : summary}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <IntelligenceMetric
              label="Bias Score"
              value={biasScore}
              detail="Political framing analysis"
            />

            <IntelligenceMetric
              label="Political Lean"
              value={lean}
              detail="AI perspective analysis"
            />

            <IntelligenceMetric
              label="Confidence"
              value={confidence}
              detail="AI analytical confidence"
            />

            <IntelligenceMetric
              label="Fact Check"
              value={factCheck}
              detail="Verification status"
            />

            <IntelligenceMetric
              label="Trust Score™"
              value={trustScore}
              detail="Source credibility analysis"
            />

            <IntelligenceMetric
              label="Consensus"
              value={consensusScore}
              detail="Common ground across viewpoints"
            />

            <IntelligenceMetric
              label="Sources"
              value={sourcesReviewed}
              detail="Sources analyzed"
            />
          </div>

          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  PoliticalPulse Analysis
                </p>

                <p className="mt-2 text-lg font-bold text-white">
                  {analysis
                    ? "AI Intelligence Complete"
                    : "Generating Intelligence"}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-sm font-bold text-red-300">
                {analysis ? "AI" : "..."}
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full bg-red-500 transition-all duration-500 ${
                  analysis ? "w-full" : "w-1/3"
                }`}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenReport}
            disabled={!article}
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-white px-5 py-4 font-semibold text-slate-950 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Read Full Intelligence Report

            <span
              aria-hidden="true"
              className="ml-2"
            >
              →
            </span>
          </button>
        </div>
      </article>
    </Card>
  );
}
import type { IntelligenceReport } from "../../types/report";

type ExecutiveSummaryProps = {
  report: IntelligenceReport;
};

function formatBiasLabel(
  biasScore: number
) {
  if (biasScore <= -20) {
    return "Left";
  }

  if (biasScore >= 20) {
    return "Right";
  }

  return "Center";
}

export default function ExecutiveSummary({
  report,
}: ExecutiveSummaryProps) {
  const confidence =
    Math.round(
      report.overview.confidence
    );

  const bias =
    formatBiasLabel(
      report.overview.biasScore
    );

  const sourceCount =
    report.trustScore.sourceCount ??
    report.overview.sourcesReviewed;

  return (
    <section className="h-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-sm">
      <div className="border-b border-slate-800 px-5 py-4 sm:px-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-red-400">
          AI Executive Summary
        </p>

        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
          Executive Brief
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          The central assessment, reliability signals, and political framing in one place.
        </p>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
              Confidence
            </p>

            <p className="mt-2 text-2xl font-extrabold text-white">
              {confidence}%
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
              Bias
            </p>

            <p className="mt-2 text-2xl font-extrabold text-white">
              {bias}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
              Evidence
            </p>

            <p className="mt-2 text-2xl font-extrabold text-white">
              {report.trustScore.evidenceStrength}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
              Sources
            </p>

            <p className="mt-2 text-2xl font-extrabold text-white">
              {sourceCount}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
            Key Assessment
          </p>

          <p className="mt-3 text-lg leading-8 text-slate-100 sm:text-xl sm:leading-9">
            {report.executiveSummary}
          </p>
        </div>
      </div>
    </section>
  );
}

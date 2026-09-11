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
    <section className="h-full overflow-hidden rounded-3xl border border-[#17446D]/70 bg-[#04162C]/95 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
      <div className="border-b border-[#17446D]/60 px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#55C8FF]">
              Executive Intelligence
            </p>

            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
              Executive Brief
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8EA3B7]">
              The central assessment, reliability signals, and political framing in one place.
            </p>
          </div>

          <span className="rounded-full border border-[#38BDF8]/20 bg-[#38BDF8]/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-[#7DD3FC]">
            AI Analysis
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-[#17446D]/65 bg-[#020D21]/70 p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#6F879F]">
              Confidence
            </p>

            <p className="mt-2 text-2xl font-extrabold text-white">
              {confidence}%
            </p>
          </div>

          <div className="rounded-2xl border border-[#17446D]/65 bg-[#020D21]/70 p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#6F879F]">
              Bias
            </p>

            <p className="mt-2 text-2xl font-extrabold text-white">
              {bias}
            </p>
          </div>

          <div className="rounded-2xl border border-[#17446D]/65 bg-[#020D21]/70 p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#6F879F]">
              Evidence
            </p>

            <p className="mt-2 text-2xl font-extrabold text-white">
              {report.trustScore.evidenceStrength}
            </p>
          </div>

          <div className="rounded-2xl border border-[#17446D]/65 bg-[#020D21]/70 p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#6F879F]">
              Sources
            </p>

            <p className="mt-2 text-2xl font-extrabold text-white">
              {sourceCount}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[#17446D]/55 bg-[#061A31]/70 p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#55C8FF]">
            Key Assessment
          </p>

          <p className="mt-3 text-lg leading-8 text-[#E6EDF4] sm:text-xl sm:leading-9">
            {report.executiveSummary}
          </p>
        </div>
      </div>
    </section>
  );
}
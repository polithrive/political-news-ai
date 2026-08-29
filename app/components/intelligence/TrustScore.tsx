import type { TrustScore as TrustScoreData } from "@/app/types/trust";

type TrustScoreProps = {
  trustScore: TrustScoreData;
};

function getScoreLabel(
  score: number
): string {
  if (score >= 85) {
    return "Very High";
  }

  if (score >= 70) {
    return "High";
  }

  if (score >= 50) {
    return "Moderate";
  }

  return "Limited";
}

function formatReportingAgreement(
  value: number | null
): string {
  return value === null
    ? "N/A"
    : `${value}%`;
}

export default function TrustScore({
  trustScore,
}: TrustScoreProps) {
  const score =
    Math.max(
      0,
      Math.min(
        100,
        trustScore.overall
      )
    );

  return (
    <section className="h-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-sm">
      <div className="border-b border-slate-800 px-5 py-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-red-400">
          PoliticalPulse Trust Score
        </p>

        <h2 className="mt-2 text-xl font-extrabold text-white">
          Report confidence
        </h2>
      </div>

      <div className="p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-end gap-2">
              <span className="text-6xl font-black leading-none text-white">
                {score}
              </span>

              <span className="pb-1 text-lg font-bold text-slate-500">
                /100
              </span>
            </div>

            <p className="mt-2 text-sm font-bold text-slate-300">
              {getScoreLabel(score)} confidence
            </p>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-red-300">
              Evidence
            </p>

            <p className="mt-1 text-lg font-extrabold text-white">
              {trustScore.evidenceStrength}
            </p>
          </div>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-red-500"
            style={{
              width: `${score}%`,
            }}
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs font-bold text-slate-500">
              Sources
            </p>

            <p className="mt-2 text-2xl font-extrabold text-white">
              {trustScore.sourceCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs font-bold text-slate-500">
              Agreement
            </p>

            <p className="mt-2 text-2xl font-extrabold text-white">
              {formatReportingAgreement(
                trustScore.reportingAgreement
              )}
            </p>
          </div>

          <div className="col-span-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs font-bold text-slate-500">
              Political diversity
            </p>

            <p className="mt-2 text-lg font-extrabold text-white">
              {trustScore.politicalDiversity}
            </p>
          </div>
        </div>

        {trustScore.sourceCount <= 1 ? (
          <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
            <p className="text-sm leading-6 text-amber-100">
              Independent corroboration is not yet available for this report.
            </p>
          </div>
        ) : null}

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Trust Score summarizes the strength of the available reporting. It is not a guarantee that every claim is correct.
        </p>
      </div>
    </section>
  );
}

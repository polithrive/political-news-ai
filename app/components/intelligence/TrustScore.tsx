import type { TrustScore as TrustScoreData } from "@/app/types/trust";

type TrustScoreProps = {
  trustScore: TrustScoreData;
};

function getScoreLabel(score: number): string {
  if (score >= 85) {
    return "Very High Confidence";
  }

  if (score >= 70) {
    return "High Confidence";
  }

  if (score >= 50) {
    return "Moderate Confidence";
  }

  return "Limited Confidence";
}

function getProgressWidth(score: number): string {
  return `${Math.max(0, Math.min(100, score))}%`;
}

export default function TrustScore({
  trustScore,
}: TrustScoreProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
      <div className="border-b border-slate-800 bg-gradient-to-r from-red-950/30 via-slate-900 to-slate-900 px-6 py-5 md:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
          PoliticalPulse Trust Score
        </p>

        <h2 className="mt-2 text-2xl font-bold text-white">
          Confidence in this intelligence report
        </h2>

        <p className="mt-3 max-w-3xl text-slate-400">
          This score summarizes reporting agreement, source quality, evidence
          strength, and political diversity across the available coverage.
        </p>
      </div>

      <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[280px_1fr]">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-400">
            Overall Score
          </p>

          <div className="mt-4 flex items-end justify-center gap-2">
            <span className="text-7xl font-black leading-none text-white">
              {trustScore.overall}
            </span>

            <span className="pb-2 text-2xl font-bold text-slate-500">
              /100
            </span>
          </div>

          <p className="mt-4 font-semibold text-slate-200">
            {getScoreLabel(trustScore.overall)}
          </p>
        </div>

        <div>
          <div className="h-4 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-red-500 transition-all duration-700"
              style={{
                width: getProgressWidth(trustScore.overall),
              }}
            />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <MetricCard
              label="Evidence Strength"
              value={trustScore.evidenceStrength}
              description="Quality and consistency of available evidence"
            />

            <MetricCard
              label="Reporting Agreement"
              value={`${trustScore.reportingAgreement}%`}
              description="Preliminary agreement across the source set"
            />

            <MetricCard
              label="Sources Reviewed"
              value={String(trustScore.sourceCount)}
              description="Distinct reporting sources included"
            />

            <MetricCard
              label="Political Diversity"
              value={trustScore.politicalDiversity}
              description="Range of perspectives represented"
            />
          </div>

          <p className="mt-6 text-sm leading-6 text-slate-500">
            The Trust Score reflects the strength of the available reporting.
            It does not guarantee that every claim is correct and should not be
            treated as a substitute for independent verification.
          </p>
        </div>
      </div>
    </section>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  description: string;
};

function MetricCard({
  label,
  value,
  description,
}: MetricCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-2 text-sm leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}
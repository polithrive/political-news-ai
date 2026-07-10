import type { SourceAnalysis } from "@/app/types/source";

type Props = {
  analysis: SourceAnalysis;
};

export default function SourceIntelligence({ analysis }: Props) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
        Source Intelligence
      </p>

      <h2 className="mt-2 text-2xl font-bold text-white">
        {analysis.sourceName}
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <InfoCard label="Reliability" value={`${analysis.reliabilityScore}/100`} />
        <InfoCard label="Political Lean" value={analysis.politicalLean} />
        <InfoCard label="Factual Reporting" value={analysis.factualReporting} />
        <InfoCard label="Historical Accuracy" value={analysis.historicalAccuracy} />
        <InfoCard label="Opinion Level" value={analysis.opinionLevel} />
        <InfoCard label="Coverage Style" value={analysis.coverageStyle} />
      </div>

      <div className="mt-6 rounded-xl bg-slate-800 p-4">
        <p className="text-sm font-semibold text-red-400">
          PoliticalPulse Insight
        </p>

        <p className="mt-2 text-slate-300">
          {analysis.summary}
        </p>
      </div>
    </section>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-800 p-4">
      <p className="text-xs uppercase text-slate-400">
        {label}
      </p>

      <p className="mt-2 font-semibold text-white">
        {value}
      </p>
    </div>
  );
}
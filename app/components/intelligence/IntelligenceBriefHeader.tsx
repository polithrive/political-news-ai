import type { IntelligenceBrief } from "@/app/types/intelligenceBrief";

type Props = {
  brief: IntelligenceBrief;
};

export default function IntelligenceBriefHeader({ brief }: Props) {
  return (
    <section className="rounded-2xl border border-red-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
            PoliticalPulse Intelligence Brief
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Intelligence Score
          </h1>
        </div>

        <div className="text-right">
          <p className="text-5xl font-bold text-white">
            {brief.intelligenceScore}
          </p>

          <p className="text-sm text-slate-400">
            /100
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Metric
          label="Confidence"
          value={`${brief.confidence}%`}
        />

        <Metric
          label="Reading Time"
          value={`${brief.readingTime} min`}
        />

        <Metric
          label="Importance"
          value={brief.importance}
        />

        <Metric
          label="Generated"
          value={brief.generatedAt}
        />
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-800 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-white">
        {value}
      </p>
    </div>
  );
}
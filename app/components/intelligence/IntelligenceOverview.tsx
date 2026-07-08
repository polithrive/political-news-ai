import type { IntelligenceReport } from "../../types/report";
import ReportSection from "./ReportSection";
import PoliticalSpectrum from "./PoliticalSpectrum";

type IntelligenceOverviewProps = {
  report: IntelligenceReport;
};

function SignalBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-white">{value}%</p>
      </div>

      <div className="h-3 rounded-full bg-slate-800">
        <div
          className="h-3 rounded-full bg-red-600"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function IntelligenceOverview({
  report,
}: IntelligenceOverviewProps) {
  return (
    <ReportSection
      title="Intelligence Signals"
      subtitle="How to interpret this story"
      icon="📊"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SignalBar
          label="Confidence"
          value={report.overview.confidence}
        />

      <div className="md:col-span-2">
  <PoliticalSpectrum lean="Center" />
</div>

        <SignalBar label="Evidence Strength" value={82} />

        <SignalBar label="Polarization" value={68} />

        <SignalBar label="Story Complexity" value={74} />

        <SignalBar label="Source Reliability" value={90} />
      </div>

      <div className="mt-6 rounded-xl bg-slate-800 p-5">
        <p className="text-sm text-slate-400">Story Category</p>
        <p className="mt-2 text-xl font-bold text-white">
          {report.overview.category}
        </p>
      </div>
    </ReportSection>
  );
}
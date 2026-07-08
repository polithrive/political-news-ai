import ReportSection from "./intelligence/ReportSection";

export default function SourceComparison() {
  return (
    <ReportSection
      title="Source Comparison"
      subtitle="How different outlets frame this story"
      icon="📰"
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <h3 className="font-bold text-white">Reuters</h3>
          <p className="mt-2 text-slate-300">
            Focuses primarily on the legislative process and economic implications.
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <h3 className="font-bold text-white">Associated Press</h3>
          <p className="mt-2 text-slate-300">
            Presents a straightforward summary emphasizing verified facts.
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <h3 className="font-bold text-white">PoliticalPulse Observation</h3>

          <p className="mt-3 leading-7 text-slate-300">
            While the reporting is largely consistent across major outlets,
            differences emerge in what each publication emphasizes.
            The underlying facts remain substantially aligned.
          </p>
        </div>
      </div>
    </ReportSection>
  );
}
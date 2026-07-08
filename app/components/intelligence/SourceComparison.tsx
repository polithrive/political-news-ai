import ReportSection from "./ReportSection";

export default function SourceComparison() {
  return (
    <ReportSection
      title="Source Comparison"
      subtitle="How different news outlets frame this story"
      icon="📰"
    >
      <div className="space-y-4">

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <h3 className="text-lg font-bold text-white">Reuters</h3>
          <p className="mt-2 text-slate-300">
            Focuses primarily on the legislative process and economic impact.
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <h3 className="text-lg font-bold text-white">
            Associated Press
          </h3>
          <p className="mt-2 text-slate-300">
            Presents the event with a straightforward emphasis on verified facts.
          </p>
        </div>

        <div className="rounded-xl border border-green-700 bg-green-950/20 p-5">
          <h3 className="text-lg font-bold text-green-300">
            PoliticalPulse Observation
          </h3>

          <p className="mt-3 leading-7 text-slate-300">
            While reporting differs in emphasis, the major factual events remain
            consistent across reputable sources. Differences primarily involve
            framing and interpretation rather than the underlying facts.
          </p>
        </div>

      </div>
    </ReportSection>
  );
}
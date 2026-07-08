import type { IntelligenceReport } from "../../types/report";
import ReportSection from "./ReportSection";

type KeyFactsProps = {
  report: IntelligenceReport;
};

export default function KeyFacts({ report }: KeyFactsProps) {
  return (
    <ReportSection
      title="Key Facts"
      subtitle="What we know so far"
      icon="✓"
    >
      <div className="space-y-4">
        {report.keyFacts.length > 0 ? (
          report.keyFacts.map((fact, index) => (
            <div key={index} className="rounded-xl bg-slate-800 p-5">
              <p className="text-slate-200">{fact}</p>
            </div>
          ))
        ) : (
          <p className="text-slate-400">Key facts are being generated.</p>
        )}
      </div>
    </ReportSection>
  );
}
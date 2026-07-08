import ReportSection from "./ReportSection";
import type { IntelligenceReport } from "@/app/types/report";

type FactCheckProps = {
  report: IntelligenceReport;
};

export default function FactCheck({ report }: FactCheckProps) {
  return (
    <ReportSection
      title="Fact Check"
      subtitle="AI assessment of factual reliability"
      icon="✔️"
    >
      <div className="rounded-xl border border-blue-800 bg-blue-950/30 p-6">
        <h3 className="text-xl font-bold text-blue-300">
          {report.factCheck.verdict}
        </h3>

        <p className="mt-4 text-slate-300 leading-7">
          {report.factCheck.explanation}
        </p>
      </div>
    </ReportSection>
  );
}
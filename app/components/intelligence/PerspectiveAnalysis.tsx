import ReportSection from "./ReportSection";
import type { IntelligenceReport } from "../../types/report";

type PerspectiveAnalysisProps = {
  report: IntelligenceReport;
};

export default function PerspectiveAnalysis({
  report,
}: PerspectiveAnalysisProps) {
  return (
    <ReportSection
      title="Perspective Analysis"
      subtitle="How different viewpoints interpret this story"
      icon="⚖️"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl bg-blue-950/40 border border-blue-800 p-6">
          <h3 className="text-xl font-bold text-blue-300">
            Left Perspective
          </h3>

          <p className="mt-4 leading-7 text-slate-300">
            {report.perspectives.left}
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 border border-slate-700 p-6">
          <h3 className="text-xl font-bold text-white">
            Center Perspective
          </h3>

          <p className="mt-4 leading-7 text-slate-300">
            {report.perspectives.center}
          </p>
        </div>

        <div className="rounded-xl bg-red-950/40 border border-red-800 p-6">
          <h3 className="text-xl font-bold text-red-300">
            Right Perspective
          </h3>

          <p className="mt-4 leading-7 text-slate-300">
            {report.perspectives.right}
          </p>
        </div>
      </div>
    </ReportSection>
  );
}
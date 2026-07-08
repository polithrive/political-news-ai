import type { IntelligenceReport } from "../../types/report";
import ReportSection from "./ReportSection";

type ExecutiveSummaryProps = {
  report: IntelligenceReport;
};

export default function ExecutiveSummary({ report }: ExecutiveSummaryProps) {
  return (
    <ReportSection
      title="Executive Brief"
      subtitle="30-second intelligence briefing"
      icon="🧠"
    >
      <p className="text-lg leading-8 text-slate-200">
        {report.executiveSummary}
      </p>
    </ReportSection>
  );
}
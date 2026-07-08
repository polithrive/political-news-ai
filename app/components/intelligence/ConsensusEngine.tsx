import ReportSection from "./ReportSection";
import type { IntelligenceReport } from "../../types/report";

type ConsensusEngineProps = {
  report: IntelligenceReport;
};

export default function ConsensusEngine({
  report,
}: ConsensusEngineProps) {
  return (
    <ReportSection
      title="Consensus Engine"
      subtitle="Where perspectives find common ground"
      icon="🤝"
    >
      <div className="rounded-xl border border-green-800 bg-green-950/30 p-6">
        <h3 className="text-xl font-bold text-green-300">
          Areas of Agreement
        </h3>

        <ul className="mt-5 space-y-4">
        {(report.commonGround ?? []).map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-slate-200"
            >
              <span className="text-green-400 font-bold">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </ReportSection>
  );
}
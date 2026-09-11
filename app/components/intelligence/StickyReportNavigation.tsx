import type { IntelligenceReport } from "@/app/types/report";

import ReadingTime from "./ReadingTime";
import ReportMetrics from "./ReportMetrics";
import ReportNavigation from "./ReportNavigation";

type StickyReportNavigationProps = {
  report?: IntelligenceReport | null;
};

const WORDS_PER_MINUTE = 225;
const DEFAULT_READING_TIME_MINUTES = 10;

function calculateReadingTime(
  report?: IntelligenceReport | null
) {
  if (!report) {
    return DEFAULT_READING_TIME_MINUTES;
  }

  const reportText = JSON.stringify(report);

  const wordCount = reportText
    .replace(/[{}[\]",:]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(
    1,
    Math.ceil(wordCount / WORDS_PER_MINUTE)
  );
}

export default function StickyReportNavigation({
  report,
}: StickyReportNavigationProps) {
  const readingTime =
    calculateReadingTime(report);

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-6">
        <div className="max-h-[calc(100vh-3rem)] overflow-y-auto rounded-2xl border border-[#17446D]/70 bg-[#04162C]/95 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
          <div className="mb-3 border-b border-[#17446D]/55 px-2 pb-3">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#FF5161]">
              The Angle Report
            </p>

            <p className="mt-2 text-lg font-extrabold tracking-tight text-white">
              Report sections
            </p>

            <p className="mt-1 text-xs leading-5 text-[#8EA3B7]">
              Follow the analysis from the executive briefing through deeper context and evidence.
            </p>
          </div>

          <div className="space-y-3">
            <ReportNavigation />

            <ReadingTime
              minutes={readingTime}
            />

            <ReportMetrics
              report={report}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
import type { IntelligenceReport } from "@/app/types/report";

import { colors } from "@/lib/design/theme";

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
        <div
          className="max-h-[calc(100vh-3rem)] overflow-y-auto rounded-2xl border p-3 shadow-[0_16px_45px_rgba(37,54,74,0.08)]"
          style={{
            backgroundColor:
              colors.background.surface,
            borderColor: colors.border.default,
          }}
        >
          <div className="space-y-3">
            <ReportNavigation />

            <ReadingTime minutes={readingTime} />

            <ReportMetrics report={report} />
          </div>
        </div>
      </div>
    </aside>
  );
}
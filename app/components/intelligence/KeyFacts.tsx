import type { IntelligenceReport } from "../../types/report";

import { colors } from "@/lib/design/theme";

import ReportSection from "./ReportSection";

type KeyFactsProps = {
  report: IntelligenceReport;
};

export default function KeyFacts({
  report,
}: KeyFactsProps) {
  const hasKeyFacts = report.keyFacts.length > 0;

  return (
    <ReportSection
      title="Key Facts"
      subtitle="The most important confirmed details from the reporting"
      icon="✓"
    >
      {hasKeyFacts ? (
        <ol
          aria-label="Key facts from the intelligence report"
          className="grid gap-4"
        >
          {report.keyFacts.map((fact, index) => {
            const factNumber = String(index + 1).padStart(
              2,
              "0"
            );

            return (
              <li
                key={`${fact}-${index}`}
                className="group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-6"
                style={{
                  backgroundColor:
                    colors.background.elevated,
                  borderColor: colors.border.default,
                }}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 transition-all duration-300 group-hover:w-1.5"
                  style={{
                    backgroundColor:
                      colors.brand.primary,
                  }}
                />

                <div className="flex items-start gap-4 sm:gap-5">
                  <div
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-xs font-bold tracking-[0.12em]"
                    style={{
                      backgroundColor:
                        colors.background.surface,
                      borderColor:
                        colors.border.default,
                      color: colors.brand.primary,
                    }}
                  >
                    {factNumber}
                  </div>

                  <p
                    className="pt-1 text-base leading-7 sm:text-lg sm:leading-8"
                    style={{
                      color: colors.text.primary,
                    }}
                  >
                    {fact}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <div
          role="status"
          className="rounded-2xl border border-dashed p-6 sm:p-8"
          style={{
            backgroundColor: colors.background.elevated,
            borderColor: colors.border.default,
          }}
        >
          <p
            className="text-sm leading-6"
            style={{
              color: colors.text.secondary,
            }}
          >
            Key facts are still being generated for this
            intelligence report.
          </p>
        </div>
      )}
    </ReportSection>
  );
}
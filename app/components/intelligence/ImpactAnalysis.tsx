import type { IntelligenceReport } from "@/app/types/report";

import AnalysisCard from "@/app/components/ui/AnalysisCard";
import SectionHeader from "@/app/components/ui/SectionHeader";

import { colors } from "@/lib/design/theme";

type ImpactAnalysisProps = {
  report: IntelligenceReport;
};

export default function ImpactAnalysis({
  report,
}: ImpactAnalysisProps) {
  const hasAffectedGroups =
    report.whoIsAffected.length > 0;

  const hasUnansweredQuestions =
    report.unansweredQuestions.length > 0;

  return (
    <section
      aria-label="Impact analysis"
      className="relative overflow-hidden rounded-3xl border p-6 shadow-[0_20px_55px_rgba(37,54,74,0.08)] sm:p-8 lg:p-10"
      style={{
        backgroundColor:
          colors.background.surface,
        borderColor:
          colors.border.default,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full blur-3xl"
        style={{
          backgroundColor:
            `${colors.status.info}12`,
        }}
      />

      <div className="relative">
        <SectionHeader
          eyebrow="Impact Analysis"
          title="What This Story Means"
          subtitle="PoliticalPulse analyzes why the story matters, who may be affected, and what could happen next."
        />

        <div className="mt-8">
          <AnalysisCard
            eyebrow="Central Significance"
            title="Why This Story Matters"
            accent="primary"
          >
            <p
              className="text-base leading-7 sm:text-lg sm:leading-8"
              style={{
                color: colors.text.primary,
              }}
            >
              {report.whyThisMatters}
            </p>
          </AnalysisCard>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <AnalysisCard
            eyebrow="Stakeholder Impact"
            title="Who Is Most Affected"
            accent="info"
          >
            {hasAffectedGroups ? (
              <ul
                aria-label="Groups most affected"
                className="space-y-3"
              >
                {report.whoIsAffected.map(
                  (group, index) => (
                    <li
                      key={`${group}-${index}`}
                      className="flex items-start gap-3"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-2 w-2 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            colors.status.info,
                        }}
                      />

                      <span
                        className="text-sm leading-7 sm:text-base"
                        style={{
                          color:
                            colors.text.secondary,
                        }}
                      >
                        {group}
                      </span>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p
                className="text-sm leading-7 sm:text-base"
                style={{
                  color: colors.text.muted,
                }}
              >
                The affected groups could not be
                determined from the available
                information.
              </p>
            )}
          </AnalysisCard>

          <AnalysisCard
            eyebrow="Open Intelligence Gaps"
            title="Questions Still Unanswered"
            accent="warning"
          >
            {hasUnansweredQuestions ? (
              <ul
                aria-label="Unanswered questions"
                className="space-y-3"
              >
                {report.unansweredQuestions.map(
                  (question, index) => (
                    <li
                      key={`${question}-${index}`}
                      className="flex items-start gap-3"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-2 w-2 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            colors.status.warning,
                        }}
                      />

                      <span
                        className="text-sm leading-7 sm:text-base"
                        style={{
                          color:
                            colors.text.secondary,
                        }}
                      >
                        {question}
                      </span>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p
                className="text-sm leading-7 sm:text-base"
                style={{
                  color: colors.text.muted,
                }}
              >
                No major unanswered questions were
                identified.
              </p>
            )}
          </AnalysisCard>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <AnalysisCard
            eyebrow="Near-Term Outlook"
            title="Short-Term Impact"
            accent="warning"
          >
            <p
              className="text-sm leading-7 sm:text-base"
              style={{
                color: colors.text.secondary,
              }}
            >
              {report.shortTermImpact}
            </p>
          </AnalysisCard>

          <AnalysisCard
            eyebrow="Strategic Outlook"
            title="Long-Term Impact"
            accent="success"
          >
            <p
              className="text-sm leading-7 sm:text-base"
              style={{
                color: colors.text.secondary,
              }}
            >
              {report.longTermImpact}
            </p>
          </AnalysisCard>
        </div>
      </div>
    </section>
  );
}
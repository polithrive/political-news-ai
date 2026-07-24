import type { IntelligenceReport } from "@/app/types/report";

import AnalysisCard from "@/app/components/ui/AnalysisCard";
import MetricCard from "@/app/components/ui/MetricCard";
import SectionHeader from "@/app/components/ui/SectionHeader";

import { colors } from "@/lib/design/theme";

type EvidencePanelProps = {
  report: IntelligenceReport;
};

type EvidenceListProps = {
  items: string[];
  emptyMessage: string;
  accentColor: string;
};

function clampPercentage(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, value));
}

function formatAnalyzedDate(value: string): string {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getConfidenceLabel(
  confidence: number
): string {
  if (confidence >= 80) {
    return "High confidence";
  }

  if (confidence >= 60) {
    return "Moderate confidence";
  }

  return "Limited confidence";
}

function getConfidenceAccent(
  confidence: number
): "success" | "warning" | "primary" {
  if (confidence >= 80) {
    return "success";
  }

  if (confidence >= 60) {
    return "warning";
  }

  return "primary";
}

function EvidenceList({
  items,
  emptyMessage,
  accentColor,
}: EvidenceListProps) {
  if (items.length === 0) {
    return (
      <div
        role="status"
        className="mt-5 rounded-xl border border-dashed p-4"
        style={{
          backgroundColor: colors.background.surface,
          borderColor: colors.border.default,
        }}
      >
        <p
          className="text-sm leading-6"
          style={{
            color: colors.text.muted,
          }}
        >
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <ol className="mt-5 space-y-3">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex items-start gap-3 rounded-xl border p-4"
          style={{
            backgroundColor: colors.background.surface,
            borderColor: colors.border.default,
          }}
        >
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
            style={{
              backgroundColor: `${accentColor}10`,
              borderColor: `${accentColor}35`,
              color: accentColor,
            }}
          >
            {index + 1}
          </span>

          <p
            className="text-sm leading-7 sm:text-base"
            style={{
              color: colors.text.secondary,
            }}
          >
            {item}
          </p>
        </li>
      ))}
    </ol>
  );
}

export default function EvidencePanel({
  report,
}: EvidencePanelProps) {
  const { evidence, overview } = report;

  const confidence = clampPercentage(
    overview.confidence
  );

  const sourcesReviewed = Math.max(
    0,
    overview.sourcesReviewed
  );

  const confidenceLabel =
    getConfidenceLabel(confidence);

  const confidenceAccent =
    getConfidenceAccent(confidence);

  const analyzedDate = formatAnalyzedDate(
    evidence.lastAnalyzedAt
  );

  return (
    <section
      aria-label="Evidence and confidence"
      className="relative overflow-hidden rounded-3xl border p-6 shadow-2xl shadow-black/20 sm:p-8 lg:p-10"
      style={{
        backgroundColor: colors.background.surface,
        borderColor: colors.border.default,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl"
        style={{
          backgroundColor: `${colors.status.success}0D`,
        }}
      />

      <div className="relative">
        <SectionHeader
          eyebrow="Evidence & Confidence"
          title="How PoliticalPulse Reached This Assessment"
          subtitle="Review the evidence, reporting signals, and methodology used to generate this intelligence report."
        />

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Overall Confidence"
            value={`${confidence}%`}
            description={confidenceLabel}
            accent={confidenceAccent}
          />

          <MetricCard
            label="Sources Reviewed"
            value={sourcesReviewed}
            description="Reporting inputs analyzed"
            accent="info"
          />

          <MetricCard
            label="Primary Evidence"
            value={evidence.primarySources.length}
            description="Supporting signals identified"
            accent="success"
          />

          <MetricCard
            label="Reporting Conflicts"
            value={
              evidence.conflictingReporting.length
            }
            description="Disagreements requiring context"
            accent={
              evidence.conflictingReporting.length > 0
                ? "warning"
                : "success"
            }
          />
        </div>

        <div
          className="mt-6 rounded-2xl border p-5 sm:p-6"
          style={{
            backgroundColor:
              colors.background.elevated,
            borderColor: colors.border.default,
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.18em]"
                style={{
                  color: colors.text.muted,
                }}
              >
                Assessment Confidence
              </p>

              <p
                className="mt-1 text-sm font-semibold"
                style={{
                  color: colors.text.primary,
                }}
              >
                {confidenceLabel}
              </p>
            </div>

            <p
              className="text-2xl font-bold"
              style={{
                color:
                  confidence >= 80
                    ? colors.status.success
                    : confidence >= 60
                      ? colors.status.warning
                      : colors.brand.primary,
              }}
            >
              {confidence}%
            </p>
          </div>

          <div
            className="mt-4 h-2.5 overflow-hidden rounded-full"
            style={{
              backgroundColor:
                colors.background.surface,
            }}
          >
            <div
              role="progressbar"
              aria-label="Overall report confidence"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={confidence}
              className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{
                width: `${confidence}%`,
                backgroundColor:
                  confidence >= 80
                    ? colors.status.success
                    : confidence >= 60
                      ? colors.status.warning
                      : colors.brand.primary,
              }}
            />
          </div>

          <p
            className="mt-4 text-sm leading-6"
            style={{
              color: colors.text.muted,
            }}
          >
            Confidence reflects the strength,
            consistency, and completeness of the
            available reporting. It does not guarantee
            that every underlying claim is correct.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <AnalysisCard
            eyebrow="Supporting Material"
            title="Primary Evidence"
            accent="success"
            className="h-full"
          >
            <p
              className="text-sm leading-6"
              style={{
                color: colors.text.muted,
              }}
            >
              The strongest source signals and factual
              inputs supporting the report’s assessment.
            </p>

            <EvidenceList
              items={evidence.primarySources}
              emptyMessage="No primary evidence sources were provided for this report."
              accentColor={colors.status.success}
            />
          </AnalysisCard>

          <AnalysisCard
            eyebrow="Areas of Uncertainty"
            title="Conflicting Reporting"
            accent="warning"
            className="h-full"
          >
            <p
              className="text-sm leading-6"
              style={{
                color: colors.text.muted,
              }}
            >
              Claims, interpretations, or details that
              differ across the available reporting.
            </p>

            <EvidenceList
              items={evidence.conflictingReporting}
              emptyMessage="No major reporting conflicts were identified."
              accentColor={colors.status.warning}
            />
          </AnalysisCard>
        </div>

        <div className="mt-6">
          <AnalysisCard
            eyebrow="Analytical Process"
            title="AI Methodology"
            accent="info"
          >
            <p
              className="text-sm leading-7 sm:text-base sm:leading-8"
              style={{
                color: colors.text.secondary,
              }}
            >
              {evidence.methodology ||
                "Methodology details were not available for this report."}
            </p>

            <div
              className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-2"
              style={{
                borderColor: colors.border.default,
              }}
            >
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.16em]"
                  style={{
                    color: colors.text.muted,
                  }}
                >
                  Sources Reviewed
                </p>

                <p
                  className="mt-2 text-base font-semibold"
                  style={{
                    color: colors.text.primary,
                  }}
                >
                  {sourcesReviewed}
                </p>
              </div>

              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.16em]"
                  style={{
                    color: colors.text.muted,
                  }}
                >
                  Last Analyzed
                </p>

                <p
                  className="mt-2 text-base font-semibold"
                  style={{
                    color: colors.text.primary,
                  }}
                >
                  {analyzedDate}
                </p>
              </div>
            </div>
          </AnalysisCard>
        </div>

        <div
          className="mt-6 rounded-xl border px-4 py-4 sm:px-5"
          style={{
            backgroundColor: `${colors.status.info}0A`,
            borderColor: `${colors.status.info}25`,
          }}
        >
          <p
            className="text-sm leading-6"
            style={{
              color: colors.text.secondary,
            }}
          >
            PoliticalPulse assessments are analytical
            summaries generated from available reporting.
            Readers should review original sources before
            making legal, financial, civic, or personal
            decisions.
          </p>
        </div>
      </div>
    </section>
  );
}
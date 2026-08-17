import type { TrustScore as TrustScoreData } from "@/app/types/trust";

import MetricCard from "@/app/components/ui/MetricCard";

import { colors } from "@/lib/design/theme";

type TrustScoreProps = {
  trustScore: TrustScoreData;
};

function getScoreLabel(
  score: number
): string {
  if (score >= 85) {
    return "Very High Confidence";
  }

  if (score >= 70) {
    return "High Confidence";
  }

  if (score >= 50) {
    return "Moderate Confidence";
  }

  return "Limited Confidence";
}

function getProgressWidth(
  score: number
): string {
  return `${Math.max(
    0,
    Math.min(100, score)
  )}%`;
}

function formatReportingAgreement(
  reportingAgreement: number | null
): string {
  if (reportingAgreement === null) {
    return "N/A";
  }

  return `${reportingAgreement}%`;
}

function getReportingAgreementDescription(
  reportingAgreement: number | null,
  sourceCount: number
): string {
  if (
    reportingAgreement === null &&
    sourceCount <= 1
  ) {
    return "Requires multiple independent sources";
  }

  if (reportingAgreement === null) {
    return "Not enough evidence to calculate";
  }

  return "Agreement across independent reporting";
}

export default function TrustScore({
  trustScore,
}: TrustScoreProps) {
  const reportingAgreement =
    formatReportingAgreement(
      trustScore.reportingAgreement
    );

  const reportingAgreementDescription =
    getReportingAgreementDescription(
      trustScore.reportingAgreement,
      trustScore.sourceCount
    );

  return (
    <section
      className="overflow-hidden rounded-3xl border shadow-[0_20px_55px_rgba(37,54,74,0.08)]"
      style={{
        backgroundColor:
          colors.background.surface,
        borderColor:
          colors.border.default,
      }}
    >
      <div
        className="border-b px-6 py-6 md:px-8"
        style={{
          backgroundColor:
            colors.background.elevated,
          borderColor:
            colors.border.subtle,
        }}
      >
        <p
          className="text-xs font-bold uppercase tracking-[0.18em]"
          style={{
            color:
              colors.brand.primary,
          }}
        >
          PoliticalPulse Trust Score
        </p>

        <h2
          className="mt-2 text-2xl font-bold tracking-tight md:text-3xl"
          style={{
            color:
              colors.text.primary,
          }}
        >
          Confidence in this intelligence report
        </h2>

        <p
          className="mt-3 max-w-3xl text-base leading-7"
          style={{
            color:
              colors.text.secondary,
          }}
        >
          This score summarizes source quality,
          evidence strength, corroboration, and
          political diversity across the available
          coverage.
        </p>
      </div>

      <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div
          className="flex flex-col items-center justify-center rounded-2xl border p-8 text-center"
          style={{
            backgroundColor:
              colors.brand.primarySoft,
            borderColor:
              colors.border.brand,
          }}
        >
          <p
            className="text-sm font-semibold uppercase tracking-wide"
            style={{
              color:
                colors.brand.primaryHover,
            }}
          >
            Overall Score
          </p>

          <div className="mt-4 flex items-end justify-center gap-2">
            <span
              className="text-7xl font-black leading-none"
              style={{
                color:
                  colors.text.primary,
              }}
            >
              {trustScore.overall}
            </span>

            <span
              className="pb-2 text-2xl font-bold"
              style={{
                color:
                  colors.text.muted,
              }}
            >
              /100
            </span>
          </div>

          <p
            className="mt-4 font-semibold"
            style={{
              color:
                colors.text.secondary,
            }}
          >
            {getScoreLabel(
              trustScore.overall
            )}
          </p>
        </div>

        <div>
          <div
            className="h-3 overflow-hidden rounded-full"
            style={{
              backgroundColor:
                colors.background.muted,
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width:
                  getProgressWidth(
                    trustScore.overall
                  ),
                backgroundColor:
                  colors.brand.primary,
              }}
            />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <MetricCard
              label="Evidence Strength"
              value={
                trustScore.evidenceStrength
              }
              description="Strength and corroboration of available evidence"
              accent={
                trustScore.evidenceStrength ===
                "High"
                  ? "success"
                  : trustScore.evidenceStrength ===
                      "Medium"
                    ? "info"
                    : "warning"
              }
            />

            <MetricCard
              label="Reporting Agreement"
              value={
                reportingAgreement
              }
              description={
                reportingAgreementDescription
              }
              accent={
                trustScore.reportingAgreement ===
                null
                  ? "warning"
                  : "info"
              }
            />

            <MetricCard
              label="Sources Reviewed"
              value={String(
                trustScore.sourceCount
              )}
              description="Distinct reporting sources included"
              accent="primary"
            />

            <MetricCard
              label="Political Diversity"
              value={
                trustScore.politicalDiversity
              }
              description="Range of source perspectives represented"
              accent="warning"
            />
          </div>

          {trustScore.sourceCount <= 1 ? (
            <div
              className="mt-6 rounded-xl border px-4 py-3"
              style={{
                backgroundColor:
                  colors.status.warningSoft,
                borderColor:
                  `${colors.status.warning}35`,
              }}
            >
              <p
                className="text-sm leading-6"
                style={{
                  color:
                    colors.text.secondary,
                }}
              >
                This report currently relies on a
                single reporting source. Independent
                corroboration and cross-source
                agreement cannot yet be measured.
              </p>
            </div>
          ) : null}

          <p
            className="mt-6 text-sm leading-6"
            style={{
              color:
                colors.text.muted,
            }}
          >
            The Trust Score reflects the strength of
            the available reporting. It does not
            guarantee that every claim is correct and
            should not be treated as a substitute for
            independent verification.
          </p>
        </div>
      </div>
    </section>
  );
}
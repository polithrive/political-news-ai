import type { IntelligenceReport } from "../../types/report";

import AnimatedCounter from "../ui/AnimatedCounter";
import MetricCard from "../ui/MetricCard";
import SectionHeader from "../ui/SectionHeader";

import { colors } from "@/lib/design/theme";

type ExecutiveSummaryProps = {
  report: IntelligenceReport;
};

function formatBiasLabel(biasScore: number) {
  if (biasScore <= -20) {
    return "Left";
  }

  if (biasScore >= 20) {
    return "Right";
  }

  return "Center";
}

function getBiasAccent(
  bias: ReturnType<typeof formatBiasLabel>
): "info" | "success" | "warning" {
  if (bias === "Left") {
    return "info";
  }

  if (bias === "Right") {
    return "warning";
  }

  return "success";
}

function getEvidenceAccent(
  evidenceStrength: IntelligenceReport["trustScore"]["evidenceStrength"]
): "success" | "info" | "warning" {
  if (evidenceStrength === "High") {
    return "success";
  }

  if (evidenceStrength === "Medium") {
    return "info";
  }

  return "warning";
}

export default function ExecutiveSummary({
  report,
}: ExecutiveSummaryProps) {
  const confidence = Math.round(
    report.overview.confidence
  );

  const bias = formatBiasLabel(
    report.overview.biasScore
  );

  const evidence =
    report.trustScore.evidenceStrength;

  const sourceCount =
    report.trustScore.sourceCount ??
    report.overview.sourcesReviewed;

  return (
    <section
      aria-label="Executive summary"
      className="relative overflow-hidden rounded-3xl border p-6 shadow-2xl shadow-black/20 sm:p-8 lg:p-10"
      style={{
        backgroundColor: colors.background.surface,
        borderColor: colors.border.default,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
        style={{
          backgroundColor: `${colors.brand.primary}18`,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full blur-3xl"
        style={{
          backgroundColor: `${colors.status.info}0D`,
        }}
      />

      <div className="relative">
        <SectionHeader
          eyebrow="AI Executive Summary"
          title="Executive Brief"
          subtitle="A concise intelligence briefing covering the report's central findings, reliability, and political framing."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Confidence"
            value={
              <AnimatedCounter
                value={confidence}
                suffix="%"
              />
            }
            description="AI confidence in the overall analysis."
            accent="primary"
          />

          <MetricCard
            label="Political Bias"
            value={bias}
            description="Detected framing across the analyzed reporting."
            accent={getBiasAccent(bias)}
          />

          <MetricCard
            label="Evidence Strength"
            value={evidence}
            description="Quality and consistency of supporting evidence."
            accent={getEvidenceAccent(evidence)}
          />

          <MetricCard
            label="Sources Reviewed"
            value={
              <AnimatedCounter value={sourceCount} />
            }
            description="Sources considered while building this report."
            accent="info"
          />
        </div>

        <div className="pt-8">
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="h-8 w-1 rounded-full"
              style={{
                backgroundColor: colors.brand.primary,
              }}
            />

            <h3
              className="text-sm font-semibold uppercase tracking-[0.18em]"
              style={{
                color: colors.text.muted,
              }}
            >
              Key Assessment
            </h3>
          </div>

          <p
            className="mt-5 max-w-5xl text-lg leading-8 sm:text-xl sm:leading-9"
            style={{
              color: colors.text.primary,
            }}
          >
            {report.executiveSummary}
          </p>
        </div>
      </div>
    </section>
  );
}
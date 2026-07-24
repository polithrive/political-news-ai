import type { IntelligenceReport } from "@/app/types/report";

import { colors } from "@/lib/design/theme";

import ReportSection from "./ReportSection";

type FactCheckProps = {
  report: IntelligenceReport;
};

type VerdictTone =
  | "success"
  | "info"
  | "warning"
  | "primary";

type VerdictPresentation = {
  label: string;
  tone: VerdictTone;
  description: string;
};

const toneColors = {
  primary: colors.brand.primary,
  success: colors.status.success,
  info: colors.status.info,
  warning: colors.status.warning,
} as const;

function getVerdictPresentation(
  verdict: string
): VerdictPresentation {
  const normalizedVerdict = verdict
    .trim()
    .toLowerCase();

  if (
    normalizedVerdict.includes("true") ||
    normalizedVerdict.includes("verified") ||
    normalizedVerdict.includes("accurate") ||
    normalizedVerdict.includes("supported")
  ) {
    return {
      label: verdict,
      tone: "success",
      description:
        "The available evidence generally supports the central factual claims.",
    };
  }

  if (
    normalizedVerdict.includes("false") ||
    normalizedVerdict.includes("misleading") ||
    normalizedVerdict.includes("inaccurate") ||
    normalizedVerdict.includes("unsupported")
  ) {
    return {
      label: verdict,
      tone: "warning",
      description:
        "The available evidence raises concerns about the accuracy or framing of the claims.",
    };
  }

  if (
    normalizedVerdict.includes("mixed") ||
    normalizedVerdict.includes("partial") ||
    normalizedVerdict.includes("context")
  ) {
    return {
      label: verdict,
      tone: "info",
      description:
        "Some claims are supported, while others require additional context or qualification.",
    };
  }

  return {
    label: verdict || "Assessment Pending",
    tone: "primary",
    description:
      "PoliticalPulse evaluated the available reporting and supporting evidence.",
  };
}

export default function FactCheck({
  report,
}: FactCheckProps) {
  const verdict = getVerdictPresentation(
    report.factCheck.verdict
  );

  const accentColor =
    toneColors[verdict.tone];

  return (
    <ReportSection
      title="Fact Check"
      subtitle="AI assessment of factual reliability and supporting evidence"
      icon="✓"
    >
      <article
        aria-labelledby="fact-check-verdict"
        className="relative overflow-hidden rounded-2xl border p-6 shadow-lg shadow-black/10 sm:p-8"
        style={{
          backgroundColor:
            colors.background.elevated,
          borderColor: colors.border.default,
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1.5"
          style={{
            backgroundColor: accentColor,
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full blur-3xl"
          style={{
            backgroundColor: `${accentColor}14`,
          }}
        />

        <div className="relative pl-2">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-3xl">
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: colors.text.muted,
                }}
              >
                Reliability Verdict
              </p>

              <h3
                id="fact-check-verdict"
                className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl"
                style={{
                  color: colors.text.primary,
                }}
              >
                {verdict.label}
              </h3>

              <p
                className="mt-3 text-sm leading-6 sm:text-base sm:leading-7"
                style={{
                  color: colors.text.secondary,
                }}
              >
                {verdict.description}
              </p>
            </div>

            <div
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border px-4 py-2"
              style={{
                backgroundColor: `${accentColor}12`,
                borderColor: `${accentColor}40`,
                color: accentColor,
              }}
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: accentColor,
                }}
              />

              <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                AI Assessment
              </span>
            </div>
          </div>

          <div
            className="my-7 h-px"
            style={{
              backgroundColor: colors.border.default,
            }}
          />

          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{
                color: accentColor,
              }}
            >
              Supporting Analysis
            </p>

            <p
              className="mt-4 text-base leading-8 sm:text-lg sm:leading-8"
              style={{
                color: colors.text.primary,
              }}
            >
              {report.factCheck.explanation}
            </p>
          </div>
        </div>
      </article>
    </ReportSection>
  );
}
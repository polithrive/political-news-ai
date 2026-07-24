import type { IntelligenceReport } from "../../types/report";

import AnalysisCard from "../ui/AnalysisCard";

import { colors } from "@/lib/design/theme";

import ReportSection from "./ReportSection";

type PerspectiveAnalysisProps = {
  report: IntelligenceReport;
};

type PerspectiveCardProps = {
  title: string;
  label: string;
  perspective: string;
  accent: "info" | "primary" | "warning";
};

const accentColors = {
  info: colors.status.info,
  primary: colors.brand.primary,
  warning: colors.status.warning,
} as const;

function PerspectiveCard({
  title,
  label,
  perspective,
  accent,
}: PerspectiveCardProps) {
  const accentColor = accentColors[accent];

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-6"
      style={{
        backgroundColor: colors.background.elevated,
        borderColor: colors.border.default,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1"
        style={{
          backgroundColor: accentColor,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl"
        style={{
          backgroundColor: `${accentColor}12`,
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{
                color: accentColor,
              }}
            >
              {label}
            </p>

            <h3
              className="mt-2 text-xl font-semibold tracking-tight"
              style={{
                color: colors.text.primary,
              }}
            >
              {title}
            </h3>
          </div>

          <div
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
            style={{
              backgroundColor: `${accentColor}10`,
              borderColor: `${accentColor}35`,
              color: accentColor,
            }}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-current" />
          </div>
        </div>

        <div
          className="my-5 h-px"
          style={{
            backgroundColor: colors.border.default,
          }}
        />

        <p
          className="text-sm leading-7 sm:text-base sm:leading-8"
          style={{
            color: colors.text.secondary,
          }}
        >
          {perspective}
        </p>
      </div>
    </article>
  );
}

export default function PerspectiveAnalysis({
  report,
}: PerspectiveAnalysisProps) {
  return (
    <ReportSection
      title="Perspective Analysis"
      subtitle="How different political viewpoints may interpret the same reporting"
      icon="⚖️"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <PerspectiveCard
          title="Left Perspective"
          label="Progressive Framing"
          perspective={report.perspectives.left}
          accent="info"
        />

        <PerspectiveCard
          title="Center Perspective"
          label="Centrist Framing"
          perspective={report.perspectives.center}
          accent="primary"
        />

        <PerspectiveCard
          title="Right Perspective"
          label="Conservative Framing"
          perspective={report.perspectives.right}
          accent="warning"
        />
      </div>

      <div className="mt-6">
        <AnalysisCard
          eyebrow="Reading the Landscape"
          title="How to Use These Perspectives"
          accent="primary"
        >
          <p
            className="text-sm leading-7 sm:text-base sm:leading-8"
            style={{
              color: colors.text.secondary,
            }}
          >
            These summaries show how the same facts may be
            emphasized, interpreted, or prioritized differently.
            They are intended to clarify political framing—not to
            suggest that every person within a political group
            holds the same view.
          </p>
        </AnalysisCard>
      </div>
    </ReportSection>
  );
}
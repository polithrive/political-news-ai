import type { IntelligenceReport } from "../../types/report";

import MetricCard from "../ui/MetricCard";
import SectionHeader from "../ui/SectionHeader";

import { colors } from "@/lib/design/theme";

import PoliticalSpectrum from "./PoliticalSpectrum";

type IntelligenceOverviewProps = {
  report: IntelligenceReport;
};

type SignalBarProps = {
  label: string;
  value: number;
  description: string;
};

function clampScore(value: number) {
  return Math.max(
    0,
    Math.min(100, Math.round(value))
  );
}

function SignalBar({
  label,
  value,
  description,
}: SignalBarProps) {
  const normalizedValue =
    clampScore(value);

  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        backgroundColor:
          colors.background.elevated,
        borderColor:
          colors.border.default,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="text-sm font-semibold"
            style={{
              color: colors.text.primary,
            }}
          >
            {label}
          </p>

          <p
            className="mt-1 text-sm leading-5"
            style={{
              color: colors.text.muted,
            }}
          >
            {description}
          </p>
        </div>

        <span
          className="shrink-0 text-lg font-bold"
          style={{
            color: colors.brand.navy,
          }}
        >
          {normalizedValue}%
        </span>
      </div>

      <div
        className="mt-4 h-2.5 overflow-hidden rounded-full"
        style={{
          backgroundColor:
            colors.background.muted,
        }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${normalizedValue}%`,
            backgroundColor:
              colors.brand.secondary,
          }}
        />
      </div>
    </div>
  );
}

export default function IntelligenceOverview({
  report,
}: IntelligenceOverviewProps) {
  const confidence =
    clampScore(
      report.overview.confidence
    );

  return (
    <section
      aria-label="Intelligence overview"
      className="overflow-hidden rounded-3xl border p-6 shadow-[0_20px_55px_rgba(37,54,74,0.08)] sm:p-8"
      style={{
        backgroundColor:
          colors.background.surface,
        borderColor:
          colors.border.default,
      }}
    >
      <SectionHeader
        eyebrow="Intelligence Signals"
        title="How to interpret this story"
        subtitle="A quick read of the report's confidence, political framing, complexity, and source quality."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <SignalBar
          label="Confidence"
          value={confidence}
          description="Overall confidence in the generated intelligence."
        />

        <SignalBar
          label="Evidence Strength"
          value={82}
          description="Strength and consistency of the supporting evidence."
        />

        <SignalBar
          label="Polarization"
          value={68}
          description="How politically divided the story appears to be."
        />

        <SignalBar
          label="Story Complexity"
          value={74}
          description="How much context is needed to understand the issue."
        />

        <SignalBar
          label="Source Reliability"
          value={90}
          description="Estimated quality of the reporting used in analysis."
        />

        <MetricCard
          label="Story Category"
          value={
            report.overview.category
          }
          description="Primary topic classification for this intelligence report."
          accent="primary"
        />
      </div>

      <div
        className="mt-6 rounded-2xl border p-5"
        style={{
          backgroundColor:
            colors.background.elevated,
          borderColor:
            colors.border.default,
        }}
      >
        <p
          className="text-xs font-bold uppercase tracking-[0.16em]"
          style={{
            color: colors.brand.primary,
          }}
        >
          Political Positioning
        </p>

        <div className="mt-4">
          <PoliticalSpectrum lean="Center" />
        </div>
      </div>
    </section>
  );
}
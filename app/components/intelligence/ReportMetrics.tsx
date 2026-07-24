"use client";

import type { ReactNode } from "react";

import type { IntelligenceReport } from "@/app/types/report";

import AnimatedCounter from "@/app/components/ui/AnimatedCounter";

type ReportMetricsProps = {
  report?: IntelligenceReport | null;
};

type MetricItemProps = {
  label: string;
  value: ReactNode;
};

function MetricItem({
  label,
  value,
}: MetricItemProps) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function formatBiasLabel(
  biasScore: number
) {
  if (biasScore <= -20) {
    return "Left";
  }

  if (biasScore >= 20) {
    return "Right";
  }

  return "Center";
}

export default function ReportMetrics({
  report,
}: ReportMetricsProps) {
  const confidence =
    report?.overview.confidence ?? 0;

  const bias = report
    ? formatBiasLabel(
        report.overview.biasScore
      )
    : "Analyzing";

  const evidenceStrength =
    report?.trustScore.evidenceStrength ??
    "Analyzing";

  const sourceCount =
    report?.trustScore.sourceCount ??
    report?.overview.sourcesReviewed ??
    0;

  return (
    <section
      aria-label="Intelligence report metrics"
      className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
        Report Intelligence
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <MetricItem
          label="Confidence"
          value={
            report ? (
              <AnimatedCounter
                value={Math.round(confidence)}
                suffix="%"
              />
            ) : (
              "Analyzing"
            )
          }
        />

        <MetricItem
          label="Bias"
          value={bias}
        />

        <MetricItem
          label="Evidence"
          value={evidenceStrength}
        />

        <MetricItem
          label="Sources"
          value={
            report ? (
              <AnimatedCounter
                value={sourceCount}
              />
            ) : (
              "—"
            )
          }
        />
      </div>

      {!report ? (
        <p className="mt-4 text-xs leading-5 text-slate-500">
          Report metrics will appear as soon as the
          analysis is complete.
        </p>
      ) : null}
    </section>
  );
}
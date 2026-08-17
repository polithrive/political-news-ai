import type { IntelligenceReport } from "../../types/report";

import AnalysisCard from "../ui/AnalysisCard";
import AnimatedCounter from "../ui/AnimatedCounter";
import SectionHeader from "../ui/SectionHeader";

import { colors } from "@/lib/design/theme";

type ConsensusEngineProps = {
  report: IntelligenceReport;
};

function clampScore(score: number) {
  return Math.max(
    0,
    Math.min(100, Math.round(score))
  );
}

function getConsensusLabel(score: number) {
  if (score >= 80) {
    return "Strong Common Ground";
  }

  if (score >= 60) {
    return "Meaningful Common Ground";
  }

  if (score >= 40) {
    return "Mixed Agreement";
  }

  if (score >= 20) {
    return "Limited Agreement";
  }

  return "Little Common Ground";
}

export default function ConsensusEngine({
  report,
}: ConsensusEngineProps) {
  const commonGround =
    report.commonGround ?? [];

  const consensusScore =
    clampScore(
      report.consensusScore ?? 0
    );

  const hasCommonGround =
    commonGround.length > 0;

  const consensusLabel =
    getConsensusLabel(consensusScore);

  return (
    <section
      aria-label="Consensus analysis"
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
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl"
        style={{
          backgroundColor:
            `${colors.status.success}10`,
        }}
      />

      <div className="relative">
        <SectionHeader
          eyebrow="Consensus Engine"
          title="Where the Sides Find Common Ground"
          subtitle="Identify the facts, concerns, and conclusions that different political perspectives share."
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <AnalysisCard
            eyebrow="Areas of Agreement"
            title="Shared Conclusions"
            accent="success"
          >
            {hasCommonGround ? (
              <ol
                aria-label="Areas of political agreement"
                className="space-y-4"
              >
                {commonGround.map(
                  (item, index) => (
                    <li
                      key={`${item}-${index}`}
                      className="flex items-start gap-4"
                    >
                      <div
                        aria-hidden="true"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold"
                        style={{
                          backgroundColor:
                            colors.status
                              .successSoft,
                          borderColor:
                            `${colors.status.success}35`,
                          color:
                            colors.status.success,
                        }}
                      >
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </div>

                      <p
                        className="pt-0.5 text-sm leading-7 sm:text-base"
                        style={{
                          color:
                            colors.text.secondary,
                        }}
                      >
                        {item}
                      </p>
                    </li>
                  )
                )}
              </ol>
            ) : (
              <div
                role="status"
                className="rounded-xl border border-dashed p-5"
                style={{
                  backgroundColor:
                    colors.background.surface,
                  borderColor:
                    colors.border.default,
                }}
              >
                <p
                  className="text-sm leading-6"
                  style={{
                    color: colors.text.muted,
                  }}
                >
                  Common-ground analysis is still
                  being generated for this report.
                </p>
              </div>
            )}
          </AnalysisCard>

          <article
            aria-label={`Consensus score: ${consensusScore} percent`}
            className="relative overflow-hidden rounded-2xl border p-6"
            style={{
              backgroundColor:
                colors.background.elevated,
              borderColor:
                colors.border.default,
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1"
              style={{
                backgroundColor:
                  colors.status.success,
              }}
            />

            <p
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{
                color: colors.text.muted,
              }}
            >
              Consensus Score
            </p>

            <div className="mt-5 flex items-end gap-2">
              <span
                className="text-5xl font-bold tracking-tight"
                style={{
                  color: colors.text.primary,
                }}
              >
                <AnimatedCounter
                  value={consensusScore}
                />
              </span>

              <span
                className="pb-1 text-lg font-semibold"
                style={{
                  color: colors.text.muted,
                }}
              >
                %
              </span>
            </div>

            <p
              className="mt-3 text-sm font-semibold"
              style={{
                color:
                  colors.status.success,
              }}
            >
              {consensusLabel}
            </p>

            <div
              className="mt-6 h-2.5 overflow-hidden rounded-full"
              style={{
                backgroundColor:
                  colors.background.muted,
              }}
            >
              <div
                className="h-full rounded-full transition-[width] duration-700 ease-out"
                style={{
                  width: `${consensusScore}%`,
                  backgroundColor:
                    colors.status.success,
                }}
              />
            </div>

            <p
              className="mt-5 text-sm leading-6"
              style={{
                color: colors.text.secondary,
              }}
            >
              Measures how strongly the analyzed
              perspectives converge on shared facts,
              concerns, or conclusions.
            </p>
          </article>
        </div>

        <div
          className="mt-6 rounded-2xl border p-5 sm:p-6"
          style={{
            backgroundColor:
              colors.background.elevated,
            borderColor:
              colors.border.default,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-lg font-semibold"
              style={{
                backgroundColor:
                  colors.status.infoSoft,
                borderColor:
                  `${colors.status.info}35`,
                color: colors.status.info,
              }}
            >
              ≈
            </div>

            <div>
              <h3
                className="text-base font-semibold"
                style={{
                  color:
                    colors.text.primary,
                }}
              >
                What consensus means here
              </h3>

              <p
                className="mt-2 text-sm leading-6 sm:text-base sm:leading-7"
                style={{
                  color:
                    colors.text.secondary,
                }}
              >
                Consensus does not mean every
                political perspective agrees on the
                causes, solutions, or broader
                implications. It identifies the
                points where differing viewpoints
                reach the same underlying
                conclusion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
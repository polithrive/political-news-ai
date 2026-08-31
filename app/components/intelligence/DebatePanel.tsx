import type {
  DebatePerspective,
  IntelligenceReport,
} from "@/app/types/report";

import AnalysisCard from "@/app/components/ui/AnalysisCard";
import SectionHeader from "@/app/components/ui/SectionHeader";

import { colors } from "@/lib/design/theme";

type DebatePanelProps = {
  report: IntelligenceReport;
};

type PerspectiveTone =
  | "info"
  | "primary"
  | "warning";

type PerspectiveCardProps = {
  eyebrow: string;
  title: string;
  perspective: DebatePerspective;
  tone: PerspectiveTone;
};

type InsightListProps = {
  items: string[];
  emptyMessage: string;
  color: string;
};

const perspectiveColors = {
  info: colors.status.info,
  primary: colors.brand.primary,
  warning: colors.status.warning,
} as const;

function InsightList({
  items,
  emptyMessage,
  color,
}: InsightListProps) {
  if (items.length === 0) {
    return (
      <p
        className="mt-3 text-sm leading-6"
        style={{
          color: colors.text.muted,
        }}
      >
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="mt-3 space-y-3">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex gap-3 text-sm leading-6"
          style={{
            color: colors.text.secondary,
          }}
        >
          <span
            aria-hidden="true"
            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
            style={{
              backgroundColor: color,
            }}
          />

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PerspectiveCard({
  eyebrow,
  title,
  perspective,
  tone,
}: PerspectiveCardProps) {
  const accentColor =
    perspectiveColors[tone];

  return (
    <article
      className="relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
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
          backgroundColor: accentColor,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl"
        style={{
          backgroundColor:
            `${accentColor}10`,
        }}
      />

      <div className="relative">
        <p
          className="text-xs font-semibold uppercase tracking-[0.18em]"
          style={{
            color: accentColor,
          }}
        >
          {eyebrow}
        </p>

        <h3
          className="mt-2 text-xl font-semibold tracking-tight"
          style={{
            color: colors.text.primary,
          }}
        >
          {title}
        </h3>

        <div className="mt-6">
          <h4
            className="text-sm font-semibold"
            style={{
              color: colors.text.primary,
            }}
          >
            Strongest arguments
          </h4>

          <InsightList
            items={
              perspective.strongestArguments
            }
            emptyMessage="The current analysis did not identify distinct supporting arguments."
            color={accentColor}
          />
        </div>

        <div
          className="mt-6 border-t pt-5"
          style={{
            borderColor:
              colors.border.default,
          }}
        >
          <h4
            className="text-sm font-semibold"
            style={{
              color: colors.text.primary,
            }}
          >
            Primary concerns
          </h4>

          <InsightList
            items={
              perspective.primaryConcerns
            }
            emptyMessage="The current analysis did not identify distinct concerns."
            color={accentColor}
          />
        </div>
      </div>
    </article>
  );
}

function getDebateTemperatureLabel(
  temperature: number
): string {
  if (temperature >= 80) {
    return "Highly polarized";
  }

  if (temperature >= 60) {
    return "Strong disagreement";
  }

  if (temperature >= 40) {
    return "Meaningful disagreement";
  }

  if (temperature >= 20) {
    return "Limited disagreement";
  }

  return "Broad agreement";
}

function clampTemperature(
  temperature: number
) {
  return Math.max(
    0,
    Math.min(100, temperature)
  );
}

export default function DebatePanel({
  report,
}: DebatePanelProps) {
  const perspectiveAnalysis =
    report.perspectiveAnalysis;

  const progressive =
    perspectiveAnalysis?.progressive ?? {
      position:
        report.perspectives.left ||
        "A progressive perspective is not available from the current analysis.",
      strongestArguments: [],
      primaryConcerns: [],
    };

  const centrist =
    perspectiveAnalysis?.centrist ?? {
      position:
        report.perspectives.center ||
        "A centrist perspective is not available from the current analysis.",
      strongestArguments: [],
      primaryConcerns: [],
    };

  const conservative =
    perspectiveAnalysis?.conservative ?? {
      position:
        report.perspectives.right ||
        "A conservative perspective is not available from the current analysis.",
      strongestArguments: [],
      primaryConcerns: [],
    };

  const mainDisagreements =
    perspectiveAnalysis
      ?.mainDisagreements ?? [];

  const debateTemperature =
    clampTemperature(
      perspectiveAnalysis
        ?.debateTemperature ?? 50
    );

  const debateTemperatureLabel =
    getDebateTemperatureLabel(
      debateTemperature
    );

  const topic =
    perspectiveAnalysis?.topic ||
    report.article.title ||
    "The central political debate";

  const politicalPulseAnalysis =
    perspectiveAnalysis
      ?.politicalPulseAnalysis ||
    "PoliticalPulse identified the primary arguments and areas of disagreement, but a dedicated neutral synthesis was not available.";

  return (
    <section
      aria-label="Political debate analysis"
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
            `${colors.brand.primary}10`,
        }}
      />

      <div className="relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <SectionHeader
            eyebrow="PoliticalPulse Debate™"
            title="Where the Political Debate Really Stands"
            subtitle="Compare the strongest arguments and concerns across progressive, centrist, and conservative viewpoints while identifying the central areas of disagreement."
          />

          <div
            className="w-full shrink-0 rounded-2xl border p-5 lg:max-w-xs"
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
                  className="text-xs font-semibold uppercase tracking-[0.16em]"
                  style={{
                    color:
                      colors.text.muted,
                  }}
                >
                  Debate Temperature
                </p>

                <p
                  className="mt-2 text-lg font-semibold"
                  style={{
                    color:
                      colors.text.primary,
                  }}
                >
                  {debateTemperatureLabel}
                </p>
              </div>

              <div className="text-right">
                <span
                  className="text-3xl font-bold tracking-tight"
                  style={{
                    color:
                      colors.text.primary,
                  }}
                >
                  {debateTemperature}
                </span>

                <span
                  className="ml-1 text-sm font-semibold"
                  style={{
                    color:
                      colors.text.muted,
                  }}
                >
                  /100
                </span>
              </div>
            </div>

            <div
              className="mt-5 h-2.5 overflow-hidden rounded-full"
              style={{
                backgroundColor:
                  colors.background.muted,
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width:
                    `${debateTemperature}%`,
                  backgroundColor:
                    colors.brand.primary,
                }}
                aria-hidden="true"
              />
            </div>

            <div className="mt-2 flex justify-between">
              <span
                className="text-[11px] font-medium"
                style={{
                  color: colors.text.muted,
                }}
              >
                Agreement
              </span>

              <span
                className="text-[11px] font-medium"
                style={{
                  color: colors.text.muted,
                }}
              >
                Polarized
              </span>
            </div>
          </div>
        </div>

        <div
          className="mt-8 rounded-2xl border p-5 sm:p-6"
          style={{
            backgroundColor:
              colors.brand.primarySoft,
            borderColor:
              colors.border.brand,
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-[0.18em]"
            style={{
              color:
                colors.brand.primaryHover,
            }}
          >
            Central Debate
          </p>

          <p
            className="mt-3 text-lg font-semibold leading-8 sm:text-xl"
            style={{
              color: colors.text.primary,
            }}
          >
            {topic}
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <PerspectiveCard
            eyebrow="Progressive Analysis"
            title="Progressive Arguments"
            perspective={progressive}
            tone="info"
          />

          <PerspectiveCard
            eyebrow="Centrist Analysis"
            title="Centrist Arguments"
            perspective={centrist}
            tone="primary"
          />

          <PerspectiveCard
            eyebrow="Conservative Analysis"
            title="Conservative Arguments"
            perspective={conservative}
            tone="warning"
          />
        </div>

        <div className="mt-8">
          <AnalysisCard
            eyebrow="Areas of Disagreement"
            title="Where the Sides Diverge"
            accent="warning"
          >
            <InsightList
              items={mainDisagreements}
              emptyMessage="The current analysis did not identify specific disagreements beyond the arguments described above."
              color={
                colors.status.warning
              }
            />
          </AnalysisCard>
        </div>

        <div className="mt-8">
          <AnalysisCard
            eyebrow="PoliticalPulse Synthesis"
            title="What the Debate Is Really About"
            accent="info"
          >
            <p
              className="text-base leading-8 sm:text-lg"
              style={{
                color:
                  colors.text.primary,
              }}
            >
              {politicalPulseAnalysis}
            </p>
          </AnalysisCard>
        </div>

        <div
          className="mt-6 rounded-xl border px-5 py-4"
          style={{
            backgroundColor:
              colors.background.elevated,
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
            These arguments summarize how different political viewpoints may interpret and debate the available information. They do not represent endorsements by PoliticalPulse.
          </p>
        </div>
      </div>
    </section>
  );
}
import type { IntelligenceReport } from "@/app/types/report";

type EvidencePanelProps = {
  report: IntelligenceReport;
};

type EvidenceListProps = {
  items: string[];
  emptyMessage: string;
  accent: "cyan" | "amber";
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

function getConfidenceStyles(
  confidence: number
) {
  if (confidence >= 80) {
    return {
      text: "text-emerald-400",
      bar: "bg-emerald-400",
      border: "border-emerald-400/25",
      background: "bg-emerald-400/[0.06]",
    };
  }

  if (confidence >= 60) {
    return {
      text: "text-amber-400",
      bar: "bg-amber-400",
      border: "border-amber-400/25",
      background: "bg-amber-400/[0.06]",
    };
  }

  return {
    text: "text-[#55C8FF]",
    bar: "bg-[#38BDF8]",
    border: "border-[#38BDF8]/25",
    background: "bg-[#38BDF8]/[0.06]",
  };
}

function EvidenceList({
  items,
  emptyMessage,
  accent,
}: EvidenceListProps) {
  const accentStyles =
    accent === "cyan"
      ? {
          number:
            "border-[#38BDF8]/35 bg-[#38BDF8]/10 text-[#55C8FF]",
          bullet: "bg-[#38BDF8]",
        }
      : {
          number:
            "border-amber-400/35 bg-amber-400/10 text-amber-300",
          bullet: "bg-amber-400",
        };

  if (items.length === 0) {
    return (
      <div
        role="status"
        className="mt-5 rounded-xl border border-dashed border-[#214B70]/70 bg-[#020D21]/45 p-4"
      >
        <p className="text-sm leading-6 text-[#8299AE]">
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
          className="flex items-start gap-3 rounded-xl border border-[#17446D]/65 bg-[#020D21]/55 p-4"
        >
          <span
            aria-hidden="true"
            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-black ${accentStyles.number}`}
          >
            {index + 1}
          </span>

          <p className="text-sm leading-7 text-[#B3C3D2] sm:text-base">
            {item}
          </p>
        </li>
      ))}
    </ol>
  );
}

function Metric({
  label,
  value,
  description,
  accent = "cyan",
}: {
  label: string;
  value: string | number;
  description: string;
  accent?: "cyan" | "green" | "amber" | "red";
}) {
  const styles = {
    cyan: {
      text: "text-[#55C8FF]",
      border: "border-[#38BDF8]/25",
      glow: "bg-[#38BDF8]/10",
    },
    green: {
      text: "text-emerald-400",
      border: "border-emerald-400/20",
      glow: "bg-emerald-400/10",
    },
    amber: {
      text: "text-amber-400",
      border: "border-amber-400/20",
      glow: "bg-amber-400/10",
    },
    red: {
      text: "text-[#FF5A67]",
      border: "border-[#FF2638]/20",
      glow: "bg-[#FF2638]/10",
    },
  }[accent];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${styles.border} bg-[#061A31] p-5`}
    >
      <div
        aria-hidden="true"
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl ${styles.glow}`}
      />

      <div className="relative">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7890A7]">
          {label}
        </p>

        <p
          className={`mt-3 text-3xl font-black tracking-[-0.04em] ${styles.text}`}
        >
          {value}
        </p>

        <p className="mt-2 text-xs leading-5 text-[#8299AE]">
          {description}
        </p>
      </div>
    </div>
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

  const confidenceStyles =
    getConfidenceStyles(confidence);

  const analyzedDate = formatAnalyzedDate(
    evidence.lastAnalyzedAt
  );

  const conflictCount =
    evidence.conflictingReporting.length;

  return (
    <section
      aria-label="Evidence and confidence"
      className="relative overflow-hidden rounded-3xl border border-[#17446D] bg-[#04162C] shadow-2xl shadow-black/20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#38BDF8]/[0.06] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-[#FF2638]/[0.035] blur-3xl"
      />

      <div className="relative border-b border-[#17446D]/70 px-6 py-7 sm:px-8 lg:px-10 lg:py-9">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#55C8FF]">
              Evidence &amp; Confidence
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-white sm:text-4xl">
              How The Angle Report Reached
              This Assessment
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#9CB0C5] sm:text-base">
              Review the evidence, reporting
              signals, and methodology used to
              generate this intelligence report.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/[0.07] px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#55C8FF]">
              Transparent Analysis
            </span>

            <span className="rounded-full border border-[#17446D] bg-[#061A31] px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#9CB0C5]">
              Evidence Review
            </span>
          </div>
        </div>
      </div>

      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="Overall Confidence"
            value={`${confidence}%`}
            description={confidenceLabel}
            accent={
              confidence >= 80
                ? "green"
                : confidence >= 60
                  ? "amber"
                  : "cyan"
            }
          />

          <Metric
            label="Sources Reviewed"
            value={sourcesReviewed}
            description="Reporting inputs analyzed"
            accent="cyan"
          />

          <Metric
            label="Primary Evidence"
            value={evidence.primarySources.length}
            description="Supporting signals identified"
            accent="green"
          />

          <Metric
            label="Reporting Conflicts"
            value={conflictCount}
            description="Disagreements requiring context"
            accent={
              conflictCount > 0
                ? "amber"
                : "green"
            }
          />
        </div>

        <div
          className={`mt-6 rounded-2xl border ${confidenceStyles.border} ${confidenceStyles.background} p-5 sm:p-6`}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7890A7]">
                Assessment Confidence
              </p>

              <p className="mt-2 text-base font-bold text-white">
                {confidenceLabel}
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span
                className={`text-3xl font-black tracking-[-0.04em] ${confidenceStyles.text}`}
              >
                {confidence}
              </span>

              <span className="text-sm font-bold text-[#7890A7]">
                /100
              </span>
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#020D21]">
            <div
              role="progressbar"
              aria-label="Overall report confidence"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={confidence}
              className={`h-full rounded-full transition-[width] duration-700 ease-out ${confidenceStyles.bar}`}
              style={{
                width: `${confidence}%`,
              }}
            />
          </div>

          <p className="mt-4 max-w-4xl text-sm leading-6 text-[#8EA3B7]">
            Confidence reflects the strength,
            consistency, and completeness of the
            available reporting. It does not
            guarantee that every underlying claim
            is correct.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#38BDF8]/20 bg-[#061A31] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#55C8FF]">
                  Supporting Material
                </p>

                <h3 className="mt-2 text-xl font-black tracking-[-0.025em] text-white">
                  Primary Evidence
                </h3>
              </div>

              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-emerald-400">
                Supporting
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#8EA3B7]">
              The strongest source signals and
              factual inputs supporting the
              report&apos;s assessment.
            </p>

            <EvidenceList
              items={evidence.primarySources}
              emptyMessage="No primary evidence sources were provided for this report."
              accent="cyan"
            />
          </div>

          <div className="rounded-2xl border border-amber-400/20 bg-[#061A31] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">
                  Areas of Uncertainty
                </p>

                <h3 className="mt-2 text-xl font-black tracking-[-0.025em] text-white">
                  Conflicting Reporting
                </h3>
              </div>

              <span className="rounded-full border border-amber-400/20 bg-amber-400/[0.07] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-amber-300">
                Uncertainty
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#8EA3B7]">
              Claims, interpretations, or details
              that differ across the available
              reporting.
            </p>

            <EvidenceList
              items={evidence.conflictingReporting}
              emptyMessage="No major reporting conflicts were identified."
              accent="amber"
            />
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[#17446D] bg-[#061A31] p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#55C8FF]">
                Analytical Process
              </p>

              <h3 className="mt-2 text-xl font-black tracking-[-0.025em] text-white">
                AI Methodology
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#B3C3D2] sm:text-base">
                {evidence.methodology ||
                  "Methodology details were not available for this report."}
              </p>
            </div>

            <div className="grid shrink-0 grid-cols-2 gap-3 lg:min-w-[300px]">
              <div className="rounded-xl border border-[#17446D]/70 bg-[#020D21]/60 p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#7890A7]">
                  Sources Reviewed
                </p>

                <p className="mt-2 text-lg font-black text-[#55C8FF]">
                  {sourcesReviewed}
                </p>
              </div>

              <div className="rounded-xl border border-[#17446D]/70 bg-[#020D21]/60 p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#7890A7]">
                  Last Analyzed
                </p>

                <p className="mt-2 text-sm font-bold leading-5 text-white">
                  {analyzedDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#38BDF8]/20 bg-[#38BDF8]/[0.045] px-4 py-4 sm:px-5">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#38BDF8]/35 text-[10px] font-black text-[#55C8FF]">
            i
          </div>

          <p className="text-sm leading-6 text-[#8EA3B7]">
            The Angle Report assessments are
            analytical summaries generated from
            available reporting. Readers should
            review original sources before making
            legal, financial, civic, or personal
            decisions.
          </p>
        </div>
      </div>
    </section>
  );
}
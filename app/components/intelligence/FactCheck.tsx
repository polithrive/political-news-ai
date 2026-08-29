import type { IntelligenceReport } from "@/app/types/report";

type FactCheckProps = {
  report: IntelligenceReport;
};

type VerdictTone =
  | "success"
  | "warning"
  | "info"
  | "primary";

type VerdictPresentation = {
  label: string;
  tone: VerdictTone;
  description: string;
};

const toneStyles = {
  success: {
    border: "border-emerald-500/20",
    background: "bg-emerald-500/[0.06]",
    text: "text-emerald-300",
    dot: "bg-emerald-400",
  },
  warning: {
    border: "border-amber-500/20",
    background: "bg-amber-500/[0.06]",
    text: "text-amber-300",
    dot: "bg-amber-400",
  },
  info: {
    border: "border-blue-500/20",
    background: "bg-blue-500/[0.06]",
    text: "text-blue-300",
    dot: "bg-blue-400",
  },
  primary: {
    border: "border-red-500/20",
    background: "bg-red-500/[0.06]",
    text: "text-red-300",
    dot: "bg-red-400",
  },
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
    label:
      verdict ||
      "Assessment Pending",
    tone: "primary",
    description:
      "PoliticalPulse evaluated the available reporting and supporting evidence.",
  };
}

export default function FactCheck({
  report,
}: FactCheckProps) {
  const verdict =
    getVerdictPresentation(
      report.factCheck.verdict
    );

  const styles =
    toneStyles[verdict.tone];

  return (
    <section
      aria-label="Fact check"
      className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-sm"
    >
      <div className="border-b border-slate-800 px-5 py-4 sm:px-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-red-400">
          Fact Check
        </p>

        <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Reliability assessment
          </h2>

          <p className="max-w-xl text-sm leading-6 text-slate-400">
            AI review of factual reliability,
            supporting evidence, and the limits of
            the available reporting.
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div
          className={`rounded-2xl border ${styles.border} ${styles.background} p-5`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                Reliability verdict
              </p>

              <h3
                className={`mt-2 text-2xl font-extrabold tracking-tight ${styles.text}`}
              >
                {verdict.label}
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                {verdict.description}
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1.5">
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full ${styles.dot}`}
              />

              <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                AI Assessment
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
            Supporting analysis
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
            {report.factCheck.explanation}
          </p>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3">
          <div
            aria-hidden="true"
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-700 text-[10px] font-bold text-slate-500"
          >
            i
          </div>

          <p className="text-xs leading-5 text-slate-500">
            This assessment reflects the evidence
            available to PoliticalPulse and should not
            be treated as a substitute for independent
            verification.
          </p>
        </div>
      </div>
    </section>
  );
}
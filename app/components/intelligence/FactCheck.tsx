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
    border: "border-[#38BDF8]/20",
    background: "bg-[#38BDF8]/[0.06]",
    text: "text-[#7DD3FC]",
    dot: "bg-[#38BDF8]",
  },
  primary: {
    border: "border-[#FF2638]/20",
    background: "bg-[#FF2638]/[0.06]",
    text: "text-[#FF8B95]",
    dot: "bg-[#FF5161]",
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
      "The Angle Report evaluated the available reporting and supporting evidence.",
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
      className="overflow-hidden rounded-3xl border border-[#17446D]/70 bg-[#04162C]/95 shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
    >
      <div className="border-b border-[#17446D]/60 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#55C8FF]">
              Fact Check
            </p>

            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
              Reliability assessment
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-[#8EA3B7]">
            AI review of factual reliability, supporting evidence, and the limits of the available reporting.
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div
          className={`rounded-2xl border ${styles.border} ${styles.background} p-5`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6F879F]">
                Reliability verdict
              </p>

              <h3
                className={`mt-2 text-2xl font-extrabold tracking-tight ${styles.text}`}
              >
                {verdict.label}
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#B5C3D2]">
                {verdict.description}
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#214B70] bg-[#020D21]/60 px-3 py-1.5">
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full ${styles.dot}`}
              />

              <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#8FB4D3]">
                AI Assessment
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-[#17446D]/60 bg-[#020D21]/70 p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#55C8FF]">
            Supporting analysis
          </p>

          <p className="mt-3 text-sm leading-6 text-[#B5C3D2] sm:text-base sm:leading-7">
            {report.factCheck.explanation}
          </p>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#17446D]/55 bg-[#020D21]/50 px-4 py-3">
          <div
            aria-hidden="true"
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#214B70] bg-[#061A31] text-[10px] font-bold text-[#8FB4D3]"
          >
            i
          </div>

          <p className="text-xs leading-5 text-[#6F879F]">
            This assessment reflects the evidence available to The Angle Report and should not be treated as a substitute for independent verification.
          </p>
        </div>
      </div>
    </section>
  );
}
import type { IntelligenceReport } from "../../types/report";

type PerspectiveAnalysisProps = {
  report: IntelligenceReport;
};

type PerspectiveCardProps = {
  label: string;
  title: string;
  perspective: string;
  tone: "blue" | "slate" | "red";
};

const toneStyles = {
  blue: {
    label: "text-[#7DD3FC]",
    border: "border-blue-400/20",
    background: "bg-blue-500/[0.05]",
    dot: "bg-blue-400",
    accent: "bg-blue-400",
  },
  slate: {
    label: "text-[#C2CFDB]",
    border: "border-[#31577A]/70",
    background: "bg-[#020D21]/70",
    dot: "bg-[#8EA3B7]",
    accent: "bg-[#8EA3B7]",
  },
  red: {
    label: "text-[#FF8B95]",
    border: "border-[#FF2638]/20",
    background: "bg-[#FF2638]/[0.05]",
    dot: "bg-[#FF5161]",
    accent: "bg-[#FF2638]",
  },
} as const;

function PerspectiveCard({
  label,
  title,
  perspective,
  tone,
}: PerspectiveCardProps) {
  const styles = toneStyles[tone];

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border ${styles.border} ${styles.background} p-5 transition duration-200 hover:-translate-y-0.5`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1 ${styles.accent}`}
      />

      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`h-2 w-2 rounded-full ${styles.dot}`}
        />

        <p
          className={`text-[10px] font-black uppercase tracking-[0.18em] ${styles.label}`}
        >
          {label}
        </p>
      </div>

      <h3 className="mt-3 text-lg font-extrabold tracking-tight text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-[#B5C3D2]">
        {perspective}
      </p>
    </article>
  );
}

export default function PerspectiveAnalysis({
  report,
}: PerspectiveAnalysisProps) {
  return (
    <section
      aria-label="Perspective analysis"
      className="overflow-hidden rounded-3xl border border-[#17446D]/70 bg-[#04162C]/95 shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
    >
      <div className="border-b border-[#17446D]/60 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#55C8FF]">
              Perspective Analysis
            </p>

            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
              See the story from every side
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-[#8EA3B7]">
            Compare how progressive, centrist, and conservative viewpoints may interpret the same reporting.
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[#38BDF8]/20 bg-[#38BDF8]/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-[#7DD3FC]">
            Ideas from every side
          </span>

          <span className="rounded-full border border-[#17446D]/70 bg-[#061A31] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-[#8FB4D3]">
            Framing comparison
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <PerspectiveCard
            label="Progressive framing"
            title="Left Perspective"
            perspective={report.perspectives.left}
            tone="blue"
          />

          <PerspectiveCard
            label="Centrist framing"
            title="Center Perspective"
            perspective={report.perspectives.center}
            tone="slate"
          />

          <PerspectiveCard
            label="Conservative framing"
            title="Right Perspective"
            perspective={report.perspectives.right}
            tone="red"
          />
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#17446D]/60 bg-[#020D21]/60 px-4 py-3">
          <div
            aria-hidden="true"
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#214B70] bg-[#061A31] text-xs font-bold text-[#8FB4D3]"
          >
            i
          </div>

          <p className="text-xs leading-5 text-[#6F879F] sm:text-sm sm:leading-6">
            These summaries compare differences in political framing and emphasis. They do not imply that everyone within a political group shares the same view.
          </p>
        </div>
      </div>
    </section>
  );
}
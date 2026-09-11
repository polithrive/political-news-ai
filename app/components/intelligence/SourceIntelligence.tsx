import type { SourceAnalysis } from "@/app/types/source";

type Props = {
  analysis: SourceAnalysis;
};

type InfoCardProps = {
  label: string;
  value: string;
  accent?: "cyan" | "red" | "neutral";
};

export default function SourceIntelligence({
  analysis,
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#17446D] bg-[#04162C] shadow-2xl shadow-black/20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-[#38BDF8]/[0.06] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-[#FF2638]/[0.035] blur-3xl"
      />

      <div className="relative border-b border-[#17446D]/70 px-6 py-7 sm:px-8 lg:px-10 lg:py-9">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#55C8FF]">
          Source Intelligence™
        </p>

        <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-white sm:text-4xl">
          Understand the Reporting
          Behind the Story
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#9CB0C5] sm:text-base">
          Review source reliability, political
          context, factual reporting, and editorial
          characteristics behind this coverage.
        </p>
      </div>

      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="rounded-2xl border border-[#17446D] bg-[#061A31] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7890A7]">
                Source Profile
              </p>

              <h3 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white">
                {analysis.sourceName}
              </h3>
            </div>

            <span className="w-fit rounded-full border border-[#38BDF8]/25 bg-[#38BDF8]/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#55C8FF]">
              Source Analysis
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoCard
              label="Reliability"
              value={`${analysis.reliabilityScore}/100`}
              accent="cyan"
            />

            <InfoCard
              label="Political Lean"
              value={analysis.politicalLean}
              accent="red"
            />

            <InfoCard
              label="Factual Reporting"
              value={analysis.factualReporting}
              accent="cyan"
            />

            <InfoCard
              label="Historical Accuracy"
              value={analysis.historicalAccuracy}
            />

            <InfoCard
              label="Opinion Level"
              value={analysis.opinionLevel}
              accent="red"
            />

            <InfoCard
              label="Coverage Style"
              value={analysis.coverageStyle}
            />
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[#38BDF8]/20 bg-[#061A31] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#55C8FF]">
                The Angle Report
              </p>

              <h3 className="mt-2 text-xl font-black tracking-[-0.025em] text-white">
                Source Insight
              </h3>
            </div>

            <span className="rounded-full border border-[#17446D] bg-[#020D21]/60 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-[#8EA3B7]">
              Context
            </span>
          </div>

          <p className="mt-4 text-sm leading-7 text-[#B3C3D2] sm:text-base">
            {analysis.summary}
          </p>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#17446D]/80 bg-[#020D21]/45 px-4 py-4 sm:px-5">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#38BDF8]/35 text-[10px] font-black text-[#55C8FF]">
            i
          </div>

          <p className="text-sm leading-6 text-[#8299AE]">
            Source characteristics provide context
            for how reporting may be framed. They
            should be considered alongside the
            article&apos;s evidence, sourcing, and
            broader reporting landscape.
          </p>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  label,
  value,
  accent = "neutral",
}: InfoCardProps) {
  const styles = {
    cyan: {
      border: "border-[#38BDF8]/20",
      text: "text-[#55C8FF]",
      glow: "bg-[#38BDF8]/10",
    },
    red: {
      border: "border-[#FF2638]/20",
      text: "text-[#FF6570]",
      glow: "bg-[#FF2638]/10",
    },
    neutral: {
      border: "border-[#17446D]/70",
      text: "text-white",
      glow: "bg-white/[0.04]",
    },
  }[accent];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border ${styles.border} bg-[#020D21]/55 p-4`}
    >
      <div
        aria-hidden="true"
        className={`absolute -right-6 -top-6 h-16 w-16 rounded-full blur-2xl ${styles.glow}`}
      />

      <div className="relative">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7890A7]">
          {label}
        </p>

        <p
          className={`mt-2 text-base font-black ${styles.text}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
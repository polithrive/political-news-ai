import type { IntelligenceReport } from "../../types/report";

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
    <div className="rounded-2xl border border-[#17446D]/60 bg-[#020D21]/70 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-white">
            {label}
          </p>

          <p className="mt-1 text-sm leading-5 text-[#8EA3B7]">
            {description}
          </p>
        </div>

        <span className="shrink-0 text-lg font-extrabold text-[#55C8FF]">
          {normalizedValue}%
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#0A2947]">
        <div
          className="h-full rounded-full bg-[#38BDF8] transition-all duration-700"
          style={{
            width: `${normalizedValue}%`,
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
      className="overflow-hidden rounded-3xl border border-[#17446D]/70 bg-[#04162C]/95 shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
    >
      <div className="border-b border-[#17446D]/60 px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#55C8FF]">
              Intelligence Signals
            </p>

            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
              How to interpret this story
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8EA3B7]">
              A quick read of the report&apos;s confidence, political framing, complexity, and source quality.
            </p>
          </div>

          <span className="rounded-full border border-[#38BDF8]/20 bg-[#38BDF8]/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-[#7DD3FC]">
            Story Signals
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid gap-3 md:grid-cols-2">
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

          <div className="rounded-2xl border border-[#17446D]/60 bg-[#020D21]/70 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6F879F]">
              Story Category
            </p>

            <p className="mt-3 text-xl font-extrabold text-white">
              {report.overview.category}
            </p>

            <p className="mt-2 text-sm leading-5 text-[#8EA3B7]">
              Primary topic classification for this intelligence report.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-[#17446D]/60 bg-[#020D21]/70 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#55C8FF]">
                Political Positioning
              </p>

              <p className="mt-2 text-sm text-[#8EA3B7]">
                Where the current analysis places the story on the political spectrum.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <PoliticalSpectrum
              lean="Center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
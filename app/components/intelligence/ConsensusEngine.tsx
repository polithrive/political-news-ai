import type { IntelligenceReport } from "../../types/report";

type ConsensusEngineProps = {
  report: IntelligenceReport;
};

function clampScore(score: number) {
  return Math.max(
    0,
    Math.min(100, Math.round(score))
  );
}

function getConsensusLabel(
  score: number
) {
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

  const consensusLabel =
    getConsensusLabel(
      consensusScore
    );

  return (
    <section
      aria-label="Consensus analysis"
      className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-sm"
    >
      <div className="border-b border-slate-800 px-5 py-4 sm:px-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-red-400">
          Consensus Engine
        </p>

        <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Where the sides find common ground
          </h2>

          <p className="max-w-xl text-sm leading-6 text-slate-400">
            Shared facts, concerns, and conclusions
            across the analyzed political perspectives.
          </p>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-emerald-300">
            Shared conclusions
          </p>

          {commonGround.length > 0 ? (
            <ol className="mt-4 space-y-3">
              {commonGround.map(
                (item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="flex items-start gap-3"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-[11px] font-extrabold text-emerald-300">
                      {index + 1}
                    </div>

                    <p className="pt-0.5 text-sm leading-6 text-slate-300">
                      {item}
                    </p>
                  </li>
                )
              )}
            </ol>
          ) : (
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Common-ground analysis is still being
              generated for this report.
            </p>
          )}
        </div>

        <aside
          aria-label={`Consensus score: ${consensusScore} percent`}
          className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5"
        >
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
            Consensus Score
          </p>

          <div className="mt-3 flex items-end gap-2">
            <span className="text-5xl font-black leading-none text-white">
              {consensusScore}
            </span>

            <span className="pb-1 text-lg font-bold text-slate-500">
              %
            </span>
          </div>

          <p className="mt-3 text-sm font-bold text-emerald-300">
            {consensusLabel}
          </p>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-700"
              style={{
                width: `${consensusScore}%`,
              }}
            />
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            Measures how strongly the analyzed
            perspectives converge on shared facts,
            concerns, or conclusions.
          </p>
        </aside>
      </div>

      <div className="border-t border-slate-800 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div
            aria-hidden="true"
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-xs font-bold text-slate-500"
          >
            i
          </div>

          <p className="text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
            Consensus does not mean every political
            perspective agrees on causes, solutions, or
            broader implications. It identifies points
            where differing viewpoints reach the same
            underlying conclusion.
          </p>
        </div>
      </div>
    </section>
  );
}
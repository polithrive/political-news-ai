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
      className="overflow-hidden rounded-3xl border border-[#17446D]/70 bg-[#04162C]/95 shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
    >
      <div className="border-b border-[#17446D]/60 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#55C8FF]">
              Consensus Engine
            </p>

            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
              Where the sides find common ground
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-[#8EA3B7]">
            Shared facts, concerns, and conclusions across the analyzed political perspectives.
          </p>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
              Shared conclusions
            </p>

            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-emerald-300">
              Common Ground
            </span>
          </div>

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

                    <p className="pt-0.5 text-sm leading-6 text-[#B5C3D2]">
                      {item}
                    </p>
                  </li>
                )
              )}
            </ol>
          ) : (
            <p className="mt-4 text-sm leading-6 text-[#6F879F]">
              Common-ground analysis is still being generated for this report.
            </p>
          )}
        </div>

        <aside
          aria-label={`Consensus score: ${consensusScore} percent`}
          className="rounded-2xl border border-[#17446D]/60 bg-[#020D21]/70 p-5"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#55C8FF]">
            Consensus Score
          </p>

          <div className="mt-3 flex items-end gap-2">
            <span className="text-5xl font-black leading-none text-white">
              {consensusScore}
            </span>

            <span className="pb-1 text-lg font-bold text-[#58748E]">
              %
            </span>
          </div>

          <p className="mt-3 text-sm font-bold text-emerald-300">
            {consensusLabel}
          </p>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#0A2947]">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-700"
              style={{
                width: `${consensusScore}%`,
              }}
            />
          </div>

          <p className="mt-4 text-xs leading-5 text-[#6F879F]">
            Measures how strongly the analyzed perspectives converge on shared facts, concerns, or conclusions.
          </p>
        </aside>
      </div>

      <div className="border-t border-[#17446D]/60 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div
            aria-hidden="true"
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#214B70] bg-[#061A31] text-xs font-bold text-[#8FB4D3]"
          >
            i
          </div>

          <p className="text-xs leading-5 text-[#6F879F] sm:text-sm sm:leading-6">
            Consensus does not mean every political perspective agrees on causes, solutions, or broader implications. It identifies points where differing viewpoints reach the same underlying conclusion.
          </p>
        </div>
      </div>
    </section>
  );
}
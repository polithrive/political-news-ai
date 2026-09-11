import type { IntelligenceReport } from "../../types/report";

type KeyFactsProps = {
  report: IntelligenceReport;
};

export default function KeyFacts({
  report,
}: KeyFactsProps) {
  const hasKeyFacts = report.keyFacts.length > 0;

  return (
    <section
      aria-label="Key facts"
      className="rounded-3xl border border-[#17446D]/70 bg-[#04162C]/95 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:p-8"
    >
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#55C8FF]">
          Key Facts
        </p>

        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
          What We Know
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8EA3B7]">
          The most important supported details identified across the reporting.
        </p>
      </div>

      <div className="mt-6">
        {hasKeyFacts ? (
          <ol
            aria-label="Key facts from the intelligence report"
            className="grid gap-3"
          >
            {report.keyFacts.map((fact, index) => {
              const factNumber = String(
                index + 1
              ).padStart(
                2,
                "0"
              );

              return (
                <li
                  key={`${fact}-${index}`}
                  className="group relative overflow-hidden rounded-2xl border border-[#17446D]/60 bg-[#020D21]/70 p-5 transition-all duration-200 hover:border-[#38BDF8]/35 hover:bg-[#061A31]"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-1 bg-[#38BDF8]"
                  />

                  <div className="flex items-start gap-4">
                    <div
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#38BDF8]/25 bg-[#38BDF8]/10 text-xs font-black tracking-[0.12em] text-[#7DD3FC]"
                    >
                      {factNumber}
                    </div>

                    <p className="pt-1 text-base leading-7 text-[#E6EDF4] sm:text-lg sm:leading-8">
                      {fact}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <div
            role="status"
            className="rounded-2xl border border-dashed border-[#214B70] bg-[#020D21]/55 p-6"
          >
            <p className="text-sm leading-6 text-[#8EA3B7]">
              Key facts are still being generated for this intelligence report.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
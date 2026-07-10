import type { IntelligenceReport } from "@/app/types/report";

type EvidencePanelProps = {
  report: IntelligenceReport;
};

export default function EvidencePanel({
  report,
}: EvidencePanelProps) {
  const { evidence, overview } = report;

  const confidence = Math.max(
    0,
    Math.min(100, overview.confidence)
  );

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
            Evidence & Confidence
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            How PoliticalPulse reached this assessment
          </h2>

          <p className="mt-3 max-w-3xl text-slate-400">
            This section summarizes the evidence, source signals, and
            methodology used to generate the intelligence report.
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-950/70 px-5 py-4">
          <p className="text-sm text-slate-400">
            Overall confidence
          </p>

          <p className="mt-1 text-3xl font-bold text-white">
            {confidence}%
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-red-500 transition-all duration-500"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
          <h3 className="text-lg font-semibold text-white">
            Primary evidence
          </h3>

          {evidence.primarySources.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {evidence.primarySources.map((source, index) => (
                <li
                  key={`${source}-${index}`}
                  className="flex items-start gap-3 text-slate-300"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <span>{source}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-slate-400">
              No primary evidence sources were provided.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
          <h3 className="text-lg font-semibold text-white">
            Conflicting reporting
          </h3>

          {evidence.conflictingReporting.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {evidence.conflictingReporting.map((conflict, index) => (
                <li
                  key={`${conflict}-${index}`}
                  className="flex items-start gap-3 text-slate-300"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                  <span>{conflict}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-slate-400">
              No major reporting conflicts were identified.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/50 p-5">
        <h3 className="text-lg font-semibold text-white">
          AI methodology
        </h3>

        <p className="mt-3 leading-7 text-slate-300">
          {evidence.methodology}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-2 border-t border-slate-800 pt-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Sources reviewed: {overview.sourcesReviewed}
        </span>

        <span>
          Last analyzed: {evidence.lastAnalyzedAt}
        </span>
      </div>
    </section>
  );
}
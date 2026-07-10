import type { IntelligenceReport } from "@/app/types/report";

type ImpactAnalysisProps = {
  report: IntelligenceReport;
};

export default function ImpactAnalysis({
  report,
}: ImpactAnalysisProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
          Impact Analysis
        </p>

        <h2 className="mt-2 text-2xl font-bold text-white">
          What this story means
        </h2>

        <p className="mt-3 max-w-3xl text-slate-400">
          PoliticalPulse analyzes why the story matters, who may be affected,
          and what could happen next.
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950/50 p-5">
        <h3 className="text-lg font-semibold text-white">
          Why this story matters
        </h3>

        <p className="mt-3 leading-7 text-slate-300">
          {report.whyThisMatters}
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
          <h3 className="text-lg font-semibold text-white">
            Who is most affected
          </h3>

          {report.whoIsAffected.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {report.whoIsAffected.map((group, index) => (
                <li
                  key={`${group}-${index}`}
                  className="flex items-start gap-3 text-slate-300"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <span>{group}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-slate-400">
              The affected groups could not be determined from the available
              information.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
          <h3 className="text-lg font-semibold text-white">
            Questions still unanswered
          </h3>

          {report.unansweredQuestions.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {report.unansweredQuestions.map((question, index) => (
                <li
                  key={`${question}-${index}`}
                  className="flex items-start gap-3 text-slate-300"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-slate-400">
              No major unanswered questions were identified.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Near-term outlook
          </p>

          <h3 className="mt-2 text-lg font-semibold text-white">
            Short-term impact
          </h3>

          <p className="mt-3 leading-7 text-slate-300">
            {report.shortTermImpact}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Strategic outlook
          </p>

          <h3 className="mt-2 text-lg font-semibold text-white">
            Long-term impact
          </h3>

          <p className="mt-3 leading-7 text-slate-300">
            {report.longTermImpact}
          </p>
        </div>
      </div>
    </section>
  );
}
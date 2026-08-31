import type { TrustScore as TrustScoreData } from "@/app/types/trust";

type TrustScoreProps = {
  trustScore: TrustScoreData;
};

function getScoreLabel(
  score: number
): string {
  if (score >= 85) {
    return "Very High";
  }

  if (score >= 70) {
    return "High";
  }

  if (score >= 50) {
    return "Moderate";
  }

  return "Limited";
}

function formatReportingAgreement(
  value: number | null
): string {
  return value === null
    ? "N/A"
    : `${value}%`;
}

function getCorroborationExplanation(
  sourceCount: number
): string {
  if (sourceCount <= 1) {
    return "Only one source is currently available, so independent corroboration is limited.";
  }

  if (sourceCount === 2) {
    return "Two sources are available, providing some corroboration but still limiting overall confidence.";
  }

  if (sourceCount === 3) {
    return "Three sources provide a stronger level of independent corroboration.";
  }

  return `${sourceCount} sources provide broader corroboration for this report.`;
}

function getAgreementExplanation(
  reportingAgreement: number | null
): string {
  if (reportingAgreement === null) {
    return "Cross-source reporting agreement is not yet available, so a neutral value is used rather than treating missing data as negative evidence.";
  }

  if (reportingAgreement >= 80) {
    return `Available sources show strong reporting agreement at ${reportingAgreement}%.`;
  }

  if (reportingAgreement >= 60) {
    return `Available sources show moderate reporting agreement at ${reportingAgreement}%.`;
  }

  return `Available sources show limited reporting agreement at ${reportingAgreement}%, which reduces confidence in the report.`;
}

function getDiversityExplanation(
  politicalDiversity: TrustScoreData["politicalDiversity"]
): string {
  if (politicalDiversity === "High") {
    return "The source set includes broad political perspective diversity.";
  }

  if (politicalDiversity === "Medium") {
    return "The source set includes more than one political perspective.";
  }

  return "Political perspective diversity is currently limited.";
}

export default function TrustScore({
  trustScore,
}: TrustScoreProps) {
  const score =
    Math.max(
      0,
      Math.min(
        100,
        trustScore.overall
      )
    );

  return (
    <section className="h-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-sm">
      <div className="border-b border-slate-800 px-5 py-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-red-400">
          PoliticalPulse Trust Score
        </p>

        <h2 className="mt-2 text-xl font-extrabold text-white">
          Report confidence
        </h2>
      </div>

      <div className="p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-end gap-2">
              <span className="text-6xl font-black leading-none text-white">
                {score}
              </span>

              <span className="pb-1 text-lg font-bold text-slate-500">
                /100
              </span>
            </div>

            <p className="mt-2 text-sm font-bold text-slate-300">
              {getScoreLabel(score)} confidence
            </p>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-red-300">
              Evidence
            </p>

            <p className="mt-1 text-lg font-extrabold text-white">
              {trustScore.evidenceStrength}
            </p>
          </div>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-red-500"
            style={{
              width: `${score}%`,
            }}
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs font-bold text-slate-500">
              Sources
            </p>

            <p className="mt-2 text-2xl font-extrabold text-white">
              {trustScore.sourceCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs font-bold text-slate-500">
              Agreement
            </p>

            <p className="mt-2 text-2xl font-extrabold text-white">
              {formatReportingAgreement(
                trustScore.reportingAgreement
              )}
            </p>
          </div>

          <div className="col-span-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs font-bold text-slate-500">
              Political diversity
            </p>

            <p className="mt-2 text-lg font-extrabold text-white">
              {trustScore.politicalDiversity}
            </p>
          </div>
        </div>

        {trustScore.sourceCount <= 1 ? (
          <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
            <p className="text-sm leading-6 text-amber-100">
              Independent corroboration is not yet available for this report.
            </p>
          </div>
        ) : null}

        <details className="group mt-5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-sm font-bold text-slate-200 transition hover:bg-slate-900/80">
            <span>
              How is this score calculated?
            </span>

            <span
              aria-hidden="true"
              className="text-lg text-red-400 transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>

          <div className="border-t border-slate-800 px-4 py-5">
            <p className="text-sm leading-6 text-slate-300">
              PoliticalPulse combines several confidence signals to estimate the strength of the available reporting.
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                <div>
                  <p className="text-sm font-bold text-white">
                    Analysis confidence
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Confidence derived from PoliticalPulse analysis of the available story information.
                  </p>
                </div>

                <span className="shrink-0 text-sm font-extrabold text-red-300">
                  35%
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                <div>
                  <p className="text-sm font-bold text-white">
                    Independent corroboration
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Measures how many independent sources are available to support or compare the reporting.
                  </p>
                </div>

                <span className="shrink-0 text-sm font-extrabold text-red-300">
                  35%
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                <div>
                  <p className="text-sm font-bold text-white">
                    Source quality
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Uses available source reliability and factual-reporting ratings. Unknown ratings receive a neutral value rather than a penalty.
                  </p>
                </div>

                <span className="shrink-0 text-sm font-extrabold text-red-300">
                  20%
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                <div>
                  <p className="text-sm font-bold text-white">
                    Reporting agreement
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Measures how closely available sources agree on the core facts. Unavailable agreement data receives a neutral value.
                  </p>
                </div>

                <span className="shrink-0 text-sm font-extrabold text-red-300">
                  10%
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-red-300">
                This report
              </p>

              <div className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                <p>
                  {getCorroborationExplanation(
                    trustScore.sourceCount
                  )}
                </p>

                <p>
                  {getAgreementExplanation(
                    trustScore.reportingAgreement
                  )}
                </p>

                <p>
                  {getDiversityExplanation(
                    trustScore.politicalDiversity
                  )}
                </p>

                <p>
                  Evidence strength is currently rated{" "}
                  <span className="font-bold text-white">
                    {trustScore.evidenceStrength}
                  </span>
                  .
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
                Confidence safeguards
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Reports supported by only one source are capped at 60/100. Reports supported by two sources are capped at 75/100. These limits prevent strong analysis confidence from outweighing limited corroboration.
              </p>
            </div>
          </div>
        </details>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Trust Score summarizes the strength of the available reporting. It is not a guarantee that every claim is correct.
        </p>
      </div>
    </section>
  );
}
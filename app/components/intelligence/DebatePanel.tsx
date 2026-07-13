import type {
  DebatePerspective,
  IntelligenceReport,
} from "@/app/types/report";

type DebatePanelProps = {
  report: IntelligenceReport;
};

type PerspectiveCardProps = {
  eyebrow: string;
  title: string;
  perspective: DebatePerspective;
  accentClassName: string;
  bulletClassName: string;
};

type InsightListProps = {
  items: string[];
  emptyMessage: string;
  bulletClassName: string;
};

function InsightList({
  items,
  emptyMessage,
  bulletClassName,
}: InsightListProps) {
  if (items.length === 0) {
    return (
      <p className="mt-3 text-sm leading-6 text-slate-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="mt-3 space-y-3">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex gap-3 text-sm leading-6 text-slate-300"
        >
          <span
            className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${bulletClassName}`}
            aria-hidden="true"
          />

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PerspectiveCard({
  eyebrow,
  title,
  perspective,
  accentClassName,
  bulletClassName,
}: PerspectiveCardProps) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
      <div
        className={`absolute inset-x-0 top-0 h-1 ${accentClassName}`}
        aria-hidden="true"
      />

      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {eyebrow}
      </p>

      <h3 className="mt-3 text-xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-slate-300">
        {perspective.position}
      </p>

      <div className="mt-6 border-t border-slate-800 pt-5">
        <h4 className="text-sm font-semibold text-white">
          Strongest arguments
        </h4>

        <InsightList
          items={perspective.strongestArguments}
          emptyMessage="The current analysis did not identify distinct supporting arguments."
          bulletClassName={bulletClassName}
        />
      </div>

      <div className="mt-6 border-t border-slate-800 pt-5">
        <h4 className="text-sm font-semibold text-white">
          Primary concerns
        </h4>

        <InsightList
          items={perspective.primaryConcerns}
          emptyMessage="The current analysis did not identify distinct concerns."
          bulletClassName={bulletClassName}
        />
      </div>
    </article>
  );
}

function getDebateTemperatureLabel(
  temperature: number
): string {
  if (temperature >= 80) {
    return "Highly polarized";
  }

  if (temperature >= 60) {
    return "Strong disagreement";
  }

  if (temperature >= 40) {
    return "Meaningful disagreement";
  }

  if (temperature >= 20) {
    return "Limited disagreement";
  }

  return "Broad agreement";
}

export default function DebatePanel({
  report,
}: DebatePanelProps) {
  const perspectiveAnalysis =
    report.perspectiveAnalysis;

  const progressive =
    perspectiveAnalysis?.progressive ?? {
      position:
        report.perspectives.left ||
        "A progressive perspective is not available from the current analysis.",
      strongestArguments: [],
      primaryConcerns: [],
    };

  const centrist =
    perspectiveAnalysis?.centrist ?? {
      position:
        report.perspectives.center ||
        "A centrist perspective is not available from the current analysis.",
      strongestArguments: [],
      primaryConcerns: [],
    };

  const conservative =
    perspectiveAnalysis?.conservative ?? {
      position:
        report.perspectives.right ||
        "A conservative perspective is not available from the current analysis.",
      strongestArguments: [],
      primaryConcerns: [],
    };

  const areasOfAgreement =
    perspectiveAnalysis?.areasOfAgreement?.length > 0
      ? perspectiveAnalysis.areasOfAgreement
      : report.commonGround;

  const mainDisagreements =
    perspectiveAnalysis?.mainDisagreements ?? [];

  const debateTemperature =
    perspectiveAnalysis?.debateTemperature ?? 50;

  const debateTemperatureLabel =
    getDebateTemperatureLabel(debateTemperature);

  const topic =
    perspectiveAnalysis?.topic ||
    report.article.title ||
    "The central political debate";

  const politicalPulseAnalysis =
    perspectiveAnalysis?.politicalPulseAnalysis ||
    "PoliticalPulse identified the primary perspectives and areas of agreement, but a dedicated neutral synthesis was not available.";

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
            PoliticalPulse Debate™
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            How different perspectives interpret this story
          </h2>

          <p className="mt-3 leading-7 text-slate-400">
            PoliticalPulse compares major political
            interpretations while separating perspective from
            the underlying facts and evidence.
          </p>
        </div>

        <div className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 p-5 lg:max-w-xs">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Debate temperature
              </p>

              <p className="mt-2 text-lg font-bold text-white">
                {debateTemperatureLabel}
              </p>
            </div>

            <span className="text-3xl font-bold text-white">
              {debateTemperature}
            </span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500"
              style={{
                width: `${debateTemperature}%`,
              }}
              aria-hidden="true"
            />
          </div>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            0 represents broad agreement. 100 represents intense
            political disagreement.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Central debate
        </p>

        <p className="mt-3 text-lg font-semibold leading-7 text-white">
          {topic}
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <PerspectiveCard
          eyebrow="Progressive analysis"
          title="Progressive Perspective"
          perspective={progressive}
          accentClassName="bg-blue-500"
          bulletClassName="bg-blue-400"
        />

        <PerspectiveCard
          eyebrow="Institutional analysis"
          title="Centrist Perspective"
          perspective={centrist}
          accentClassName="bg-violet-500"
          bulletClassName="bg-violet-400"
        />

        <PerspectiveCard
          eyebrow="Conservative analysis"
          title="Conservative Perspective"
          perspective={conservative}
          accentClassName="bg-red-500"
          bulletClassName="bg-red-400"
        />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-emerald-900/60 bg-emerald-950/20 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Areas of agreement
          </p>

          <h3 className="mt-3 text-xl font-bold text-white">
            PoliticalPulse Consensus
          </h3>

          <InsightList
            items={areasOfAgreement}
            emptyMessage="The current analysis did not identify clear areas of agreement."
            bulletClassName="bg-emerald-400"
          />
        </article>

        <article className="rounded-2xl border border-amber-900/60 bg-amber-950/20 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
            Areas of disagreement
          </p>

          <h3 className="mt-3 text-xl font-bold text-white">
            Major Differences
          </h3>

          <InsightList
            items={mainDisagreements}
            emptyMessage="The current analysis did not identify specific disagreements beyond the differences described in the perspective summaries."
            bulletClassName="bg-amber-400"
          />
        </article>
      </div>

      <article className="mt-8 rounded-2xl border border-cyan-900/60 bg-cyan-950/20 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
          PoliticalPulse synthesis
        </p>

        <h3 className="mt-3 text-xl font-bold text-white">
          What the debate is really about
        </h3>

        <p className="mt-4 leading-7 text-slate-300">
          {politicalPulseAnalysis}
        </p>
      </article>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/50 px-5 py-4">
        <p className="text-sm leading-6 text-slate-500">
          These perspectives summarize how different political
          viewpoints may interpret the available information.
          They do not represent endorsements by PoliticalPulse.
        </p>
      </div>
    </section>
  );
}
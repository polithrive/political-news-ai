import type {
  DebatePerspective,
  IntelligenceReport,
} from "@/app/types/report";

type DebatePanelProps = {
  report: IntelligenceReport;
};

type PerspectiveTone =
  | "progressive"
  | "centrist"
  | "conservative";

type PerspectiveCardProps = {
  eyebrow: string;
  title: string;
  perspective: DebatePerspective;
  tone: PerspectiveTone;
};

type InsightListProps = {
  items: string[];
  emptyMessage: string;
  dotClass: string;
};

const perspectiveStyles = {
  progressive: {
    border: "border-[#38BDF8]/25",
    background: "bg-[#38BDF8]/[0.055]",
    accent: "bg-[#38BDF8]",
    label: "text-[#7DD3FC]",
    dot: "bg-[#55C8FF]",
  },

  centrist: {
    border: "border-[#31506F]",
    background: "bg-[#06172B]",
    accent: "bg-[#8EA3B7]",
    label: "text-[#B5C6D8]",
    dot: "bg-[#9CB0C5]",
  },

  conservative: {
    border: "border-[#FF2638]/25",
    background: "bg-[#FF2638]/[0.055]",
    accent: "bg-[#FF2638]",
    label: "text-[#FF7B86]",
    dot: "bg-[#FF5B69]",
  },
} as const;

function InsightList({
  items,
  emptyMessage,
  dotClass,
}: InsightListProps) {
  if (items.length === 0) {
    return (
      <p className="mt-3 text-sm leading-6 text-[#6F879F]">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="mt-3 space-y-3">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex gap-3"
        >
          <span
            aria-hidden="true"
            className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`}
          />

          <span className="text-sm leading-6 text-[#B8C8D8]">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function PerspectiveCard({
  eyebrow,
  title,
  perspective,
  tone,
}: PerspectiveCardProps) {
  const styles =
    perspectiveStyles[tone];

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border ${styles.border} ${styles.background} p-5 sm:p-6`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1 ${styles.accent}`}
      />

      <p
        className={`text-[10px] font-black uppercase tracking-[0.18em] ${styles.label}`}
      >
        {eyebrow}
      </p>

      <h3 className="mt-2 text-xl font-extrabold tracking-tight text-white">
        {title}
      </h3>

      <p className="mt-4 text-sm leading-6 text-[#A9BDD0]">
        {perspective.position}
      </p>

      <div className="mt-6 border-t border-[#17446D]/65 pt-5">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7F9BB5]">
          Strongest Arguments
        </p>

        <InsightList
          items={
            perspective.strongestArguments
          }
          emptyMessage="The current analysis did not identify distinct supporting arguments."
          dotClass={styles.dot}
        />
      </div>

      <div className="mt-5 border-t border-[#17446D]/65 pt-5">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7F9BB5]">
          Primary Concerns
        </p>

        <InsightList
          items={
            perspective.primaryConcerns
          }
          emptyMessage="The current analysis did not identify distinct concerns."
          dotClass={styles.dot}
        />
      </div>
    </article>
  );
}

function getDebateTemperatureLabel(
  temperature: number
): string {
  if (temperature >= 80) {
    return "Highly Polarized";
  }

  if (temperature >= 60) {
    return "Strong Disagreement";
  }

  if (temperature >= 40) {
    return "Meaningful Disagreement";
  }

  if (temperature >= 20) {
    return "Limited Disagreement";
  }

  return "Broad Agreement";
}

function clampTemperature(
  temperature: number
) {
  return Math.max(
    0,
    Math.min(
      100,
      Math.round(temperature)
    )
  );
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

  const mainDisagreements =
    perspectiveAnalysis
      ?.mainDisagreements ?? [];

  const debateTemperature =
    clampTemperature(
      perspectiveAnalysis
        ?.debateTemperature ?? 50
    );

  const debateTemperatureLabel =
    getDebateTemperatureLabel(
      debateTemperature
    );

  const topic =
    perspectiveAnalysis?.topic ||
    report.article.title ||
    "The central political debate";

  const angleReportAnalysis =
    perspectiveAnalysis
      ?.politicalPulseAnalysis ||
    "The Angle Report identified the primary arguments and areas of disagreement, but a dedicated neutral synthesis was not available.";

  return (
    <section
      aria-label="Political debate analysis"
      className="overflow-hidden rounded-3xl border border-[#17446D] bg-[#04162C]"
    >
      {/* Header */}
      <div className="border-b border-[#17446D]/80 px-6 py-5 sm:px-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#55C8FF]">
              Debate Intelligence
            </p>

            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Where the political debate
              really stands
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#8FA9C1]">
              Compare the strongest arguments,
              concerns, and points of
              disagreement across the political
              spectrum.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-full border border-[#1C567D] bg-[#06223D] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-[#55C8FF]">
              Ideas From Every Side
            </span>

            <span className="rounded-full border border-[#17446D] bg-[#06172B] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-[#8FB4D3]">
              Debate Analysis
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-7">
        {/* Debate signal */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="rounded-2xl border border-[#17446D] bg-[#031326] p-5 sm:p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#55C8FF]">
              Central Debate
            </p>

            <p className="mt-3 max-w-4xl text-lg font-bold leading-7 text-white sm:text-xl sm:leading-8">
              {topic}
            </p>
          </div>

          <div className="rounded-2xl border border-[#17446D] bg-[#031326] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7F9BB5]">
                  Debate Temperature
                </p>

                <p className="mt-2 text-sm font-bold text-white">
                  {debateTemperatureLabel}
                </p>
              </div>

              <div className="flex items-end">
                <span className="text-3xl font-black leading-none text-white">
                  {debateTemperature}
                </span>

                <span className="ml-1 text-sm font-bold text-[#6382A0]">
                  /100
                </span>
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#102C47]">
              <div
                className="h-full rounded-full bg-[#FF2638] transition-all duration-700"
                style={{
                  width: `${debateTemperature}%`,
                }}
              />
            </div>

            <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-[0.12em] text-[#617C96]">
              <span>Agreement</span>
              <span>Polarized</span>
            </div>
          </div>
        </div>

        {/* Perspectives */}
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <PerspectiveCard
            eyebrow="Progressive View"
            title="Progressive Arguments"
            perspective={progressive}
            tone="progressive"
          />

          <PerspectiveCard
            eyebrow="Centrist View"
            title="Centrist Arguments"
            perspective={centrist}
            tone="centrist"
          />

          <PerspectiveCard
            eyebrow="Conservative View"
            title="Conservative Arguments"
            perspective={conservative}
            tone="conservative"
          />
        </div>

        {/* Disagreement */}
        <div className="mt-5 rounded-2xl border border-[#F59E0B]/20 bg-[#F59E0B]/[0.045] p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#FBBF24]" />

            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#FBBF24]">
              Areas of Disagreement
            </p>
          </div>

          <h3 className="mt-2 text-xl font-extrabold tracking-tight text-white">
            Where the sides diverge
          </h3>

          <InsightList
            items={mainDisagreements}
            emptyMessage="The current analysis did not identify specific disagreements beyond the arguments described above."
            dotClass="bg-[#FBBF24]"
          />
        </div>

        {/* Angle Report synthesis */}
        <div className="mt-5 rounded-2xl border border-[#38BDF8]/20 bg-[#38BDF8]/[0.045] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#55C8FF]">
                The Angle Report
              </p>

              <h3 className="mt-2 text-xl font-extrabold tracking-tight text-white">
                What the debate is really about
              </h3>
            </div>

            <span className="rounded-full border border-[#1C567D] bg-[#06223D] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-[#55C8FF]">
              Neutral Synthesis
            </span>
          </div>

          <p className="mt-4 text-base leading-7 text-[#C2D1DF] sm:text-lg sm:leading-8">
            {angleReportAnalysis}
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#17446D]/80 bg-[#031326] px-4 py-3">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#285172] text-[10px] font-bold text-[#6E91AF]">
            i
          </div>

          <p className="text-xs leading-5 text-[#6F879F] sm:text-sm sm:leading-6">
            These arguments summarize how
            different political viewpoints may
            interpret and debate the available
            information. They do not represent
            endorsements by The Angle Report.
          </p>
        </div>
      </div>
    </section>
  );
}
import Link from "next/link";

/*
 * TEMPORARY MOCK DATA — presentation only.
 * Not persisted reading analytics.
 */
const MOCK_READING_MIX = {
  left: 28,
  center: 46,
  right: 26,
  perspectiveBalance: "Good",
  sourceDiversity: "Strong",
  topicVariety: "Needs work",
  insight:
    "You've read mostly U.S. politics lately. Try exploring more world coverage for a broader perspective.",
};

function StatusDot({ tone }: { tone: "good" | "warn" }) {
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${
        tone === "good" ? "bg-[#34D399]" : "bg-[#FBBF24]"
      }`}
    />
  );
}

export default function ReadingMixCard() {
  const mix = MOCK_READING_MIX;

  return (
    <section
      id="reading-mix"
      className="rounded-2xl border border-[#17446D]/55 bg-[#04162C] p-4"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55C8FF]">
        Your reading mix
      </p>
      <p className="mt-2 text-sm text-[#9CB0C5]">
        A look at your news diet this month.
      </p>

      <div className="mt-4 flex h-2.5 overflow-hidden rounded-full">
        <span className="bg-[#3B82F6]" style={{ width: `${mix.left}%` }} />
        <span className="bg-[#94A3B8]" style={{ width: `${mix.center}%` }} />
        <span className="bg-[#FF2638]" style={{ width: `${mix.right}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-[#9CB0C5]">
        <span>{mix.left}% Left</span>
        <span>{mix.center}% Center</span>
        <span>{mix.right}% Right</span>
      </div>

      <ul className="mt-4 space-y-2 text-[13px]">
        <li className="flex items-center justify-between">
          <span className="text-[#D7E4F4]">Perspective balance</span>
          <span className="inline-flex items-center gap-2 font-semibold text-white">
            {mix.perspectiveBalance}
            <StatusDot tone="good" />
          </span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-[#D7E4F4]">Source diversity</span>
          <span className="inline-flex items-center gap-2 font-semibold text-white">
            {mix.sourceDiversity}
            <StatusDot tone="good" />
          </span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-[#D7E4F4]">Topic variety</span>
          <span className="inline-flex items-center gap-2 font-semibold text-white">
            {mix.topicVariety}
            <StatusDot tone="warn" />
          </span>
        </li>
      </ul>

      <p className="mt-4 rounded-lg bg-[#05182E] px-3 py-3 text-[13px] leading-5 text-[#C5D4E8]">
        <span className="mr-1.5 text-[#FBBF24]" aria-hidden="true">
          ✦
        </span>
        {mix.insight}
      </p>

      <Link
        href="/signin"
        className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-[#214B70] px-3 py-2 text-sm font-semibold text-white hover:border-[#55C8FF]"
      >
        View your full insights →
      </Link>
    </section>
  );
}

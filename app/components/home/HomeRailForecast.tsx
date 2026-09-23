export default function HomeRailForecast() {
  return (
    <section
      aria-labelledby="home-rail-forecast-heading"
      className="rounded-2xl border border-[#17446D]/55 bg-[#04162C] p-3.5"
    >
      <p
        id="home-rail-forecast-heading"
        className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55C8FF]"
      >
        Forecast
      </p>

      <h2 className="mt-3 font-serif text-[1.05rem] font-bold leading-snug text-white">
        A sourced forecast will appear here.
      </h2>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-[#0A2544] px-3 py-3 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7DD3FC]">
            Yes
          </p>
          <p className="mt-1 text-sm font-semibold text-[#7890AC]">—</p>
        </div>
        <div className="rounded-lg bg-[#2A1020] px-3 py-3 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#FF7A86]">
            No
          </p>
          <p className="mt-1 text-sm font-semibold text-[#7890AC]">—</p>
        </div>
      </div>

      <p className="mt-3 text-[12px] leading-5 text-[#9CB0C5]">
        When a real-world outcome is ready to track, odds will come from sourced
        forecasting — not placeholders.
      </p>
    </section>
  );
}

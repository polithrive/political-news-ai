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
        What could happen next
      </h2>

      <p className="mt-3 text-[12px] leading-5 text-[#9CB0C5]">
        When a developing story has a credible published forecast or a
        trackable outcome, The Angle Report will show the source and timing
        here.
      </p>
    </section>
  );
}

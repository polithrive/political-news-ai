import Link from "next/link";

import { MOCK_FEATURED_FORECAST } from "./mockForecast";

export default function FeaturedForecastCard() {
  const forecast = MOCK_FEATURED_FORECAST;

  return (
    <section
      id="forecasts"
      className="rounded-2xl border border-[#17446D]/55 bg-[#04162C] p-4"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55C8FF]">
        Featured forecast
      </p>

      <h2 className="mt-3 font-serif text-[1.05rem] font-bold leading-snug text-white">
        {forecast.question}
      </h2>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-[#0A2544] px-3 py-3 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7DD3FC]">
            Yes
          </p>
          <p className="mt-1 text-xl font-bold text-white">
            {forecast.yesPercent}%
          </p>
        </div>
        <div className="rounded-lg bg-[#2A1020] px-3 py-3 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#FF7A86]">
            No
          </p>
          <p className="mt-1 text-xl font-bold text-white">
            {forecast.noPercent}%
          </p>
        </div>
      </div>

      <p className="mt-3 text-[12px] text-[#9CB0C5]">
        {forecast.predictionCount.toLocaleString()} predictions
      </p>

      <Link
        href="#homepage-forecast"
        className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-[#214B70] px-3 py-2 text-sm font-semibold text-white hover:border-[#55C8FF]"
      >
        See all forecasts →
      </Link>
    </section>
  );
}

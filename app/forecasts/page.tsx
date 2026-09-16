import type { Metadata } from "next";

import Footer from "@/app/components/Footer";
import ForecastCard from "@/app/components/forecasts/ForecastCard";
import { MOCK_FORECASTS } from "@/app/components/forecasts/mockForecast";
import SiteShell from "@/app/components/shell/SiteShell";

export const metadata: Metadata = {
  title: "Forecasts",
  description:
    "See featured forecasts and record your own Yes or No predictions on this device.",
};

export default function ForecastsPage() {
  const [featuredForecast, ...moreForecasts] = MOCK_FORECASTS;

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
          Forecasts
        </p>
        <h1 className="mt-3 font-serif text-4xl font-black tracking-[-0.03em] text-white sm:text-5xl">
          What readers expect next
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#9CB0C5] sm:text-lg">
          These are Angle Report reader forecasts, not a betting market. Pick
          Yes or No, set your confidence, and we keep that prediction on this
          device.
        </p>

        <div className="mt-8">
          <ForecastCard forecast={featuredForecast} featured />
        </div>

        <section className="mt-10">
          <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
              More forecasts
            </h2>
            <p className="text-sm text-[#9CB0C5]">
              Other outcomes readers are tracking.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {moreForecasts.map((forecast) => (
              <ForecastCard key={forecast.id} forecast={forecast} />
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </SiteShell>
  );
}

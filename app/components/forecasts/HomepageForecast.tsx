"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { MOCK_FEATURED_FORECAST } from "./mockForecast";

export default function HomepageForecast() {
  const forecast = MOCK_FEATURED_FORECAST;
  const [choice, setChoice] = useState<"yes" | "no" | null>(null);
  const [confidence, setConfidence] = useState(70);

  return (
    <section
      id="homepage-forecast"
      className="scroll-mt-28 flex h-full flex-col rounded-2xl border border-[#17446D]/55 bg-[#04162C] p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#55C8FF]">
          Forecast
        </p>
        <p className="text-[13px] text-[#9CB0C5]">
          Predict the future. Track real-world outcomes.
        </p>
      </div>

      <div className="mt-4 flex gap-4">
        {forecast.image ? (
          <div className="relative hidden h-[92px] w-[120px] shrink-0 overflow-hidden rounded-xl sm:block">
            <Image
              src={forecast.image}
              alt=""
              fill
              sizes="120px"
              className="object-cover object-[center_35%]"
            />
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-xl font-bold leading-snug text-white">
            {forecast.question}
          </h3>
          <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#9CB0C5]">
            Your prediction
          </p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setChoice("yes")}
              suppressHydrationWarning
              className={`rounded-lg px-5 py-2 text-sm font-semibold ${
                choice === "yes"
                  ? "bg-[#38BDF8] text-[#03111F]"
                  : "bg-[#0A2544] text-white"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setChoice("no")}
              suppressHydrationWarning
              className={`rounded-lg px-5 py-2 text-sm font-semibold ${
                choice === "no"
                  ? "bg-[#7A1F2E] text-white"
                  : "bg-[#05182E] text-white"
              }`}
            >
              No
            </button>
          </div>

          <label className="mt-4 block text-[12px] text-[#9CB0C5]">
            Confidence: {confidence}%
            <input
              type="range"
              min={50}
              max={99}
              value={confidence}
              onChange={(event) => setConfidence(Number(event.target.value))}
              className="mt-2 w-full accent-[#38BDF8]"
            />
          </label>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 text-[13px]">
        <p className="text-[#9CB0C5]">
          {forecast.predictionCount.toLocaleString()} predictions
        </p>
        <Link
          href="#forecasts"
          className="font-semibold text-[#55C8FF] hover:text-[#8EDCFF]"
        >
          See all forecasts →
        </Link>
      </div>
    </section>
  );
}

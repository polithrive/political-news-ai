"use client";

import { useEffect, useState } from "react";

import {
  forecastPredictionStorageKey,
  type Forecast,
} from "./mockForecast";

type StoredPrediction = {
  choice: "yes" | "no";
  confidence: number;
};

type ForecastCardProps = {
  forecast: Forecast;
  featured?: boolean;
};

function formatCloseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (!year || !month || !day) {
    return value;
  }

  return `${months[month - 1]} ${day}, ${year}`;
}

export default function ForecastCard({
  forecast,
  featured = false,
}: ForecastCardProps) {
  const [choice, setChoice] = useState<"yes" | "no" | null>(null);
  const [confidence, setConfidence] = useState(70);
  const [hasPredicted, setHasPredicted] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(
        forecastPredictionStorageKey(forecast.id)
      );
      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored) as StoredPrediction;
      if (parsed.choice === "yes" || parsed.choice === "no") {
        setChoice(parsed.choice);
        setConfidence(parsed.confidence || 70);
        setHasPredicted(true);
      }
    } catch {
      /* presentation-only persistence */
    }
  }, [forecast.id]);

  function savePrediction(nextChoice: "yes" | "no", nextConfidence = confidence) {
    setChoice(nextChoice);
    setHasPredicted(true);

    try {
      const payload: StoredPrediction = {
        choice: nextChoice,
        confidence: nextConfidence,
      };
      window.localStorage.setItem(
        forecastPredictionStorageKey(forecast.id),
        JSON.stringify(payload)
      );
    } catch {
      /* presentation-only persistence */
    }
  }

  const closeLabel = forecast.closesAt
    ? `Closes ${formatCloseDate(forecast.closesAt)}`
    : null;

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border border-[#17446D]/55 bg-[#04162C] ${
        featured ? "p-5 sm:p-6 lg:p-7" : "p-5"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55C8FF]">
          {featured ? "Featured forecast" : forecast.category ?? "Forecast"}
        </p>
        {closeLabel ? (
          <p className="text-[11px] font-semibold text-[#9CB0C5]">{closeLabel}</p>
        ) : null}
      </div>

      <h2
        className={`mt-3 font-serif font-bold leading-snug text-white ${
          featured ? "text-xl sm:text-[1.45rem]" : "text-[1.08rem]"
        }`}
      >
        {forecast.question}
      </h2>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-[#0A2544] px-3 py-3 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7DD3FC]">
            Yes
          </p>
          <p className="mt-1 text-xl font-bold text-white">{forecast.yesPercent}%</p>
        </div>
        <div className="rounded-lg bg-[#2A1020] px-3 py-3 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#FF7A86]">
            No
          </p>
          <p className="mt-1 text-xl font-bold text-white">{forecast.noPercent}%</p>
        </div>
      </div>

      <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#9CB0C5]">
        Your prediction
      </p>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => savePrediction("yes")}
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
          onClick={() => savePrediction("no")}
          suppressHydrationWarning
          className={`rounded-lg px-5 py-2 text-sm font-semibold ${
            choice === "no" ? "bg-[#7A1F2E] text-white" : "bg-[#05182E] text-white"
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
          onChange={(event) => {
            const next = Number(event.target.value);
            setConfidence(next);
            if (choice) {
              savePrediction(choice, next);
            }
          }}
          className="mt-2 w-full accent-[#38BDF8]"
        />
      </label>

      <p className="mt-auto pt-4 text-[12px] text-[#9CB0C5]">
        {hasPredicted
          ? `Saved on this device · ${forecast.predictionCount.toLocaleString()} predictions`
          : `${forecast.predictionCount.toLocaleString()} predictions`}
      </p>
      <p className="mt-1 text-[11px] text-[#7890AC]">
        Reader forecast — not a prediction market or scientific model.
      </p>
    </article>
  );
}

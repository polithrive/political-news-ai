/*
 * TEMPORARY MOCK DATA — frontend-only homepage presentation.
 * Not a prediction market. Replace with API data later.
 */

export type Forecast = {
  id: string;
  question: string;
  category?: string;
  yesPercent: number;
  noPercent: number;
  predictionCount: number;
  image?: string;
  closesAt?: string;
};

export const MOCK_FEATURED_FORECAST: Forecast = {
  id: "mock-homepage-shutdown-forecast",
  question: "Will a government shutdown occur before November 1, 2026?",
  category: "Congress",
  yesPercent: 42,
  noPercent: 58,
  predictionCount: 3921,
  image: "/polithrive-capitol-bg.png",
  closesAt: "2026-11-01",
};

export const MOCK_FORECASTS: Forecast[] = [
  MOCK_FEATURED_FORECAST,
  {
    id: "mock-forecast-fed-cut",
    question: "Will the Federal Reserve cut interest rates before January 1, 2027?",
    category: "Economy",
    yesPercent: 61,
    noPercent: 39,
    predictionCount: 2840,
    closesAt: "2027-01-01",
  },
  {
    id: "mock-forecast-house",
    question: "Will Republicans hold the U.S. House after the 2026 midterms?",
    category: "Elections",
    yesPercent: 54,
    noPercent: 46,
    predictionCount: 5112,
    closesAt: "2026-11-03",
  },
  {
    id: "mock-forecast-ai-bill",
    question:
      "Will Congress pass a bill regulating advanced AI models before July 1, 2027?",
    category: "Technology",
    yesPercent: 33,
    noPercent: 67,
    predictionCount: 1764,
    closesAt: "2027-07-01",
  },
  {
    id: "mock-forecast-scotus",
    question:
      "Will the Supreme Court hear a major voting-rights case in the 2026 term?",
    category: "Courts",
    yesPercent: 48,
    noPercent: 52,
    predictionCount: 1298,
    closesAt: "2026-10-01",
  },
  {
    id: "mock-forecast-college",
    question:
      "Will the Education Department announce a new student-loan relief program this year?",
    category: "Education",
    yesPercent: 37,
    noPercent: 63,
    predictionCount: 2106,
    closesAt: "2026-12-31",
  },
];

export function forecastPredictionStorageKey(forecastId: string) {
  return `angle-report-forecast-prediction:${forecastId}`;
}

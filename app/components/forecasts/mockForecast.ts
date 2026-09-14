/*
 * TEMPORARY MOCK DATA — frontend-only homepage presentation.
 * Not a prediction market. Replace with API data later.
 */

export type Forecast = {
  id: string;
  question: string;
  yesPercent: number;
  noPercent: number;
  predictionCount: number;
  image?: string;
  closesAt?: string;
};

export const MOCK_FEATURED_FORECAST: Forecast = {
  id: "mock-homepage-shutdown-forecast",
  question:
    "Will a government shutdown occur before November 1, 2026?",
  yesPercent: 42,
  noPercent: 58,
  predictionCount: 3921,
  image: "/polithrive-capitol-bg.png",
  closesAt: "2026-11-01",
};

import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "OPENAI_API_KEY is not configured."
  );
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,

  /*
   * PoliticalPulse handles AI module failures at the
   * orchestration layer. Disabling SDK retries prevents
   * one slow request from blocking a report for 90 seconds.
   */
  maxRetries: 0,

  /*
   * A module that cannot respond within 20 seconds should
   * fail gracefully so the remaining report can display.
   */
  timeout: 20_000,
});
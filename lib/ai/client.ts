import OpenAI from "openai";

/*
 * Do not throw during module initialization.
 *
 * Next.js/Vercel may evaluate route modules during
 * the production build. Throwing here can cause the
 * entire deployment to fail before an API route is
 * ever called.
 */
const apiKey =
  process.env.OPENAI_API_KEY ??
  "openai-key-not-configured";

export const openai = new OpenAI({
  apiKey,

  maxRetries: 0,

  timeout: 20_000,
});
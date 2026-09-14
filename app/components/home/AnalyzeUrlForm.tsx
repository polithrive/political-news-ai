"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { createSlug } from "@/lib/createSlug";
import { saveSelectedArticle } from "@/lib/selectedArticle";
import { createUrlSubmittedArticle } from "@/lib/services/urlAnalysisReport";

function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export default function AnalyzeUrlForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setErrorMessage("Please paste a news article URL.");
      return;
    }

    if (!isHttpUrl(trimmedUrl)) {
      setErrorMessage(
        "Please enter a valid HTTP or HTTPS article URL."
      );
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    const submittedArticle = createUrlSubmittedArticle(trimmedUrl);

    saveSelectedArticle(submittedArticle);

    router.push(
      `/intelligence/${createSlug(submittedArticle.title)}`
    );
  }

  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
        Understand any article
      </p>

      <h2 className="mt-3 font-serif text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
        Paste an article. See what you're missing.
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#9CB0C5]">
        We'll look at the piece you submitted alongside related
        reporting, so you can see what it says, what others add, and
        what remains uncertain.
      </p>

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com/news-article"
            disabled={isSubmitting}
            aria-label="News article URL"
            className="min-w-0 flex-1 rounded-xl border border-[#1769A4]/40 bg-[#051831]/70 px-4 py-3.5 text-sm text-[#F8FAFC] outline-none transition placeholder:text-[#7890AC] focus:border-[#38BDF8] disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-[#FF2638] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#FF4656] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Opening brief..." : "See what you're missing"}
          </button>
        </div>
      </form>

      {errorMessage ? (
        <p role="alert" className="mt-3 text-sm text-red-300">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

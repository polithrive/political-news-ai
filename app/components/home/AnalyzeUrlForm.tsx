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

    const submittedArticle =
      createUrlSubmittedArticle(trimmedUrl);

    saveSelectedArticle(submittedArticle);

    router.push(
      `/intelligence/${createSlug(submittedArticle.title)}`
    );
  }

  return (
    <section className="mb-7 rounded-[22px] border border-[#17446D]/70 bg-[#04162C]/78 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#55C8FF]">
            Analyze any article
          </p>

          <h2 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">
            Generate an Intelligence Report from a URL
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#9CB0C5]">
            Paste a news article link. The Angle Report will extract
            the story, gather related reporting, and open the same
            Intelligence Report used for homepage stories.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-5"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com/news-article"
            disabled={isSubmitting}
            aria-label="News article URL"
            className="min-w-0 flex-1 rounded-xl border border-[#1769A4]/70 bg-[#051831]/80 px-4 py-3 text-sm text-[#F8FAFC] outline-none transition placeholder:text-[#7890AC] focus:border-[#38BDF8] disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-[#FF2638] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(255,38,56,0.18)] transition hover:bg-[#FF4656] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Opening report..."
              : "Analyze URL"}
          </button>
        </div>
      </form>

      {errorMessage ? (
        <p
          role="alert"
          className="mt-3 text-sm text-red-300"
        >
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
}

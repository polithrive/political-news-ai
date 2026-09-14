"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { createSlug } from "@/lib/createSlug";
import { saveSelectedArticle } from "@/lib/selectedArticle";
import { createUrlSubmittedArticle } from "@/lib/services/urlAnalysisReport";

import { LinkIcon } from "./HomeIcons";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setErrorMessage("Please paste a news article URL.");
      return;
    }

    if (!isHttpUrl(trimmedUrl)) {
      setErrorMessage("Please enter a valid HTTP or HTTPS article URL.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    const submittedArticle = createUrlSubmittedArticle(trimmedUrl);

    saveSelectedArticle(submittedArticle);

    router.push(`/intelligence/${createSlug(submittedArticle.title)}`);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-[#05182E] px-3.5 py-2.5">
            <LinkIcon className="h-4 w-4 shrink-0 text-[#55C8FF]" />
            <span className="sr-only">News article URL</span>
            <input
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com/news-article"
              disabled={isSubmitting}
              className="min-w-0 flex-1 bg-transparent text-sm text-[#F8FAFC] outline-none placeholder:text-[#7890AC] disabled:opacity-60"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            suppressHydrationWarning
            className="rounded-lg bg-[#38BDF8] px-5 py-2.5 text-sm font-bold text-[#03111F] transition hover:bg-[#55C8FF] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Opening brief..." : "Analyze Article →"}
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

"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { ANALYTICS_EVENTS } from "@/lib/analytics/taxonomy";
import { trackEvent } from "@/lib/analytics/track";
import { createIntelligenceHref } from "@/lib/services/intelligenceIdentity";
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

type AnalyzeUrlFormProps = {
  submitLabel?: string;
};

export default function AnalyzeUrlForm({
  submitLabel = "Analyze Article →",
}: AnalyzeUrlFormProps) {
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
    const href = createIntelligenceHref(submittedArticle);

    if (!href) {
      setErrorMessage("Please enter a valid HTTP or HTTPS article URL.");
      setIsSubmitting(false);
      return;
    }

    saveSelectedArticle(submittedArticle);
    trackEvent(ANALYTICS_EVENTS.analyzeSubmitted, { surface: "home" });

    router.push(href);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#17446D]/40 bg-[#05182E] px-3.5 py-2.5">
            <LinkIcon className="h-4 w-4 shrink-0 text-[#55C8FF]" />
            <span className="sr-only">News article URL</span>
            <input
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="Paste an article URL"
              disabled={isSubmitting}
              className="min-w-0 flex-1 bg-transparent text-sm text-[#F8FAFC] outline-none placeholder:text-[#7890AC] disabled:opacity-60"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            suppressHydrationWarning
            className="shrink-0 rounded-full border border-[#3A6A96] bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition hover:border-[#55C8FF] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Opening brief..." : submitLabel}
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

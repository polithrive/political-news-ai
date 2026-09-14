"use client";

import Link from "next/link";
import { FormEvent, useState, type ReactNode } from "react";

import type { AnalysisResult } from "@/app/types/analysis";
import type { Article } from "@/app/types/article";
import type { IntelligencePreview } from "@/app/types/intelligencePreview";

import StoryBriefLink from "./StoryBriefLink";
import {
  collectLeaningStories,
  leanCounts,
  storyForLean,
  type CoverageLean,
  type LeaningStory,
} from "./homeDesk";

const UPDATES_KEY = "the-angle-report-updates-email";

type HomeInsightPanelsProps = {
  articles: Article[];
  analysisResults: Record<number, AnalysisResult>;
  featuredArticle: Article | null;
  featuredAnalysis: IntelligencePreview | null;
};

const PERSPECTIVES: {
  lean: CoverageLean;
  title: string;
  href: string;
  accent: string;
}[] = [
  {
    lean: "Left",
    title: "Democratic perspective",
    href: "/perspectives/democratic",
    accent: "border-[#3B82F6]/50",
  },
  {
    lean: "Right",
    title: "Republican perspective",
    href: "/perspectives/republican",
    accent: "border-[#FF2638]/45",
  },
  {
    lean: "Center",
    title: "Neutral analysis",
    href: "/",
    accent: "border-[#55C8FF]/35",
  },
];

function Panel({
  kicker,
  title,
  actionHref,
  actionLabel,
  children,
}: {
  kicker: string;
  title: string;
  actionHref?: string;
  actionLabel?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#17446D]/55 bg-[#06172D]/85 p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#55C8FF]">
            {kicker}
          </p>
          <h2 className="mt-1 text-base font-bold text-white">
            {title}
          </h2>
        </div>
        {actionHref && actionLabel ? (
          <Link
            href={actionHref}
            className="shrink-0 text-xs font-semibold text-[#55C8FF] hover:text-[#8EDCFF]"
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function PerspectiveCard({
  title,
  accent,
  href,
  story,
}: {
  title: string;
  accent: string;
  href: string;
  story?: LeaningStory;
}) {
  return (
    <article
      className={`flex h-full flex-col rounded-xl border bg-[#041525]/80 p-4 ${accent}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8FB4D3]">
        {title}
      </p>
      {story ? (
        <>
          <h3 className="mt-2 line-clamp-3 text-sm font-bold leading-5 text-white">
            {story.article.title}
          </h3>
          {story.summary ? (
            <p className="mt-2 line-clamp-3 text-xs leading-5 text-[#9CB0C5]">
              {story.summary}
            </p>
          ) : null}
          <p className="mt-2 text-[11px] text-[#7A93AA]">
            {story.sourceName}
          </p>
          <div className="mt-3">
            <StoryBriefLink article={story.article} />
          </div>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm leading-6 text-[#9CB0C5]">
            No matching lean in today&apos;s top briefs yet.
          </p>
          <Link
            href={href}
            className="mt-3 text-xs font-semibold text-[#55C8FF]"
          >
            How angles work →
          </Link>
        </>
      )}
    </article>
  );
}

function StayInformed() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saved" | "error">(
    "idle"
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
      setStatus("error");
      return;
    }

    window.localStorage.setItem(UPDATES_KEY, nextEmail);
    setStatus("saved");
  }

  return (
    <Panel kicker="Updates" title="Stay informed">
      <p className="text-sm leading-6 text-[#9CB0C5]">
        Get a daily brief of the top political stories, without a
        headline dump.
      </p>
      {status === "saved" ? (
        <p className="mt-4 text-sm font-semibold text-[#7DD3FC]">
          Saved on this device. Billing and email delivery are not
          live yet.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setStatus("idle");
            }}
            placeholder="Enter your email"
            className="min-w-0 flex-1 rounded-lg border border-[#1769A4]/60 bg-[#051831] px-3 py-2 text-sm text-white outline-none placeholder:text-[#7890AC] focus:border-[#38BDF8]"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#3B82F6] px-3 py-2 text-sm font-semibold text-white hover:bg-[#60A5FA]"
          >
            Subscribe
          </button>
        </form>
      )}
      {status === "error" ? (
        <p className="mt-2 text-xs text-[#FF7A86]">
          Enter a valid email address.
        </p>
      ) : null}
    </Panel>
  );
}

export default function HomeInsightPanels({
  articles,
  analysisResults,
  featuredArticle,
  featuredAnalysis,
}: HomeInsightPanelsProps) {
  const leaningStories = collectLeaningStories(
    articles,
    analysisResults,
    featuredArticle,
    featuredAnalysis
  );
  const counts = leanCounts(leaningStories);
  const total = counts.Left + counts.Center + counts.Right;

  return (
    <div className="mt-8 space-y-5">
      <Panel
        kicker="Perspectives & analysis"
        title="How today's top briefs lean"
        actionHref="/perspectives/democratic"
        actionLabel="How it works"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {PERSPECTIVES.map((perspective) => (
            <PerspectiveCard
              key={perspective.lean}
              title={perspective.title}
              accent={perspective.accent}
              href={perspective.href}
              story={storyForLean(leaningStories, perspective.lean)}
            />
          ))}
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
        <Panel
          kicker="Coverage"
          title="Side-by-side coverage"
          actionHref="/coverage"
          actionLabel="Paste an article"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {PERSPECTIVES.map((perspective) => {
              const matches = leaningStories.filter(
                (story) => story.lean === perspective.lean
              );

              return (
                <div key={perspective.lean}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8FB4D3]">
                    {perspective.lean === "Left"
                      ? "Left-leaning"
                      : perspective.lean === "Right"
                        ? "Right-leaning"
                        : "Center"}
                  </p>
                  {matches.length > 0 ? (
                    <ul className="mt-2 space-y-2">
                      {matches.slice(0, 3).map((story) => (
                        <li
                          key={story.article.url || story.article.title}
                        >
                          <p className="text-xs font-semibold text-white">
                            {story.sourceName}
                          </p>
                          <p className="line-clamp-2 text-[11px] leading-4 text-[#9CB0C5]">
                            {story.article.title}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-xs leading-5 text-[#7A93AA]">
                      No {perspective.lean.toLowerCase()} lean in
                      the stories we&apos;ve briefed yet.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel kicker="Snapshot" title="Polling snapshot">
          {total > 0 ? (
            <>
              <p className="text-xs leading-5 text-[#9CB0C5]">
                Coverage mix of today&apos;s briefed stories — not
                a public-opinion poll.
              </p>
              <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-[#0A2846]">
                {counts.Left > 0 ? (
                  <div
                    className="bg-[#3B82F6]"
                    style={{
                      width: `${(counts.Left / total) * 100}%`,
                    }}
                  />
                ) : null}
                {counts.Center > 0 ? (
                  <div
                    className="bg-[#94A3B8]"
                    style={{
                      width: `${(counts.Center / total) * 100}%`,
                    }}
                  />
                ) : null}
                {counts.Right > 0 ? (
                  <div
                    className="bg-[#FF2638]"
                    style={{
                      width: `${(counts.Right / total) * 100}%`,
                    }}
                  />
                ) : null}
              </div>
              <ul className="mt-3 space-y-1 text-xs text-[#9CB0C5]">
                <li>Left {counts.Left}</li>
                <li>Center {counts.Center}</li>
                <li>Right {counts.Right}</li>
              </ul>
            </>
          ) : (
            <p className="text-sm leading-6 text-[#9CB0C5]">
              Briefs are still loading, so there is no coverage mix
              to show yet.
            </p>
          )}
        </Panel>

        <StayInformed />
      </div>
    </div>
  );
}

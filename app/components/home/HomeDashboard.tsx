"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import type { AnalysisResult } from "@/app/types/analysis";
import type { Article } from "@/app/types/article";
import type { IntelligencePreview } from "@/app/types/intelligencePreview";

import { createSlug } from "@/lib/createSlug";
import { saveSelectedArticle } from "@/lib/selectedArticle";

import AnalyzeUrlForm from "./AnalyzeUrlForm";

type HomeDashboardProps = {
  articles: Article[];
  analysisResults: Record<number, AnalysisResult>;
  featuredArticle: Article | null;
  featuredAnalysis: IntelligencePreview | null;
  isLoading: boolean;
  errorMessage: string | null;
  onTopicSelect: (topic: string) => void;
};

type ArticleImageProps = {
  src?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

type SidebarProps = {
  featuredArticle: Article | null;
};

const topics = [
  "Supreme Court",
  "Congress",
  "Immigration",
  "Economy",
  "Healthcare",
  "Foreign Policy",
];

function ArticleImage({
  src,
  sizes,
  priority = false,
  className = "object-cover",
}: ArticleImageProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const hasUsableImage =
    Boolean(src) && !imageFailed;

  if (!hasUsableImage) {
    return null;
  }

  return (
    <Image
      src={src as string}
      alt=""
      fill
      priority={priority}
      unoptimized
      sizes={sizes}
      className={className}
      onError={() => setImageFailed(true)}
    />
  );
}

function StoryLink({
  article,
  label = "Open Intelligence Report",
}: {
  article: Article;
  label?: string;
}) {
  return (
    <Link
      href={`/intelligence/${createSlug(
        article.title
      )}`}
      prefetch={false}
      onClick={() =>
        saveSelectedArticle(article)
      }
      className="inline-flex items-center gap-2 text-sm font-bold text-[#55C8FF] transition hover:text-[#8EDCFF]"
    >
      {label}

      <span
        aria-hidden="true"
        className="transition group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  );
}

function MetricBar({
  value,
  tone = "blue",
}: {
  value: number;
  tone?: "blue" | "emerald" | "red";
}) {
  const clampedValue = Math.max(
    0,
    Math.min(100, value)
  );

  const barClass =
    tone === "emerald"
      ? "bg-gradient-to-r from-emerald-500 to-emerald-300"
      : tone === "red"
        ? "bg-gradient-to-r from-[#FF2638] to-[#FF5A67]"
        : "bg-gradient-to-r from-[#1769A4] to-[#38BDF8]";

  return (
    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#102A45]">
      <div
        className={`h-full rounded-full ${barClass}`}
        style={{
          width: `${Math.max(
            clampedValue,
            clampedValue > 0 ? 4 : 0
          )}%`,
        }}
      />
    </div>
  );
}

function Sidebar({
  featuredArticle,
}: SidebarProps) {
  const reportBaseHref =
    featuredArticle
      ? `/intelligence/${createSlug(
          featuredArticle.title
        )}`
      : null;

  const intelligenceItems = [
    {
      label: "Trust Score",
      section: "trust-score",
    },
    {
      label: "Perspective Analysis",
      section: "perspective-analysis",
    },
    {
      label: "Fact Check",
      section: "fact-check",
    },
    {
      label: "Source Comparison",
      section: "source-comparison",
    },
  ];

  const linkClass =
    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#B7C8DA] transition hover:bg-[#0A2B4C] hover:text-white";

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 overflow-hidden rounded-[22px] border border-[#17446D]/70 bg-[#041225]/88 shadow-[0_26px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <div className="border-b border-[#153451] p-5">
          <Link
            href="/"
            className="block"
          >
            <p className="font-serif text-[23px] font-black leading-[0.86] tracking-[-0.04em] text-white">
              <span className="block text-[17px] text-[#38BDF8]">
                the
              </span>

              angle report
              <span className="text-[#FF2638]">
                .
              </span>
            </p>
          </Link>

          <p className="mt-3 text-[8px] font-bold uppercase tracking-[0.34em] text-[#55C8FF]">
            Ideas from every side.
          </p>
        </div>

        <div className="p-3">
          <p className="mb-2 px-3 text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#668099]">
            Discover
          </p>

          <div className="space-y-1">
            <Link
              href="/"
              className={linkClass}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#38BDF8]" />
              Home
            </Link>

            <Link
              href="/#top-stories"
              className={linkClass}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#47637F] transition group-hover:bg-[#38BDF8]" />
              Top Stories
            </Link>

            <Link
              href="/#top-stories"
              className={linkClass}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#47637F] transition group-hover:bg-[#38BDF8]" />
              Trending
            </Link>

            <Link
              href="/#topics"
              className={linkClass}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#47637F] transition group-hover:bg-[#38BDF8]" />
              Topics
            </Link>
          </div>
        </div>

        <div className="border-t border-[#153451] p-3">
          <p className="mb-2 px-3 text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#38BDF8]">
            Intelligence
          </p>

          <div className="space-y-1">
            {intelligenceItems.map(
              (item) => {
                if (
                  !featuredArticle ||
                  !reportBaseHref
                ) {
                  return (
                    <span
                      key={item.label}
                      className="block cursor-not-allowed rounded-xl px-3 py-2.5 text-sm font-semibold text-[#40556A]"
                    >
                      {item.label}
                    </span>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={`${reportBaseHref}#${item.section}`}
                    prefetch={false}
                    onClick={() =>
                      saveSelectedArticle(
                        featuredArticle
                      )
                    }
                    className={linkClass}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2278B8] transition group-hover:bg-[#38BDF8]" />
                    {item.label}
                  </Link>
                );
              }
            )}
          </div>
        </div>

        <div className="border-t border-[#153451] p-3">
          <p className="mb-2 px-3 text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#668099]">
            Company
          </p>

          <div className="space-y-1">
            <Link
              href="/about"
              className={linkClass}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={linkClass}
            >
              Contact
            </Link>

            <Link
              href="/privacy"
              className={linkClass}
            >
              Privacy
            </Link>
          </div>
        </div>

        <div className="border-t border-[#153451] p-4">
          <div className="rounded-xl border border-[#17446D] bg-[#061A31] p-4">
            <p className="text-xs font-black text-white">
              Explore every angle.
            </p>

            <p className="mt-2 text-[11px] leading-5 text-[#8299B1]">
              Go deeper with evidence,
              perspectives, sources, and
              context.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function RightRail({
  featuredAnalysis,
}: {
  featuredAnalysis:
    | IntelligencePreview
    | null;
}) {
  const trust =
    featuredAnalysis?.trustScore ?? 0;

  const consensus =
    featuredAnalysis?.consensusScore ?? 0;

  const confidence =
    featuredAnalysis?.confidence ?? 0;

  const sourcesReviewed =
    featuredAnalysis?.sourcesReviewed ?? 0;

  return (
    <aside
      id="intelligence"
      className="space-y-5"
    >
      <section className="overflow-hidden rounded-[22px] border border-[#17446D]/75 bg-[#04162C]/88 shadow-[0_22px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl">
        <div className="border-b border-[#153451] bg-gradient-to-r from-[#0B5C9D]/15 to-transparent px-5 py-5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#55C8FF]">
            Today&apos;s Intelligence
          </p>

          <h2 className="mt-2 text-xl font-black text-white">
            Featured story signals
          </h2>
        </div>

        <div className="space-y-6 p-5">
          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#71869B]">
                  Trust Score
                </p>

                <div className="mt-2 flex items-end gap-1">
                  <p className="text-4xl font-black text-white">
                    {trust}
                  </p>

                  <span className="mb-1 text-sm font-semibold text-[#64778C]">
                    /100
                  </span>
                </div>
              </div>

              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[9px] font-black uppercase tracking-wide text-emerald-300">
                Evidence
              </span>
            </div>

            <MetricBar
              value={trust}
              tone="emerald"
            />
          </div>

          <div className="border-t border-[#153451] pt-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#71869B]">
                  Consensus
                </p>

                <div className="mt-2 flex items-end gap-1">
                  <p className="text-4xl font-black text-white">
                    {consensus}
                  </p>

                  <span className="mb-1 text-sm font-semibold text-[#64778C]">
                    %
                  </span>
                </div>
              </div>

              <span className="rounded-full border border-[#38BDF8]/20 bg-[#38BDF8]/10 px-3 py-1 text-[9px] font-black uppercase tracking-wide text-[#7DD3FC]">
                Common Ground
              </span>
            </div>

            <MetricBar
              value={consensus}
            />
          </div>
        </div>
      </section>

      <section className="rounded-[22px] border border-[#17446D]/75 bg-[#04162C]/88 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#55C8FF]">
          Analysis Quality
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#163B5E] bg-[#051A32] p-4">
            <p className="text-[9px] font-bold uppercase tracking-wide text-[#70869B]">
              Confidence
            </p>

            <p className="mt-2 text-2xl font-black text-white">
              {confidence}%
            </p>
          </div>

          <div className="rounded-xl border border-[#1769A4]/45 bg-[#0A315B]/35 p-4">
            <p className="text-[9px] font-bold uppercase tracking-wide text-[#7DD3FC]">
              Sources
            </p>

            <p className="mt-2 text-2xl font-black text-white">
              {sourcesReviewed}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[22px] border border-[#17446D]/75 bg-[#04162C]/88 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#55C8FF]">
          The Angle Report
        </p>

        <h3 className="mt-2 text-lg font-black text-white">
          Go beyond the headline.
        </h3>

        <div className="mt-4 space-y-3">
          {[
            "Multi-source intelligence",
            "Perspective comparison",
            "Fact-check signals",
            "Common-ground analysis",
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-xl border border-transparent px-2 py-1.5 transition hover:border-[#1769A4]/25 hover:bg-[#1769A4]/10"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-[#38BDF8]/20 bg-[#38BDF8]/10 text-[10px] font-black text-[#7DD3FC]">
                ✓
              </span>

              <p className="text-sm leading-6 text-[#B7C8DA]">
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}

const TOP_STORIES_PAGE_SIZE = 6;

export default function HomeDashboard({
  articles,
  analysisResults,
  featuredArticle,
  featuredAnalysis,
  isLoading,
  errorMessage,
  onTopicSelect,
}: HomeDashboardProps) {
  const [visibleTopStoryCount, setVisibleTopStoryCount] =
    useState(TOP_STORIES_PAGE_SIZE);

  const storyPool =
    articles.filter(
      (article) =>
        article.url !==
        featuredArticle?.url
    );

  const sideStories =
    storyPool.slice(0, 2);

  const latestStoriesPool =
    storyPool.slice(2);

  const latestStories =
    latestStoriesPool.slice(
      0,
      visibleTopStoryCount
    );

  const hasMoreTopStories =
    visibleTopStoryCount <
    latestStoriesPool.length;

  return (
    <div className="relative overflow-hidden bg-[#020D21]">
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[930px] overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-65"
          style={{
            backgroundImage:
              "url('/polithrive-capitol-bg.png')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#020D21]/35 via-[#020D21]/60 to-[#020D21]" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#020D21]/90 via-[#020D21]/42 to-[#020D21]/80" />

        <div className="absolute left-[19%] top-[-220px] h-[620px] w-[620px] rounded-full bg-[#097AC1]/15 blur-[130px]" />

        <div className="absolute right-[10%] top-[120px] h-[380px] w-[380px] rounded-full bg-[#FF2638]/[0.035] blur-[110px]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1980px] gap-5 px-3 py-8 sm:px-4 xl:grid-cols-[220px_minmax(0,1fr)_340px] xl:px-5 2xl:px-6">
        <Sidebar
          featuredArticle={
            featuredArticle
          }
        />

        <main className="min-w-0">
          {/* Brand hero */}
          <section>
            <div className="mb-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#1769A4]/50 bg-[#082447]/60 px-3.5 py-1.5 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.9)]" />

                <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#7DD3FC]">
                  More than news. A clearer perspective.
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="max-w-4xl text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl">
                    Understand every{" "}
                    <span className="text-[#38BDF8]">
                      angle
                    </span>
                    <span className="text-[#FF2638]">
                      .
                    </span>
                  </h1>

                  <p className="mt-4 max-w-3xl text-sm leading-6 text-[#9CB0C5] sm:text-base sm:leading-7">
                    Evidence, context, source
                    analysis, and multiple
                    perspectives on the stories
                    that matter — so you can
                    understand the full picture,
                    not just consume the news.
                  </p>
                </div>

                <div className="hidden items-center gap-2 pb-1 text-xs font-semibold text-[#72889E] sm:flex">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
                  Live intelligence
                </div>
              </div>

              {/* Feature strip */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
                {[
                  {
                    title: "Multiple Perspectives",
                    text: "See how different sides view the story.",
                  },
                  {
                    title: "Source Analysis",
                    text: "Understand reliability and framing.",
                  },
                  {
                    title: "Deeper Context",
                    text: "Get the background that matters.",
                  },
                  {
                    title: "Common Ground",
                    text: "See where competing views agree.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-[#17446D]/55 bg-[#04162C]/58 px-4 py-3 backdrop-blur"
                  >
                    <p className="text-xs font-black text-[#55C8FF]">
                      {item.title}
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-[#8399AE]">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <AnalyzeUrlForm />

            {errorMessage ? (
              <div className="rounded-2xl border border-[#FF2638]/30 bg-[#FF2638]/10 p-6 text-red-200">
                {errorMessage}
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(285px,0.55fr)]">
                {/* Main story */}
                <article className="group overflow-hidden rounded-[24px] border border-[#28567F]/70 bg-[#04162C]/50 shadow-[0_26px_75px_rgba(0,0,0,0.23)] backdrop-blur">
                  <div className="relative min-h-[455px] bg-[#061A31]">
                    <ArticleImage
                      src={
                        featuredArticle
                          ?.urlToImage
                      }
                      priority
                      sizes="(max-width: 1024px) 100vw, 62vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.015]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#020D21]/95 via-[#020D21]/30 to-transparent" />

                    <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#020D21]/35 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-6 pt-20 sm:p-8 sm:pt-24">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md border border-white/10 bg-[#020D21]/85 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white backdrop-blur">
                          {featuredArticle
                            ?.source?.name ??
                            "The Angle Report"}
                        </span>

                        <span className="rounded-md border border-[#FF2638]/40 bg-[#FF2638]/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#FFB4BB] backdrop-blur">
                          Top Story
                        </span>

                        <span className="rounded-md border border-[#38BDF8]/30 bg-[#1769A4]/25 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#9BDFFF] backdrop-blur">
                          Intelligence Ready
                        </span>
                      </div>

                      <h2 className="mt-4 max-w-4xl text-3xl font-black leading-tight tracking-[-0.025em] text-white sm:text-4xl lg:text-[2.65rem]">
                        {featuredArticle?.title ??
                          "Loading today’s top story..."}
                      </h2>

                      <p className="mt-4 max-w-3xl text-sm leading-6 text-[#CFDAE7] sm:text-base">
                        {featuredAnalysis
                          ?.summary ||
                          featuredArticle
                            ?.description ||
                          "The Angle Report is preparing the intelligence preview."}
                      </p>

                      {featuredArticle ? (
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                          <Link
                            href={`/intelligence/${createSlug(
                              featuredArticle.title
                            )}`}
                            prefetch={false}
                            onClick={() =>
                              saveSelectedArticle(
                                featuredArticle
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-[#FF2638] px-5 py-3 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(255,38,56,0.22)] transition hover:bg-[#FF4151]"
                          >
                            Open Intelligence Report

                            <span>
                              →
                            </span>
                          </Link>

                          <span className="text-xs font-medium text-[#8298AD]">
                            Evidence • context • perspectives
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>

                {/* Side stories */}
                <div className="grid gap-5">
                  {sideStories.map(
                    (article, index) => (
                      <article
                        key={
                          article.url ||
                          `${article.title}-${index}`
                        }
                        className="group flex min-h-[218px] flex-col rounded-[22px] border border-[#28567F]/60 bg-[#06192F]/72 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.15)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[#38BDF8]/45 hover:bg-[#08203A]"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#55C8FF]">
                              {article.source
                                ?.name ??
                                "Source"}
                            </p>

                            <span className="rounded-md border border-[#245076] bg-[#04162C] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#6F879F]">
                              Analysis
                            </span>
                          </div>

                          <h3 className="mt-3 line-clamp-3 text-xl font-extrabold leading-7 text-white">
                            {article.title}
                          </h3>

                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#93A8BC]">
                            {article.description ||
                              "Open the report for full analysis."}
                          </p>
                        </div>

                        <div className="mt-auto border-t border-[#153451] pt-4">
                          <StoryLink
                            article={article}
                            label="Open Report"
                          />
                        </div>
                      </article>
                    )
                  )}

                  {isLoading &&
                  sideStories.length === 0 ? (
                    <div className="rounded-[22px] border border-[#28567F]/60 bg-[#06192F]/72 p-5">
                      <div className="h-5 w-24 animate-pulse rounded bg-[#143A5E]" />

                      <div className="mt-4 h-6 w-full animate-pulse rounded bg-[#143A5E]" />

                      <div className="mt-3 h-6 w-4/5 animate-pulse rounded bg-[#143A5E]" />
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </section>

          {/* Top Stories */}
          <section
            id="top-stories"
            className="mt-14 scroll-mt-28"
          >
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.23em] text-[#55C8FF]">
                  Today&apos;s Top Stories
                </p>

                <h2 className="mt-2 font-serif text-3xl font-black text-white">
                  More stories worth understanding
                </h2>

                <p className="mt-2 text-sm text-[#8398AD]">
                  Explore the biggest stories
                  with deeper context and
                  multi-angle analysis.
                </p>
              </div>

              <span className="hidden rounded-lg border border-[#17446D] bg-[#04162C] px-3 py-1.5 text-xs font-semibold text-[#8197AD] sm:inline">
                {latestStoriesPool.length} stories
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {latestStories.map(
                (article, index) => {
                  const articleIndex =
                    articles.findIndex(
                      (candidate) =>
                        candidate.url ===
                        article.url
                    );

                  const analysis =
                    articleIndex >= 0
                      ? analysisResults[
                          articleIndex
                        ]
                      : undefined;

                  return (
                    <article
                      key={
                        article.url ||
                        `${article.title}-${index}`
                      }
                      className="group overflow-hidden rounded-[22px] border border-[#214B70]/65 bg-[#05182E]/80 shadow-[0_18px_45px_rgba(0,0,0,0.15)] transition hover:-translate-y-0.5 hover:border-[#38BDF8]/40"
                    >
                      <div className="grid h-full sm:grid-cols-[155px_1fr]">
                        <div className="relative min-h-[175px] overflow-hidden bg-[#0A2846]">
                          <ArticleImage
                            src={
                              article.urlToImage
                            }
                            sizes="155px"
                            className="object-cover transition duration-500 group-hover:scale-[1.04]"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-[#020D21]/70 to-transparent" />

                          <div className="absolute left-3 top-3">
                            <span className="rounded-md border border-[#38BDF8]/25 bg-[#020D21]/75 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#7DD3FC] backdrop-blur">
                              Intelligence
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col p-5">
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#55C8FF]">
                            {article.source
                              ?.name ??
                              "Source"}
                          </p>

                          <h3 className="mt-2 line-clamp-3 text-lg font-extrabold leading-6 text-white">
                            {article.title}
                          </h3>

                          {analysis ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                              <span className="rounded-md border border-[#294B6B] bg-[#04162C] px-2.5 py-1 text-[10px] font-bold text-[#B2C0CE]">
                                Bias{" "}
                                {
                                  analysis.biasScore
                                }
                                /100
                              </span>

                              <span className="rounded-md border border-[#1769A4]/35 bg-[#1769A4]/15 px-2.5 py-1 text-[10px] font-bold text-[#7DD3FC]">
                                Confidence{" "}
                                {
                                  analysis.confidence
                                }
                                %
                              </span>
                            </div>
                          ) : null}

                          <div className="mt-auto border-t border-[#153451] pt-4">
                            <StoryLink
                              article={article}
                            />
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>

            {hasMoreTopStories ? (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleTopStoryCount(
                      (currentCount) =>
                        currentCount +
                        TOP_STORIES_PAGE_SIZE
                    )
                  }
                  className="rounded-xl border border-[#1769A4]/70 bg-[#082447]/80 px-6 py-3 text-sm font-bold text-[#E2F3FF] transition hover:border-[#38BDF8] hover:bg-[#0A315B]"
                >
                  Load More
                </button>
              </div>
            ) : null}
          </section>

          {/* Topics */}
          <section
            id="topics"
            className="mt-14 scroll-mt-28"
          >
            <div className="overflow-hidden rounded-[24px] border border-[#214B70]/70 bg-[#05182E]/82 shadow-[0_20px_55px_rgba(0,0,0,0.16)] backdrop-blur">
              <div className="border-b border-[#153451] bg-gradient-to-r from-[#1769A4]/15 to-transparent p-6">
                <div className="max-w-2xl">
                  <p className="text-[10px] font-black uppercase tracking-[0.23em] text-[#55C8FF]">
                    Explore Topics
                  </p>

                  <h2 className="mt-2 font-serif text-3xl font-black text-white">
                    Follow the issues shaping the conversation
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-[#8DA2B6]">
                    Jump into the issues driving
                    today&apos;s conversation and
                    explore the evidence,
                    perspectives, and context
                    behind them.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3">
                {topics.map(
                  (topic, index) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() =>
                        onTopicSelect(topic)
                      }
                      className="group flex items-center justify-between rounded-xl border border-[#1C456A] bg-[#04162C]/75 px-4 py-3.5 text-left transition hover:border-[#38BDF8]/45 hover:bg-[#082442] focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/30"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#38BDF8]/20 bg-[#1769A4]/15 text-xs font-black text-[#7DD3FC] transition group-hover:bg-[#1769A4]/25">
                          {index + 1}
                        </span>

                        <span className="text-sm font-bold text-[#D5E0EA] transition group-hover:text-white">
                          {topic}
                        </span>
                      </div>

                      <span className="text-[#38BDF8] transition group-hover:translate-x-1">
                        →
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>
          </section>
        </main>

        <RightRail
          featuredAnalysis={
            featuredAnalysis
          }
        />
      </div>
    </div>
  );
}
"use client";

import Image from "next/image";
import Link from "next/link";

import type { AnalysisResult } from "../types/analysis";
import type { Article } from "../types/article";

import { createSlug } from "@/lib/createSlug";
import { saveSelectedArticle } from "../../lib/selectedArticle";

const MAX_VISIBLE_ARTICLES = 6;

type LiveNewsProps = {
  articles: Article[];
  analysisResults: Record<number, AnalysisResult>;
  featuredAnalysis: AnalysisResult | null;
  isLoading: boolean;
  errorMessage: string | null;
};

function formatPublishedDate(publishedAt: string | undefined): string {
  if (!publishedAt) return "Date unavailable";
  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getLeanStyles(lean: string | undefined): string {
  const value = lean?.trim().toLowerCase();
  if (value === "left" || value === "progressive") return "border-blue-200 bg-blue-50 text-blue-700";
  if (value === "right" || value === "conservative") return "border-red-200 bg-red-50 text-red-700";
  if (value === "center" || value === "centrist") return "border-violet-200 bg-violet-50 text-violet-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

function LoadingCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="h-52 animate-pulse bg-slate-200" />
      <div className="p-6">
        <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
        <div className="mt-5 h-7 w-full animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-7 w-4/5 animate-pulse rounded bg-slate-200" />
        <div className="mt-5 h-16 animate-pulse rounded bg-slate-100" />
        <div className="mt-6 h-11 animate-pulse rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}

export default function LiveNews({ articles, analysisResults, isLoading, errorMessage }: LiveNewsProps) {
  const visibleArticles = articles.slice(0, MAX_VISIBLE_ARTICLES);

  if (isLoading) {
    return (
      <section id="live-news" className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Live Intelligence</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Latest stories under analysis</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: MAX_VISIBLE_ARTICLES }).map((_, index) => <LoadingCard key={index} />)}
          </div>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section id="live-news" className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="font-semibold text-red-700">Live news could not be loaded.</p>
            <p className="mt-2 text-red-700/80">{errorMessage}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="live-news" className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:py-20">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Live Intelligence</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Understand what is happening now</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Browse the latest political stories, then open an Intelligence Report when you want the deeper analysis.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>{visibleArticles.length} active {visibleArticles.length === 1 ? "story" : "stories"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleArticles.map((article, index) => {
            const analysis = analysisResults[index] ?? null;
            const sourceName = article.source?.name ?? "Unknown Source";
            const reportRoute = `/intelligence/${createSlug(article.title)}`;

            return (
              <article key={article.url || `${article.title}-${index}`} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  {article.urlToImage ? (
                    <Image src={article.urlToImage} alt="" fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" unoptimized />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
                      <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">PoliticalPulse</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-flex max-w-[80%] truncate rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-800 backdrop-blur">{sourceName}</span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">Political News</span>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getLeanStyles(analysis?.lean)}`}>
                      {analysis?.lean ? `${analysis.lean} framing` : "Perspective pending"}
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{formatPublishedDate(article.publishedAt)}</p>
                  <h3 className="mt-3 text-xl font-extrabold leading-8 text-slate-950">{article.title}</h3>
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{analysis?.summary || article.description || "Open the intelligence report for a complete analysis of this story."}</p>

                  {analysis ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">Bias {analysis.biasScore}/100</span>
                      <span className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">Confidence {analysis.confidence}%</span>
                      <span className="rounded-lg bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700">{analysis.keyFacts.length} key facts</span>
                    </div>
                  ) : null}

                  <div className="mt-auto pt-6">
                    <Link prefetch={false} href={reportRoute} onClick={() => saveSelectedArticle(article)} className="flex w-full items-center justify-between rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700">
                      <span>Open Intelligence Report</span><span>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

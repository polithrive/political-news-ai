"use client";

import Image from "next/image";
import Link from "next/link";

import type { Article } from "@/app/types/article";
import type { IntelligencePreview } from "@/app/types/intelligencePreview";

import { createSlug } from "@/lib/createSlug";
import { saveSelectedArticle } from "@/lib/selectedArticle";

import IntelligencePreviewCard from "./IntelligencePreviewCard";

type HeroSectionProps = {
  featuredArticle: Article | null;
  featuredAnalysis: IntelligencePreview | null;
  isLoading: boolean;
};

function formatPublishedDate(
  publishedAt: string | undefined
): string {
  if (!publishedAt) {
    return "Latest coverage";
  }

  const date = new Date(publishedAt);

  if (Number.isNaN(date.getTime())) {
    return "Latest coverage";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function HeroSection({
  featuredArticle,
  featuredAnalysis,
  isLoading,
}: HeroSectionProps) {
  function saveFeaturedArticle() {
    if (featuredArticle) {
      saveSelectedArticle(featuredArticle);
    }
  }

  const intelligenceRoute = featuredArticle
    ? `/intelligence/${createSlug(featuredArticle.title)}`
    : "#";

  return (
    <section className="relative overflow-hidden bg-[#020D21] text-white">
      {/* Background atmosphere */}
      <div className="absolute inset-0">
        <Image
          src="/polithrive-capitol-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,#020D21_0%,rgba(2,13,33,0.96)_30%,rgba(2,13,33,0.72)_62%,rgba(2,13,33,0.9)_100%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_25%,rgba(20,112,220,0.24),transparent_34%)]" />

        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#020D21] to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-[1500px] px-5 py-10 sm:px-7 lg:px-8 lg:py-14 xl:py-16">
        {/* Brand positioning */}
        <div className="mb-8 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1769A4]/80 bg-[#082447]/75 px-4 py-2 shadow-[0_0_28px_rgba(56,189,248,0.08)] backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#38BDF8] shadow-[0_0_10px_rgba(56,189,248,0.9)]" />

            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7DD3FC]">
              More than news. A clearer perspective.
            </span>
          </div>

          <h1 className="mt-6 max-w-5xl text-4xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Understand every{" "}
            <span className="text-[#38BDF8]">
              angle
            </span>
            <span className="text-[#FF2638]">.</span>
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-[#B7C7DA] sm:text-lg sm:leading-8">
            Get evidence, context, source analysis, and multiple
            perspectives on the stories that matter — so you can
            understand the full picture, not just consume the news.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {featuredArticle ? (
              <Link
                href={intelligenceRoute}
                prefetch={false}
                onClick={saveFeaturedArticle}
                className="inline-flex items-center gap-2 rounded-xl bg-[#FF2638] px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(255,38,56,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#FF4050]"
              >
                Generate Intelligence Report
                <span aria-hidden="true">→</span>
              </Link>
            ) : (
              <button
                disabled
                className="rounded-xl bg-[#B91C2B] px-5 py-3.5 text-sm font-bold text-white opacity-60"
              >
                {isLoading
                  ? "Preparing intelligence..."
                  : "Report unavailable"}
              </button>
            )}

            <Link
              href="#live-news"
              className="inline-flex items-center gap-2 rounded-xl border border-[#2D81B8] bg-[#04172F]/70 px-5 py-3.5 text-sm font-bold text-[#E2F3FF] backdrop-blur transition duration-200 hover:border-[#38BDF8] hover:bg-[#082447]"
            >
              Explore Top Stories
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Intelligence benefit strip */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Multiple Perspectives",
              description:
                "See how different sides are talking about it.",
              icon: "◫",
            },
            {
              title: "Source Analysis",
              description:
                "Understand credibility, reliability, and framing.",
              icon: "▥",
            },
            {
              title: "Deeper Context",
              description:
                "Get the background that actually matters.",
              icon: "◆",
            },
            {
              title: "Common Ground",
              description:
                "See where competing perspectives agree.",
              icon: "◎",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group flex items-start gap-4 rounded-2xl border border-[#19466D]/55 bg-[#06172D]/66 p-4 backdrop-blur-md transition hover:border-[#38BDF8]/50 hover:bg-[#08203D]/78"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#1769A4]/60 bg-[#0A315B] text-lg font-black text-[#7DD3FC]">
                {item.icon}
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#EAF4FF]">
                  {item.title}
                </h2>

                <p className="mt-1 text-sm leading-5 text-[#91A8C2]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Featured story + intelligence preview */}
        <div className="grid gap-5 xl:grid-cols-[1.48fr_0.72fr]">
          <article className="group overflow-hidden rounded-[24px] border border-[#23527C]/70 bg-[#06172D]/85 shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
            <div className="relative min-h-[430px] overflow-hidden sm:min-h-[500px]">
              {featuredArticle?.urlToImage ? (
                <Image
                  src={featuredArticle.urlToImage}
                  alt=""
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1280px) 100vw, 70vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.015]"
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#174C82,#06172D_55%,#020D21)]" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#020D21] via-[#020D21]/55 to-[#020D21]/5" />

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-9">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg border border-[#38BDF8]/30 bg-[#06172D]/90 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#7DD3FC] backdrop-blur">
                    {featuredArticle?.source?.name ??
                      "The Angle Report"}
                  </span>

                  <span className="rounded-lg bg-[#FF2638] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-white">
                    Top Story
                  </span>

                  <span className="rounded-lg border border-[#2563EB]/60 bg-[#164A8A]/80 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.1em] text-[#BFDBFE]">
                    Intelligence Ready
                  </span>
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#8FB0D1]">
                  {formatPublishedDate(featuredArticle?.publishedAt)}
                </p>

                <h2 className="mt-3 max-w-5xl text-3xl font-black leading-[1.04] tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
                  {featuredArticle?.title ??
                    "Loading today’s featured story..."}
                </h2>

                <p className="mt-5 max-w-4xl text-base leading-7 text-[#CFDBE8] sm:text-lg">
                  {featuredAnalysis?.summary ||
                    featuredArticle?.description ||
                    "The Angle Report is preparing the intelligence preview for this story."}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  {featuredArticle ? (
                    <Link
                      href={intelligenceRoute}
                      prefetch={false}
                      onClick={saveFeaturedArticle}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0B5ED7] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1476F2]"
                    >
                      Open Intelligence Report
                      <span aria-hidden="true">→</span>
                    </Link>
                  ) : null}

                  <Link
                    href="#live-news"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
                  >
                    Browse More Stories
                  </Link>
                </div>
              </div>
            </div>
          </article>

          <div className="min-w-0">
            <div className="h-full rounded-[24px] border border-[#23527C]/70 bg-[#06172D]/88 p-1 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <IntelligencePreviewCard
                article={featuredArticle}
                analysis={featuredAnalysis}
                isLoading={isLoading}
                onOpenReport={saveFeaturedArticle}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
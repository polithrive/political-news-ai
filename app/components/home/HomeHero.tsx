"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { Article } from "@/app/types/article";

import { trackReadOriginal } from "@/lib/analytics/track";

import RelativeTime from "./RelativeTime";
import StoryBriefLink from "./StoryBriefLink";
import { storyCategory } from "./storyMeta";

type HomeHeroProps = {
  article?: Article | null;
  summary?: string;
  isLoading?: boolean;
};

export default function HomeHero({
  article,
  summary,
  isLoading = false,
}: HomeHeroProps) {
  const [todayLabel, setTodayLabel] = useState("");

  useEffect(() => {
    setTodayLabel(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );
  }, []);

  const dek = summary?.trim() || article?.description?.trim() || "";
  const category = article ? storyCategory(article) : "";

  return (
    <section className="relative overflow-hidden rounded-2xl">
      <div className="absolute inset-0">
        <Image
          src="/polithrive-capitol-bg.png"
          alt=""
          fill
          priority
          unoptimized
          sizes="(max-width: 1024px) 100vw, 70vw"
          className="object-cover object-[68%_42%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#020D21_0%,rgba(2,13,33,0.88)_28%,rgba(2,13,33,0.18)_58%,rgba(2,13,33,0.35)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,13,33,0.2)_0%,transparent_45%,rgba(2,13,33,0.55)_100%)]" />
      </div>

      <div className="relative px-5 py-7 sm:px-7 sm:py-8 lg:py-9">
        <div className="flex max-w-2xl flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#55C8FF]">
            Today&apos;s top story
          </p>
          {todayLabel ? (
            <p className="text-[13px] text-[#9CB0C5]">{todayLabel}</p>
          ) : null}
        </div>

        {article ? (
          <>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7DD3FC]">
              {category}
              {article.publishedAt ? (
                <>
                  <span className="mx-2 text-[#4E6A84]">·</span>
                  <RelativeTime publishedAt={article.publishedAt} />
                </>
              ) : null}
            </p>

            <h1 className="mt-2.5 max-w-2xl text-balance font-serif text-[1.85rem] font-black leading-[1.12] tracking-[-0.035em] text-white sm:text-[2.2rem] lg:line-clamp-4 lg:text-[2.4rem]">
              {article.title}
            </h1>

            {dek ? (
              <p className="mt-3 max-w-xl text-[15px] leading-6 text-[#C5D4E8] sm:line-clamp-3 sm:text-[16px] sm:leading-7">
                {dek}
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <StoryBriefLink
                article={article}
                className="inline-flex items-center rounded-full bg-[#FF2638] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#FF4151]"
              />
              {article.url ? (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackReadOriginal(article.url, "home")}
                  className="inline-flex items-center rounded-full border border-[#3A6A96] px-4 py-2.5 text-sm font-semibold text-white hover:border-[#55C8FF]"
                >
                  Read original →
                </a>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-3 max-w-xl font-serif text-[1.85rem] font-black leading-[1.12] tracking-[-0.035em] text-white sm:text-[2.2rem] lg:text-[2.4rem]">
              {isLoading
                ? "Loading today's top story…"
                : "Today's top story will appear here."}
            </h1>
            <p className="mt-3 max-w-md text-[15px] leading-6 text-[#C5D4E8] sm:text-[16px] sm:leading-7">
              Clear. Balanced. Multi-source analysis.
            </p>
          </>
        )}

        <p className="pointer-events-none absolute bottom-5 right-6 hidden max-w-[148px] text-right text-[12px] leading-5 text-[#9CB0C5] lg:block">
          Different perspectives.
          <br />
          A clearer picture.
        </p>
      </div>
    </section>
  );
}

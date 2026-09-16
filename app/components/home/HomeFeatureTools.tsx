"use client";

import Link from "next/link";

import AnalyzeUrlForm from "./AnalyzeUrlForm";

export default function HomeFeatureTools() {
  return (
    <section id="understand-any-article" className="scroll-mt-28 space-y-4">
      <div className="rounded-2xl border border-[#17446D]/45 bg-[#04162C] px-5 py-7 sm:px-8 sm:py-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
          Understand any article
        </p>
        <h2 className="mt-2 font-serif text-3xl font-black tracking-[-0.03em] text-white sm:text-[2.15rem]">
          Paste an article.
          <br />
          See what you&apos;re missing.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#9CB0C5] sm:text-base">
          Compare the reporting, see what&apos;s corroborated, discover other
          perspectives, and understand what&apos;s still uncertain.
        </p>
        <p className="mt-2 max-w-2xl text-[13px] leading-5 text-[#7890AC]">
          We analyze the story across multiple sources — not just the article
          you paste.
        </p>
        <div className="mt-6 max-w-2xl">
          <AnalyzeUrlForm submitLabel="Analyze article →" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-xl border border-[#17446D]/40 bg-[#04162C] px-4 py-4">
          <h3 className="text-[13px] font-semibold text-white">Follow topics</h3>
          <p className="mt-1.5 text-[12px] leading-5 text-[#9CB0C5]">
            Track stories and get meaningful updates.
          </p>
          <Link
            href="/saved"
            className="mt-3 inline-flex text-[12px] font-semibold text-[#55C8FF] hover:text-[#8EDCFF]"
          >
            Start following →
          </Link>
        </article>

        <article className="rounded-xl border border-[#17446D]/40 bg-[#04162C] px-4 py-4">
          <h3 className="text-[13px] font-semibold text-white">
            Explore timelines
          </h3>
          <p className="mt-1.5 text-[12px] leading-5 text-[#9CB0C5]">
            See how important stories develop over time.
          </p>
          <Link
            href="/timeline"
            className="mt-3 inline-flex text-[12px] font-semibold text-[#55C8FF] hover:text-[#8EDCFF]"
          >
            Open timelines →
          </Link>
        </article>

        <article className="rounded-xl border border-[#17446D]/40 bg-[#04162C] px-4 py-4">
          <h3 className="text-[13px] font-semibold text-white">Check a source</h3>
          <p className="mt-1.5 text-[12px] leading-5 text-[#9CB0C5]">
            Understand ownership, reliability information, and coverage
            patterns.
          </p>
          <div className="mt-3">
            <AnalyzeUrlForm compact submitLabel="Check a source →" />
          </div>
        </article>
      </div>
    </section>
  );
}

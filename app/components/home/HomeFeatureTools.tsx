"use client";

import AnalyzeUrlForm from "./AnalyzeUrlForm";

export default function HomeFeatureTools() {
  return (
    <section id="understand-any-article" className="scroll-mt-28">
      <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
        <article className="flex h-full flex-col rounded-xl border border-[#17446D]/55 bg-[#04162C] px-5 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
            Understand any article
          </p>
          <h2 className="mt-2 font-serif text-[1.35rem] font-black tracking-[-0.03em] text-white sm:text-[1.5rem]">
            Paste an article. See what you&apos;re missing.
          </h2>
          <p className="mt-2 text-[13px] leading-5 text-[#9CB0C5]">
            Open a 60-second brief on any story URL — compared across multiple
            sources, not just the article you paste.
          </p>
          <div className="mt-4">
            <AnalyzeUrlForm submitLabel="Analyze article" />
          </div>
        </article>

        <article className="flex h-full flex-col rounded-xl border border-[#17446D]/55 bg-[#04162C] px-5 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
            Check a source
          </p>
          <h2 className="mt-2 font-serif text-[1.35rem] font-black tracking-[-0.03em] text-white sm:text-[1.5rem]">
            Understand the source behind a story
          </h2>
          <p className="mt-2 text-[13px] leading-5 text-[#9CB0C5]">
            The Angle Report will help readers see a source&apos;s ownership,
            reliability context, and coverage patterns — so you can judge the
            outlet, not just the article.
          </p>
          <p className="mt-auto pt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7890AC]">
            In development
          </p>
        </article>
      </div>
    </section>
  );
}

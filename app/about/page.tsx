import Link from "next/link";

import Footer from "@/app/components/Footer";
import SiteShell from "@/app/components/shell/SiteShell";

const principles = [
  {
    title: "Understand, not persuade",
    description:
      "The Angle Report explains what happened, how sides interpret it, and what remains uncertain — without telling you what to think.",
  },
  {
    title: "Finish the story, don't pile on headlines",
    description:
      "Most sites compete on volume. We compete on minutes. A 60-second brief should be enough for a busy reader to walk away informed.",
  },
  {
    title: "Show the coverage, not a scoreboard",
    description:
      "When we can, we say how many sources were reviewed and how strong the evidence is. We do not hide thin coverage behind a confidence number.",
  },
  {
    title: "Be honest about uncertainty",
    description:
      "Analysis can be wrong. We surface conflicting reporting and unanswered questions instead of pretending the story is settled.",
  },
];

export default function AboutPage() {
  return (
    <SiteShell>

      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
          About
        </p>

        <h1 className="mt-5 font-serif text-4xl font-black tracking-[-0.03em] sm:text-5xl">
          People do not need more news. They need to finish the story.
        </h1>

        <p className="mt-6 text-lg leading-8 text-[#9CB0C5]">
          The Angle Report is the fastest way to understand the news from
          every angle. Open Today for 60-second briefs, or paste any
          article to see what that piece says, what others add, and what
          remains uncertain.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/"
            className="rounded-xl bg-[#FF2638] px-5 py-3 font-semibold text-white transition hover:bg-[#FF4151]"
          >
            Read Today
          </Link>

          <Link
            href="/#understand-any-article"
            className="rounded-xl px-5 py-3 font-semibold text-[#9CB0C5] transition hover:text-white"
          >
            Understand any article
          </Link>
        </div>
      </section>

      <section className="border-y border-[#17446D]/40">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
            How we work
          </p>

          <div className="mt-10 grid gap-10">
            {principles.map((principle) => (
              <article key={principle.title}>
                <h2 className="text-xl font-bold text-white">
                  {principle.title}
                </h2>

                <p className="mt-3 leading-7 text-[#9CB0C5]">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#FF7A86]">
          Limitation
        </p>

        <h2 className="mt-3 font-serif text-2xl font-black tracking-[-0.03em]">
          This is a tool for understanding, not a replacement for original reporting.
        </h2>

        <p className="mt-4 leading-7 text-[#9CB0C5]">
          Briefs are generated from available reporting and may contain
          errors or incomplete analysis. Read original sources, especially
          before legal, financial, medical, or voting decisions.
        </p>
      </section>

      <Footer />
    </SiteShell>
  );
}

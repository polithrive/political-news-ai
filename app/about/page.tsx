import Link from "next/link";

const principles = [
  {
    title: "Understand, not persuade",
    description:
      "PoliticalPulse is designed to explain political stories, competing viewpoints, and areas of agreement without telling readers what to think.",
  },
  {
    title: "Separate facts from interpretation",
    description:
      "Our reports distinguish reported facts, political framing, unresolved questions, and AI-generated analysis so readers can evaluate each layer clearly.",
  },
  {
    title: "Show the reporting landscape",
    description:
      "PoliticalPulse compares multiple sources and provides context about reliability, factual reporting, and political lean.",
  },
  {
    title: "Be transparent about uncertainty",
    description:
      "AI can make mistakes. PoliticalPulse highlights limitations, conflicting reporting, and unanswered questions instead of presenting uncertainty as fact.",
  },
];

const capabilities = [
  "Multi-source Intelligence Reports",
  "Trust Score™",
  "PoliticalPulse Debate™",
  "Source Intelligence™",
  "Story Timeline",
  "Intelligence Graph",
  "Fact Check",
  "AI-powered report chat",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
          About PoliticalPulse
        </p>

        <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          People do not need more political news.
          They need better tools to understand it.
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          PoliticalPulse is an AI-powered political intelligence
          platform built to help readers understand what happened,
          why it matters, how different perspectives interpret it,
          and where uncertainty remains.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/"
            className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500"
          >
            Explore PoliticalPulse
          </Link>

          <Link
            href="/contact"
            className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
          >
            Contact us
          </Link>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Our mission
            </p>

            <h2 className="mt-4 text-3xl font-bold">
              Make complex political information easier to understand.
            </h2>

            <p className="mt-5 leading-8 text-slate-300">
              Political coverage is often fragmented across outlets,
              opinion programs, social media, and breaking updates.
              PoliticalPulse brings that information into one structured
              intelligence experience so readers can see the facts,
              perspectives, evidence, and unresolved questions together.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            How it works
          </p>

          <h2 className="mt-4 text-3xl font-bold">
            From headlines to intelligence
          </h2>

          <p className="mt-5 leading-8 text-slate-300">
            PoliticalPulse uses AI and source metadata to transform
            political reporting into structured analysis. The platform
            evaluates available information, summarizes the story,
            identifies affected groups and impacts, compares political
            perspectives, highlights agreement and disagreement, and
            explains the evidence behind the report.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((capability) => (
            <div
              key={capability}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
            >
              <p className="font-semibold text-white">
                {capability}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Our principles
            </p>

            <h2 className="mt-4 text-3xl font-bold">
              Built around trust, neutrality, and transparency
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {principles.map((principle) => (
              <article
                key={principle.title}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6"
              >
                <h3 className="text-xl font-bold text-white">
                  {principle.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-300">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-2xl border border-amber-900/60 bg-amber-950/20 p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
            Important limitation
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            PoliticalPulse is a tool for understanding, not a
            replacement for original reporting.
          </h2>

          <p className="mt-4 max-w-4xl leading-7 text-slate-300">
            PoliticalPulse reports are generated with artificial
            intelligence and may contain errors or incomplete analysis.
            Readers should review original sources and use independent
            judgment, especially for legal, financial, medical, voting,
            or other high-impact decisions.
          </p>
        </div>
      </section>
    </main>
  );
}
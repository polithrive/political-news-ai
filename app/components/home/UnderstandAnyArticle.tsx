"use client";

import AnalyzeUrlForm from "./AnalyzeUrlForm";
import { ChartIcon, ClockIcon, DocumentIcon } from "./HomeIcons";

const benefits = [
  {
    title: "Get the full picture",
    body: "See what other sources are saying.",
    icon: DocumentIcon,
  },
  {
    title: "Save time",
    body: "Understand any article in seconds.",
    icon: ClockIcon,
  },
  {
    title: "Make better decisions",
    body: "See what's confirmed, disputed, and missing.",
    icon: ChartIcon,
  },
];

export default function UnderstandAnyArticle() {
  return (
    <section
      id="understand-any-article"
      className="scroll-mt-28"
    >
      <div className="rounded-2xl bg-[#04162C] px-5 py-7 sm:px-7 sm:py-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
          Understand any article
        </p>
        <h2 className="mt-2 font-serif text-3xl font-black tracking-[-0.03em] text-white sm:text-[2.1rem]">
          Paste an article. See what you&apos;re missing.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#9CB0C5]">
          We&apos;ll analyze the article alongside multiple sources so you can
          see what it says, what others add, and what remains uncertain.
        </p>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
          <AnalyzeUrlForm />

          <ul className="grid gap-5 sm:grid-cols-3">
            {benefits.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.title}>
                  <span className="text-[#55C8FF]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[13px] leading-5 text-[#9CB0C5]">
                    {item.body}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

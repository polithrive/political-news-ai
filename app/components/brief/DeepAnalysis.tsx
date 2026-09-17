"use client";

import { useState, type ReactNode } from "react";

type DeepAnalysisProps = {
  children: ReactNode;
  onOpen?: () => void;
};

export default function DeepAnalysis({
  children,
  onOpen,
}: DeepAnalysisProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="deep-analysis" className="scroll-mt-28 border-t border-[#17446D]/40 pt-6">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((current) => {
            const next = !current;

            if (next) {
              onOpen?.();
            }

            return next;
          });
        }}
        className="flex w-full items-center justify-between gap-4 rounded-xl border border-[#17446D]/60 bg-[#04162C]/80 px-4 py-3.5 text-left transition hover:border-[#38BDF8]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8] sm:px-5"
      >
        <div>
          <h2 className="font-serif text-2xl font-black tracking-[-0.03em] text-white sm:text-[1.65rem]">
            {isOpen ? "Deep analysis" : "Want the full analysis?"}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#9CB0C5]">
            {isOpen
              ? "Evidence, chronology, perspectives, and connected context for this story."
              : "Evidence, context, timeline, perspectives and more."}
          </p>
        </div>

        <span className="shrink-0 text-sm font-semibold text-[#55C8FF]">
          {isOpen ? "Hide" : "Go deeper →"}
        </span>
      </button>

      {isOpen ? <div className="mt-10 space-y-8">{children}</div> : null}
    </section>
  );
}

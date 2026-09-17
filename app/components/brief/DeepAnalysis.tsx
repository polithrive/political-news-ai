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
    <section id="deep-analysis" className="scroll-mt-28 border-t border-[#17446D]/40 pt-12">
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
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
            Optional
          </p>

          <h2 className="mt-2 font-serif text-3xl font-black tracking-[-0.03em] text-white">
            {isOpen ? "Deep analysis" : "Go deeper"}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#9CB0C5]">
            {isOpen
              ? "Evidence, chronology, perspectives, and connected context for this story."
              : "Open the full evidence, timeline, perspectives, and connected context."}
          </p>
        </div>

        <span className="shrink-0 text-sm font-semibold text-[#55C8FF]">
          {isOpen ? "Hide" : "Show"}
        </span>
      </button>

      {isOpen ? <div className="mt-10 space-y-8">{children}</div> : null}
    </section>
  );
}

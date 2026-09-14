"use client";

import { useId, useState } from "react";

import type { CoverageFraming } from "@/app/lib/coverageFraming";
import { COVERAGE_METHODOLOGY_SHORT } from "@/app/lib/coverageFraming";

import ShareCoverageCard from "./ShareCoverageCard";

type CoverageMeterProps = {
  articleTitle: string;
  articlePath?: string;
  coverage: CoverageFraming | null;
  compact?: boolean;
};

export default function CoverageMeter({
  articleTitle,
  articlePath,
  coverage,
  compact = false,
}: CoverageMeterProps) {
  const labelId = useId();
  const [isShareOpen, setIsShareOpen] = useState(false);

  if (!coverage) {
    return (
      <div className={compact ? "mt-3" : "mt-4"}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7890AC]">
          Coverage framing
        </p>
        <div className="mt-1.5 h-1.5 rounded-full bg-[#020D21]" />
        <p className="mt-1.5 text-[11px] text-[#7890AC]">
          Pending analysis
        </p>
      </div>
    );
  }

  return (
    <div className={compact ? "mt-3" : "mt-4"}>
      <div className="flex items-center justify-between gap-2">
        <p
          id={labelId}
          className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#55C8FF]"
        >
          Coverage framing
        </p>
        <button
          type="button"
          onClick={() => setIsShareOpen(true)}
          className="text-[11px] font-semibold text-[#9CB0C5] hover:text-white"
        >
          Share
        </button>
      </div>

      <div
        className="relative mt-2 h-1.5 rounded-full bg-gradient-to-r from-[#3B82F6] via-[#94A3B8] to-[#FF2638]"
        role="meter"
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={coverage.score}
        aria-valuetext={`${coverage.lean}, ${coverage.score} of 100`}
      >
        <span
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#020D21] shadow"
          style={{ left: `${coverage.score}%` }}
        />
      </div>

      <div className="mt-1.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7890AC]">
        <span>Left</span>
        <span>Center</span>
        <span>Right</span>
      </div>

      <p className="mt-1 text-[11px] text-[#9CB0C5]">
        {coverage.lean} framing · {coverage.score}/100
      </p>

      {compact ? null : (
        <p className="mt-1 text-[11px] leading-4 text-[#7890AC]">
          {coverage.reasoning || COVERAGE_METHODOLOGY_SHORT}
        </p>
      )}

      {isShareOpen ? (
        <ShareCoverageCard
          articleTitle={articleTitle}
          articlePath={articlePath}
          coverage={coverage}
          onClose={() => setIsShareOpen(false)}
        />
      ) : null}
    </div>
  );
}

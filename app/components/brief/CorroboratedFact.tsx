"use client";

import { useId, useState } from "react";

import type { EvidenceBriefFact } from "@/app/types/report";

type CorroboratedFactProps = {
  fact: EvidenceBriefFact;
};

function uniquePublishers(fact: EvidenceBriefFact): string[] {
  const seen = new Set<string>();
  const names: string[] = [];

  for (const item of fact.evidence ?? []) {
    const name = item.publisher.trim();
    const key = name.toLowerCase();

    if (!name || seen.has(key)) {
      continue;
    }

    seen.add(key);
    names.push(name);
  }

  return names;
}

function shortFragment(value: string): string | null {
  const trimmed = value.replace(/\s+/g, " ").trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.length <= 140) {
    return trimmed;
  }

  return `${trimmed.slice(0, 137).trimEnd()}…`;
}

function supportFieldLabel(
  field: "title" | "description"
): string {
  return field === "title"
    ? "Headline"
    : "Description";
}

export default function CorroboratedFact({
  fact,
}: CorroboratedFactProps) {
  const [isOpen, setIsOpen] = useState(false);
  const detailsId = useId();
  const publishers = uniquePublishers(fact);
  const independentCount = Math.max(
    publishers.length,
    new Set(fact.supportedBy.filter(Boolean)).size
  );
  const details = (fact.evidence ?? [])
    .map((item) => ({
      publisher: item.publisher.trim(),
      fragment: shortFragment(item.supportText),
      field: item.supportField,
    }))
    .filter(
      (item) => item.publisher && item.fragment
    );
  const canRevealEvidence = details.length > 0;

  return (
    <article className="rounded-2xl border border-[#17446D]/70 bg-[#05182E]/90 p-5 sm:p-6">
      <p className="text-base leading-7 text-[#E6EDF4] sm:text-[1.05rem]">
        {fact.text}
      </p>

      {publishers.length > 0 ? (
        <p className="mt-4 text-sm font-medium text-[#7DD3FC]">
          {publishers.join(" · ")}
        </p>
      ) : null}

      {independentCount > 0 ? (
        <p className="mt-2 text-sm text-[#8EA3B7]">
          Supported by {independentCount} independent{" "}
          {independentCount === 1 ? "source" : "sources"}
        </p>
      ) : (
        <p className="mt-2 text-sm text-[#8EA3B7]">
          Supported across reporting
        </p>
      )}

      {canRevealEvidence ? (
        <div className="mt-4">
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={detailsId}
            onClick={() => setIsOpen((open) => !open)}
            className="text-sm font-semibold text-[#55C8FF] transition hover:text-[#8EDCFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8]"
          >
            {isOpen ? "Hide evidence" : "See evidence →"}
          </button>

          {isOpen ? (
            <ul
              id={detailsId}
              className="mt-3 space-y-3 border-t border-[#17446D]/50 pt-3"
            >
              {details.map((item, index) => (
                <li
                  key={`${item.publisher}-${index}`}
                  className="text-sm leading-6 text-[#9CB0C5]"
                >
                  <p className="font-semibold text-[#D5E0EC]">
                    {item.publisher}
                  </p>
                  <p className="mt-1">“{item.fragment}”</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#7A93AA]">
                    {supportFieldLabel(item.field)}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

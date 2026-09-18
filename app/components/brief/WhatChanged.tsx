"use client";

import { useEffect, useId, useState } from "react";

import { ANALYTICS_EVENTS } from "@/lib/analytics/taxonomy";
import { trackEvent } from "@/lib/analytics/track";
import type { EvidenceBriefFact } from "@/app/types/report";
import type { WhatChangedViewModel } from "@/lib/services/whatChangedViewModel";

import CorroboratedFact from "./CorroboratedFact";
import { formatPublisherDisplayName } from "./briefUi";

type WhatChangedProps = {
  whatChanged: WhatChangedViewModel;
  storyRef?: string;
};

function formatComparedDate(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function toBriefFact(fact: WhatChangedViewModel["facts"][number]): EvidenceBriefFact {
  return {
    text: fact.text,
    supportedBy: fact.publishers,
    evidence: fact.evidence.map((item, index) => ({
      sourceId: `W${index + 1}`,
      publisher: item.publisher,
      supportText: item.supportText,
      supportField: item.supportField,
    })),
  };
}

export default function WhatChanged({
  whatChanged,
  storyRef = "unknown",
}: WhatChangedProps) {
  const panelId = useId();
  const headingId = "what-changed-heading";
  const [isOpen, setIsOpen] = useState(whatChanged.defaultExpanded);
  const comparedDate = formatComparedDate(whatChanged.previousCapturedAt);
  const itemCount =
    whatChanged.facts.length +
    whatChanged.uncertainties.length +
    whatChanged.coverageDifferences.length +
    whatChanged.sources.length;
  const supportLine = comparedDate
    ? `Compared with the previous saved analysis · ${comparedDate}`
    : "Compared with the previous saved analysis";

  useEffect(() => {
    if (!whatChanged.defaultExpanded) {
      return;
    }

    trackEvent(
      ANALYTICS_EVENTS.whatChangedToggled,
      { surface: "brief", detail: storyRef },
      { onceKey: `what_changed:${storyRef}` }
    );
  }, [storyRef, whatChanged.defaultExpanded]);

  return (
    <section
      id="what-changed"
      aria-labelledby={headingId}
      className="scroll-mt-28"
    >
      <div className="flex items-start justify-between gap-3">
        <header className="mb-2 min-w-0">
          <h2
            id={headingId}
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]"
          >
            What changed
          </h2>
          <p className="mt-1.5 max-w-3xl text-sm leading-6 text-[#8EA3B7]">
            {supportLine}
          </p>
        </header>

        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label={
            isOpen
              ? `What changed, ${itemCount} new items, collapse`
              : `What changed, ${itemCount} new items`
          }
          onClick={() => {
            setIsOpen((open) => !open);
            trackEvent(ANALYTICS_EVENTS.whatChangedToggled, {
              surface: "brief",
              detail: storyRef,
            });
          }}
          className="mt-0.5 shrink-0 text-sm font-semibold text-[#55C8FF] transition hover:text-[#8EDCFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8] motion-reduce:transition-none"
        >
          {isOpen ? "Hide" : "Show"}
        </button>
      </div>

      {isOpen ? (
        <div
          id={panelId}
          className="rounded-xl border border-[#17446D]/45 bg-[#04162C]/70 px-4 py-4 sm:px-5"
        >
          {whatChanged.facts.map((item) => (
            <article key={item.text} className="border-b border-[#17446D]/40 last:border-b-0">
              <p className="pt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A93AA]">
                New since the previous analysis
              </p>
              <CorroboratedFact fact={toBriefFact(item)} />
              {item.evidence.length > 0 ? (
                <p className="pb-3 text-xs leading-5 text-[#7A93AA]">
                  Saved with the latest analysis. This is not a new server-side
                  recheck.
                </p>
              ) : null}
            </article>
          ))}

          {whatChanged.uncertainties.map((item) => (
            <article
              key={item}
              className="border-b border-[#17446D]/40 py-3 last:border-b-0"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A93AA]">
                New uncertainty in reviewed reporting
              </p>
              <p className="mt-2 text-sm leading-6 text-[#E8D7B0]">{item}</p>
            </article>
          ))}

          {whatChanged.coverageDifferences.map((item) => (
            <article
              key={item}
              className="border-b border-[#17446D]/40 py-3 last:border-b-0"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A93AA]">
                New difference in reviewed reporting
              </p>
              <p className="mt-2 text-sm leading-6 text-[#D5E0EC]">{item}</p>
            </article>
          ))}

          {whatChanged.sources.length > 0 ? (
            <div className="border-b border-[#17446D]/40 py-3 last:border-b-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A93AA]">
                Additional reporting reviewed
              </p>
              <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#D5E0EC]">
                {whatChanged.sources.map((source, index) => (
                  <span key={source.url} className="inline-flex">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[#7DD3FC] underline decoration-[#31577A] underline-offset-4 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8]"
                    >
                      {formatPublisherDisplayName(source.name, source.url)}
                    </a>
                    {index < whatChanged.sources.length - 1 ? (
                      <span className="ml-2 text-[#8EA3B7]">·</span>
                    ) : null}
                  </span>
                ))}
              </p>
            </div>
          ) : null}

          {whatChanged.limitedEvidenceNote ? (
            <p className="pt-3 text-sm leading-6 text-[#D5E0EC]">
              {whatChanged.limitedEvidenceNote}
            </p>
          ) : null}

          <p className="mt-3 text-xs leading-5 text-[#7A93AA]">
            This compares saved analyses of this article URL. It is not a live
            news alert.
          </p>
        </div>
      ) : null}
    </section>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import ShareBriefButton from "./ShareBriefButton";

import type { Article } from "@/app/types/article";

import { ANALYTICS_EVENTS } from "@/lib/analytics/taxonomy";
import { storyRefFromUrl } from "@/lib/analytics/storyRef";
import { trackEvent, trackReadOriginal } from "@/lib/analytics/track";
import { createIntelligenceHref } from "@/lib/services/intelligenceIdentity";

type StoryBriefHeaderProps = {
  article: Article;
  isUrlArticle?: boolean;
  isLoading?: boolean;
  showReportingUpdated?: boolean;
};

function formatPublishedDate(publishedAt: string) {
  const publishedDate = new Date(publishedAt);

  if (Number.isNaN(publishedDate.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(publishedDate);
}

const actionClassName =
  "inline-flex items-center rounded-lg border border-[#214B70] px-3.5 py-2 text-sm font-semibold text-[#55C8FF] transition hover:border-[#38BDF8] hover:text-[#7DD3FC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8]";

export default function StoryBriefHeader({
  article,
  isUrlArticle = false,
  isLoading = false,
  showReportingUpdated = false,
}: StoryBriefHeaderProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const publishedDate = formatPublishedDate(article.publishedAt);
  const hasUsableImage = Boolean(article.urlToImage) && !imageFailed;
  const sourceName =
    article.source?.name &&
    article.source.name !== "Submitted article"
      ? article.source.name
      : null;
  const dek = article.description?.trim() || null;

  return (
    <header className="border-b border-[#17446D]/40 pb-6 lg:pb-7">
      <div
        className={
          hasUsableImage
            ? "grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,42%)] lg:items-start lg:gap-10"
            : "grid gap-6"
        }
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
            {isUrlArticle ? "Understand any article" : "60-second brief"}
          </p>

          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-black leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl">
            {article.title}
          </h1>

          {dek ? (
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#9CB0C5]">
              {dek}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#8EA3B7]">
            {sourceName ? (
              <span className="font-medium text-[#D5E0EC]">{sourceName}</span>
            ) : null}
            {sourceName && publishedDate ? (
              <span aria-hidden="true">·</span>
            ) : null}
            {publishedDate ? <time dateTime={article.publishedAt}>{publishedDate}</time> : null}
            {showReportingUpdated ? (
              <>
                {(sourceName || publishedDate) ? (
                  <span aria-hidden="true">·</span>
                ) : null}
                <a
                  href="#what-changed"
                  onClick={() => {
                    trackEvent(ANALYTICS_EVENTS.whatChangedToggled, {
                      surface: "brief",
                      detail: storyRefFromUrl(article.url),
                    });
                  }}
                  className="font-medium text-[#55C8FF] transition hover:text-[#8EDCFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8]"
                >
                  Reporting updated
                </a>
              </>
            ) : null}
            {isLoading ? (
              <span className="text-[#7A93AA]">Preparing this brief…</span>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {article.url ? (
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackReadOriginal(article.url, "brief")}
                className={actionClassName}
              >
                Read original
                <span aria-hidden="true" className="ml-1">
                  →
                </span>
              </a>
            ) : null}

            <ShareBriefButton
              title={article.title}
              sharePath={createIntelligenceHref(article)}
              storyRef={storyRefFromUrl(article.url)}
              className={actionClassName}
            />

            {isUrlArticle ? (
              <Link
                href="/#understand-any-article"
                className="inline-flex items-center px-2 py-2 text-sm font-semibold text-[#8EA3B7] transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8]"
              >
                Paste another article
              </Link>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center px-2 py-2 text-sm font-semibold text-[#8EA3B7] transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8]"
              >
                Back to Today
              </Link>
            )}
          </div>
        </div>

        {hasUsableImage ? (
          <div className="relative h-56 overflow-hidden rounded-2xl bg-[#06172D] sm:h-72 lg:h-full lg:min-h-[18rem]">
            <Image
              src={article.urlToImage as string}
              alt=""
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 420px"
              className="object-cover"
              onError={() => setImageFailed(true)}
            />
          </div>
        ) : null}
      </div>
    </header>
  );
}

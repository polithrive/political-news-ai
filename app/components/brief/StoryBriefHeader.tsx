"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import ShareBriefButton from "./ShareBriefButton";
import EvidenceLine from "./EvidenceLine";
import CoverageMeter from "@/app/components/coverage/CoverageMeter";
import { coverageFromPreview } from "@/app/lib/coverageFraming";
import { createSlug } from "@/lib/createSlug";

import type { Article } from "@/app/types/article";
import type { EvidenceStrength } from "@/app/types/trust";

type StoryBriefHeaderProps = {
  article: Article;
  sourceCount?: number | null;
  ratedSourceCount?: number | null;
  evidenceStrength?: EvidenceStrength | null;
  isUrlArticle?: boolean;
  otherSourceCount?: number | null;
  showDescription?: boolean;
  biasScore?: number | null;
  lean?: string | null;
  biasReasoning?: string | null;
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
  }).format(publishedDate);
}

function coverageLine(sourceCount?: number | null) {
  if (
    typeof sourceCount !== "number" ||
    !Number.isFinite(sourceCount) ||
    sourceCount <= 0
  ) {
    return null;
  }

  if (sourceCount === 1) {
    return "Analyzed from 1 source";
  }

  return `Analyzed across ${sourceCount} sources`;
}

function otherCoverageLine(otherSourceCount?: number | null) {
  if (
    typeof otherSourceCount !== "number" ||
    !Number.isFinite(otherSourceCount) ||
    otherSourceCount <= 0
  ) {
    return null;
  }

  if (otherSourceCount === 1) {
    return "Compared with 1 other source";
  }

  return `Compared with ${otherSourceCount} other sources`;
}

export default function StoryBriefHeader({
  article,
  sourceCount,
  ratedSourceCount,
  evidenceStrength,
  isUrlArticle = false,
  otherSourceCount,
  showDescription = true,
  biasScore,
  lean,
  biasReasoning,
}: StoryBriefHeaderProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const publishedDate = formatPublishedDate(article.publishedAt);
  const coverage = isUrlArticle
    ? otherCoverageLine(otherSourceCount) || coverageLine(sourceCount)
    : coverageLine(sourceCount);
  const hasUsableImage = Boolean(article.urlToImage) && !imageFailed;
  const sourceName =
    article.source?.name &&
    article.source.name !== "Submitted article"
      ? article.source.name
      : null;

  return (
    <header className="border-b border-[#17446D]/40 pb-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
        {isUrlArticle ? "Understand any article" : "60-second brief"}
      </p>

      <h1 className="mt-4 max-w-4xl font-serif text-4xl font-black leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl">
        {article.title}
      </h1>

      {showDescription && article.description?.trim() ? (
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#9CB0C5]">
          {article.description.trim()}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-[#7A93AA]">
        <EvidenceLine
          evidenceStrength={evidenceStrength}
          sourceCount={sourceCount}
          ratedSourceCount={ratedSourceCount}
        />

        {coverage && !evidenceStrength ? (
          <span>{coverage}</span>
        ) : null}

        {sourceName ? <span>{sourceName}</span> : null}

        {publishedDate ? <span>{publishedDate}</span> : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {article.url ? (
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-[#55C8FF] transition hover:text-[#8EDCFF]"
          >
            {isUrlArticle
              ? "The article you submitted"
              : "Original article"}
            <span aria-hidden="true"> →</span>
          </a>
        ) : null}

        {isUrlArticle ? (
          <Link
            href="/#understand-any-article"
            className="text-sm font-semibold text-[#7A93AA] transition hover:text-white"
          >
            Paste another article
          </Link>
        ) : (
          <Link
            href="/"
            className="text-sm font-semibold text-[#7A93AA] transition hover:text-white"
          >
            Back to Today
          </Link>
        )}

        <ShareBriefButton title={article.title} />
      </div>

      <CoverageMeter
        articleTitle={article.title}
        articlePath={`/intelligence/${createSlug(article.title)}`}
        coverage={coverageFromPreview({
          biasScore: biasScore ?? undefined,
          lean: lean ?? undefined,
          biasReasoning: biasReasoning ?? undefined,
        })}
      />

      {hasUsableImage ? (
        <div className="relative mt-8 h-56 overflow-hidden rounded-2xl bg-[#06172D] sm:h-72">
          <Image
            src={article.urlToImage as string}
            alt=""
            fill
            priority
            unoptimized
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        </div>
      ) : null}
    </header>
  );
}

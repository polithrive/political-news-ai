"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import type { Article } from "../../types/article";

type ReportHeaderProps = {
  article: Article;
};

function formatPublishedDate(
  publishedAt: string
) {
  const publishedDate =
    new Date(publishedAt);

  if (
    Number.isNaN(
      publishedDate.getTime()
    )
  ) {
    return "Publication date unavailable";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(publishedDate);
}

export default function ReportHeader({
  article,
}: ReportHeaderProps) {
  const [imageFailed, setImageFailed] =
    useState(false);

  const publishedDate =
    formatPublishedDate(
      article.publishedAt
    );

  const hasUsableImage =
    Boolean(article.urlToImage) &&
    !imageFailed;

  return (
    <header className="overflow-hidden rounded-[28px] border border-[#17446D]/70 bg-[#04162C]/95 shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
      <div className="flex flex-col gap-5 border-b border-[#17446D]/65 px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            aria-label="Return to The Angle Report homepage"
            className="group flex shrink-0 items-center gap-3"
          >
            <div className="font-serif text-[22px] font-black leading-[0.82] tracking-[-0.05em] text-white">
              <span className="block text-[15px] text-[#38BDF8]">
                the
              </span>

              <span className="block">
                angle
              </span>

              <span className="block">
                report
                <span className="text-[#FF2638]">.</span>
              </span>
            </div>
          </Link>

          <div className="hidden h-11 w-px bg-[#17446D]/70 sm:block" />

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#55C8FF]">
              The Angle Report
            </p>

            <p className="mt-1 text-lg font-extrabold tracking-tight text-white">
              Intelligence Report
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#8EA3B7]">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#38BDF8]/20 bg-[#38BDF8]/10 px-3 py-1.5 text-[#7DD3FC]">
            <span className="h-2 w-2 rounded-full bg-[#38BDF8] shadow-[0_0_10px_rgba(56,189,248,0.65)]" />
            AI Intelligence
          </span>

          <span>
            {article.source.name}
          </span>

          <span className="hidden text-[#31577A] sm:inline">
            •
          </span>

          <span>
            {publishedDate}
          </span>
        </div>
      </div>

      <div className="grid gap-7 px-6 py-7 md:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#17446D]/75 bg-[#061A31] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#8FB4D3]">
              Evidence
            </span>

            <span className="rounded-full border border-[#17446D]/75 bg-[#061A31] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#8FB4D3]">
              Context
            </span>

            <span className="rounded-full border border-[#17446D]/75 bg-[#061A31] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#8FB4D3]">
              Perspectives
            </span>
          </div>

          <h1 className="max-w-5xl text-3xl font-extrabold leading-[1.08] tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          {article.description ? (
            <p className="mt-5 max-w-4xl text-base leading-7 text-[#B5C3D2] md:text-lg">
              {article.description}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#executive-intelligence"
              className="inline-flex items-center justify-center rounded-xl bg-[#FF2638] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(255,38,56,0.18)] transition hover:bg-[#FF4656]"
            >
              Start with the briefing
            </a>

            <a
              href={article.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-[#214B70] bg-[#061A31] px-5 py-3 text-sm font-bold text-[#D7E2EC] transition hover:border-[#38BDF8]/45 hover:bg-[#08203A]"
            >
              View original source
            </a>
          </div>
        </div>

        <div className="relative h-44 overflow-hidden rounded-2xl border border-[#17446D]/70 bg-[#061A31] sm:h-52 lg:h-52">
          {hasUsableImage ? (
            <>
              <Image
                src={article.urlToImage}
                alt=""
                fill
                className="object-cover"
                sizes="320px"
                unoptimized
                priority
                onError={() =>
                  setImageFailed(true)
                }
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#020D21]/70 via-transparent to-transparent" />

              <div className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-[#020D21]/75 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#D7E2EC] backdrop-blur-sm">
                Source: {article.source.name}
              </div>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0B2541] via-[#04162C] to-[#020D21]">
              <div className="text-center">
                <div className="mx-auto font-serif text-[31px] font-black leading-[0.82] tracking-[-0.05em] text-white">
                  <span className="block text-[20px] text-[#38BDF8]">
                    the
                  </span>

                  <span className="block">
                    angle
                  </span>

                  <span className="block">
                    report
                    <span className="text-[#FF2638]">.</span>
                  </span>
                </div>

                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.24em] text-[#55C8FF]">
                  Ideas from every side.
                </p>

                <p className="mt-2 text-xs text-[#6F879F]">
                  Intelligence Report
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
import Image from "next/image";
import Link from "next/link";

import { colors } from "@/lib/design/theme";

import type { Article } from "../../types/article";

type ReportHeaderProps = {
  article: Article;
};

function formatPublishedDate(publishedAt: string) {
  const publishedDate = new Date(publishedAt);

  if (Number.isNaN(publishedDate.getTime())) {
    return "Publication date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(publishedDate);
}

function formatGeneratedDate() {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

export default function ReportHeader({
  article,
}: ReportHeaderProps) {
  const publishedDate = formatPublishedDate(
    article.publishedAt
  );

  const generatedDate = formatGeneratedDate();

  return (
    <header
      className="overflow-hidden rounded-3xl border shadow-[0_24px_70px_rgba(15,23,42,0.18)]"
      style={{
        backgroundColor: colors.background.surface,
        borderColor: colors.border.default,
      }}
    >
      <div
        className="border-b px-6 py-5 md:px-10"
        style={{
          backgroundColor: colors.brand.navy,
          borderColor: colors.brand.navySoft,
        }}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              aria-label="Return to PoliticalPulse homepage"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg font-bold text-white transition hover:bg-white/10"
            >
              P
            </Link>

            <div>
              <p
                className="text-xs font-bold uppercase tracking-[0.22em]"
                style={{
                  color: colors.brand.primary,
                }}
              >
                PoliticalPulse
              </p>

              <p
                className="mt-1 text-xl font-semibold tracking-tight md:text-2xl"
                style={{
                  color: colors.text.inverse,
                }}
              >
                Intelligence Report
              </p>
            </div>
          </div>

          <div
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"
            style={{
              color: "#CBD5DF",
            }}
          >
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              AI analysis complete
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-slate-500 sm:block" />

            <span>Generated {generatedDate}</span>

            <span className="hidden h-1 w-1 rounded-full bg-slate-500 sm:block" />

            <span>Approximately 5 minutes</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 md:px-10 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: colors.brand.primarySoft,
                  color: colors.brand.primaryHover,
                }}
              >
                {article.source.name}
              </span>

              <span
                className="text-sm"
                style={{
                  color: colors.text.muted,
                }}
              >
                Published {publishedDate}
              </span>
            </div>

            <h1
              className="mt-6 max-w-5xl text-3xl font-bold leading-[1.1] tracking-[-0.035em] sm:text-4xl lg:text-5xl"
              style={{
                color: colors.text.primary,
              }}
            >
              {article.title}
            </h1>

            {article.description ? (
              <p
                className="mt-6 max-w-4xl text-base leading-8 md:text-lg"
                style={{
                  color: colors.text.secondary,
                }}
              >
                {article.description}
              </p>
            ) : null}

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#executive-summary"
                className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Read executive summary
              </a>

              <a
                href="#trust-score"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                View Trust Score
              </a>

              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                View original source
              </a>
            </div>
          </div>

          <aside
            className="rounded-2xl border p-5"
            style={{
              borderColor: colors.border.subtle,
              backgroundColor: colors.background.muted,
            }}
          >
            <p
              className="text-xs font-bold uppercase tracking-[0.18em]"
              style={{
                color: colors.brand.primary,
              }}
            >
              Report coverage
            </p>

            <h2
              className="mt-3 text-lg font-bold"
              style={{
                color: colors.text.primary,
              }}
            >
              What this briefing examines
            </h2>

            <ul
              className="mt-4 space-y-3 text-sm leading-6"
              style={{
                color: colors.text.secondary,
              }}
            >
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                Key facts and reported claims
              </li>

              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                Political perspectives and framing
              </li>

              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                Areas of consensus and disagreement
              </li>

              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                Source evidence and broader context
              </li>
            </ul>
          </aside>
        </div>

        {article.urlToImage ? (
          <div
            className="relative mt-9 h-64 w-full overflow-hidden rounded-2xl border sm:h-80 lg:h-[420px]"
            style={{
              borderColor: colors.border.subtle,
              backgroundColor: colors.background.muted,
            }}
          >
            <Image
              src={article.urlToImage}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1200px"
              unoptimized
              priority
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-4 p-5 text-sm text-white">
              <span className="font-medium">
                Source: {article.source.name}
              </span>

              <span className="hidden text-white/80 sm:block">
                Original reporting image
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
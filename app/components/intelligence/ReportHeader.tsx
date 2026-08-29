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
  const publishedDate =
    formatPublishedDate(
      article.publishedAt
    );

  return (
    <header className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
      <div className="flex flex-col gap-5 border-b border-slate-800 px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            aria-label="Return to PoliticalPulse homepage"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-sm font-black text-white transition hover:bg-red-500"
          >
            P
          </Link>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-red-400">
              PoliticalPulse
            </p>

            <p className="mt-1 text-lg font-extrabold tracking-tight text-white">
              Intelligence Report
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-400">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            AI analysis
          </span>

          <span>
            {article.source.name}
          </span>

          <span className="hidden text-slate-600 sm:inline">
            •
          </span>

          <span>
            {publishedDate}
          </span>
        </div>
      </div>

      <div className="grid gap-6 px-6 py-7 md:px-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center">
        <div className="min-w-0">
          <h1 className="max-w-5xl text-3xl font-extrabold leading-[1.08] tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          {article.description ? (
            <p className="mt-5 max-w-4xl text-base leading-7 text-slate-300 md:text-lg">
              {article.description}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#executive-intelligence"
              className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500"
            >
              Start with the briefing
            </a>

            <a
              href={article.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
            >
              View original source
            </a>
          </div>
        </div>

        {article.urlToImage ? (
          <div className="relative h-44 overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 sm:h-52 lg:h-48">
            <Image
              src={article.urlToImage}
              alt=""
              fill
              className="object-cover"
              sizes="300px"
              unoptimized
              priority
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
          </div>
        ) : (
          <div className="hidden h-48 rounded-2xl border border-slate-800 bg-gradient-to-br from-red-500/10 to-slate-900 lg:block" />
        )}
      </div>
    </header>
  );
}

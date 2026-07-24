import Image from "next/image";

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

export default function ReportHeader({
  article,
}: ReportHeaderProps) {
  const publishedDate = formatPublishedDate(
    article.publishedAt
  );

  return (
    <header
      className="overflow-hidden rounded-3xl border shadow-[0_24px_70px_rgba(37,54,74,0.12)]"
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
          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.2em]"
              style={{
                color: colors.brand.primary,
              }}
            >
              PoliticalPulse
            </p>

            <p
              className="mt-2 text-xl font-semibold tracking-tight md:text-2xl"
              style={{
                color: colors.text.inverse,
              }}
            >
              Intelligence Report
            </p>
          </div>

          <div
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
            style={{
              color: "#CBD5DF",
            }}
          >
            <span>AI-analyzed briefing</span>

            <span className="hidden h-1 w-1 rounded-full bg-slate-500 sm:block" />

            <span>Generated today</span>

            <span className="hidden h-1 w-1 rounded-full bg-slate-500 sm:block" />

            <span>Approximately 5 minutes</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 md:px-10 md:py-10">
        <div className="max-w-5xl">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor:
                  colors.brand.primarySoft,
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
            className="mt-6 max-w-5xl text-3xl font-bold leading-[1.12] tracking-[-0.035em] sm:text-4xl lg:text-5xl"
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
        </div>

        {article.urlToImage ? (
          <div
            className="relative mt-8 h-64 w-full overflow-hidden rounded-2xl border sm:h-80 lg:h-[420px]"
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

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
          </div>
        ) : null}
      </div>
    </header>
  );
}
"use client";

import Link from "next/link";

import type { Article } from "@/app/types/article";

import { trackBriefSelected } from "@/lib/analytics/track";
import { createIntelligenceHref } from "@/lib/services/intelligenceIdentity";
import { saveSelectedArticle } from "@/lib/selectedArticle";

type StoryBriefLinkProps = {
  article: Article;
  label?: string;
  className?: string;
  surface?: "home" | "search";
};

export default function StoryBriefLink({
  article,
  label = "60-second brief",
  className,
  surface = "home",
}: StoryBriefLinkProps) {
  const href = createIntelligenceHref(article);

  if (!href) {
    return null;
  }

  return (
    <Link
      href={href}
      prefetch={false}
      onClick={() => {
        saveSelectedArticle(article);
        trackBriefSelected(article.url, surface);
      }}
        className={
        className ??
        "inline-flex scroll-mt-28 items-center gap-2 text-sm font-semibold text-[#55C8FF] transition hover:text-[#8EDCFF]"
      }
    >
      {label}
      <span aria-hidden="true">→</span>
    </Link>
  );
}

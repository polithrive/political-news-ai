"use client";

import { type ReactNode } from "react";

import type { Article } from "@/app/types/article";

import PublicationNav from "./PublicationNav";
import TrendingTopicsBanner from "./TrendingTopicsBanner";

type SiteShellProps = {
  children: ReactNode;
  searchTerm?: string;
  onSearchTermChange?: (value: string) => void;
  trendingArticles?: Article[];
};

export default function SiteShell({
  children,
  searchTerm,
  onSearchTermChange,
  trendingArticles,
}: SiteShellProps) {
  return (
    <div className="relative min-h-screen bg-[#020D21] text-white">
      <div className="sticky top-0 z-50">
        <PublicationNav
          searchTerm={searchTerm}
          onSearchTermChange={onSearchTermChange}
        />
        <TrendingTopicsBanner articles={trendingArticles} />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

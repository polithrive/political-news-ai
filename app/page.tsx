"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Footer from "./components/Footer";
import HomePublication from "./components/home/HomePublication";
import SearchResults from "./components/SearchResults";
import SiteShell from "./components/shell/SiteShell";
import { useHomepageIntelligence } from "./hooks/useHomepageIntelligence";

function HomePage() {
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q") ?? "";
  const [searchTerm, setSearchTerm] = useState(queryFromUrl);

  const {
    articles,
    analysisResults,
    featuredArticle,
    featuredAnalysis,
    bigStories,
    trendingArticles,
    moreStories,
    isNewsLoading,
    isFeaturedAnalysisLoading,
    errorMessage,
  } = useHomepageIntelligence();

  useEffect(() => {
    setSearchTerm(queryFromUrl);
  }, [queryFromUrl]);

  return (
    <SiteShell
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
    >
      {searchTerm.trim() ? (
        <SearchResults searchTerm={searchTerm} articles={articles} />
      ) : (
        <HomePublication
          articles={articles}
          bigStories={bigStories}
          trendingArticles={trendingArticles}
          moreStories={moreStories}
          analysisResults={analysisResults}
          featuredArticle={featuredArticle}
          featuredAnalysis={featuredAnalysis}
          isLoading={isNewsLoading || isFeaturedAnalysisLoading}
          errorMessage={errorMessage}
        />
      )}

      <Footer />
    </SiteShell>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <SiteShell>
          <div className="min-h-[50vh] bg-[#020D21]" />
        </SiteShell>
      }
    >
      <HomePage />
    </Suspense>
  );
}

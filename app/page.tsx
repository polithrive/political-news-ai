"use client";

import { useState } from "react";
import BreakingNews from "./components/BreakingNews";
import Footer from "./components/Footer";
import HomeDashboard from "./components/home/HomeDashboard";
import Navbar from "./components/Navbar";
import SearchResults from "./components/SearchResults";
import { useHomepageIntelligence } from "./hooks/useHomepageIntelligence";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    articles,
    analysisResults,
    featuredArticle,
    featuredAnalysis,
    isNewsLoading,
    isFeaturedAnalysisLoading,
    errorMessage,
  } = useHomepageIntelligence();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <BreakingNews />
      {searchTerm.trim() ? <SearchResults searchTerm={searchTerm} /> : null}
      <HomeDashboard
        articles={articles}
        analysisResults={analysisResults}
        featuredArticle={featuredArticle}
        featuredAnalysis={featuredAnalysis}
        isLoading={isNewsLoading || isFeaturedAnalysisLoading}
        errorMessage={errorMessage}
      />
      <Footer />
    </main>
  );
}

"use client";

import { useState } from "react";

import BreakingNews from "./components/BreakingNews";
import Footer from "./components/Footer";
import IntelligenceStory from "./components/home/IntelligenceStory";
import HeroSection from "./components/home/HeroSection";
import LiveNews from "./components/LiveNews";
import Navbar from "./components/Navbar";
import PerspectiveComparison from "./components/PerspectiveComparison";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";

import { useHomepageIntelligence } from "./hooks/useHomepageIntelligence";

export default function Home() {
  const [searchTerm, setSearchTerm] =
    useState("");

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
      <Navbar />

      <BreakingNews />

      <HeroSection
        featuredArticle={featuredArticle}
        featuredAnalysis={featuredAnalysis}
        isLoading={
          isNewsLoading ||
          isFeaturedAnalysisLoading
        }
      />

      <IntelligenceStory />

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <SearchResults
        searchTerm={searchTerm}
      />

      <PerspectiveComparison />

      <LiveNews
        articles={articles}
        analysisResults={analysisResults}
        featuredAnalysis={featuredAnalysis}
        errorMessage={errorMessage}
        isLoading={isNewsLoading}
      />

      <Footer />
    </main>
  );
}
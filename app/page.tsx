"use client";
import { useState } from "react";
import Navbar from "./components/Navbar";
import BreakingNews from "./components/BreakingNews";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import FeaturedStory from "./components/FeaturedStory";
import TrendingStories from "./components/TrendingStories";
import AIFeatures from "./components/AIFeatures";
import PerspectiveComparison from "./components/PerspectiveComparison";
import LatestNews from "./components/LatestNews";
import LiveNews from "./components/LiveNews";
import Footer from "./components/Footer";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <BreakingNews />
      <Hero />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <SearchResults searchTerm={searchTerm} />
      <FeaturedStory />
      <TrendingStories />
      <AIFeatures />
      <PerspectiveComparison />
      <LatestNews />
      <LiveNews />
      <Footer />
    </main>
  );
}
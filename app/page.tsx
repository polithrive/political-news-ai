"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import BreakingNews from "./components/BreakingNews";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import PerspectiveComparison from "./components/PerspectiveComparison";
import LiveNews from "./components/LiveNews";
import Footer from "./components/Footer";
import HeroSection from "./components/home/HeroSection";
import IntelligenceStory from "./components/home/IntelligenceStory";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <BreakingNews />
      <HeroSection />
      <IntelligenceStory />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <SearchResults searchTerm={searchTerm} />
      <PerspectiveComparison />
      <LiveNews />
      <Footer />
    </main>
  );
}
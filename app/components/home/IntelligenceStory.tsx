"use client";

import { useEffect, useState } from "react";
import AIAnalysisCard from "../AIAnalysisCard";
import { getLatestNews } from "../../../lib/news";
import { analyzeArticle } from "../../lib/analysis";
import type { Article } from "../../../types/article";
import type { AnalysisResult } from "../../../types/analysis";

export default function IntelligenceStory() {
  const [story, setStory] = useState<Article | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    async function loadStory() {
      const articles = await getLatestNews();
      const topStory = articles[0] || null;

      setStory(topStory);

      if (!topStory) return;

      const analysisData = await analyzeArticle(topStory);
      setAnalysis(analysisData);
    }

    loadStory();
  }, []);

  if (!story) {
    return (
      <section className="max-w-7xl mx-auto px-8 py-12">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <p className="text-gray-400">
            Loading today&apos;s intelligence brief...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-8 py-12">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
          Today&apos;s Intelligence Brief
        </p>

        <h2 className="mt-3 text-4xl font-bold">{story.title}</h2>

        <p className="mt-4 max-w-3xl text-gray-300 leading-7">
          {story.description}
        </p>

        <div className="mt-6 text-sm text-gray-500">
          Source: {story.source.name}
        </div>

        {analysis ? (
          <AIAnalysisCard {...analysis} />
        ) : (
          <div className="mt-6 rounded-xl bg-slate-800 p-4">
            <p className="text-sm font-semibold text-red-500">AI ANALYSIS</p>
            <p className="mt-2 text-sm text-gray-300">
              Generating intelligence brief...
            </p>
          </div>
        )}

        <a
          href={story.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6 bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold transition"
        >
          Read Source Article →
        </a>
      </div>
    </section>
  );
}
"use client";

import { useEffect, useState } from "react";

import type { AnalysisResult } from "@/app/types/analysis";
import type { Article } from "@/app/types/article";
import type { IntelligencePreview } from "@/app/types/intelligencePreview";

import { analyzeArticle } from "@/app/lib/analysis";
import { getLatestNews } from "@/lib/news";

const MAX_HOMEPAGE_ARTICLES = 6;
const ANALYSIS_CONCURRENCY = 2;

type HomepageIntelligenceState = {
  articles: Article[];
  analysisResults: Record<number, AnalysisResult>;
  featuredArticle: Article | null;
  featuredAnalysis: IntelligencePreview | null;
  isNewsLoading: boolean;
  isFeaturedAnalysisLoading: boolean;
  errorMessage: string | null;
};

export function useHomepageIntelligence(): HomepageIntelligenceState {
  const [articles, setArticles] =
    useState<Article[]>([]);

  const [analysisResults, setAnalysisResults] =
    useState<Record<number, AnalysisResult>>({});

  const [featuredAnalysis, setFeaturedAnalysis] =
    useState<IntelligencePreview | null>(null);

  const [isNewsLoading, setIsNewsLoading] =
    useState(true);

  const [
    isFeaturedAnalysisLoading,
    setIsFeaturedAnalysisLoading,
  ] = useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function analyzeArticles(
      articlesToAnalyze: Article[]
    ) {
      let nextIndex = 0;

      async function worker() {
        while (
          nextIndex < articlesToAnalyze.length &&
          !isCancelled
        ) {
          const currentIndex = nextIndex;
          nextIndex += 1;

          const article =
            articlesToAnalyze[currentIndex];

          if (!article) {
            continue;
          }

          try {
            const analysis =
              await analyzeArticle(article);

            if (isCancelled) {
              return;
            }

            setAnalysisResults(
              (previousResults) => ({
                ...previousResults,
                [currentIndex]: analysis,
              })
            );

            if (currentIndex === 0) {
              setFeaturedAnalysis(analysis);
              setIsFeaturedAnalysisLoading(false);
            }
          } catch (error) {
            console.error(
              `Failed to analyze homepage article ${
                currentIndex + 1
              }:`,
              error
            );

            if (
              !isCancelled &&
              currentIndex === 0
            ) {
              setIsFeaturedAnalysisLoading(false);
            }
          }
        }
      }

      const workerCount = Math.min(
        ANALYSIS_CONCURRENCY,
        articlesToAnalyze.length
      );

      const workers = Array.from({
        length: workerCount,
      }).map(() => worker());

      await Promise.all(workers);
    }

    async function loadHomepageIntelligence() {
      try {
        setIsNewsLoading(true);
        setIsFeaturedAnalysisLoading(false);
        setErrorMessage(null);
        setArticles([]);
        setAnalysisResults({});
        setFeaturedAnalysis(null);

        const latestArticles =
          await getLatestNews();

        if (isCancelled) {
          return;
        }

        const homepageArticles =
          latestArticles.slice(
            0,
            MAX_HOMEPAGE_ARTICLES
          );

        if (homepageArticles.length === 0) {
          setErrorMessage(
            "PoliticalPulse did not receive any live articles."
          );

          return;
        }

        setArticles(homepageArticles);
        setIsNewsLoading(false);
        setIsFeaturedAnalysisLoading(true);

        await analyzeArticles(homepageArticles);
      } catch (error) {
        console.error(
          "Failed to load homepage intelligence:",
          error
        );

        if (!isCancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "PoliticalPulse could not load homepage intelligence."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsNewsLoading(false);
          setIsFeaturedAnalysisLoading(false);
        }
      }
    }

    void loadHomepageIntelligence();

    return () => {
      isCancelled = true;
    };
  }, []);

  return {
    articles,
    analysisResults,
    featuredArticle: articles[0] ?? null,
    featuredAnalysis,
    isNewsLoading,
    isFeaturedAnalysisLoading,
    errorMessage,
  };
}
"use client";

import { useEffect, useState } from "react";

import type { AnalysisResult } from "@/app/types/analysis";
import type { Article } from "@/app/types/article";
import type { IntelligencePreview } from "@/app/types/intelligencePreview";

import { analyzeArticle } from "@/app/lib/analysis";
import { splitHomepageSections } from "@/lib/services/homepageSections";
import { getLatestNews } from "@/lib/news";

const PREVIEW_ARTICLE_COUNT = 3;

type HomepageIntelligenceState = {
  articles: Article[];
  analysisResults: Record<number, AnalysisResult>;
  featuredArticle: Article | null;
  featuredAnalysis: IntelligencePreview | null;
  bigStories: Article[];
  trendingArticles: Article[];
  moreStories: Article[];
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

    async function analyzeHomepagePreviews(
      homepageArticles: Article[]
    ) {
      const previewArticles = homepageArticles.slice(
        0,
        PREVIEW_ARTICLE_COUNT
      );

      if (previewArticles.length === 0) {
        return;
      }

      setIsFeaturedAnalysisLoading(true);

      await Promise.all(
        previewArticles.map(async (article, articleIndex) => {
          try {
            const analysis = await analyzeArticle(
              article
            );

            if (isCancelled) {
              return;
            }

            if (articleIndex === 0) {
              setFeaturedAnalysis(analysis);
              setIsFeaturedAnalysisLoading(false);
            }

            setAnalysisResults((previousResults) => ({
              ...previousResults,
              [articleIndex]: analysis,
            }));
          } catch (error) {
            console.error(
              `Failed to analyze homepage article ${
                articleIndex + 1
              }:`,
              error
            );

            if (
              articleIndex === 0 &&
              !isCancelled
            ) {
              setIsFeaturedAnalysisLoading(false);
            }
          }
        })
      );
    }

    async function loadHomepageIntelligence() {
      try {
        setIsNewsLoading(true);
        setErrorMessage(null);

        const latestArticles = await getLatestNews();

        if (isCancelled) {
          return;
        }

        if (latestArticles.length === 0) {
          setErrorMessage(
            "The Angle Report did not receive any live articles."
          );

          return;
        }

        setArticles(latestArticles);
        setAnalysisResults({});
        setFeaturedAnalysis(null);
        setIsNewsLoading(false);

        await analyzeHomepagePreviews(
          latestArticles
        );
      } catch (error) {
        console.error(
          "Failed to load homepage intelligence:",
          error
        );

        if (!isCancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "The Angle Report could not load homepage intelligence."
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

  const sections = splitHomepageSections(articles);

  return {
    articles,
    analysisResults,
    featuredArticle: sections.lead,
    featuredAnalysis,
    bigStories: sections.bigStories,
    trendingArticles: sections.trending,
    moreStories: sections.moreStories,
    isNewsLoading,
    isFeaturedAnalysisLoading,
    errorMessage,
  };
}

"use client";

import { useEffect, useState } from "react";

import type { AnalysisResult } from "@/app/types/analysis";
import type { Article } from "@/app/types/article";
import type { IntelligencePreview } from "@/app/types/intelligencePreview";

import { analyzeArticle } from "@/app/lib/analysis";
import { getLatestNews } from "@/lib/news";

const PREVIEW_ARTICLE_COUNT = 3;
const DIVERSITY_WINDOW = 12;
const MAX_PER_PUBLISHER_IN_WINDOW = 2;

type HomepageIntelligenceState = {
  articles: Article[];
  analysisResults: Record<number, AnalysisResult>;
  featuredArticle: Article | null;
  featuredAnalysis: IntelligencePreview | null;
  isNewsLoading: boolean;
  isFeaturedAnalysisLoading: boolean;
  errorMessage: string | null;
};

function normalizePublisherName(
  value: string | undefined
): string {
  return (value ?? "unknown")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/*
 * Reorders the fetched homepage pool so a single
 * publisher does not dominate the first visible
 * stories. Deferred articles remain in the array
 * for Load More, search, and Intelligence Report
 * selection.
 */
function applyPublisherDiversity(
  articles: Article[]
): Article[] {
  const windowArticles: Article[] = [];
  const deferredArticles: Article[] = [];
  const remainingArticles: Article[] = [];
  const publisherCounts = new Map<string, number>();

  for (const article of articles) {
    const publisherKey = normalizePublisherName(
      article.source?.name
    );

    if (windowArticles.length < DIVERSITY_WINDOW) {
      const currentCount =
        publisherCounts.get(publisherKey) ?? 0;

      if (currentCount >= MAX_PER_PUBLISHER_IN_WINDOW) {
        deferredArticles.push(article);
        continue;
      }

      windowArticles.push(article);
      publisherCounts.set(
        publisherKey,
        currentCount + 1
      );
      continue;
    }

    remainingArticles.push(article);
  }

  return [
    ...windowArticles,
    ...deferredArticles,
    ...remainingArticles,
  ];
}

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

        const homepageArticles =
          applyPublisherDiversity(latestArticles);

        if (homepageArticles.length === 0) {
          setErrorMessage(
            "The Angle Report did not receive any live articles."
          );

          return;
        }

        setArticles(homepageArticles);
        setAnalysisResults({});
        setFeaturedAnalysis(null);
        setIsNewsLoading(false);

        await analyzeHomepagePreviews(
          homepageArticles
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

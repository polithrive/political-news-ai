import type { AnalysisResult } from "@/app/types/analysis";

export type ArticleAnalysisOrigin = "url";

export type StoryGeography = "US" | "WORLD" | "UNKNOWN";

export type StoryTopic =
  | "POLITICS"
  | "ECONOMY"
  | "TECHNOLOGY"
  | "HEALTH"
  | "BUSINESS"
  | "WORLD"
  | "CULTURE"
  | "OTHER";

export type HomepageCuration = {
  category: string;
  geography: StoryGeography;
  topic: StoryTopic;
  clusterSize: number;
  relatedSources: string[];
  score: number;
  selectionReason: string;
  acquisitionPools?: string[];
};

export type Article = {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;

  source: {
    name: string;
  };

  curation?: HomepageCuration;

  preview?: AnalysisResult;

  /*
   * Marks articles that entered the Intelligence
   * Report through the user-submitted URL pipeline.
   * Homepage stories omit this field.
   */
  analysisOrigin?: ArticleAnalysisOrigin;
};
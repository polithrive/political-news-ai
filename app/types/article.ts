import type { AnalysisResult } from "@/app/types/analysis";

export type ArticleAnalysisOrigin = "url";

export type Article = {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;

  source: {
    name: string;
  };

  preview?: AnalysisResult;

  /*
   * Marks articles that entered the Intelligence
   * Report through the user-submitted URL pipeline.
   * Homepage stories omit this field.
   */
  analysisOrigin?: ArticleAnalysisOrigin;
};
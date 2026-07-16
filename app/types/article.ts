import type { AnalysisResult } from "@/app/types/analysis";

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
};
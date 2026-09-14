import type { AnalysisResult } from "@/app/types/analysis";
import type { Article } from "@/app/types/article";
import type { IntelligencePreview } from "@/app/types/intelligencePreview";

export type CoverageLean = "Left" | "Center" | "Right";

export type LeaningStory = {
  lean: CoverageLean;
  article: Article;
  summary: string;
  sourceName: string;
};

function asLean(value: string | undefined): CoverageLean {
  if (value === "Left" || value === "Right") {
    return value;
  }

  return "Center";
}

export function collectLeaningStories(
  articles: Article[],
  analysisResults: Record<number, AnalysisResult>,
  featuredArticle: Article | null,
  featuredAnalysis: IntelligencePreview | null
): LeaningStory[] {
  const stories: LeaningStory[] = [];
  const seen = new Set<string>();

  function add(
    article: Article | null,
    lean: string | undefined,
    summary: string | undefined
  ) {
    if (!article) {
      return;
    }

    const key = article.url || article.title;

    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    stories.push({
      lean: asLean(lean),
      article,
      summary:
        summary?.trim() ||
        article.description?.trim() ||
        "",
      sourceName: article.source?.name || "Source",
    });
  }

  add(
    featuredArticle,
    featuredAnalysis?.lean,
    featuredAnalysis?.summary
  );

  articles.forEach((article, index) => {
    const analysis = analysisResults[index];

    if (!analysis) {
      return;
    }

    add(article, analysis.lean, analysis.summary);
  });

  return stories;
}

export function storyForLean(
  stories: LeaningStory[],
  lean: CoverageLean
): LeaningStory | undefined {
  return stories.find((story) => story.lean === lean);
}

export function leanCounts(stories: LeaningStory[]) {
  const counts = {
    Left: 0,
    Center: 0,
    Right: 0,
  };

  for (const story of stories) {
    counts[story.lean] += 1;
  }

  return counts;
}

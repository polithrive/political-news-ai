import { attachHttpStatus } from "@/lib/analytics/httpStatus";
import type { Article } from "@/app/types/article";
import type {
  IntelligenceReport,
  PoliticalPerspectiveAnalysis,
  ReportRelatedSource,
} from "@/app/types/report";
import type { TrustScore } from "@/app/types/trust";

import type { MergedAnalysis } from "@/lib/ai/mergeAnalysis";
import type { EvidenceSource } from "@/lib/services/evidenceContext";
import { normalizeEvidenceBrief } from "@/lib/services/evidenceBrief";
import { createStorySnapshotInput } from "@/lib/services/buildEvidenceSnapshot";
import type { StorySnapshotInput } from "@/lib/services/storySnapshotInput";

type AnalyzeUrlArticle = {
  title: string;
  description: string;
  url: string;
  image: string | null;
  author: string | null;
  published: string;
  source: string;
};

type AnalyzeUrlEvidence = {
  sourceCount: number;
  independentSourceCount: number;
  ratedSourceCount: number;
  sources: EvidenceSource[];
};

type AnalyzeUrlSuccessResponse = {
  article: AnalyzeUrlArticle;
  evidence: AnalyzeUrlEvidence;
  trustScore: TrustScore;
  analysis: MergedAnalysis;
};

type AnalyzeUrlErrorResponse = {
  error?: string;
};

export function isUrlSubmittedArticle(
  article: Article | null
): article is Article {
  return article?.analysisOrigin === "url";
}

export function createUrlSubmittedArticle(
  url: string
): Article {
  return {
    title: "Analyzing submitted article...",
    description:
      "The Angle Report is reading this article and comparing it with related reporting.",
    url,
    urlToImage: "",
    publishedAt: new Date().toISOString(),
    source: {
      name: "Submitted article",
    },
    analysisOrigin: "url",
  };
}

function toStringValue(
  value: unknown,
  fallback: string
): string {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : fallback;
}

function toNumberValue(
  value: unknown,
  fallback: number
): number {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : fallback;
}

function toClampedScore(
  value: unknown,
  fallback: number
): number {
  const numericValue = toNumberValue(value, fallback);

  return Math.max(0, Math.min(100, Math.round(numericValue)));
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

function isEvidenceStrength(
  value: unknown
): value is TrustScore["evidenceStrength"] {
  return value === "Low" || value === "Medium" || value === "High";
}

function isPoliticalDiversity(
  value: unknown
): value is TrustScore["politicalDiversity"] {
  return value === "Low" || value === "Medium" || value === "High";
}

function isTrustScore(value: unknown): value is TrustScore {
  if (value === null || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<TrustScore>;

  return (
    typeof candidate.overall === "number" &&
    Number.isFinite(candidate.overall) &&
    isEvidenceStrength(candidate.evidenceStrength) &&
    (candidate.reportingAgreement === null ||
      (typeof candidate.reportingAgreement === "number" &&
        Number.isFinite(candidate.reportingAgreement))) &&
    typeof candidate.sourceCount === "number" &&
    Number.isFinite(candidate.sourceCount) &&
    typeof candidate.ratedSourceCount === "number" &&
    Number.isFinite(candidate.ratedSourceCount) &&
    isPoliticalDiversity(candidate.politicalDiversity)
  );
}

function createDebatePerspective(
  perspective: MergedAnalysis["perspectiveAnalysis"]["progressive"] | undefined,
  fallbackPosition: string
) {
  return {
    position: toStringValue(perspective?.position, fallbackPosition),
    strongestArguments: toStringArray(perspective?.strongestArguments),
    primaryConcerns: toStringArray(perspective?.primaryConcerns),
  };
}

function createPerspectiveAnalysis(
  analysis: MergedAnalysis,
  article: Article,
  commonGround: string[]
): PoliticalPerspectiveAnalysis {
  const dedicatedAnalysis = analysis.perspectiveAnalysis;

  const areasOfAgreement = toStringArray(
    dedicatedAnalysis?.areasOfAgreement
  );

  return {
    topic: toStringValue(
      dedicatedAnalysis?.topic,
      article.title || "The central political debate"
    ),

    progressive: createDebatePerspective(
      dedicatedAnalysis?.progressive,
      toStringValue(
        analysis.perspectives?.left,
        "A dedicated progressive analysis is not available."
      )
    ),

    centrist: createDebatePerspective(
      dedicatedAnalysis?.centrist,
      toStringValue(
        analysis.perspectives?.center,
        "A dedicated centrist analysis is not available."
      )
    ),

    conservative: createDebatePerspective(
      dedicatedAnalysis?.conservative,
      toStringValue(
        analysis.perspectives?.right,
        "A dedicated conservative analysis is not available."
      )
    ),

    areasOfAgreement:
      areasOfAgreement.length > 0 ? areasOfAgreement : commonGround,

    mainDisagreements: toStringArray(
      dedicatedAnalysis?.mainDisagreements
    ),

    politicalPulseAnalysis: toStringValue(
      dedicatedAnalysis?.politicalPulseAnalysis,
      "The Angle Report identified the major perspectives and areas of possible agreement, but a dedicated synthesis was not available."
    ),

    debateTemperature: toClampedScore(
      dedicatedAnalysis?.debateTemperature,
      50
    ),
  };
}

function createRelatedSources(
  sources: EvidenceSource[] | undefined
): ReportRelatedSource[] {
  if (!Array.isArray(sources)) {
    return [];
  }

  return sources
    .map((source) => ({
      title: toStringValue(source.title, ""),
      url: toStringValue(source.url, ""),
      sourceName: toStringValue(source.sourceName, ""),
      isPrimary: Boolean(source.isPrimary),
    }))
    .filter(
      (source) => source.sourceName || source.title || source.url
    );
}

function createArticleFromUrlAnalysis(
  article: AnalyzeUrlArticle
): Article {
  return {
    title: toStringValue(article.title, "Untitled article"),
    description: toStringValue(article.description, ""),
    url: toStringValue(article.url, ""),
    urlToImage: toStringValue(article.image, ""),
    publishedAt: toStringValue(
      article.published,
      new Date().toISOString()
    ),
    source: {
      name: toStringValue(article.source, "Unknown source"),
    },
    analysisOrigin: "url",
  };
}

export function mapAnalyzeUrlToIntelligenceReport(
  payload: AnalyzeUrlSuccessResponse
): {
  article: Article;
  report: IntelligenceReport;
  snapshotInput: StorySnapshotInput;
} {
  if (!isTrustScore(payload.trustScore)) {
    throw new Error(
      "The Angle Report received an invalid Trust Score from the URL analysis pipeline."
    );
  }

  const article = createArticleFromUrlAnalysis(payload.article);
  const analysis = payload.analysis;
  const relatedSources = createRelatedSources(payload.evidence?.sources);

  const analysisPrimarySources = toStringArray(
    analysis?.evidence?.primarySources
  );

  const evidenceSourceNames = Array.from(
    new Set(
      relatedSources
        .map((source) => source.sourceName.trim())
        .filter(Boolean)
    )
  );

  const primarySources =
    analysisPrimarySources.length > 0
      ? analysisPrimarySources
      : evidenceSourceNames.length > 0
        ? evidenceSourceNames
        : [article.source.name];

  const returnedCommonGround = toStringArray(analysis?.commonGround);

  const commonGround =
    returnedCommonGround.length > 0
      ? returnedCommonGround
      : [
          "The Angle Report identified potential areas of agreement in the available analysis.",
          "Additional reporting may change how the issue is understood.",
        ];

  const sourcesReviewed = Math.max(
    1,
    toNumberValue(
      analysis?.sourcesReviewed,
      payload.evidence?.sourceCount || primarySources.length || 1
    )
  );

  const executiveSummary = toStringValue(
    analysis?.summary,
    article.description || "No executive summary is available."
  );

  const whyThisMatters = toStringValue(
    analysis?.whyThisMatters,
    "The Angle Report could not determine why this story matters from the available reporting."
  );

  const independentSourceCount = Math.max(
    1,
    toNumberValue(
      payload.evidence?.independentSourceCount,
      evidenceSourceNames.length || 1
    )
  );

  const brief = normalizeEvidenceBrief({
    rawBrief: analysis?.brief,
    sources: payload.evidence?.sources ?? [],
    independentSourceCount,
    whatHappenedFallback: executiveSummary,
    whyItMattersFallback: whyThisMatters,
  });

  const report: IntelligenceReport = {
    article,

    overview: {
      biasScore: toClampedScore(analysis?.biasScore, 50),
      confidence: toClampedScore(analysis?.confidence, 0),
      category: toStringValue(analysis?.category, "Political"),
      sourcesReviewed,
    },

    trustScore: payload.trustScore,

    executiveSummary,

    whyThisMatters,

    whoIsAffected: toStringArray(analysis?.whoIsAffected),

    shortTermImpact: toStringValue(
      analysis?.shortTermImpact,
      "The short-term impact is not yet clear from the available reporting."
    ),

    longTermImpact: toStringValue(
      analysis?.longTermImpact,
      "The long-term impact is not yet clear from the available reporting."
    ),

    unansweredQuestions: toStringArray(analysis?.unansweredQuestions),

    keyFacts: toStringArray(analysis?.keyFacts),

    commonGround,

    consensusScore: toClampedScore(analysis?.consensusScore, 0),

    factCheck: {
      verdict: toStringValue(analysis?.factCheck?.verdict, "Pending"),
      explanation: toStringValue(
        analysis?.factCheck?.explanation,
        "Fact-checking details are not currently available."
      ),
    },

    perspectives: {
      left: toStringValue(
        analysis?.perspectives?.left,
        "Left-leaning perspective analysis is not available."
      ),
      center: toStringValue(
        analysis?.perspectives?.center,
        "Centrist perspective analysis is not available."
      ),
      right: toStringValue(
        analysis?.perspectives?.right,
        "Right-leaning perspective analysis is not available."
      ),
    },

    perspectiveAnalysis: createPerspectiveAnalysis(
      analysis,
      article,
      commonGround
    ),

    evidence: {
      primarySources,
      conflictingReporting: toStringArray(
        analysis?.evidence?.conflictingReporting
      ),
      methodology: toStringValue(
        analysis?.evidence?.methodology,
        "The Angle Report analyzed the submitted article using the available evidence set."
      ),
      lastAnalyzedAt: toStringValue(
        analysis?.evidence?.lastAnalyzedAt,
        new Date().toISOString()
      ),
      relatedSources:
        relatedSources.length > 0 ? relatedSources : undefined,
    },

    brief,
  };

  return {
    article,
    report,
    snapshotInput: createStorySnapshotInput({
      primary: {
        url: article.url,
        title: article.title,
        sourceName: article.source.name,
        publishedAt: article.publishedAt,
      },
      sources: payload.evidence?.sources ?? [],
      brief,
    }),
  };
}

export async function generateIntelligenceReportFromUrl(
  url: string
): Promise<{
  article: Article;
  report: IntelligenceReport;
  snapshotInput: StorySnapshotInput;
}> {
  const response = await fetch("/api/analyze-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      url,
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | AnalyzeUrlSuccessResponse
    | AnalyzeUrlErrorResponse
    | null;

  if (!response.ok) {
    const errorMessage =
      payload && "error" in payload
        ? toStringValue(
            payload.error,
            "The Angle Report could not process this article."
          )
        : "The Angle Report could not process this article.";

    throw attachHttpStatus(new Error(errorMessage), response.status);
  }

  if (
    !payload ||
    !("article" in payload) ||
    !("analysis" in payload) ||
    !("trustScore" in payload) ||
    !("evidence" in payload)
  ) {
    throw new Error(
      "The Angle Report received an incomplete URL analysis response."
    );
  }

  return mapAnalyzeUrlToIntelligenceReport(payload);
}

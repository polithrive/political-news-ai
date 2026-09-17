import type { Article } from "@/app/types/article";

import {
  generatePoliticalAnalysis,
  type PoliticalAnalysis,
} from "@/lib/ai/generatePoliticalAnalysis";

import {
  generateSummaryAnalysis,
  type SummaryAnalysis,
} from "@/lib/ai/generateSummary";

import { mergeAnalysis } from "@/lib/ai/mergeAnalysis";

import {
  extractArticle,
  normalizeArticleUrl,
} from "@/lib/services/articleExtractor";

import { buildEvidenceContext } from "@/lib/services/evidenceContext";

import { calculateTrustScore } from "@/lib/services/trustScore";

type AnalyzeUrlRequest = {
  url?: unknown;
};

function createSummaryFallback(): SummaryAnalysis {
  return {
    summary:
      "The Angle Report could not complete the executive summary for this story.",

    whyThisMatters:
      "Additional information is needed to determine the story’s broader significance.",

    whoIsAffected: [],

    shortTermImpact:
      "Short-term impact analysis is currently unavailable.",

    longTermImpact:
      "Long-term impact analysis is currently unavailable.",

    unansweredQuestions: [
      "What additional reporting is available?",
      "Which claims require independent verification?",
    ],

    keyFacts: [],

    factCheck: {
      verdict: "Unavailable",

      explanation:
        "The Angle Report could not complete the fact-check assessment.",
    },

    category: "Unknown",

    confidence: 0,

    brief: {
      whatHappened: "",
      whyItMatters: "",
      corroboratedFacts: [],
      angles: [],
      uncertainties: [],
      coverageDifferences: [],
    },
  };
}

function createPoliticalFallback(): PoliticalAnalysis {
  return {
    biasScore: 50,

    lean: "Center",

    biasReasoning:
      "Political framing could not be assessed from the available analysis.",

    perspectives: {
      left:
        "Progressive interpretation is currently unavailable.",

      center:
        "Centrist interpretation is currently unavailable.",

      right:
        "Conservative interpretation is currently unavailable.",
    },

    perspectiveAnalysis: {
      topic:
        "Political debate analysis is unavailable.",

      progressive: {
        position:
          "Progressive position analysis is unavailable.",

        strongestArguments: [],

        primaryConcerns: [],
      },

      centrist: {
        position:
          "Centrist position analysis is unavailable.",

        strongestArguments: [],

        primaryConcerns: [],
      },

      conservative: {
        position:
          "Conservative position analysis is unavailable.",

        strongestArguments: [],

        primaryConcerns: [],
      },

      areasOfAgreement: [],

      mainDisagreements: [],

      /*
       * Keep this property name for compatibility
       * with the existing intelligence data model.
       */
      politicalPulseAnalysis:
        "The Angle Report could not complete the political perspective analysis.",

      debateTemperature: 0,
    },

    commonGround: [],

    consensusScore: 0,
  };
}

function logModuleFailure(
  moduleName: string,
  reason: unknown
): void {
  console.error(
    `Analyze URL API ${moduleName} failed:`,
    reason
  );
}

function createArticleFromExtraction(
  extracted: Awaited<
    ReturnType<typeof extractArticle>
  >
): Article | null {
  if (!extracted) {
    return null;
  }

  return {
    title:
      extracted.title,

    description:
      extracted.description ||
      extracted.content.slice(
        0,
        500
      ),

    url:
      extracted.url,

    urlToImage:
      extracted.image || null,

    publishedAt:
      extracted.published || "",

    content:
      extracted.content || "",

    author:
      extracted.author || null,

    source: {
      id: null,

      name:
        extracted.source ||
        "Unknown source",
    },
  } as Article;
}

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as AnalyzeUrlRequest;

    if (
      typeof body.url !== "string" ||
      !body.url.trim()
    ) {
      return Response.json(
        {
          error:
            "Please provide a news article URL.",
        },
        {
          status: 400,
        }
      );
    }

    let normalizedUrl: string;

    try {
      normalizedUrl =
        normalizeArticleUrl(
          body.url
        );
    } catch (error) {
      return Response.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Please enter a valid article URL.",
        },
        {
          status: 400,
        }
      );
    }

    const extracted =
      await extractArticle(
        normalizedUrl
      );

    if (!extracted) {
      return Response.json(
        {
          error:
            "The Angle Report could not extract enough information from this article. The publisher may block automated access, the article may be behind a paywall, or the page may not contain readable news content.",
        },
        {
          status: 422,
        }
      );
    }

    const article =
      createArticleFromExtraction(
        extracted
      );

    if (!article) {
      return Response.json(
        {
          error:
            "The Angle Report could not prepare this article for analysis.",
        },
        {
          status: 422,
        }
      );
    }

    const evidenceContext =
      await buildEvidenceContext(
        article,
        {
          primaryContent:
            extracted.content,
        }
      );

    const sourceName =
      article.source?.name ||
      extracted.source ||
      "Unknown source";

    const description =
      article.description ||
      extracted.content.slice(
        0,
        1500
      );

    const [
      summaryResult,
      politicalResult,
    ] =
      await Promise.allSettled([
        generateSummaryAnalysis({
          title:
            article.title,

          description,

          sourceName,

          evidenceContext:
            evidenceContext
              .promptContext,
        }),

        generatePoliticalAnalysis({
          title:
            article.title,

          description,

          sourceName,

          evidenceContext:
            evidenceContext
              .promptContext,
        }),
      ]);

    const summaryAnalysis =
      summaryResult.status ===
      "fulfilled"
        ? summaryResult.value
        : createSummaryFallback();

    const politicalAnalysis =
      politicalResult.status ===
      "fulfilled"
        ? politicalResult.value
        : createPoliticalFallback();

    if (
      summaryResult.status ===
      "rejected"
    ) {
      logModuleFailure(
        "summary module",
        summaryResult.reason
      );
    }

    if (
      politicalResult.status ===
      "rejected"
    ) {
      logModuleFailure(
        "political module",
        politicalResult.reason
      );
    }

    const sourceNames =
      evidenceContext.sources
        .map(
          (source) =>
            source.sourceName
        )
        .filter(Boolean);

    const sourceConsensus =
      evidenceContext
        .sourceConsensus;

    /*
     * Calculate the Trust Score from the
     * actual evidence set.
     *
     * AI confidence is only one component.
     * Source corroboration, publisher quality,
     * reporting alignment, and political
     * diversity also contribute.
     */
    const trustScore =
      calculateTrustScore({
        confidence:
          summaryAnalysis.confidence,

        sourceCount:
          sourceConsensus.sourceCount,

        ratedSourceCount:
          sourceConsensus
            .ratedSourceCount,

        averageReliability:
          sourceConsensus
            .averageReliability,

        averageFactualReporting:
          sourceConsensus
            .averageFactualReporting,

        reportingAgreement:
          sourceConsensus
            .reportingAgreement,

        politicalDistribution:
          sourceConsensus
            .politicalDistribution,
      });

    const analysis =
      mergeAnalysis({
        summaryAnalysis,

        politicalAnalysis,

        sourceName,

        sourcesReviewed:
          evidenceContext
            .sourceCount,

        primarySources:
          sourceNames,

        methodology:
          evidenceContext
            .sourceCount > 1
            ? `The Angle Report analyzed the submitted article alongside ${evidenceContext.sourceCount - 1} related source${evidenceContext.sourceCount - 1 === 1 ? "" : "s"}. The evidence set included ${evidenceContext.independentSourceCount} independent publisher${evidenceContext.independentSourceCount === 1 ? "" : "s"}. Summary and political-intelligence modules analyzed the same evidence context to identify supported facts, uncertainty, framing, perspectives, and areas of agreement or disagreement.`
            : "The Angle Report analyzed the submitted article as the only available source. No additional sufficiently relevant reporting was available in the evidence set, so the analysis should not be interpreted as independently corroborated.",
      });

    return Response.json({
      article: {
        title:
          article.title,

        description:
          article.description,

        url:
          article.url,

        image:
          extracted.image,

        author:
          extracted.author,

        published:
          extracted.published,

        source:
          sourceName,
      },

      evidence: {
        sourceCount:
          evidenceContext
            .sourceCount,

        independentSourceCount:
          evidenceContext
            .independentSourceCount,

        ratedSourceCount:
          evidenceContext
            .ratedSourceCount,

        sourceConsensus: {
          sourceCount:
            sourceConsensus
              .sourceCount,

          ratedSourceCount:
            sourceConsensus
              .ratedSourceCount,

          averageReliability:
            sourceConsensus
              .averageReliability,

          averageFactualReporting:
            sourceConsensus
              .averageFactualReporting,

          reportingAgreement:
            sourceConsensus
              .reportingAgreement,

          sourceQualityScore:
            sourceConsensus
              .sourceQualityScore,

          sourceNames:
            sourceConsensus
              .sourceNames,

          politicalDistribution:
            sourceConsensus
              .politicalDistribution,
        },

        sources:
          evidenceContext.sources,
      },

      trustScore,

      analysis,
    });
  } catch (error) {
    console.error(
      "Analyze URL API orchestration error:",
      error
    );

    return Response.json(
      {
        error:
          "The Angle Report could not process this article.",
      },
      {
        status: 500,
      }
    );
  }
}
import type { RankedArticle } from "./multiSource";

export type SourceConsensus = {
  sourceCount: number;

  ratedSourceCount: number;

  averageReliability: number | null;

  averageFactualReporting: number | null;

  reportingAgreement: number | null;

  sourceQualityScore: number | null;

  sourceNames: string[];

  politicalDistribution: {
    left: number;
    center: number;
    right: number;
    mixed: number;
  };
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "been",
  "being",
  "but",
  "by",
  "for",
  "from",
  "had",
  "has",
  "have",
  "he",
  "her",
  "his",
  "in",
  "into",
  "is",
  "it",
  "its",
  "of",
  "on",
  "or",
  "said",
  "says",
  "she",
  "that",
  "the",
  "their",
  "they",
  "this",
  "to",
  "was",
  "were",
  "will",
  "with",
]);

const WEAK_REPORTING_TERMS =
  new Set([
    "breaking",
    "latest",
    "live",
    "news",
    "report",
    "reports",
    "reported",
    "reporting",
    "update",
    "updates",
    "analysis",
    "opinion",
    "exclusive",
    "today",
    "yesterday",
    "tomorrow",
    "new",
    "more",
    "most",
    "after",
    "before",
    "about",
    "amid",
    "political",
    "politics",
    "official",
    "officials",
    "president",
    "government",
  ]);

function calculateAverage(
  values: number[]
): number | null {
  if (values.length === 0) {
    return null;
  }

  const total = values.reduce(
    (sum, value) =>
      sum + value,
    0
  );

  return Math.round(
    total / values.length
  );
}

function clampScore(
  value: number
): number {
  return Math.max(
    0,
    Math.min(
      100,
      Math.round(value)
    )
  );
}

function normalizeText(
  value: string | null | undefined
): string {
  return (value ?? "")
    .toLowerCase()
    .replace(
      /(?<=\d),(?=\d)/g,
      ""
    )
    .replace(
      /[^\p{L}\p{N}\s]/gu,
      " "
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
}

function getInformativeWords(
  value: string
): string[] {
  return Array.from(
    new Set(
      normalizeText(value)
        .split(" ")
        .filter(
          (word) =>
            word.length >= 3 &&
            !STOP_WORDS.has(word) &&
            !WEAK_REPORTING_TERMS.has(
              word
            )
        )
    )
  );
}

function getArticleText(
  source: RankedArticle
): string {
  return [
    source.article.title,
    source.article.description ??
      "",
  ]
    .filter(Boolean)
    .join(" ");
}

function getSourcePublisher(
  source: RankedArticle
): string {
  return normalizeText(
    source.article.source?.name
  );
}

function removeDuplicatePublishers(
  sources: RankedArticle[]
): RankedArticle[] {
  const seenPublishers =
    new Set<string>();

  const uniqueSources:
    RankedArticle[] = [];

  for (const source of sources) {
    const publisher =
      getSourcePublisher(source);

    /*
     * If the publisher name is unavailable,
     * keep the source because we cannot safely
     * determine whether it is a duplicate.
     */
    if (!publisher) {
      uniqueSources.push(source);
      continue;
    }

    if (
      seenPublishers.has(
        publisher
      )
    ) {
      continue;
    }

    seenPublishers.add(
      publisher
    );

    uniqueSources.push(
      source
    );
  }

  return uniqueSources;
}

function calculateSetOverlap(
  first: string[],
  second: string[]
): number {
  if (
    first.length === 0 ||
    second.length === 0
  ) {
    return 0;
  }

  const firstSet =
    new Set(first);

  const secondSet =
    new Set(second);

  let sharedCount = 0;

  for (const word of firstSet) {
    if (
      secondSet.has(word)
    ) {
      sharedCount += 1;
    }
  }

  /*
   * Sørensen-Dice coefficient.
   *
   * This is more forgiving than Jaccard for
   * short news headlines while still requiring
   * meaningful overlap.
   */
  return (
    (2 * sharedCount) /
    (
      firstSet.size +
      secondSet.size
    )
  );
}

function calculatePairAgreement(
  first: RankedArticle,
  second: RankedArticle
): number {
  const firstTitleWords =
    getInformativeWords(
      first.article.title
    );

  const secondTitleWords =
    getInformativeWords(
      second.article.title
    );

  const firstFullWords =
    getInformativeWords(
      getArticleText(first)
    );

  const secondFullWords =
    getInformativeWords(
      getArticleText(second)
    );

  const titleOverlap =
    calculateSetOverlap(
      firstTitleWords,
      secondTitleWords
    );

  const reportingOverlap =
    calculateSetOverlap(
      firstFullWords,
      secondFullWords
    );

  /*
   * Headline overlap is useful because it
   * tends to contain the core event.
   *
   * Description overlap receives more weight
   * because it usually contains more factual
   * detail than the headline alone.
   */
  const rawScore =
    titleOverlap * 40 +
    reportingOverlap * 60;

  return clampScore(rawScore);
}

function calculateReportingAgreement(
  sources: RankedArticle[]
): number | null {
  /*
   * Agreement should only be calculated
   * across independent publishers.
   */
  const independentSources =
    removeDuplicatePublishers(
      sources
    );

  if (
    independentSources.length < 2
  ) {
    return null;
  }

  const pairScores:
    number[] = [];

  for (
    let firstIndex = 0;
    firstIndex <
    independentSources.length;
    firstIndex += 1
  ) {
    for (
      let secondIndex =
        firstIndex + 1;
      secondIndex <
      independentSources.length;
      secondIndex += 1
    ) {
      const first =
        independentSources[
          firstIndex
        ];

      const second =
        independentSources[
          secondIndex
        ];

      pairScores.push(
        calculatePairAgreement(
          first,
          second
        )
      );
    }
  }

  if (
    pairScores.length === 0
  ) {
    return null;
  }

  const averagePairScore =
    calculateAverage(
      pairScores
    );

  if (
    averagePairScore === null
  ) {
    return null;
  }

  /*
   * Do not let lexical overlap alone produce
   * an extremely high "agreement" score.
   *
   * Headlines and descriptions can show that
   * independent outlets are reporting the
   * same major facts or themes, but they do
   * not prove every claim is true.
   *
   * Claim-level corroboration can replace this
   * ceiling later.
   */
  return Math.min(
    85,
    clampScore(
      averagePairScore
    )
  );
}

export function calculateSourceConsensus(
  sources: RankedArticle[]
): SourceConsensus {
  const politicalDistribution = {
    left: 0,
    center: 0,
    right: 0,
    mixed: 0,
  };

  for (const source of sources) {
    switch (
      source.sourceRating
        .politicalLean
    ) {
      case "Left":
        politicalDistribution.left +=
          1;
        break;

      case "Center":
        politicalDistribution.center +=
          1;
        break;

      case "Right":
        politicalDistribution.right +=
          1;
        break;

      default:
        politicalDistribution.mixed +=
          1;
        break;
    }
  }

  const ratedSources =
    sources.filter(
      (source) =>
        source.sourceRating
          .isRated
    );

  const reliabilityValues =
    ratedSources.map(
      (source) =>
        source.sourceRating
          .reliability
    );

  const factualReportingValues =
    ratedSources.map(
      (source) =>
        source.sourceRating
          .factualReporting
    );

  const averageReliability =
    calculateAverage(
      reliabilityValues
    );

  const averageFactualReporting =
    calculateAverage(
      factualReportingValues
    );

  const sourceQualityScore =
    averageReliability !== null &&
    averageFactualReporting !== null
      ? clampScore(
          (
            averageReliability +
            averageFactualReporting
          ) /
            2
        )
      : null;

  const reportingAgreement =
    calculateReportingAgreement(
      sources
    );

  const sourceNames =
    Array.from(
      new Set(
        sources
          .map(
            (source) =>
              source.article
                .source?.name?.trim()
          )
          .filter(
            (
              sourceName
            ): sourceName is string =>
              Boolean(sourceName)
          )
      )
    );

  return {
    sourceCount:
      sources.length,

    ratedSourceCount:
      ratedSources.length,

    averageReliability,

    averageFactualReporting,

    reportingAgreement,

    sourceQualityScore,

    sourceNames,

    politicalDistribution,
  };
}
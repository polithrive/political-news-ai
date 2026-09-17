import type { Article } from "@/app/types/article";

import {
  getSourceRating,
  type SourceRating,
} from "./sourceRanking";

const MAX_SOURCES = 6;
const SOURCE_GATHER_TIMEOUT_MS = 7_000;

const MIN_RELEVANCE_SCORE = 30;

const MAX_QUERY_KEYWORDS = 6;
const MIN_QUERY_KEYWORDS = 3;
const MAX_RELATED_QUERIES = 3;

function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "";
  }

  const configuredUrl =
    process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  const vercelUrl =
    process.env.VERCEL_URL?.trim();

  if (vercelUrl) {
    return `https://${vercelUrl.replace(/\/$/, "")}`;
  }

  return "http://localhost:3000";
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "been",
  "but",
  "by",
  "for",
  "from",
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

/*
 * These terms frequently appear in headlines
 * but usually do not identify the underlying
 * event strongly enough to be useful in a
 * related-story search.
 */
const WEAK_QUERY_TERMS = new Set([
  "breaking",
  "latest",
  "live",
  "news",
  "report",
  "reports",
  "update",
  "updates",
  "analysis",
  "opinion",
  "exclusive",
  "watch",
  "today",
  "tomorrow",
  "yesterday",
  "week",
  "month",
  "year",
  "years",
  "new",
  "more",
  "most",
  "show",
  "shows",
  "showed",
  "showing",
  "than",
  "after",
  "before",
  "over",
  "under",
  "about",
  "amid",
  "among",
  "work",
  "works",
  "working",
  "toward",
  "towards",
  "political",
  "question",
  "long",
  "term",
  "interest",
  "interests",
  "stress",
  "stresses",
  "stressed",
  "package",
  "solution",
  "plan",
  "plans",
  "move",
  "moves",
  "moving",
  "seek",
  "seeks",
  "sought",
  "call",
  "calls",
  "called",
  "fury",
  "furious",
  "pathetic",
  "inside",
  "including",
  "looming",
  "outrage",
  "outraged",
  "shocking",
  "stunning",
  "slams",
  "slam",
  "slammed",
  "reveals",
  "revealed",
  "convince",
  "questions",
  "positions",
  "top",
  "could",
  "should",
  "might",
  "president",
  "end",
  "human",
  "life",
]);

const WEAK_RELEVANCE_TERMS = new Set([
  "breaking",
  "latest",
  "live",
  "news",
  "report",
  "reports",
  "update",
  "updates",
  "analysis",
  "opinion",
  "exclusive",
  "watch",
  "today",
  "tomorrow",
  "yesterday",
  "week",
  "month",
  "year",
  "years",
  "new",
  "more",
  "most",
  "show",
  "shows",
  "showed",
  "showing",
  "than",
  "after",
  "before",
  "over",
  "under",
  "about",
  "amid",
  "among",
  "work",
  "works",
  "working",
  "toward",
  "towards",
  "political",
  "question",
  "long",
  "term",
  "interest",
  "interests",
  "stress",
  "stresses",
  "stressed",
  "package",
  "solution",
  "plan",
  "plans",
  "move",
  "moves",
  "moving",
  "seek",
  "seeks",
  "sought",
  "call",
  "calls",
  "called",
  "appear",
  "appears",
  "appeared",
  "forget",
  "forgets",
  "forgot",
  "speak",
  "speaks",
  "speech",
  "during",
  "just",
  "president",
  "government",
  "official",
  "officials",
]);

export type RankedArticle = {
  article: Article;
  sourceRating: SourceRating;
  isPrimary: boolean;
};

type ScoredArticle = RankedArticle & {
  relevanceScore: number;
  rankingScore: number;
};

function normalizeText(
  value: string | null | undefined
): string {
  return (value ?? "")
    .toLowerCase()
    .replace(/(?<=\d),(?=\d)/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getKeywords(
  value: string
): string[] {
  return Array.from(
    new Set(
      normalizeText(value)
        .split(" ")
        .filter(
          (word) =>
            word.length >= 3 &&
            !STOP_WORDS.has(word)
        )
    )
  );
}

function getQueryKeywords(
  value: string
): string[] {
  return getKeywords(value).filter(
    (keyword) =>
      !WEAK_QUERY_TERMS.has(keyword)
  );
}

const DESCRIPTION_GLUE_TERMS = new Set([
  "currently",
  "unknown",
  "where",
  "spent",
  "cultivating",
  "previous",
  "failed",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
  "officials",
  "holds",
  "years",
  "allies",
  "both",
  "major",
  "parties",
  "discussing",
  "three",
  "would",
  "which",
  "last",
  "until",
  "after",
  "widely",
  "condemned",
  "came",
  "come",
  "coming",
  "election",
  "day",
]);

const EVENT_QUERY_TERMS = new Set([
  "vote",
  "votes",
  "voting",
  "strike",
  "drone",
  "jets",
  "airspace",
  "hearing",
  "confirmation",
  "impeachment",
  "shutdown",
  "shuts",
  "canceling",
  "cancelling",
  "canceled",
  "cancelled",
  "extinction",
  "nomination",
  "nominee",
  "surgeon",
  "iran",
  "lithuania",
  "lithuanian",
  "nato",
  "war",
  "defect",
  "speaker",
  "senate",
  "house",
  "capitol",
]);

const GENERIC_PUBLISHER_WORDS = new Set([
  "the",
  "news",
  "daily",
  "post",
  "times",
  "tribune",
  "herald",
  "press",
  "mail",
  "sun",
  "star",
  "journal",
  "story",
  "raw",
  "new",
  "york",
  "washington",
  "associated",
  "national",
  "public",
  "radio",
  "media",
  "digital",
  "online",
]);

const HOST_BRAND_TOKENS: Record<string, string[]> = {
  npr: ["npr"],
  bbc: ["bbc"],
  reuters: ["reuters"],
  cnn: ["cnn"],
  apnews: ["apnews"],
  cbsnews: ["cbsnews", "cbs"],
  nbcnews: ["nbcnews", "nbc"],
  abcnews: ["abcnews"],
  foxnews: ["foxnews"],
  nytimes: ["nytimes", "nyt"],
  washingtonpost: ["washingtonpost", "wapo"],
  theguardian: ["guardian"],
  politico: ["politico"],
  cnbc: ["cnbc"],
  bloomberg: ["bloomberg"],
  aljazeera: ["aljazeera"],
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hostnameFromArticleUrl(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

function getPublisherBrandTokens(article: Article): Set<string> {
  const tokens = new Set<string>();
  const sourceName = article.source?.name?.trim() ?? "";
  const sourceRating = getSourceRating(sourceName, article.url);
  const names = [sourceName, sourceRating.displayName].filter(Boolean);

  for (const name of names) {
    for (const token of normalizeText(name).split(" ")) {
      if (
        token.length >= 3 &&
        !GENERIC_PUBLISHER_WORDS.has(token) &&
        !STOP_WORDS.has(token)
      ) {
        tokens.add(token);
      }
    }
  }

  const host = hostnameFromArticleUrl(article.url ?? "");
  const hostLabel = host.split(".")[0] ?? "";
  const brandTokens = HOST_BRAND_TOKENS[hostLabel];

  if (brandTokens) {
    for (const token of brandTokens) {
      tokens.add(token);
    }
  }

  return tokens;
}

function stripPublisherSuffix(title: string, article: Article): string {
  let value = title.trim();
  const sourceName = article.source?.name?.trim() ?? "";
  const displayName = getSourceRating(sourceName, article.url).displayName;
  const names = Array.from(new Set([sourceName, displayName])).filter(Boolean);

  for (const name of names) {
    const pattern = new RegExp(
      `(?:\\s*[-–—|:]+\\s*|\\s+)(?:the\\s+)?${escapeRegExp(name)}\\s*$`,
      "i"
    );
    value = value.replace(pattern, "").trim();
  }

  return value;
}

function tokenizeOriginal(value: string): string[] {
  return value.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?/gu) ?? [];
}

function isMostlyTitleCase(title: string): boolean {
  const words = tokenizeOriginal(title).filter(
    (word) => word.replace(/['’]/g, "").length >= 4
  );

  if (words.length < 4) {
    return false;
  }

  const capitalized = words.filter((word) =>
    /^\p{Lu}/u.test(word)
  ).length;

  return capitalized / words.length >= 0.75;
}

function isAcronymToken(token: string): boolean {
  return (
    token === "AI" ||
    (/^[\p{Lu}]{2,5}$/u.test(token) && token.length >= 2)
  );
}

function extractEntityTerms(text: string): string[] {
  const tokens = tokenizeOriginal(text);
  const titleCase = isMostlyTitleCase(text);
  const entities: string[] = [];

  function add(term: string): void {
    const normalized = normalizeText(term.replace(/['’]s$/i, ""));

    if (
      !normalized ||
      STOP_WORDS.has(normalized) ||
      WEAK_QUERY_TERMS.has(normalized) ||
      DESCRIPTION_GLUE_TERMS.has(normalized) ||
      (GENERIC_PUBLISHER_WORDS.has(normalized) &&
        !EVENT_QUERY_TERMS.has(normalized)) ||
      normalized === "dr" ||
      entities.includes(normalized)
    ) {
      return;
    }

    entities.push(normalized);
  }

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const next = tokens[index + 1];

    if (isAcronymToken(token)) {
      add(token);
    }

    const currentIsProper = /^\p{Lu}/u.test(token);
    const nextIsProper =
      Boolean(next) &&
      /^\p{Lu}/u.test(next) &&
      !STOP_WORDS.has(normalizeText(next));

    if (currentIsProper && nextIsProper) {
      add(token);
      add(next);
      index += 1;
      continue;
    }

    if (
      currentIsProper &&
      !titleCase &&
      token.replace(/['’]/g, "").length >= 4
    ) {
      add(token);
    }

    if (/['’]s$/i.test(token) && /^\p{Lu}/u.test(token)) {
      add(token);
    }
  }

  return entities;
}

function queryTermWeight(
  term: string,
  options: {
    entities: Set<string>;
    fromTitle: boolean;
  }
): number {
  let weight = 0;

  if (options.entities.has(term)) {
    weight += 6;
  }

  if (EVENT_QUERY_TERMS.has(term)) {
    weight += 5;
  }

  if (term.length >= 8) {
    weight += 3;
  } else if (term.length >= 6) {
    weight += 2;
  } else if (term.length >= 5) {
    weight += 1;
  }

  if (options.fromTitle) {
    weight += 2;
  }

  if (/\d/.test(term)) {
    weight += 2;
  }

  return weight;
}

function rankQueryTerms(
  terms: string[],
  entities: Set<string>,
  fromTitle: boolean
): string[] {
  return [...terms].sort((left, right) => {
    const weightDelta =
      queryTermWeight(right, { entities, fromTitle }) -
      queryTermWeight(left, { entities, fromTitle });

    if (weightDelta !== 0) {
      return weightDelta;
    }

    return terms.indexOf(left) - terms.indexOf(right);
  });
}

function querySimilarity(left: string, right: string): number {
  const leftTerms = new Set(left.split(" "));
  const rightTerms = new Set(right.split(" "));
  let intersection = 0;

  for (const term of leftTerms) {
    if (rightTerms.has(term)) {
      intersection += 1;
    }
  }

  const union = new Set([...leftTerms, ...rightTerms]).size;

  return union === 0 ? 0 : intersection / union;
}

function takeStrongTerms(
  ranked: string[],
  count: number,
  extra: string[] = [],
  entities: Set<string> = new Set()
): string[] {
  const selected: string[] = [];

  function add(term: string): boolean {
    if (!term || selected.includes(term)) {
      return false;
    }

    selected.push(term);
    return selected.length >= count;
  }

  for (const term of extra) {
    if (add(term)) {
      return selected;
    }
  }

  for (const term of ranked) {
    const weight = queryTermWeight(term, {
      entities,
      fromTitle: true,
    });

    if (weight < 6) {
      continue;
    }

    if (add(term)) {
      return selected;
    }
  }

  if (selected.length < MIN_QUERY_KEYWORDS) {
    for (const term of ranked) {
      if (add(term) || selected.length >= MIN_QUERY_KEYWORDS) {
        break;
      }
    }
  }

  return selected;
}

/*
 * Build a focused search query rather than
 * sending the complete headline to NewsAPI.
 *
 * Queries should describe the underlying event
 * (people, places, institutions, distinctive
 * actions) rather than the publisher's headline
 * framing.
 */
export function buildRelatedStoryQueries(
  article: Article
): string[] {
  const publisherTokens =
    getPublisherBrandTokens(article);
  const strippedTitle =
    stripPublisherSuffix(
      article.title,
      article
    );

  const titleEntities = extractEntityTerms(
    strippedTitle
  );
  const descriptionEntities =
    extractEntityTerms(
      article.description ?? ""
    );
  const entities = new Set([
    ...titleEntities,
    ...descriptionEntities,
  ]);

  function usableTerms(
    value: string,
    allowGlue: boolean
  ): string[] {
    return getQueryKeywords(value).filter(
      (keyword) => {
        if (publisherTokens.has(keyword)) {
          return false;
        }

        if (
          GENERIC_PUBLISHER_WORDS.has(keyword) &&
          !EVENT_QUERY_TERMS.has(keyword)
        ) {
          return false;
        }

        if (
          !allowGlue &&
          DESCRIPTION_GLUE_TERMS.has(keyword)
        ) {
          return false;
        }

        return true;
      }
    );
  }

  const titleTerms = usableTerms(strippedTitle, true);
  const descriptionTerms = usableTerms(
    article.description ?? "",
    false
  );
  const rankedTitle = rankQueryTerms(
    titleTerms,
    entities,
    true
  );
  const rankedDescription = rankQueryTerms(
    descriptionTerms,
    entities,
    false
  );
  const eventTitleTerms = titleTerms.filter(
    (term) => EVENT_QUERY_TERMS.has(term)
  );

  if (
    titleTerms.length === 0 &&
    descriptionTerms.length === 0
  ) {
    const fallback = normalizeText(strippedTitle);
    return fallback ? [fallback] : [];
  }

  const queries: string[] = [];

  function addQuery(keywords: string[]): void {
    const uniqueKeywords = Array.from(
      new Set(keywords.filter(Boolean))
    );

    if (uniqueKeywords.length < MIN_QUERY_KEYWORDS) {
      return;
    }

    const query = uniqueKeywords
      .slice(0, MAX_QUERY_KEYWORDS)
      .join(" ");

    if (!query) {
      return;
    }

    const tooSimilar = queries.some(
      (existing) => querySimilarity(existing, query) >= 0.6
    );

    if (!tooSimilar && !queries.includes(query)) {
      queries.push(query);
    }
  }

  const distinctiveEventTerms = eventTitleTerms.filter(
    (term) => !titleEntities.includes(term)
  );
  const descriptionEventTerms = descriptionTerms.filter((term) =>
    EVENT_QUERY_TERMS.has(term)
  );

  addQuery(
    takeStrongTerms(
      rankedTitle,
      5,
      [
        ...titleEntities.slice(0, 3),
        ...distinctiveEventTerms.slice(0, 2),
        ...descriptionEventTerms.slice(0, 2),
      ],
      entities
    )
  );

  addQuery(
    takeStrongTerms(
      rankedTitle,
      5,
      [...distinctiveEventTerms, ...titleEntities.slice(0, 2)],
      entities
    )
  );

  addQuery(
    takeStrongTerms(
      rankedTitle,
      5,
      [
        ...descriptionEntities.slice(0, 3),
        ...rankedDescription.slice(0, 3),
        ...titleEntities.slice(0, 2),
      ],
      entities
    )
  );

  if (queries.length === 0) {
    addQuery(
      takeStrongTerms(
        [...rankedTitle, ...rankedDescription],
        MAX_QUERY_KEYWORDS,
        [],
        entities
      )
    );
  }

  return queries.slice(0, MAX_RELATED_QUERIES);
}

function createPrimarySource(
  primaryArticle: Article
): RankedArticle {
  return {
    article: primaryArticle,

    sourceRating: getSourceRating(
      primaryArticle.source.name
    ),

    isPrimary: true,
  };
}

function normalizeSourceName(
  article: Article
): string {
  return normalizeText(
    article.source?.name
  );
}

function removeDuplicateArticles(
  articles: Article[]
): Article[] {
  const seenUrls =
    new Set<string>();

  const seenTitles =
    new Set<string>();

  return articles.filter(
    (article) => {
      const normalizedUrl =
        normalizeText(article.url);

      const normalizedTitle =
        normalizeText(article.title);

      if (
        !normalizedUrl ||
        !normalizedTitle
      ) {
        return false;
      }

      if (
        seenUrls.has(
          normalizedUrl
        ) ||
        seenTitles.has(
          normalizedTitle
        )
      ) {
        return false;
      }

      seenUrls.add(
        normalizedUrl
      );

      seenTitles.add(
        normalizedTitle
      );

      return true;
    }
  );
}

function getEventAnchors(
  primaryArticle: Article
): string[] {
  const titleKeywords =
    getKeywords(
      primaryArticle.title
    ).filter(
      (keyword) =>
        !WEAK_RELEVANCE_TERMS.has(
          keyword
        )
    );

  const descriptionKeywords =
    getKeywords(
      primaryArticle.description ?? ""
    ).filter(
      (keyword) =>
        !WEAK_RELEVANCE_TERMS.has(
          keyword
        )
    );

  return Array.from(
    new Set([
      ...titleKeywords,
      ...descriptionKeywords,
    ])
  );
}

function calculateEventAnchorOverlap(
  article: Article,
  primaryArticle: Article
): number {
  const anchors =
    getEventAnchors(primaryArticle);

  if (anchors.length === 0) {
    return 0;
  }

  const candidateKeywords =
    new Set(
      getKeywords(
        `${article.title} ${
          article.description ?? ""
        }`
      )
    );

  const sharedAnchors =
    anchors.filter(
      (anchor) =>
        candidateKeywords.has(anchor)
    );

  return (
    sharedAnchors.length /
    anchors.length
  );
}

function calculateKeywordOverlap(
  article: Article,
  primaryKeywords: string[]
): number {
  if (
    primaryKeywords.length === 0
  ) {
    return 0;
  }

  const articleText =
    `${article.title} ${
      article.description ?? ""
    }`;

  const articleKeywords =
    new Set(
      getKeywords(articleText)
    );

  const sharedKeywords =
    primaryKeywords.filter(
      (keyword) =>
        articleKeywords.has(
          keyword
        )
    );

  return (
    sharedKeywords.length /
    primaryKeywords.length
  );
}

function calculateTitleSimilarity(
  article: Article,
  primaryArticle: Article
): number {
  const primaryTitleKeywords =
    getKeywords(
      primaryArticle.title
    );

  if (
    primaryTitleKeywords.length === 0
  ) {
    return 0;
  }

  const articleTitleKeywords =
    new Set(
      getKeywords(
        article.title
      )
    );

  const sharedTitleKeywords =
    primaryTitleKeywords.filter(
      (keyword) =>
        articleTitleKeywords.has(
          keyword
        )
    );

  return (
    sharedTitleKeywords.length /
    primaryTitleKeywords.length
  );
}

function calculateRelevanceScore(
  article: Article,
  primaryArticle: Article
): number {
  if (
    article.url ===
    primaryArticle.url
  ) {
    return 100;
  }

  const primaryKeywords =
    getKeywords(
      `${primaryArticle.title} ${
        primaryArticle.description ??
        ""
      }`
    );

  const keywordOverlap =
    calculateKeywordOverlap(
      article,
      primaryKeywords
    );

  const titleSimilarity =
    calculateTitleSimilarity(
      article,
      primaryArticle
    );

  const eventAnchorOverlap =
    calculateEventAnchorOverlap(
      article,
      primaryArticle
    );

  /*
   * Event anchors are the strongest signal.
   * Generic headline resemblance must not be
   * enough to classify two articles as the
   * same underlying event.
   */
  return Math.round(
    eventAnchorOverlap * 55 +
      titleSimilarity * 30 +
      keywordOverlap * 15
  );
}

function calculateRankingScore(
  relevanceScore: number,
  sourceRating: SourceRating
): number {
  /*
   * Relevance dominates the ranking.
   *
   * Source quality is only used as a
   * secondary signal when PoliticalPulse
   * actually maintains a verified rating.
   */
  const relevanceContribution =
    relevanceScore * 0.8;

  const sourceQualityContribution =
    sourceRating.isRated
      ? (
          sourceRating.reliability +
          sourceRating.factualReporting
        ) /
        2 *
        0.2
      : 50 * 0.2;

  return Math.round(
    relevanceContribution +
      sourceQualityContribution
  );
}

function scoreArticles(
  articles: Article[],
  primaryArticle: Article
): ScoredArticle[] {
  return articles
    .map((article) => {
      const sourceRating =
        getSourceRating(
          article.source.name
        );

      const isPrimary =
        article.url ===
        primaryArticle.url;

      const relevanceScore =
        calculateRelevanceScore(
          article,
          primaryArticle
        );

      const rankingScore =
        isPrimary
          ? 1000
          : calculateRankingScore(
              relevanceScore,
              sourceRating
            );

      return {
        article,
        sourceRating,
        isPrimary,
        relevanceScore,
        rankingScore,
      };
    })
    .filter(
      (source) =>
        source.isPrimary ||
        source.relevanceScore >=
          MIN_RELEVANCE_SCORE
    )
    .sort(
      (a, b) =>
        b.rankingScore -
        a.rankingScore
    );
}

function selectDiverseSources(
  scoredArticles: ScoredArticle[],
  primaryArticle: Article
): RankedArticle[] {
  const selected:
    RankedArticle[] = [];

  const usedPublishers =
    new Set<string>();

  const primary =
    scoredArticles.find(
      (source) =>
        source.isPrimary
    ) ??
    {
      ...createPrimarySource(
        primaryArticle
      ),
      relevanceScore: 100,
      rankingScore: 1000,
    };

  selected.push({
    article:
      primary.article,
    sourceRating:
      primary.sourceRating,
    isPrimary: true,
  });

  const primaryPublisher =
    normalizeSourceName(
      primary.article
    );

  if (primaryPublisher) {
    usedPublishers.add(
      primaryPublisher
    );
  }

  /*
   * First pass:
   * prefer independent publishers.
   */
  for (const source of scoredArticles) {
    if (
      selected.length >=
      MAX_SOURCES
    ) {
      break;
    }

    if (source.isPrimary) {
      continue;
    }

    const publisher =
      normalizeSourceName(
        source.article
      );

    if (
      !publisher ||
      usedPublishers.has(
        publisher
      )
    ) {
      continue;
    }

    selected.push({
      article:
        source.article,
      sourceRating:
        source.sourceRating,
      isPrimary: false,
    });

    usedPublishers.add(
      publisher
    );
  }

  /*
   * Second pass:
   * if fewer than MAX_SOURCES were found,
   * allow additional articles from an
   * already-used publisher rather than
   * discarding relevant coverage.
   */
  if (
    selected.length <
    MAX_SOURCES
  ) {
    const selectedUrls =
      new Set(
        selected.map(
          (source) =>
            source.article.url
        )
      );

    for (const source of scoredArticles) {
      if (
        selected.length >=
        MAX_SOURCES
      ) {
        break;
      }

      if (
        source.isPrimary ||
        selectedUrls.has(
          source.article.url
        )
      ) {
        continue;
      }

      selected.push({
        article:
          source.article,
        sourceRating:
          source.sourceRating,
        isPrimary: false,
      });

      selectedUrls.add(
        source.article.url
      );
    }
  }

  return selected;
}

function rankArticles(
  articles: Article[],
  primaryArticle: Article
): RankedArticle[] {
  const scoredArticles =
    scoreArticles(
      articles,
      primaryArticle
    );

  return selectDiverseSources(
    scoredArticles,
    primaryArticle
  );
}

export async function gatherStorySources(
  primaryArticle: Article
): Promise<RankedArticle[]> {
  const controller =
    new AbortController();

  const timeoutId =
    setTimeout(() => {
      controller.abort();
    }, SOURCE_GATHER_TIMEOUT_MS);

  const relatedStoryQueries =
    buildRelatedStoryQueries(
      primaryArticle
    );

  console.info(
    "PoliticalPulse related-story search:",
    {
      originalTitle:
        primaryArticle.title,
      relatedStoryQueries,
    }
  );

  try {
    if (
      relatedStoryQueries.length === 0
    ) {
      return [
        createPrimarySource(
          primaryArticle
        ),
      ];
    }

    const queryResults =
      await Promise.all(
        relatedStoryQueries.map(
          async (
            relatedStoryQuery
          ): Promise<Article[]> => {
            try {
              const query =
                encodeURIComponent(
                  relatedStoryQuery
                );

              const apiBaseUrl =
                getApiBaseUrl();

              const response =
                await fetch(
                  `${apiBaseUrl}/api/news?mode=related&q=${query}`,
                  {
                    signal:
                      controller.signal,
                  }
                );

              if (!response.ok) {
                return [];
              }

              const data =
                (await response.json()) as {
                  articles?: unknown;
                };

              return Array.isArray(
                data.articles
              )
                ? (data.articles as Article[])
                : [];
            } catch (error) {
              if (
                error instanceof
                  DOMException &&
                error.name ===
                  "AbortError"
              ) {
                throw error;
              }

              console.warn(
                "Related-story query failed:",
                {
                  relatedStoryQuery,
                  error,
                }
              );

              return [];
            }
          }
        )
      );

    const relatedArticles =
      queryResults.flat();

    const combined =
      removeDuplicateArticles([
        primaryArticle,
        ...relatedArticles,
      ]);

    const rankedArticles =
      rankArticles(
        combined,
        primaryArticle
      );

    console.info(
      "PoliticalPulse source selection:",
      {
        primarySource:
          primaryArticle.source.name,

        relatedStoryQueries,

        queryCandidateCounts:
          relatedStoryQueries.map(
            (
              relatedStoryQuery,
              index
            ) => ({
              query:
                relatedStoryQuery,
              candidateCount:
                queryResults[index]
                  ?.length ?? 0,
            })
          ),

        relatedCandidates:
          relatedArticles.length,

        uniqueCandidates:
          combined.length,

        selectedSources:
          rankedArticles.map(
            (source) => ({
              source:
                source.article
                  .source.name,
              title:
                source.article.title,
              rated:
                source.sourceRating
                  .isRated,
              primary:
                source.isPrimary,
              relevanceScore:
                calculateRelevanceScore(
                  source.article,
                  primaryArticle
                ),
            })
          ),
      }
    );

    return rankedArticles.length > 0
      ? rankedArticles
      : [
          createPrimarySource(
            primaryArticle
          ),
        ];
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name ===
        "AbortError"
    ) {
      console.warn(
        `Related-source gathering exceeded ${SOURCE_GATHER_TIMEOUT_MS}ms. Continuing with the primary article.`
      );
    } else {
      console.error(
        "Failed to gather multi-source intelligence:",
        error
      );
    }

    return [
      createPrimarySource(
        primaryArticle
      ),
    ];
  } finally {
    clearTimeout(timeoutId);
  }
}
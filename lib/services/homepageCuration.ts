import type { Article } from "@/app/types/article";
import type {
  HomepageCuration,
  StoryGeography,
  StoryTopic,
} from "@/app/types/article";

import { getSourceRating } from "@/lib/services/sourceRanking";

export type HomepageArticleInput = {
  title?: string | null;
  description?: string | null;
  url?: string | null;
  urlToImage?: string | null;
  publishedAt?: string | null;
  source?: {
    name?: string | null;
  };
  acquisitionPools?: string[];
};

const MAX_HOMEPAGE_STORIES = 28;
const BIG_STORY_COUNT = 4;
const TRENDING_COUNT = 3;
const CLUSTER_MAX_HOURS = 42;
const GENERIC_TOKENS = new Set([
  "trump",
  "biden",
  "harris",
  "obama",
  "president",
  "presidents",
  "republican",
  "republicans",
  "democrat",
  "democrats",
  "democratic",
  "gop",
  "senate",
  "senator",
  "senators",
  "congress",
  "congressional",
  "house",
  "white",
  "court",
  "supreme",
  "federal",
  "government",
  "governments",
  "official",
  "officials",
  "administration",
  "washington",
  "america",
  "american",
  "americans",
  "united",
  "states",
  "party",
  "parties",
  "people",
  "year",
  "years",
  "day",
  "days",
  "new",
  "latest",
  "report",
  "reports",
  "says",
  "said",
  "after",
  "over",
  "into",
  "from",
  "with",
  "against",
  "amid",
]);

const TOKEN_ALIASES: Record<string, string> = {
  bills: "bill",
  legislation: "bill",
  legislative: "bill",
  act: "bill",
  acts: "bill",
  failed: "fail",
  fails: "fail",
  failing: "fail",
  failure: "fail",
  stalled: "fail",
  stalls: "fail",
  blocked: "fail",
  blocks: "fail",
  rejected: "fail",
  cryptocurrency: "crypto",
  cryptocurrencies: "crypto",
  bitcoin: "crypto",
  impeachment: "impeach",
  impeached: "impeach",
  impeaches: "impeach",
  closed: "close",
  closing: "close",
  closes: "close",
  ballots: "ballot",
  voting: "vote",
  shutter: "close",
  shuttered: "close",
  ctr: "center",
};

const US_NATIONAL_TERMS = [
  "united states",
  "u.s.",
  "u.s.a",
  "usa ",
  "american ",
  "washington",
  "white house",
  "capitol hill",
  "u.s. senate",
  "us senate",
  "u.s. house",
  "house of representatives",
  "supreme court",
  "federal reserve",
  "pentagon",
  "department of justice",
  "justice department",
  "homeland security",
  "state department",
  "defense department",
  "treasury department",
  "congress",
  "congressional",
  "midterm",
  "electoral college",
  "federal government",
  "oval office",
  "fbi",
  "cia",
  "irs",
  "sec ",
  "fda",
  "doj",
  "dhs",
];

const GLOBAL_IMPORTANCE_TERMS = [
  "war ",
  "warfare",
  "invasion",
  "ceasefire",
  "cease-fire",
  "airstrike",
  "missile",
  "nuclear",
  "nato",
  "united nations",
  "security council",
  "geopolitical",
  "sanctions",
  "humanitarian",
  "earthquake",
  "hurricane",
  "typhoon",
  "wildfire",
  "pandemic",
  "coup",
  "cease fire",
  "hostage",
  "troops",
  "military offensive",
];

const FOREIGN_LOCAL_TERMS = [
  "nigeria",
  "nigerian",
  "tinubu",
  "lagos",
  "abuja",
  "apc gov",
  "rainbow coalition",
  "wike",
  "fayose",
  "kerala",
  "uttar pradesh",
  "andhra",
  "telangana",
  "west bengal",
  "maharashtra",
  "lok sabha",
  "vidhan sabha",
  "auto drivers",
  "hong kong: auto",
];

const WORLD_PLACE_TERMS = [
  "ukraine",
  "russia",
  "china",
  "beijing",
  "moscow",
  "israel",
  "gaza",
  "iran",
  "taiwan",
  "nato",
  "europe",
  "european union",
  "britain",
  "united kingdom",
  "india",
  "pakistan",
  "north korea",
  "south korea",
  "japan",
  "mexico",
  "canada",
  "brazil",
  "nigeria",
  "kenya",
  "south africa",
  "lithuania",
  "poland",
  "saudi",
  "qatar",
  "turkey",
  "syria",
  "lebanon",
  "yemen",
  "sudan",
  "venezuela",
  "hong kong",
  "kerala",
  "belarus",
  "lukashenko",
];

const TOPIC_RULES: { topic: StoryTopic; terms: string[] }[] = [
  {
    topic: "ECONOMY",
    terms: [
      "inflation",
      "interest rate",
      "federal reserve",
      "the fed",
      "gdp",
      "tariff",
      "trade war",
      "unemployment",
      "jobs report",
      "recession",
      "budget",
      "debt ceiling",
      "shutdown",
    ],
  },
  {
    topic: "TECHNOLOGY",
    terms: [
      "artificial intelligence",
      " ai ",
      "crypto",
      "cryptocurrency",
      "cyber",
      "semiconductor",
      "chip",
      "apple",
      "google",
      "microsoft",
      "meta ",
      "software",
      "app store",
    ],
  },
  {
    topic: "HEALTH",
    terms: [
      "health",
      "hospital",
      "vaccine",
      "fda",
      "medicare",
      "medicaid",
      "cancer",
      "outbreak",
      "cdc",
      "medical",
    ],
  },
  {
    topic: "BUSINESS",
    terms: [
      "earnings",
      "merger",
      "acquisition",
      "ceo",
      "shareholders",
      "startup",
      "antitrust",
    ],
  },
  {
    topic: "CULTURE",
    terms: [
      "kennedy center",
      "performing arts",
      "broadway",
      "museum",
      "concert hall",
      "arts venue",
      "national gallery",
    ],
  },
  {
    topic: "WORLD",
    terms: [
      "invasion",
      "ceasefire",
      "nato",
      "united nations",
      "geopolitical",
      "airstrike",
      "missile strike",
      "at war",
      "declares war",
      "weapons in space",
      "space weapons",
      "deployed weapons",
    ],
  },
  {
    topic: "POLITICS",
    terms: [
      "congress",
      "senate",
      "impeach",
      "election",
      "primary",
      "governor",
      "legislature",
      "white house",
      "supreme court",
      "ballot",
      "voting",
      "lawmakers",
      "cloture",
    ],
  },
];

const LOW_IMPORTANCE_TERMS = [
  "baffled",
  "shtick",
  "celebrity",
  "op-ed",
  "opinion:",
  "columnist",
  "what was that",
  "human interest",
  "auto drivers",
  "cancer-care",
  "goes global",
  "smacked down",
  "talking points",
  "doozy",
  "exclusive:",
  "forgot how",
  "if he ever knew",
  "messi",
  "soccer",
  "farewell to argentina",
];

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
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
  "after",
  "over",
  "amid",
  "just",
  "could",
  "would",
  "may",
  "says",
  "say",
  "said",
]);

function articleText(article: HomepageArticleInput): string {
  return `${article.title ?? ""} ${article.description ?? ""}`.toLowerCase();
}

function containsAny(haystack: string, terms: string[]): boolean {
  return terms.some((term) => haystack.includes(term));
}

function countMatches(haystack: string, terms: string[]): number {
  return terms.reduce(
    (count, term) => (haystack.includes(term) ? count + 1 : count),
    0
  );
}

const DOMESTIC_STORY_TERMS = [
  "tax",
  "crypto",
  "clarity act",
  "shutdown",
  "impeach",
  "mail ballot",
  "mail-in",
  "voting rights",
  "app store",
  "kennedy center",
  "midterm",
  "senate race",
  "house race",
  "federal reserve",
  "debt ceiling",
];

const US_INVOLVEMENT_WORLD_TERMS = [
  "sanctions",
  "envoy",
  "ambassador",
  "foreign leader",
  "diplomatic",
  "diplomacy",
  "ceasefire",
  "invasion",
  "troops",
  "hostage",
  "peace talks",
  "meets u.s.",
  "meets us ",
  "u.s. envoy",
  "iran war",
  "weapons in space",
  "space weapons",
  "china and russia",
];

export function classifyGeography(
  article: HomepageArticleInput
): StoryGeography {
  const text = articleText(article);
  const usHits = countMatches(text, US_NATIONAL_TERMS);
  const worldHits = countMatches(text, WORLD_PLACE_TERMS);
  const foreignLocal = containsAny(text, FOREIGN_LOCAL_TERMS);
  const domesticStory = containsAny(text, DOMESTIC_STORY_TERMS);
  const usInvolvementWorld = containsAny(text, US_INVOLVEMENT_WORLD_TERMS);

  if (foreignLocal && usHits === 0) {
    return "WORLD";
  }

  if (worldHits > 0 && usInvolvementWorld && !domesticStory) {
    return "WORLD";
  }

  if (worldHits > 0 && usHits > 0 && usInvolvementWorld) {
    return "WORLD";
  }

  if (domesticStory && worldHits === 0) {
    return "US";
  }

  if (worldHits >= 2 && !domesticStory) {
    return "WORLD";
  }

  if (usHits > 0 && worldHits > 0) {
    return usHits >= worldHits && !usInvolvementWorld ? "US" : "WORLD";
  }

  if (usHits > 0) {
    return "US";
  }

  if (
    !foreignLocal &&
    worldHits === 0 &&
    /\b(senate|congress|white house|capitol hill|supreme court)\b/.test(text)
  ) {
    return "US";
  }

  if (worldHits > 0 || foreignLocal) {
    return "WORLD";
  }

  return "UNKNOWN";
}

export function classifyTopic(article: HomepageArticleInput): StoryTopic {
  const padded = ` ${articleText(article)} `;
  const legislativeProcess =
    /\b(senate|congress|cloture|lawmakers)\b/.test(padded) &&
    /\b(bill|legislation|act|vote|impeach)\b/.test(padded);

  if (legislativeProcess && !padded.includes("app store")) {
    return "POLITICS";
  }

  for (const rule of TOPIC_RULES) {
    if (rule.terms.some((term) => padded.includes(term))) {
      return rule.topic;
    }
  }

  return "OTHER";
}

export function displayCategory(
  geography: StoryGeography,
  topic: StoryTopic
): string {
  if (geography === "WORLD") {
    return "World";
  }

  if (topic === "CULTURE" && geography === "US") {
    return "U.S.";
  }

  if (geography === "US" && (topic === "POLITICS" || topic === "WORLD")) {
    return "U.S. Politics";
  }

  if (topic === "ECONOMY") {
    return "Economy";
  }

  if (topic === "TECHNOLOGY") {
    return "Technology";
  }

  if (topic === "HEALTH") {
    return "Health";
  }

  if (topic === "BUSINESS") {
    return "Business";
  }

  if (topic === "POLITICS") {
    return "Politics";
  }

  if (topic === "WORLD") {
    return "World";
  }

  return "Other";
}

export function classifyStory(article: HomepageArticleInput): {
  geography: StoryGeography;
  topic: StoryTopic;
  category: string;
} {
  const geography = classifyGeography(article);
  const topic = classifyTopic(article);

  return {
    geography,
    topic,
    category: displayCategory(geography, topic),
  };
}

function normalizeToken(token: string): string {
  return TOKEN_ALIASES[token] ?? token;
}

function stemToken(token: string): string {
  if (token.endsWith("ies") && token.length > 5) {
    return `${token.slice(0, -3)}y`;
  }

  if (token.endsWith("s") && !token.endsWith("ss") && token.length > 4) {
    return token.slice(0, -1);
  }

  return token;
}

function titleTokens(title: string): string[] {
  return Array.from(
    new Set(
      title
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .split(/\s+/)
        .map((word) => stemToken(normalizeToken(word.trim())))
        .filter(
          (word) =>
            word.length >= 3 &&
            !STOP_WORDS.has(word) &&
            !GENERIC_TOKENS.has(word)
        )
    )
  );
}

function hoursApart(left: string, right: string): number {
  const leftTime = Date.parse(left);
  const rightTime = Date.parse(right);

  if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
    return 0;
  }

  return Math.abs(leftTime - rightTime) / 3_600_000;
}

function shouldCluster(left: HomepageArticleInput, right: HomepageArticleInput): boolean {
  const leftTitle = left.title?.trim() ?? "";
  const rightTitle = right.title?.trim() ?? "";

  if (!leftTitle || !rightTitle) {
    return false;
  }

  const leftTokens = titleTokens(leftTitle);
  const rightTokens = titleTokens(rightTitle);

  if (leftTokens.length < 2 || rightTokens.length < 2) {
    return false;
  }

  const rightSet = new Set(rightTokens);
  const overlap = leftTokens.filter((token) => rightSet.has(token));
  const smaller = Math.min(leftTokens.length, rightTokens.length);
  const jaccard =
    overlap.length /
    new Set([...leftTokens, ...rightTokens]).size;

  const publishedDelta = hoursApart(
    left.publishedAt ?? "",
    right.publishedAt ?? ""
  );

  if (publishedDelta > CLUSTER_MAX_HOURS) {
    return false;
  }

  const hasAnchor = overlap.some(
    (token) =>
      token.length >= 6 ||
      token === "iran" ||
      token === "ballot" ||
      token === "nato" ||
      token === "crypto"
  );

  if (hasAnchor && overlap.length >= 2 && jaccard >= 0.16) {
    return true;
  }

  if (overlap.length >= 3 && jaccard >= 0.22) {
    return true;
  }

  return overlap.length >= 2 && jaccard >= 0.24 && smaller >= 3;
}

type ScoredCluster = {
  representative: HomepageArticleInput;
  members: HomepageArticleInput[];
  geography: StoryGeography;
  topic: StoryTopic;
  category: string;
  score: number;
  recencyScore: number;
  reasons: string[];
  acquisitionPools: string[];
};

function recencyScore(publishedAt: string | null | undefined, now: number): number {
  const published = publishedAt ? Date.parse(publishedAt) : Number.NaN;

  if (Number.isNaN(published)) {
    return 28;
  }

  const hours = Math.max(0, (now - published) / 3_600_000);
  return Math.round(Math.exp(-hours / 48) * 100);
}

function usNationalScore(article: HomepageArticleInput, geography: StoryGeography): number {
  const text = articleText(article);
  const matches = countMatches(text, US_NATIONAL_TERMS);
  let score = Math.min(100, matches * 18);

  if (geography === "US") {
    score = Math.max(score, 58);
  }

  if (containsAny(text, FOREIGN_LOCAL_TERMS)) {
    score = Math.min(score, 12);
  }

  return Math.max(0, Math.min(100, score));
}

function globalImportanceScore(
  article: HomepageArticleInput,
  geography: StoryGeography
): number {
  const text = articleText(article);
  const matches = countMatches(text, GLOBAL_IMPORTANCE_TERMS);
  let score = Math.min(100, matches * 22);

  if (geography === "WORLD" && matches > 0) {
    score = Math.max(score, 62);
  }

  if (containsAny(text, FOREIGN_LOCAL_TERMS) && matches === 0) {
    score = Math.min(score, 10);
  }

  return Math.max(0, Math.min(100, score));
}

function topicImportanceScore(article: HomepageArticleInput): number {
  const text = articleText(article);
  let score = 54;

  if (
    text.includes("shutdown") ||
    text.includes("impeach") ||
    text.includes("supreme court") ||
    text.includes("federal reserve") ||
    text.includes("cloture") ||
    text.includes("invasion") ||
    text.includes("ceasefire")
  ) {
    score += 22;
  }

  if (containsAny(text, LOW_IMPORTANCE_TERMS)) {
    score -= 36;
  }

  return Math.max(8, Math.min(100, score));
}

function coverageScore(clusterSize: number): number {
  return Math.min(100, 24 + (clusterSize - 1) * 28);
}

const AGGREGATOR_HOST_HINTS = [
  "biztoc.com",
  "slashdot.org",
  "msn.com",
  "news.yahoo.com",
  "dailyhodl.com",
  "newser.com",
  "newsbreak.com",
  "smartnews.com",
];

const LOW_QUALITY_HOST_HINTS = [
  "radaronline",
  "newser.com",
  "freerepublic",
  "dailyhodl",
  "macdailynews",
  "lawyersgunsmoney",
];

function articleHost(article: HomepageArticleInput): string {
  try {
    return article.url ? new URL(article.url).hostname.toLowerCase() : "";
  } catch {
    return "";
  }
}

function isAggregatorArticle(article: HomepageArticleInput): boolean {
  const host = articleHost(article);
  const name = (article.source?.name ?? "").toLowerCase();

  return AGGREGATOR_HOST_HINTS.some(
    (hint) => host.includes(hint) || name.includes(hint.replace(".com", ""))
  );
}

function isLowQualityHost(article: HomepageArticleInput): boolean {
  const host = articleHost(article);
  const name = (article.source?.name ?? "").toLowerCase();

  return LOW_QUALITY_HOST_HINTS.some(
    (hint) => host.includes(hint) || name.includes(hint)
  );
}

function articleCompleteness(article: HomepageArticleInput): number {
  const description = article.description?.trim() ?? "";
  const title = article.title?.trim() ?? "";
  let score = 0;

  if (article.urlToImage?.trim()) {
    score += 28;
  }

  if (description.length >= 120) {
    score += 36;
  } else if (description.length >= 40) {
    score += 18;
  }

  if (title.length >= 24 && title.length <= 140) {
    score += 16;
  }

  if (!/^watch:/i.test(title)) {
    score += 10;
  }

  return score;
}

function sourceQualityScore(article: HomepageArticleInput): number {
  if (isAggregatorArticle(article) || isLowQualityHost(article)) {
    return 34;
  }

  const rating = getSourceRating(
    article.source?.name ?? "",
    article.url
  );

  if (!rating.isRated) {
    return 62;
  }

  return rating.reliability;
}

function representativeScore(
  article: HomepageArticleInput,
  now: number,
  preferRated: boolean
): number {
  const rating = getSourceRating(
    article.source?.name ?? "",
    article.url
  );
  const quality = sourceQualityScore(article);
  const completeness = articleCompleteness(article);
  const recency = recencyScore(article.publishedAt, now);
  let score =
    quality * 0.48 + completeness * 0.24 + recency * 0.18;

  if (article.urlToImage?.trim()) {
    score += 8;
  }

  if (preferRated && rating.isRated && !isAggregatorArticle(article)) {
    score += 22;
  }

  if (isAggregatorArticle(article) || isLowQualityHost(article)) {
    score -= 20;
  }

  return score;
}

function pickRepresentative(
  members: HomepageArticleInput[],
  now: number,
  preferRated: boolean
): HomepageArticleInput {
  const ratedOriginal = members.filter((member) => {
    const rating = getSourceRating(
      member.source?.name ?? "",
      member.url
    );
    return rating.isRated && !isAggregatorArticle(member) && !isLowQualityHost(member);
  });
  const original = members.filter(
    (member) => !isAggregatorArticle(member) && !isLowQualityHost(member)
  );
  const notAggregator = members.filter((member) => !isAggregatorArticle(member));

  const pool =
    preferRated && ratedOriginal.length > 0
      ? ratedOriginal
      : original.length > 0
        ? original
        : notAggregator.length > 0
          ? notAggregator
          : members;

  return [...pool].sort(
    (left, right) =>
      representativeScore(right, now, preferRated) -
      representativeScore(left, now, preferRated)
  )[0];
}

function isObscureForeignLocal(article: HomepageArticleInput): boolean {
  const text = articleText(article);
  const sourceName = (article.source?.name ?? "").toLowerCase();
  const foreignPublisher =
    sourceName.includes("the punch") ||
    sourceName === "vanguard" ||
    sourceName.includes("conversation africa");

  if (
    (containsAny(text, FOREIGN_LOCAL_TERMS) || foreignPublisher) &&
    globalImportanceScore(article, "WORLD") < 48
  ) {
    return true;
  }

  const classified = classifyStory(article);
  return (
    classified.geography === "UNKNOWN" &&
    usNationalScore(article, classified.geography) < 40 &&
    globalImportanceScore(article, classified.geography) < 40
  );
}

function subjectKeys(article: HomepageArticleInput): string[] {
  const title = article.title ?? "";
  const kept = title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .map((word) => stemToken(normalizeToken(word.trim())))
    .filter((word) =>
      ["supreme", "court", "senate", "congress", "ballot", "iran"].includes(
        word
      )
    );

  return Array.from(
    new Set([
      ...kept,
      ...titleTokens(title).filter((token) => token.length >= 4),
    ])
  ).slice(0, 8);
}

function sharesSoftSubject(
  candidate: HomepageArticleInput,
  occupied: HomepageArticleInput[]
): boolean {
  const candidateKeys = new Set(subjectKeys(candidate));

  return occupied.some((article) => {
    const shared = subjectKeys(article).filter((key) =>
      candidateKeys.has(key)
    );

    return (
      shared.some(
        (key) =>
          key.length >= 5 ||
          key === "iran" ||
          key === "nato" ||
          key === "mail"
      ) || shared.length >= 2
    );
  });
}

function scoreCluster(
  members: HomepageArticleInput[],
  now: number
): ScoredCluster {
  const recency = Math.max(
    ...members.map((member) => recencyScore(member.publishedAt, now))
  );
  const usNational = Math.max(
    ...members.map((member) =>
      usNationalScore(member, classifyGeography(member))
    )
  );
  const globalImportance = Math.max(
    ...members.map((member) =>
      globalImportanceScore(member, classifyGeography(member))
    )
  );
  const topicImportance = Math.max(
    ...members.map((member) => topicImportanceScore(member))
  );
  const coverage = coverageScore(members.length);
  const quality = Math.max(
    ...members.map((member) => sourceQualityScore(member))
  );
  const representative = pickRepresentative(members, now, true);
  const classified = classifyStory(representative);
  const acquisitionPools = Array.from(
    new Set(
      members.flatMap((member) => member.acquisitionPools ?? [])
    )
  );

  let score = Math.round(
    recency * 0.22 +
      usNational * 0.26 +
      globalImportance * 0.18 +
      topicImportance * 0.12 +
      coverage * 0.12 +
      quality * 0.1
  );

  if (
    acquisitionPools.includes("us-headlines") &&
    classified.topic !== "OTHER"
  ) {
    score += 3;
  }

  if (
    acquisitionPools.includes("world") &&
    classified.geography === "WORLD"
  ) {
    score += 4;
  }

  if (
    classified.topic === "OTHER" &&
    members.length === 1 &&
    classified.geography !== "WORLD"
  ) {
    score -= 10;
  }

  if (members.some((member) => isObscureForeignLocal(member))) {
    score -= 30;
  }

  score = Math.max(0, Math.min(100, score));

  const reasons: string[] = [];

  if (recency >= 70) {
    reasons.push("recent");
  }

  if (usNational >= 58) {
    reasons.push("U.S. national relevance");
  }

  if (globalImportance >= 60) {
    reasons.push("major global importance");
  }

  if (members.length > 1) {
    reasons.push(`${members.length} related publishers in feed`);
  }

  if (quality >= 88) {
    reasons.push("high source reliability available in cluster");
  }

  if (acquisitionPools.includes("us-headlines")) {
    reasons.push("also in U.S. top headlines");
  }

  if (acquisitionPools.includes("world")) {
    reasons.push("world discovery pool");
  }

  if (topicImportance <= 30) {
    reasons.push("lower topical importance");
  }

  return {
    representative,
    members,
    geography: classified.geography,
    topic: classified.topic,
    category: classified.category,
    score,
    recencyScore: recency,
    reasons,
    acquisitionPools,
  };
}

function clusterArticles(articles: HomepageArticleInput[]): HomepageArticleInput[][] {
  const clusters: HomepageArticleInput[][] = [];
  const assigned = new Set<string>();

  for (const article of articles) {
    const url = article.url?.trim() ?? "";

    if (!url || assigned.has(url)) {
      continue;
    }

    const cluster = [article];
    assigned.add(url);

    for (const candidate of articles) {
      const candidateUrl = candidate.url?.trim() ?? "";

      if (!candidateUrl || assigned.has(candidateUrl)) {
        continue;
      }

      if (cluster.some((member) => shouldCluster(member, candidate))) {
        cluster.push(candidate);
        assigned.add(candidateUrl);
      }
    }

    clusters.push(cluster);
  }

  return mergeRelatedClusters(clusters);
}

function mergeRelatedClusters(
  clusters: HomepageArticleInput[][]
): HomepageArticleInput[][] {
  const merged: HomepageArticleInput[][] = [];
  const used = new Set<number>();

  for (let index = 0; index < clusters.length; index += 1) {
    if (used.has(index)) {
      continue;
    }

    let current = [...clusters[index]];
    used.add(index);
    let changed = true;

    while (changed) {
      changed = false;

      for (let other = 0; other < clusters.length; other += 1) {
        if (used.has(other)) {
          continue;
        }

        const isRelated = current.some((left) =>
          clusters[other].some((right) => shouldCluster(left, right))
        );

        if (isRelated) {
          current = current.concat(clusters[other]);
          used.add(other);
          changed = true;
        }
      }
    }

    merged.push(current);
  }

  return merged;
}

function publisherKey(article: HomepageArticleInput): string {
  return (article.source?.name ?? "unknown").trim().toLowerCase();
}

function pickDiverse(
  ranked: ScoredCluster[],
  count: number,
  excluded: Set<string>,
  options?: {
    maxPerPublisher?: number;
    preferTopicMix?: boolean;
    recencyBias?: boolean;
    skipObscureForeignLocal?: boolean;
    avoidSubjectsFrom?: HomepageArticleInput[];
    publisherCounts?: Map<string, number>;
    topicCounts?: Map<string, number>;
  }
): ScoredCluster[] {
  const selected: ScoredCluster[] = [];
  const publisherCounts = options?.publisherCounts ?? new Map<string, number>();
  const topicCounts = options?.topicCounts ?? new Map<string, number>();
  const maxPerPublisher = options?.maxPerPublisher ?? 1;
  const occupiedSubjects = options?.avoidSubjectsFrom ?? [];

  const pool = options?.recencyBias
    ? [...ranked].sort(
        (left, right) =>
          right.recencyScore * 0.55 +
          right.score * 0.45 -
          (left.recencyScore * 0.55 + left.score * 0.45)
      )
    : ranked;

  for (const cluster of pool) {
    if (selected.length >= count) {
      break;
    }

    const url = cluster.representative.url?.trim() ?? "";

    if (!url || excluded.has(url)) {
      continue;
    }

    if (
      options?.skipObscureForeignLocal &&
      (isObscureForeignLocal(cluster.representative) ||
        (cluster.geography === "UNKNOWN" && cluster.score < 52) ||
        containsAny(articleText(cluster.representative), [
          "messi",
          "soccer",
          "nba",
          "nfl",
          "worldsoccer",
        ]) ||
        (cluster.topic === "OTHER" &&
          cluster.members.length === 1 &&
          cluster.geography !== "WORLD" &&
          globalImportanceScore(cluster.representative, cluster.geography) < 48))
    ) {
      continue;
    }

    if (
      (occupiedSubjects.length > 0 || selected.length > 0) &&
      sharesSoftSubject(cluster.representative, [
        ...occupiedSubjects,
        ...selected.map((item) => item.representative),
      ])
    ) {
      continue;
    }

    const publisher = publisherKey(cluster.representative);
    const publisherCount = publisherCounts.get(publisher) ?? 0;
    const aggregatorOnly = cluster.members.every((member) =>
      isAggregatorArticle(member)
    );

    if (
      aggregatorOnly &&
      options?.skipObscureForeignLocal &&
      pool.some((candidate) => {
        const candidateUrl = candidate.representative.url?.trim() ?? "";
        return (
          candidateUrl &&
          !excluded.has(candidateUrl) &&
          !candidate.members.every((member) => isAggregatorArticle(member)) &&
          candidate.score >= cluster.score - 10
        );
      })
    ) {
      continue;
    }

    if (publisherCount >= maxPerPublisher && pool.length - selected.length > 3) {
      continue;
    }

    if (options?.preferTopicMix) {
      const topicCount = topicCounts.get(cluster.category) ?? 0;
      const nextDiverse = pool.find((candidate) => {
        const candidateUrl = candidate.representative.url?.trim() ?? "";
        return (
          candidateUrl &&
          !excluded.has(candidateUrl) &&
          candidate.category !== cluster.category &&
          candidate.score >= cluster.score - 10
        );
      });

      if (topicCount >= 2 && nextDiverse && cluster.score - nextDiverse.score < 12) {
        continue;
      }
    }

    selected.push(cluster);
    excluded.add(url);
    publisherCounts.set(publisher, publisherCount + 1);
    topicCounts.set(cluster.category, (topicCounts.get(cluster.category) ?? 0) + 1);
  }

  if (selected.length < count) {
    for (const cluster of ranked) {
      if (selected.length >= count) {
        break;
      }

      const url = cluster.representative.url?.trim() ?? "";

      if (!url || excluded.has(url)) {
        continue;
      }

      if (
        options?.skipObscureForeignLocal &&
        (isObscureForeignLocal(cluster.representative) ||
          (cluster.geography === "UNKNOWN" && cluster.score < 52))
      ) {
        continue;
      }

      selected.push(cluster);
      excluded.add(url);
    }
  }

  return selected;
}

function toArticle(
  cluster: ScoredCluster,
  selectionReason: string,
  now: number,
  preferRated: boolean
): Article {
  const representative = pickRepresentative(
    cluster.members,
    now,
    preferRated
  );
  const classified = classifyStory(representative);
  const relatedSources = Array.from(
    new Set(
      cluster.members
        .map((member) => member.source?.name?.trim())
        .filter((name): name is string => Boolean(name))
    )
  );

  const curation: HomepageCuration = {
    category: classified.category,
    geography: classified.geography,
    topic: classified.topic,
    clusterSize: cluster.members.length,
    relatedSources,
    score: cluster.score,
    selectionReason: [selectionReason, ...cluster.reasons].join("; "),
    acquisitionPools: Array.from(
      new Set([
        ...cluster.acquisitionPools,
        ...(representative.acquisitionPools ?? []),
      ])
    ),
  };

  return {
    title: representative.title?.trim() ?? "",
    description: representative.description?.trim() ?? "",
    url: representative.url?.trim() ?? "",
    urlToImage: representative.urlToImage?.trim() ?? "",
    publishedAt: representative.publishedAt?.trim() ?? "",
    source: {
      name: representative.source?.name?.trim() ?? "Unknown",
    },
    curation,
  };
}

export function curateHomepageFeed(
  articles: HomepageArticleInput[],
  now = Date.now()
): Article[] {
  const usable = articles.filter(
    (article) => article.title?.trim() && article.url?.trim()
  );
  const clusters = clusterArticles(usable).map((members) =>
    scoreCluster(members, now)
  );
  const ranked = [...clusters].sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }

    if (right.members.length !== left.members.length) {
      return right.members.length - left.members.length;
    }

    return right.recencyScore - left.recencyScore;
  });
  const excluded = new Set<string>();
  const publisherCounts = new Map<string, number>();
  const topicCounts = new Map<string, number>();

  const lead = pickDiverse(ranked, 1, excluded, {
    maxPerPublisher: 1,
    skipObscureForeignLocal: true,
    publisherCounts,
    topicCounts,
  })[0];
  const big = pickDiverse(ranked, BIG_STORY_COUNT, excluded, {
    maxPerPublisher: 1,
    preferTopicMix: true,
    skipObscureForeignLocal: true,
    avoidSubjectsFrom: lead ? [lead.representative] : [],
    publisherCounts,
    topicCounts,
  });
  const trending = pickDiverse(ranked, TRENDING_COUNT, excluded, {
    maxPerPublisher: 1,
    recencyBias: true,
    skipObscureForeignLocal: true,
    avoidSubjectsFrom: [
      ...(lead ? [lead.representative] : []),
      ...big.map((cluster) => cluster.representative),
    ],
    publisherCounts,
  });

  const remaining = ranked.filter((cluster) => {
    const url = cluster.representative.url?.trim() ?? "";
    return (
      url &&
      !excluded.has(url) &&
      !isObscureForeignLocal(cluster.representative)
    );
  });

  const ordered = [
    ...(lead ? [toArticle(lead, "Today's Top Story", now, true)] : []),
    ...big.map((cluster, index) =>
      toArticle(cluster, `Big Stories #${index + 1}`, now, true)
    ),
    ...trending.map((cluster, index) =>
      toArticle(cluster, `Trending Today #${index + 1}`, now, true)
    ),
    ...remaining.map((cluster) =>
      toArticle(cluster, "More Stories", now, false)
    ),
  ];

  return ordered.slice(0, MAX_HOMEPAGE_STORIES);
}

export function analyzeNewsApiPool(articles: HomepageArticleInput[]) {
  const usable = articles.filter(
    (article) => article.title?.trim() && article.url?.trim()
  );
  const publishers = new Map<string, number>();
  const ratedPublisherNames = new Set<string>();
  let usNational = 0;
  let majorWorld = 0;
  let foreignLocal = 0;
  let otherWorld = 0;
  let unknown = 0;
  let rated = 0;
  let unrated = 0;

  for (const article of usable) {
    const classified = classifyStory(article);
    const publisher = article.source?.name?.trim() || "Unknown";
    publishers.set(publisher, (publishers.get(publisher) ?? 0) + 1);

    if (getSourceRating(publisher, article.url).isRated) {
      rated += 1;
      ratedPublisherNames.add(publisher);
    } else {
      unrated += 1;
    }

    if (isObscureForeignLocal(article)) {
      foreignLocal += 1;
      continue;
    }

    if (
      classified.geography === "WORLD" &&
      globalImportanceScore(article, "WORLD") >= 48
    ) {
      majorWorld += 1;
      continue;
    }

    if (classified.geography === "US") {
      usNational += 1;
      continue;
    }

    if (classified.geography === "WORLD") {
      otherWorld += 1;
      continue;
    }

    unknown += 1;
  }

  const clusters = clusterArticles(usable);
  const topPublishers = [...publishers.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 12)
    .map(([name, count]) => ({ name, count }));
  const unratedPublishers = new Map<string, number>();

  for (const article of usable) {
    const publisher = article.source?.name?.trim() || "Unknown";

    if (!getSourceRating(publisher, article.url).isRated) {
      unratedPublishers.set(
        publisher,
        (unratedPublishers.get(publisher) ?? 0) + 1
      );
    }
  }

  const uniqueToPool = {
    "us-headlines": 0,
    discovery: 0,
    world: 0,
    mixed: 0,
    none: 0,
  };

  for (const article of usable) {
    const pools = article.acquisitionPools ?? [];

    if (pools.length === 0) {
      uniqueToPool.none += 1;
    } else if (pools.length > 1) {
      uniqueToPool.mixed += 1;
    } else if (pools[0] === "us-headlines") {
      uniqueToPool["us-headlines"] += 1;
    } else if (pools[0] === "discovery") {
      uniqueToPool.discovery += 1;
    } else if (pools[0] === "world") {
      uniqueToPool.world += 1;
    }
  }

  return {
    usableArticles: usable.length,
    usNational,
    majorWorld,
    foreignLocal,
    otherWorld,
    unknown,
    ratedSources: rated,
    unratedSources: unrated,
    distinctRatedPublishers: ratedPublisherNames.size,
    distinctClusters: clusters.length,
    topPublishers,
    largestPublisherShare:
      usable.length === 0
        ? 0
        : Math.round(
            ((topPublishers[0]?.count ?? 0) / usable.length) * 1000
          ) / 10,
    uniqueToPool,
    ratedPublishers: [...ratedPublisherNames]
      .map((name) => ({ name, count: publishers.get(name) ?? 0 }))
      .sort((left, right) => right.count - left.count),
    unratedPublishers: [...unratedPublishers.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 20)
      .map(([name, count]) => ({ name, count })),
  };
}

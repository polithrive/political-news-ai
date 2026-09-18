export type PoliticalLean =
  | "Left"
  | "Center"
  | "Right"
  | "Mixed";

export type OwnershipType =
  | "Private"
  | "Public"
  | "Government"
  | "Nonprofit"
  | "Cooperative"
  | "Unknown";

export type SourceRating = {
  /*
   * Whether PoliticalPulse has an established
   * source-quality profile for this publication.
   *
   * When false, reliability and factualReporting
   * must NOT be treated as researched ratings.
   */
  isRated: boolean;

  reliability: number;
  factualReporting: number;

  politicalLean: PoliticalLean;

  displayName: string;
  country: string;
  ownershipType: OwnershipType;

  editorialApproach: string;
  description: string;
  website: string;

  biasExplanation: string;
  trustSummary: string;
};

const SOURCE_DATABASE: Record<
  string,
  SourceRating
> = {
  Reuters: {
    isRated: true,

    reliability: 98,
    factualReporting: 99,
    politicalLean: "Center",

    displayName: "Reuters",
    country: "United Kingdom",
    ownershipType: "Private",

    editorialApproach:
      "Global wire service focused on factual reporting and speed.",

    description:
      "One of the world's largest international news organizations.",

    website: "https://www.reuters.com",

    biasExplanation:
      "Generally regarded as centrist because reporting emphasizes factual coverage with limited editorial language.",

    trustSummary:
      "Excellent reputation for factual reporting and broad international coverage.",
  },

  "Associated Press": {
    isRated: true,

    reliability: 98,
    factualReporting: 99,
    politicalLean: "Center",

    displayName: "Associated Press",
    country: "United States",
    ownershipType: "Cooperative",

    editorialApproach:
      "Independent cooperative providing factual reporting to media organizations worldwide.",

    description:
      "One of the oldest and most respected wire services.",

    website: "https://apnews.com",

    biasExplanation:
      "Generally viewed as centrist due to strong editorial standards and broad use across media organizations.",

    trustSummary:
      "Widely trusted for factual reporting and breaking news coverage.",
  },

  "AP News": {
    isRated: true,

    reliability: 98,
    factualReporting: 99,
    politicalLean: "Center",

    displayName: "Associated Press",
    country: "United States",
    ownershipType: "Cooperative",

    editorialApproach:
      "Independent cooperative providing factual reporting to media organizations worldwide.",

    description:
      "Digital publication of the Associated Press.",

    website: "https://apnews.com",

    biasExplanation:
      "Generally viewed as centrist due to strong editorial standards.",

    trustSummary:
      "Highly trusted factual reporting.",
  },

  BBC: {
    isRated: true,

    reliability: 95,
    factualReporting: 96,
    politicalLean: "Center",

    displayName: "BBC News",
    country: "United Kingdom",
    ownershipType: "Public",

    editorialApproach:
      "Public service broadcaster with extensive international reporting.",

    description:
      "One of the world's largest public broadcasters.",

    website: "https://www.bbc.com/news",

    biasExplanation:
      "Generally considered center with emphasis on public service journalism.",

    trustSummary:
      "High-quality international reporting with broad global coverage.",
  },

  NPR: {
    isRated: true,

    reliability: 92,
    factualReporting: 95,
    politicalLean: "Center",

    displayName: "NPR",
    country: "United States",
    ownershipType: "Nonprofit",

    editorialApproach:
      "Public-interest journalism with in-depth explanatory reporting.",

    description:
      "National Public Radio serves a nationwide network of member stations.",

    website: "https://www.npr.org",

    biasExplanation:
      "Coverage is generally factual, though some audiences perceive a slight left-of-center framing.",

    trustSummary:
      "Strong long-form journalism and explanatory reporting.",
  },

  CNN: {
    isRated: true,

    reliability: 88,
    factualReporting: 90,
    politicalLean: "Left",

    displayName: "CNN",
    country: "United States",
    ownershipType: "Private",

    editorialApproach:
      "24-hour television and digital news organization.",

    description:
      "One of the largest cable news organizations in the world.",

    website: "https://www.cnn.com",

    biasExplanation:
      "Often perceived as left-leaning in political coverage while maintaining high factual reporting standards.",

    trustSummary:
      "Strong breaking news operation with broad domestic and international coverage.",
  },

  "Fox News": {
    isRated: true,

    reliability: 84,
    factualReporting: 86,
    politicalLean: "Right",

    displayName: "Fox News",
    country: "United States",
    ownershipType: "Private",

    editorialApproach:
      "Television and digital news organization with opinion programming alongside straight news coverage.",

    description:
      "One of the largest cable news organizations in the United States.",

    website: "https://www.foxnews.com",

    biasExplanation:
      "Often perceived as right-leaning in political coverage while maintaining separate news and opinion programming.",

    trustSummary:
      "Strong political reporting with a conservative editorial reputation.",
  },

  "NBC News": {
    isRated: true,
    reliability: 91,
    factualReporting: 93,
    politicalLean: "Center",
    displayName: "NBC News",
    country: "United States",
    ownershipType: "Private",
    editorialApproach: "Broadcast and digital national news reporting.",
    description: "National broadcast news division of NBC.",
    website: "https://www.nbcnews.com",
    biasExplanation:
      "Generally treated as a mainstream national newsgatherer for reliability scoring.",
    trustSummary: "Established national broadcast reporting.",
  },

  "ABC News": {
    isRated: true,
    reliability: 90,
    factualReporting: 92,
    politicalLean: "Center",
    displayName: "ABC News",
    country: "United States",
    ownershipType: "Private",
    editorialApproach: "Broadcast and digital national news reporting.",
    description: "National broadcast news division of ABC.",
    website: "https://abcnews.go.com",
    biasExplanation:
      "Generally treated as a mainstream national newsgatherer for reliability scoring.",
    trustSummary: "Established national broadcast reporting.",
  },

  "CBS News": {
    isRated: true,
    reliability: 90,
    factualReporting: 92,
    politicalLean: "Center",
    displayName: "CBS News",
    country: "United States",
    ownershipType: "Private",
    editorialApproach: "Broadcast and digital national news reporting.",
    description: "National broadcast news division of CBS.",
    website: "https://www.cbsnews.com",
    biasExplanation:
      "Generally treated as a mainstream national newsgatherer for reliability scoring.",
    trustSummary: "Established national broadcast reporting.",
  },

  "The New York Times": {
    isRated: true,
    reliability: 93,
    factualReporting: 94,
    politicalLean: "Center",
    displayName: "The New York Times",
    country: "United States",
    ownershipType: "Public",
    editorialApproach: "National newspaper with original reporting.",
    description: "Major U.S. newspaper of record.",
    website: "https://www.nytimes.com",
    biasExplanation:
      "Reliability scoring here reflects newsgathering capacity, not viewpoint.",
    trustSummary: "High original-reporting capacity.",
  },

  "The Washington Post": {
    isRated: true,
    reliability: 92,
    factualReporting: 93,
    politicalLean: "Center",
    displayName: "The Washington Post",
    country: "United States",
    ownershipType: "Private",
    editorialApproach: "National newspaper with original reporting.",
    description: "Major U.S. newspaper.",
    website: "https://www.washingtonpost.com",
    biasExplanation:
      "Reliability scoring here reflects newsgathering capacity, not viewpoint.",
    trustSummary: "High original-reporting capacity.",
  },

  "The Wall Street Journal": {
    isRated: true,
    reliability: 94,
    factualReporting: 95,
    politicalLean: "Center",
    displayName: "The Wall Street Journal",
    country: "United States",
    ownershipType: "Private",
    editorialApproach: "National newspaper with strong business reporting.",
    description: "Major U.S. newspaper.",
    website: "https://www.wsj.com",
    biasExplanation:
      "Reliability scoring here reflects newsgathering capacity, not viewpoint.",
    trustSummary: "High original-reporting capacity.",
  },

  Bloomberg: {
    isRated: true,
    reliability: 93,
    factualReporting: 94,
    politicalLean: "Center",
    displayName: "Bloomberg",
    country: "United States",
    ownershipType: "Private",
    editorialApproach: "Financial and national newsgathering.",
    description: "Global business and news organization.",
    website: "https://www.bloomberg.com",
    biasExplanation:
      "Reliability scoring here reflects newsgathering capacity, not viewpoint.",
    trustSummary: "Strong original financial and political reporting.",
  },

  CNBC: {
    isRated: true,
    reliability: 89,
    factualReporting: 90,
    politicalLean: "Center",
    displayName: "CNBC",
    country: "United States",
    ownershipType: "Private",
    editorialApproach: "Business and markets reporting.",
    description: "Business news network.",
    website: "https://www.cnbc.com",
    biasExplanation:
      "Reliability scoring here reflects newsgathering capacity, not viewpoint.",
    trustSummary: "Established business newsgathering.",
  },

  Politico: {
    isRated: true,
    reliability: 88,
    factualReporting: 89,
    politicalLean: "Center",
    displayName: "Politico",
    country: "United States",
    ownershipType: "Private",
    editorialApproach: "Political newsgathering in Washington and beyond.",
    description: "Political news organization.",
    website: "https://www.politico.com",
    biasExplanation:
      "Reliability scoring here reflects newsgathering capacity, not viewpoint.",
    trustSummary: "High-volume original political reporting.",
  },

  "The Guardian": {
    isRated: true,
    reliability: 90,
    factualReporting: 91,
    politicalLean: "Center",
    displayName: "The Guardian",
    country: "United Kingdom",
    ownershipType: "Private",
    editorialApproach: "International news reporting.",
    description: "British newspaper with substantial U.S. coverage.",
    website: "https://www.theguardian.com",
    biasExplanation:
      "Reliability scoring here reflects newsgathering capacity, not viewpoint.",
    trustSummary: "Established original reporting.",
  },

  "Al Jazeera English": {
    isRated: true,
    reliability: 86,
    factualReporting: 87,
    politicalLean: "Center",
    displayName: "Al Jazeera English",
    country: "Qatar",
    ownershipType: "Government",
    editorialApproach: "International newsgathering.",
    description: "Global English-language news network.",
    website: "https://www.aljazeera.com",
    biasExplanation:
      "Reliability scoring here reflects newsgathering capacity, not viewpoint.",
    trustSummary: "Substantial original international reporting.",
  },

  "The Hill": {
    isRated: true,
    reliability: 85,
    factualReporting: 86,
    politicalLean: "Center",
    displayName: "The Hill",
    country: "United States",
    ownershipType: "Private",
    editorialApproach: "Congressional and political newsgathering.",
    description: "Washington political news outlet.",
    website: "https://thehill.com",
    biasExplanation:
      "Reliability scoring here reflects newsgathering capacity, not viewpoint.",
    trustSummary: "Established Capitol Hill reporting.",
  },
};

const DEFAULT_SOURCE: SourceRating = {
  isRated: false,

  /*
   * These values remain neutral placeholders for
   * backward compatibility only.
   *
   * Code calculating source quality must check
   * isRated before using them.
   */
  reliability: 75,
  factualReporting: 75,

  politicalLean: "Mixed",

  displayName: "Unknown Source",
  country: "Unknown",
  ownershipType: "Unknown",

  editorialApproach:
    "The Angle Report has not yet collected enough source metadata to assign a formal editorial profile.",

  description:
    "The Angle Report does not currently maintain a verified source profile for this publication.",

  website: "",

  biasExplanation:
    "The Angle Report has not assigned this publication a verified political-lean classification.",

  trustSummary:
    "This source has not yet been formally rated by The Angle Report.",
};

/*
 * Exact publisher-name aliases only. Keys are
 * output of normalizePublisherKey().
 *
 * Do not use substring matching — "ABC News (AU)"
 * and local ABC affiliates must not resolve to
 * U.S. ABC News.
 */
const SOURCE_NAME_ALIASES: Record<string, string> = {
  reuters: "Reuters",
  "associated press": "Associated Press",
  ap: "Associated Press",
  "ap news": "AP News",
  bbc: "BBC",
  "bbc news": "BBC",
  npr: "NPR",
  "national public radio": "NPR",
  cnn: "CNN",
  "fox news": "Fox News",
  foxnews: "Fox News",
  "nbc news": "NBC News",
  nbcnews: "NBC News",
  "abc news": "ABC News",
  "cbs news": "CBS News",
  nyt: "The New York Times",
  "new york times": "The New York Times",
  nytimes: "The New York Times",
  "washington post": "The Washington Post",
  wapo: "The Washington Post",
  "wall street journal": "The Wall Street Journal",
  wsj: "The Wall Street Journal",
  bloomberg: "Bloomberg",
  cnbc: "CNBC",
  politico: "Politico",
  guardian: "The Guardian",
  "al jazeera": "Al Jazeera English",
  "al jazeera english": "Al Jazeera English",
  "the hill": "The Hill",
};

/*
 * Hostname → existing SOURCE_DATABASE key.
 * Stronger than name matching. Only domains for
 * sources that already have ratings. Do not invent
 * entries for Business Insider, CBC, Barron's,
 * TechCrunch, or DW.
 */
const SOURCE_HOST_ALIASES: Record<string, string> = {
  "reuters.com": "Reuters",
  "apnews.com": "Associated Press",
  "ap.org": "Associated Press",
  "bbc.com": "BBC",
  "bbc.co.uk": "BBC",
  "npr.org": "NPR",
  "cnn.com": "CNN",
  "foxnews.com": "Fox News",
  "nbcnews.com": "NBC News",
  "abcnews.go.com": "ABC News",
  "abcnews.com": "ABC News",
  "cbsnews.com": "CBS News",
  "nytimes.com": "The New York Times",
  "washingtonpost.com": "The Washington Post",
  "wsj.com": "The Wall Street Journal",
  "bloomberg.com": "Bloomberg",
  "cnbc.com": "CNBC",
  "politico.com": "Politico",
  "theguardian.com": "The Guardian",
  "aljazeera.com": "Al Jazeera English",
  "thehill.com": "The Hill",
};

function hostnameFromUrl(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    return new URL(withProtocol).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

function looksLikeHostname(value: string): boolean {
  return /^[\w.-]+\.[a-z]{2,}$/i.test(value.trim()) && !value.includes(" ");
}

function normalizePublisherKey(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/^the\s+/, "")
    .replace(/['’]/g, "")
    .replace(/[^\p{L}\p{N}.\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isRejectedAmbiguousIdentity(
  sourceName: string,
  hostname: string
): boolean {
  const text = `${sourceName} ${hostname}`.toLowerCase();

  return (
    hostname === "abc.net.au" ||
    hostname.endsWith(".abc.net.au") ||
    /\babc news \(au\)/.test(text) ||
    /\babc news australia\b/.test(text) ||
    /\baustralian broadcasting\b/.test(text) ||
    /\b(wabc|kabc|abc7|abc 7|abc13|abc 13)\b/.test(text)
  );
}

function lookupCanonicalKey(
  sourceName: string,
  sourceUrl?: string | null
): string | null {
  const trimmedName = sourceName.trim();
  const hostname =
    hostnameFromUrl(sourceUrl ?? "") ||
    (looksLikeHostname(trimmedName)
      ? hostnameFromUrl(trimmedName)
      : "");

  if (isRejectedAmbiguousIdentity(trimmedName, hostname)) {
    return null;
  }

  if (hostname && SOURCE_HOST_ALIASES[hostname]) {
    return SOURCE_HOST_ALIASES[hostname];
  }

  if (SOURCE_DATABASE[trimmedName]) {
    return trimmedName;
  }

  const nameKey = normalizePublisherKey(trimmedName);

  if (SOURCE_NAME_ALIASES[nameKey]) {
    return SOURCE_NAME_ALIASES[nameKey];
  }

  if (looksLikeHostname(nameKey) && SOURCE_HOST_ALIASES[nameKey]) {
    return SOURCE_HOST_ALIASES[nameKey];
  }

  for (const [databaseKey] of Object.entries(SOURCE_DATABASE)) {
    if (normalizePublisherKey(databaseKey) === nameKey) {
      return databaseKey;
    }
  }

  return null;
}

export function getSourceRating(
  sourceName: string,
  sourceUrl?: string | null
): SourceRating {
  const canonicalKey = lookupCanonicalKey(sourceName, sourceUrl);

  if (canonicalKey && SOURCE_DATABASE[canonicalKey]) {
    return SOURCE_DATABASE[canonicalKey];
  }

  return {
    ...DEFAULT_SOURCE,
    displayName: sourceName.trim() || "Unknown Source",
  };
}
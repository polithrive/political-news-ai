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
    "PoliticalPulse has not yet collected enough source metadata to assign a formal editorial profile.",

  description:
    "PoliticalPulse does not currently maintain a verified source profile for this publication.",

  website: "",

  biasExplanation:
    "PoliticalPulse has not assigned this publication a verified political-lean classification.",

  trustSummary:
    "This source has not yet been formally rated by PoliticalPulse.",
};

export function getSourceRating(
  sourceName: string
): SourceRating {
  const normalizedSourceName =
    sourceName.trim();

  const knownSource =
    SOURCE_DATABASE[normalizedSourceName];

  if (knownSource) {
    return knownSource;
  }

  return {
    ...DEFAULT_SOURCE,

    displayName:
      normalizedSourceName ||
      "Unknown Source",
  };
}
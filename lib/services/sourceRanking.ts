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
  // Existing fields (kept for compatibility)
  reliability: number;
  factualReporting: number;
  politicalLean: PoliticalLean;

  // New Source Intelligence™ fields
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
  reliability: 75,
  factualReporting: 75,
  politicalLean: "Mixed",

  displayName: "Unknown Source",
  country: "Unknown",
  ownershipType: "Unknown",

  editorialApproach:
    "PoliticalPulse has not yet collected detailed metadata for this source.",

  description:
    "Limited information is currently available for this publication.",

  website: "",

  biasExplanation:
    "PoliticalPulse does not yet have enough historical information to estimate editorial lean beyond the available reporting.",

  trustSummary:
    "Source metadata is still being collected.",
};

export function getSourceRating(
  sourceName: string
): SourceRating {
  return (
    SOURCE_DATABASE[sourceName] ??
    {
      ...DEFAULT_SOURCE,
      displayName: sourceName || "Unknown Source",
    }
  );
}
import type { StorySnapshotInput } from "./storySnapshotInput";

export const STORY_SNAPSHOT_MAX_BODY_BYTES = 32_768;
export const STORY_SNAPSHOT_MAX_SOURCES = 6;
export const STORY_SNAPSHOT_MAX_FACTS = 20;
export const STORY_SNAPSHOT_MAX_SUPPORTS = 6;
export const STORY_SNAPSHOT_MAX_UNCERTAINTIES = 20;
export const STORY_SNAPSHOT_MAX_COVERAGE_DIFFERENCES = 20;
const MAX_URL_LENGTH = 2_048;
const MAX_TITLE_LENGTH = 400;
const MAX_NAME_LENGTH = 200;
const MAX_FACT_LENGTH = 800;
const MAX_FRAGMENT_LENGTH = 180;
const MAX_PUBLISHED_AT_LENGTH = 64;
const MAX_SOURCE_ID_LENGTH = 8;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function asString(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed.length > maxLength) {
    return null;
  }

  return trimmed;
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function asCount(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > 20) {
    return null;
  }

  return value;
}

function asStringArray(value: unknown, maxItems: number, maxLength: number) {
  if (!Array.isArray(value) || value.length > maxItems) {
    return null;
  }

  const items: string[] = [];

  for (const entry of value) {
    const text = asString(entry, maxLength);

    if (text === null) {
      return null;
    }

    if (text) {
      items.push(text);
    }
  }

  return items;
}

function parseSupport(value: unknown) {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  const sourceId = asString(record.sourceId, MAX_SOURCE_ID_LENGTH);
  const publisher = asString(record.publisher, MAX_NAME_LENGTH);
  const supportText = asString(record.supportText, MAX_FRAGMENT_LENGTH);
  const supportField = record.supportField;

  if (
    sourceId === null ||
    publisher === null ||
    supportText === null ||
    (supportField !== "title" && supportField !== "description")
  ) {
    return null;
  }

  return {
    sourceId,
    publisher,
    supportText,
    supportField,
  } as const;
}

function parseFact(value: unknown) {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  const text = asString(record.text, MAX_FACT_LENGTH);
  const supportedBy = asStringArray(record.supportedBy, STORY_SNAPSHOT_MAX_SUPPORTS, MAX_NAME_LENGTH);

  if (text === null || !text || supportedBy === null || !Array.isArray(record.evidence)) {
    return null;
  }

  if (record.evidence.length > STORY_SNAPSHOT_MAX_SUPPORTS) {
    return null;
  }

  const evidence = [];

  for (const item of record.evidence) {
    const parsed = parseSupport(item);

    if (!parsed) {
      return null;
    }

    evidence.push(parsed);
  }

  return {
    text,
    supportedBy,
    evidence,
  };
}

function parseCoverageDifference(value: unknown) {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  const text = asString(record.text, MAX_FACT_LENGTH);
  const representedBy = asStringArray(
    record.representedBy,
    STORY_SNAPSHOT_MAX_SUPPORTS,
    MAX_NAME_LENGTH
  );

  if (text === null || !text || representedBy === null) {
    return null;
  }

  return {
    text,
    representedBy,
  };
}

function parseSource(value: unknown) {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  if ("description" in record || "content" in record || "promptContext" in record) {
    return null;
  }

  const sourceId = asString(record.sourceId, MAX_SOURCE_ID_LENGTH);
  const url = asString(record.url, MAX_URL_LENGTH);
  const sourceName = asString(record.sourceName, MAX_NAME_LENGTH);
  const publishedAt = asString(record.publishedAt, MAX_PUBLISHED_AT_LENGTH);
  const title = asString(record.title, MAX_TITLE_LENGTH);

  if (
    sourceId === null ||
    url === null ||
    sourceName === null ||
    publishedAt === null ||
    title === null ||
    typeof record.isPrimary !== "boolean"
  ) {
    return null;
  }

  return {
    sourceId,
    url,
    sourceName,
    publishedAt,
    title,
    isPrimary: record.isPrimary,
  };
}

export function parseStorySnapshotInput(
  value: unknown
): StorySnapshotInput | null {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  if (
    "fingerprint" in record ||
    "storyId" in record ||
    "capturedAt" in record ||
    "schema_version" in record ||
    "schemaVersion" in record ||
    "content" in record
  ) {
    return null;
  }

  const primaryRecord = asRecord(record.primary);
  const briefRecord = asRecord(record.brief);

  if (!primaryRecord || !briefRecord || !Array.isArray(record.sources)) {
    return null;
  }

  if ("content" in primaryRecord || "description" in primaryRecord) {
    return null;
  }

  if (
    "whatHappened" in briefRecord ||
    "whyItMatters" in briefRecord ||
    "angles" in briefRecord ||
    "rejectedEvidence" in briefRecord
  ) {
    return null;
  }

  if (record.sources.length === 0 || record.sources.length > STORY_SNAPSHOT_MAX_SOURCES) {
    return null;
  }

  const primaryUrl = asString(primaryRecord.url, MAX_URL_LENGTH);
  const primaryTitle = asString(primaryRecord.title, MAX_TITLE_LENGTH);
  const primarySourceName = asString(primaryRecord.sourceName, MAX_NAME_LENGTH);
  const primaryPublishedAt = asString(primaryRecord.publishedAt, MAX_PUBLISHED_AT_LENGTH);

  if (
    primaryUrl === null ||
    primaryTitle === null ||
    !primaryTitle ||
    primarySourceName === null ||
    primaryPublishedAt === null
  ) {
    return null;
  }

  const sources = [];

  for (const source of record.sources) {
    const parsed = parseSource(source);

    if (!parsed) {
      return null;
    }

    sources.push(parsed);
  }

  if (!Array.isArray(briefRecord.corroboratedFacts) ||
    briefRecord.corroboratedFacts.length > STORY_SNAPSHOT_MAX_FACTS ||
    !Array.isArray(briefRecord.uncertainties) ||
    briefRecord.uncertainties.length > STORY_SNAPSHOT_MAX_UNCERTAINTIES ||
    !Array.isArray(briefRecord.coverageDifferences) ||
    briefRecord.coverageDifferences.length > STORY_SNAPSHOT_MAX_COVERAGE_DIFFERENCES
  ) {
    return null;
  }

  const corroboratedFacts = [];

  for (const fact of briefRecord.corroboratedFacts) {
    const parsed = parseFact(fact);

    if (!parsed) {
      return null;
    }

    corroboratedFacts.push(parsed);
  }

  const uncertainties = asStringArray(
    briefRecord.uncertainties,
    STORY_SNAPSHOT_MAX_UNCERTAINTIES,
    MAX_FACT_LENGTH
  );
  const coverageDifferences = [];

  for (const item of briefRecord.coverageDifferences) {
    const parsed = parseCoverageDifference(item);

    if (!parsed) {
      return null;
    }

    coverageDifferences.push(parsed);
  }

  const independentSourceCount = asCount(briefRecord.independentSourceCount);
  const limitedEvidence = asBoolean(briefRecord.limitedEvidence);

  if (uncertainties === null || independentSourceCount === null || limitedEvidence === null) {
    return null;
  }

  return {
    primary: {
      url: primaryUrl,
      title: primaryTitle,
      sourceName: primarySourceName,
      publishedAt: primaryPublishedAt,
    },
    sources,
    brief: {
      corroboratedFacts,
      uncertainties,
      coverageDifferences,
      independentSourceCount,
      limitedEvidence,
    },
  };
}

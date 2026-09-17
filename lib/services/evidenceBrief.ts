import type {
  EvidenceBrief,
  EvidenceBriefAngle,
  EvidenceBriefCoverageDifference,
  EvidenceBriefFact,
  EvidenceBriefRejected,
  EvidenceBriefSupport,
} from "@/app/types/report";

import type { EvidenceSource } from "./evidenceContext";

const FORBIDDEN_ANGLE_LABELS = new Set([
  "left",
  "center",
  "right",
  "liberal",
  "progressive",
  "conservative",
  "centrist",
  "left-leaning",
  "right-leaning",
]);

const UNCERTAINTY_CUE =
  /\b(unresolved|unknown|unclear|disputed|dispute|pending|conflict(?:ing)?|not yet|remain(?:s)? to|unanswered|alleged|reportedly|could not|investigation|whether|if any|has not|have not|no confirmation|unconfirmed)\b/i;

const MIN_SUPPORT_LENGTH = 12;
const MAX_SUPPORT_LENGTH = 180;

type NormalizeEvidenceBriefOptions = {
  rawBrief: unknown;
  sources: EvidenceSource[];
  independentSourceCount: number;
  whatHappenedFallback: string;
  whyItMattersFallback: string;
};

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function uniqueTrimmed(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function limitSentences(value: string, maxSentences: number): string {
  const trimmed = cleanText(value);

  if (!trimmed || maxSentences < 1) {
    return "";
  }

  const sentences = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g);

  if (!sentences) {
    return trimmed;
  }

  return sentences
    .slice(0, maxSentences)
    .map((sentence) => sentence.trim())
    .join(" ");
}

function normalizePublisherKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function normalizeForMatch(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isForbiddenAngleLabel(label: string): boolean {
  return FORBIDDEN_ANGLE_LABELS.has(normalizePublisherKey(label));
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function countIndependentPublishers(
  supports: EvidenceBriefSupport[]
): number {
  return new Set(
    supports.map((item) => normalizePublisherKey(item.publisher)).filter(Boolean)
  ).size;
}

function matchSupportText(
  rawFragment: string,
  source: EvidenceSource
): EvidenceBriefSupport | null {
  const fragment = cleanText(rawFragment).slice(0, MAX_SUPPORT_LENGTH);
  const needle = normalizeForMatch(fragment);

  if (needle.length < MIN_SUPPORT_LENGTH) {
    return null;
  }

  const description = normalizeForMatch(source.description);
  const title = normalizeForMatch(source.title);

  if (description.includes(needle)) {
    return {
      sourceId: source.sourceId,
      publisher: source.sourceName,
      supportText: fragment,
      supportField: "description",
    };
  }

  if (title.includes(needle)) {
    return {
      sourceId: source.sourceId,
      publisher: source.sourceName,
      supportText: fragment,
      supportField: "title",
    };
  }

  return null;
}

function resolveEvidenceItems(
  rawEvidence: unknown,
  sourcesById: Map<string, EvidenceSource>,
  rejected: EvidenceBriefRejected[],
  kind: EvidenceBriefRejected["kind"],
  claim: string
): EvidenceBriefSupport[] {
  const rawItems = Array.isArray(rawEvidence) ? rawEvidence : [];
  const validated: EvidenceBriefSupport[] = [];
  const seenIds = new Set<string>();

  for (const rawItem of rawItems) {
    const record = asRecord(rawItem);
    const sourceId = cleanText(record?.sourceId).toUpperCase();
    const supportText = cleanText(record?.supportText);

    if (!sourceId) {
      rejected.push({
        kind,
        claim,
        reason: "Missing sourceId",
        supportText: supportText || undefined,
      });
      continue;
    }

    const source = sourcesById.get(sourceId);

    if (!source) {
      rejected.push({
        kind,
        claim,
        sourceId,
        supportText: supportText || undefined,
        reason: "Unknown sourceId",
      });
      continue;
    }

    const matched = matchSupportText(supportText, source);

    if (!matched) {
      rejected.push({
        kind,
        claim,
        sourceId,
        supportText: supportText || undefined,
        reason:
          "supportText was not found in that source's supplied title or description",
      });
      continue;
    }

    if (seenIds.has(matched.sourceId)) {
      continue;
    }

    seenIds.add(matched.sourceId);
    validated.push(matched);
  }

  return validated;
}

function collectLegacyEvidence(
  rawIdsOrNames: unknown,
  sources: EvidenceSource[],
  sourcesById: Map<string, EvidenceSource>,
  rejected: EvidenceBriefRejected[],
  kind: EvidenceBriefRejected["kind"],
  claim: string
): EvidenceBriefSupport[] {
  /*
   * Backward-compatible: if the model still emits
   * supportedBy publisher names or source IDs without
   * fragments, those cannot be text-validated. Drop them.
   */
  if (!Array.isArray(rawIdsOrNames)) {
    return [];
  }

  for (const rawValue of rawIdsOrNames) {
    const value = cleanText(rawValue);

    if (!value) {
      continue;
    }

    const asId = value.toUpperCase();
    const knownId = sourcesById.has(asId);
    const knownPublisher = sources.some(
      (source) =>
        normalizePublisherKey(source.sourceName) ===
        normalizePublisherKey(value)
    );

    if (knownId || knownPublisher) {
      rejected.push({
        kind,
        claim,
        sourceId: knownId ? asId : undefined,
        reason:
          "Publisher/source listed without a validated title or description fragment",
      });
    }
  }

  return [];
}

function normalizeFacts(
  rawFacts: unknown,
  sources: EvidenceSource[],
  sourcesById: Map<string, EvidenceSource>,
  independentSourceCount: number,
  rejected: EvidenceBriefRejected[]
): EvidenceBriefFact[] {
  if (independentSourceCount < 2 || !Array.isArray(rawFacts)) {
    return [];
  }

  const facts: EvidenceBriefFact[] = [];

  for (const rawFact of rawFacts) {
    if (facts.length >= 4) {
      break;
    }

    const record = asRecord(rawFact);
    const text = cleanText(record?.text);

    if (!text) {
      continue;
    }

    const evidence = resolveEvidenceItems(
      record?.evidence,
      sourcesById,
      rejected,
      "fact",
      text
    );

    collectLegacyEvidence(
      record?.supportedBy,
      sources,
      sourcesById,
      rejected,
      "fact",
      text
    );

    if (countIndependentPublishers(evidence) < 2) {
      if (evidence.length > 0 || Array.isArray(record?.evidence)) {
        rejected.push({
          kind: "fact",
          claim: text,
          reason:
            "Fewer than two independent publishers remained after support-text validation",
        });
      }
      continue;
    }

    facts.push({
      text,
      supportedBy: uniqueTrimmed(evidence.map((item) => item.publisher)),
      evidence,
    });
  }

  return facts;
}

function normalizeAngles(
  rawAngles: unknown,
  sourcesById: Map<string, EvidenceSource>,
  rejected: EvidenceBriefRejected[]
): EvidenceBriefAngle[] {
  if (!Array.isArray(rawAngles)) {
    return [];
  }

  const angles: EvidenceBriefAngle[] = [];

  for (const rawAngle of rawAngles) {
    if (angles.length >= 3) {
      break;
    }

    const record = asRecord(rawAngle);
    const label = cleanText(record?.label);
    const summary = cleanText(record?.summary);

    if (!label || !summary) {
      continue;
    }

    if (isForbiddenAngleLabel(label)) {
      rejected.push({
        kind: "angle",
        claim: label,
        reason: "Generic Left/Center/Right political label rejected",
      });
      continue;
    }

    const evidence = resolveEvidenceItems(
      record?.evidence,
      sourcesById,
      rejected,
      "angle",
      `${label}: ${summary}`
    );

    if (evidence.length === 0) {
      rejected.push({
        kind: "angle",
        claim: label,
        reason: "No validated supporting evidence fragment",
      });
      continue;
    }

    angles.push({
      label,
      summary,
      representedBy: uniqueTrimmed(evidence.map((item) => item.publisher)),
      evidence,
    });
  }

  return angles;
}

function normalizeCoverageDifferences(
  rawDifferences: unknown,
  sourcesById: Map<string, EvidenceSource>,
  independentSourceCount: number,
  rejected: EvidenceBriefRejected[]
): EvidenceBriefCoverageDifference[] {
  if (independentSourceCount < 2 || !Array.isArray(rawDifferences)) {
    return [];
  }

  const differences: EvidenceBriefCoverageDifference[] = [];

  for (const rawDifference of rawDifferences) {
    if (differences.length >= 3) {
      break;
    }

    const record = asRecord(rawDifference);
    const text = cleanText(
      record?.text ?? (typeof rawDifference === "string" ? rawDifference : "")
    );

    if (!text) {
      continue;
    }

    const evidence = resolveEvidenceItems(
      record?.evidence,
      sourcesById,
      rejected,
      "coverage",
      text
    );

    if (countIndependentPublishers(evidence) < 2) {
      rejected.push({
        kind: "coverage",
        claim: text,
        reason:
          "Coverage difference lacked two independently validated source fragments",
      });
      continue;
    }

    differences.push({
      text,
      representedBy: uniqueTrimmed(evidence.map((item) => item.publisher)),
      evidence,
    });
  }

  return differences;
}

function normalizeUncertainties(
  rawUncertainties: unknown,
  sourcesById: Map<string, EvidenceSource>,
  rejected: EvidenceBriefRejected[]
): string[] {
  if (!Array.isArray(rawUncertainties)) {
    return [];
  }

  const uncertainties: string[] = [];

  for (const rawItem of rawUncertainties) {
    if (uncertainties.length >= 4) {
      break;
    }

    const record = asRecord(rawItem);
    const text = cleanText(
      record?.text ?? (typeof rawItem === "string" ? rawItem : "")
    );

    if (!text) {
      continue;
    }

    if (!record || !Array.isArray(record.evidence)) {
      rejected.push({
        kind: "uncertainty",
        claim: text,
        reason: "Uncertainty lacked source evidence references",
      });
      continue;
    }

    const evidence = resolveEvidenceItems(
      record.evidence,
      sourcesById,
      rejected,
      "uncertainty",
      text
    );

    const hasCue = evidence.some((item) => UNCERTAINTY_CUE.test(item.supportText));

    if (evidence.length === 0 || !hasCue) {
      rejected.push({
        kind: "uncertainty",
        claim: text,
        reason:
          evidence.length === 0
            ? "No validated supporting evidence fragment"
            : "Validated fragment did not indicate unresolved, disputed, or unknown reporting",
      });
      continue;
    }

    uncertainties.push(text);
  }

  return uniqueTrimmed(uncertainties);
}

export function createEmptyEvidenceBrief(options: {
  independentSourceCount: number;
  whatHappened?: string;
  whyItMatters?: string;
}): EvidenceBrief {
  return {
    whatHappened: limitSentences(options.whatHappened ?? "", 3),
    whyItMatters: limitSentences(options.whyItMatters ?? "", 2),
    corroboratedFacts: [],
    angles: [],
    uncertainties: [],
    coverageDifferences: [],
    limitedEvidence: options.independentSourceCount < 2,
    independentSourceCount: options.independentSourceCount,
    rejectedEvidence: [],
  };
}

export function normalizeEvidenceBrief({
  rawBrief,
  sources,
  independentSourceCount,
  whatHappenedFallback,
  whyItMattersFallback,
}: NormalizeEvidenceBriefOptions): EvidenceBrief {
  const record = asRecord(rawBrief);
  const limitedEvidence = independentSourceCount < 2;
  const rejected: EvidenceBriefRejected[] = [];
  const sourcesById = new Map(
    sources.map((source) => [source.sourceId.toUpperCase(), source])
  );

  const whatHappened = limitSentences(
    cleanText(record?.whatHappened) || whatHappenedFallback,
    3
  );

  const whyItMatters = limitSentences(
    cleanText(record?.whyItMatters) || whyItMattersFallback,
    2
  );

  return {
    whatHappened,
    whyItMatters,
    corroboratedFacts: limitedEvidence
      ? []
      : normalizeFacts(
          record?.corroboratedFacts,
          sources,
          sourcesById,
          independentSourceCount,
          rejected
        ),
    angles: normalizeAngles(record?.angles, sourcesById, rejected),
    uncertainties: normalizeUncertainties(
      record?.uncertainties,
      sourcesById,
      rejected
    ),
    coverageDifferences: limitedEvidence
      ? []
      : normalizeCoverageDifferences(
          record?.coverageDifferences,
          sourcesById,
          independentSourceCount,
          rejected
        ),
    limitedEvidence,
    independentSourceCount,
    rejectedEvidence: rejected,
  };
}

import type { EvidenceSnapshotV1 } from "@/lib/db/evidence";
import { formatPublisherDisplayName } from "@/app/components/brief/briefUi";

import type { EvidenceSnapshotDiff } from "./diffEvidenceSnapshots";
import { tryBuildStoryKey } from "./storyKey";
import { normalizeFingerprintText } from "./storySnapshotFingerprint";

export type WhatChangedFactEvidence = {
  publisher: string;
  supportText: string;
  supportField: "title" | "description";
};

export type WhatChangedFact = {
  text: string;
  publishers: string[];
  evidence: WhatChangedFactEvidence[];
};

export type WhatChangedSource = {
  name: string;
  url: string;
};

export type WhatChangedViewModel = {
  previousCapturedAt: string | null;
  defaultExpanded: boolean;
  facts: WhatChangedFact[];
  uncertainties: string[];
  coverageDifferences: string[];
  sources: WhatChangedSource[];
  limitedEvidenceNote: string | null;
};

const MAX_FACTS = 3;
const MAX_UNCERTAINTIES = 2;
const MAX_COVERAGE = 2;
const MAX_SOURCES = 3;
const MAX_ITEMS = 8;

function toIsoDate(value: Date | string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function currentFactByText(snapshot: EvidenceSnapshotV1, text: string) {
  const wanted = normalizeFingerprintText(text);

  return snapshot.facts.find(
    (fact) => normalizeFingerprintText(fact.text) === wanted
  );
}

function namedSource(
  snapshot: EvidenceSnapshotV1,
  url: string
): WhatChangedSource | null {
  const wanted = tryBuildStoryKey(url);

  if (!wanted) {
    return null;
  }

  const match = snapshot.sources.find(
    (source) => tryBuildStoryKey(source.url) === wanted
  );
  const name = formatPublisherDisplayName(
    match?.sourceName ?? "",
    match?.url || url
  );

  if (!name) {
    return null;
  }

  return {
    name,
    url: match?.url || wanted,
  };
}

function trimFromBottom(
  facts: WhatChangedFact[],
  uncertainties: string[],
  coverageDifferences: string[],
  sources: WhatChangedSource[]
) {
  while (
    facts.length +
      uncertainties.length +
      coverageDifferences.length +
      sources.length >
    MAX_ITEMS
  ) {
    if (sources.length > 0) {
      sources.pop();
      continue;
    }

    if (coverageDifferences.length > 0) {
      coverageDifferences.pop();
      continue;
    }

    if (uncertainties.length > 0) {
      uncertainties.pop();
      continue;
    }

    if (facts.length > 0) {
      facts.pop();
      continue;
    }

    break;
  }
}

function limitedEvidenceNote(
  diff: EvidenceSnapshotDiff
): string | null {
  if (diff.limitedEvidence.previous === diff.limitedEvidence.current) {
    return null;
  }

  if (diff.limitedEvidence.previous && !diff.limitedEvidence.current) {
    return "This brief now draws on more independent reporting than the previous saved analysis.";
  }

  return "This brief now has more limited independent reporting than the previous saved analysis.";
}

export function buildWhatChangedViewModel(input: {
  previousCapturedAt?: Date | string | null;
  current: EvidenceSnapshotV1;
  diff: EvidenceSnapshotDiff;
}): WhatChangedViewModel | null {
  const facts = input.diff.factsAdded.slice(0, MAX_FACTS).map((item) => {
    const currentFact = currentFactByText(input.current, item.text);

    return {
      text: item.text,
      publishers: currentFact?.publishers.filter(Boolean) ?? [],
      evidence: (currentFact?.support ?? [])
        .filter(
          (support) =>
            support.publisher &&
            support.fragment &&
            (support.field === "title" || support.field === "description")
        )
        .map((support) => ({
          publisher: support.publisher,
          supportText: support.fragment,
          supportField: support.field,
        })),
    };
  });

  const uncertainties = input.diff.uncertaintiesAdded
    .slice(0, MAX_UNCERTAINTIES)
    .map((item) => item.text);
  const coverageDifferences = input.diff.coverageDifferencesAdded
    .slice(0, MAX_COVERAGE)
    .map((item) => item.text);
  const sources = input.diff.sourcesAdded
    .slice(0, MAX_SOURCES)
    .map((item) => namedSource(input.current, item.url))
    .filter((item): item is WhatChangedSource => item !== null);

  trimFromBottom(facts, uncertainties, coverageDifferences, sources);

  const note = limitedEvidenceNote(input.diff);
  const itemCount =
    facts.length +
    uncertainties.length +
    coverageDifferences.length +
    sources.length;

  if (itemCount === 0 && !note) {
    return null;
  }

  return {
    previousCapturedAt: toIsoDate(input.previousCapturedAt),
    defaultExpanded:
      facts.length > 0 ||
      uncertainties.length > 0 ||
      coverageDifferences.length > 0,
    facts,
    uncertainties,
    coverageDifferences,
    sources,
    limitedEvidenceNote: note,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function parseWhatChangedViewModel(
  value: unknown
): WhatChangedViewModel | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    !Array.isArray(value.facts) ||
    !Array.isArray(value.uncertainties) ||
    !Array.isArray(value.coverageDifferences) ||
    !Array.isArray(value.sources) ||
    typeof value.defaultExpanded !== "boolean"
  ) {
    return null;
  }

  const previousCapturedAt =
    typeof value.previousCapturedAt === "string" ||
    value.previousCapturedAt === null
      ? value.previousCapturedAt
      : null;

  const facts: WhatChangedFact[] = [];

  for (const fact of value.facts) {
    if (!isRecord(fact) || typeof fact.text !== "string" || !fact.text) {
      return null;
    }

    facts.push({
      text: fact.text,
      publishers: Array.isArray(fact.publishers)
        ? fact.publishers.filter((name): name is string => typeof name === "string")
        : [],
      evidence: Array.isArray(fact.evidence)
        ? fact.evidence.flatMap((item) => {
            if (
              !isRecord(item) ||
              typeof item.publisher !== "string" ||
              typeof item.supportText !== "string" ||
              (item.supportField !== "title" && item.supportField !== "description")
            ) {
              return [];
            }

            return [
              {
                publisher: item.publisher,
                supportText: item.supportText,
                supportField: item.supportField,
              },
            ];
          })
        : [],
    });
  }

  const uncertainties = value.uncertainties.filter(
    (item): item is string => typeof item === "string" && Boolean(item)
  );
  const coverageDifferences = value.coverageDifferences.filter(
    (item): item is string => typeof item === "string" && Boolean(item)
  );
  const sources: WhatChangedSource[] = [];

  for (const source of value.sources) {
    if (
      !isRecord(source) ||
      typeof source.name !== "string" ||
      typeof source.url !== "string" ||
      !source.name ||
      !source.url
    ) {
      return null;
    }

    sources.push({ name: source.name, url: source.url });
  }

  const limitedEvidenceNote =
    typeof value.limitedEvidenceNote === "string"
      ? value.limitedEvidenceNote
      : value.limitedEvidenceNote === null
        ? null
        : null;

  if (
    facts.length === 0 &&
    uncertainties.length === 0 &&
    coverageDifferences.length === 0 &&
    sources.length === 0 &&
    !limitedEvidenceNote
  ) {
    return null;
  }

  return {
    previousCapturedAt,
    defaultExpanded: value.defaultExpanded,
    facts,
    uncertainties,
    coverageDifferences,
    sources,
    limitedEvidenceNote,
  };
}

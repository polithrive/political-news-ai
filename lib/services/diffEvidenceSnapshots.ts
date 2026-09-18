import type { EvidenceSnapshotV1 } from "@/lib/db/evidence";

import { tryBuildStoryKey } from "./storyKey";
import { normalizeFingerprintText } from "./storySnapshotFingerprint";

export type SnapshotTextChange = {
  text: string;
};

export type SnapshotSourceChange = {
  url: string;
};

export type EvidenceSnapshotDiff = {
  hasMaterialChange: boolean;
  sourcesAdded: SnapshotSourceChange[];
  sourcesMissingFromNewer: SnapshotSourceChange[];
  factsAdded: SnapshotTextChange[];
  factsMissingFromNewer: SnapshotTextChange[];
  uncertaintiesAdded: SnapshotTextChange[];
  uncertaintiesMissingFromNewer: SnapshotTextChange[];
  coverageDifferencesAdded: SnapshotTextChange[];
  coverageDifferencesMissingFromNewer: SnapshotTextChange[];
  independentSourceCount: {
    previous: number;
    current: number;
  };
  limitedEvidence: {
    previous: boolean;
    current: boolean;
  };
};

function uniqueSorted(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((left, right) =>
    left.localeCompare(right)
  );
}

function sourceUrlSet(snapshot: EvidenceSnapshotV1) {
  return uniqueSorted(
    snapshot.sources
      .map((source) => tryBuildStoryKey(source.url))
      .filter((url): url is string => Boolean(url))
  );
}

function factTextSet(snapshot: EvidenceSnapshotV1) {
  return uniqueSorted(
    snapshot.facts.map((fact) => normalizeFingerprintText(fact.text))
  );
}

function uncertaintySet(snapshot: EvidenceSnapshotV1) {
  return uniqueSorted(
    snapshot.uncertainties.map((item) => normalizeFingerprintText(item))
  );
}

function coverageTextSet(snapshot: EvidenceSnapshotV1) {
  return uniqueSorted(
    snapshot.coverageDifferences.map((item) =>
      normalizeFingerprintText(item.text)
    )
  );
}

function addedAndMissing(previous: string[], current: string[]) {
  const previousSet = new Set(previous);
  const currentSet = new Set(current);

  return {
    added: current.filter((value) => !previousSet.has(value)),
    missingFromNewer: previous.filter((value) => !currentSet.has(value)),
  };
}

function asTextChanges(values: string[]): SnapshotTextChange[] {
  return values.map((text) => ({ text }));
}

function asSourceChanges(values: string[]): SnapshotSourceChange[] {
  return values.map((url) => ({ url }));
}

export function diffEvidenceSnapshots(
  previous: EvidenceSnapshotV1,
  current: EvidenceSnapshotV1
): EvidenceSnapshotDiff {
  const sources = addedAndMissing(sourceUrlSet(previous), sourceUrlSet(current));
  const facts = addedAndMissing(factTextSet(previous), factTextSet(current));
  const uncertainties = addedAndMissing(
    uncertaintySet(previous),
    uncertaintySet(current)
  );
  const coverage = addedAndMissing(
    coverageTextSet(previous),
    coverageTextSet(current)
  );

  const independentSourceCount = {
    previous: previous.independentSourceCount,
    current: current.independentSourceCount,
  };
  const limitedEvidence = {
    previous: previous.limitedEvidence,
    current: current.limitedEvidence,
  };

  const hasMaterialChange =
    sources.added.length > 0 ||
    sources.missingFromNewer.length > 0 ||
    facts.added.length > 0 ||
    facts.missingFromNewer.length > 0 ||
    uncertainties.added.length > 0 ||
    uncertainties.missingFromNewer.length > 0 ||
    coverage.added.length > 0 ||
    coverage.missingFromNewer.length > 0 ||
    independentSourceCount.previous !== independentSourceCount.current ||
    limitedEvidence.previous !== limitedEvidence.current;

  return {
    hasMaterialChange,
    sourcesAdded: asSourceChanges(sources.added),
    sourcesMissingFromNewer: asSourceChanges(sources.missingFromNewer),
    factsAdded: asTextChanges(facts.added),
    factsMissingFromNewer: asTextChanges(facts.missingFromNewer),
    uncertaintiesAdded: asTextChanges(uncertainties.added),
    uncertaintiesMissingFromNewer: asTextChanges(uncertainties.missingFromNewer),
    coverageDifferencesAdded: asTextChanges(coverage.added),
    coverageDifferencesMissingFromNewer: asTextChanges(coverage.missingFromNewer),
    independentSourceCount,
    limitedEvidence,
  };
}

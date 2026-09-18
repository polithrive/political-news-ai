import { createHash } from "node:crypto";

import type { EvidenceSnapshotV1 } from "@/lib/db/evidence";

import { tryBuildStoryKey } from "./storyKey";

export function normalizeFingerprintText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function createStorySnapshotFingerprint(
  snapshot: EvidenceSnapshotV1
): string {
  const sourceUrls = [
    ...new Set(
      snapshot.sources
        .map((source) => tryBuildStoryKey(source.url) || source.url.trim())
        .filter(Boolean)
    ),
  ].sort((left, right) => left.localeCompare(right));

  const payload = {
    sourceUrls,
    facts: snapshot.facts
      .map((fact) => normalizeFingerprintText(fact.text))
      .filter(Boolean)
      .sort((left, right) => left.localeCompare(right)),
    uncertainties: snapshot.uncertainties
      .map((item) => normalizeFingerprintText(item))
      .filter(Boolean)
      .sort((left, right) => left.localeCompare(right)),
    coverageDifferences: snapshot.coverageDifferences
      .map((item) => normalizeFingerprintText(item.text))
      .filter(Boolean)
      .sort((left, right) => left.localeCompare(right)),
    independentSourceCount: snapshot.independentSourceCount,
    limitedEvidence: snapshot.limitedEvidence,
  };

  return createHash("sha256").update(JSON.stringify(payload), "utf8").digest("hex");
}

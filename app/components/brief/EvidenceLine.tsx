"use client";

import type { EvidenceStrength } from "@/app/types/trust";

type EvidenceLineProps = {
  evidenceStrength?: EvidenceStrength | null;
  sourceCount?: number | null;
  ratedSourceCount?: number | null;
};

function strengthLabel(value: EvidenceStrength): string {
  if (value === "High") {
    return "Strong evidence";
  }

  if (value === "Medium") {
    return "Moderate evidence";
  }

  return "Limited evidence";
}

function hasCount(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export default function EvidenceLine({
  evidenceStrength,
  sourceCount,
  ratedSourceCount,
}: EvidenceLineProps) {
  const parts: string[] = [];

  if (
    evidenceStrength === "High" ||
    evidenceStrength === "Medium" ||
    evidenceStrength === "Low"
  ) {
    parts.push(strengthLabel(evidenceStrength));
  }

  if (hasCount(sourceCount)) {
    parts.push(
      sourceCount === 1
        ? "1 source"
        : `${sourceCount} sources`
    );
  }

  if (
    hasCount(ratedSourceCount) &&
    ratedSourceCount !== sourceCount
  ) {
    parts.push(
      ratedSourceCount === 1
        ? "1 rated source"
        : `${ratedSourceCount} rated sources`
    );
  }

  if (parts.length === 0) {
    return null;
  }

  return <span>{parts.join(" · ")}</span>;
}

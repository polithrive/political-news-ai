import type { EvidenceSnapshotV1 } from "@/lib/db/evidence";

export type StorySnapshotRow = {
  id: string;
  capturedAt: Date;
  fingerprint: string;
  evidence: EvidenceSnapshotV1;
};

export type StorySnapshotPairResult =
  | { status: "none" }
  | { status: "single"; current: StorySnapshotRow }
  | {
      status: "pair";
      previous: StorySnapshotRow;
      current: StorySnapshotRow;
    };

export function compareSnapshotRowsNewestFirst(
  left: StorySnapshotRow,
  right: StorySnapshotRow
) {
  const timeDelta = right.capturedAt.getTime() - left.capturedAt.getTime();

  if (timeDelta !== 0) {
    return timeDelta;
  }

  return right.id.localeCompare(left.id);
}

export function sortSnapshotRowsNewestFirst(rows: StorySnapshotRow[]) {
  return [...rows].sort(compareSnapshotRowsNewestFirst);
}

export function interpretLatestSnapshotRows(
  rows: StorySnapshotRow[]
): StorySnapshotPairResult {
  if (rows.length === 0) {
    return { status: "none" };
  }

  if (rows.length === 1) {
    return { status: "single", current: rows[0] };
  }

  return {
    status: "pair",
    current: rows[0],
    previous: rows[1],
  };
}

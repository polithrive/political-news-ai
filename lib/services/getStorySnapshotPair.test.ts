import assert from "node:assert/strict";
import test from "node:test";

import type { EvidenceSnapshotV1 } from "../db/evidence";
import { tryBuildStoryKey } from "./storyKey";
import {
  interpretLatestSnapshotRows,
  sortSnapshotRowsNewestFirst,
  type StorySnapshotRow,
} from "./storySnapshotPair";

function evidence(label: string): EvidenceSnapshotV1 {
  return {
    primary: {
      url: "https://example.com/story",
      title: label,
      sourceName: "Primary",
      publishedAt: "2026-01-01",
    },
    sources: [
      {
        url: "https://example.com/story",
        sourceName: "Primary",
        publishedAt: "2026-01-01",
        title: label,
        isPrimary: true,
      },
    ],
    facts: [],
    uncertainties: [],
    coverageDifferences: [],
    independentSourceCount: 1,
    limitedEvidence: true,
  };
}

function row(
  id: string,
  capturedAt: string,
  fingerprint: string
): StorySnapshotRow {
  return {
    id,
    capturedAt: new Date(capturedAt),
    fingerprint,
    evidence: evidence(fingerprint),
  };
}

test("0 snapshots yields none", () => {
  assert.deepEqual(interpretLatestSnapshotRows([]), { status: "none" });
});

test("1 snapshot yields single", () => {
  const current = row(
    "00000000-0000-0000-0000-000000000001",
    "2026-01-02T00:00:00.000Z",
    "fp-1"
  );
  const result = interpretLatestSnapshotRows([current]);

  assert.equal(result.status, "single");
  if (result.status === "single") {
    assert.equal(result.current.fingerprint, "fp-1");
  }
});

test("2+ snapshots: newest captured_at is current", () => {
  const older = row(
    "00000000-0000-0000-0000-000000000001",
    "2026-01-01T00:00:00.000Z",
    "fp-old"
  );
  const newer = row(
    "00000000-0000-0000-0000-000000000002",
    "2026-01-03T00:00:00.000Z",
    "fp-new"
  );
  const extra = row(
    "00000000-0000-0000-0000-000000000003",
    "2026-01-02T00:00:00.000Z",
    "fp-mid"
  );
  const ordered = sortSnapshotRowsNewestFirst([older, extra, newer]).slice(0, 2);
  const result = interpretLatestSnapshotRows(ordered);

  assert.equal(result.status, "pair");
  if (result.status === "pair") {
    assert.equal(result.current.fingerprint, "fp-new");
    assert.equal(result.previous.fingerprint, "fp-mid");
  }
});

test("equal captured_at uses stable id DESC", () => {
  const capturedAt = "2026-01-01T12:00:00.000Z";
  const lowerId = row(
    "00000000-0000-0000-0000-000000000001",
    capturedAt,
    "fp-low"
  );
  const higherId = row(
    "00000000-0000-0000-0000-000000000009",
    capturedAt,
    "fp-high"
  );
  const ordered = sortSnapshotRowsNewestFirst([lowerId, higherId]);
  const result = interpretLatestSnapshotRows(ordered);

  assert.equal(result.status, "pair");
  if (result.status === "pair") {
    assert.equal(result.current.id, higherId.id);
    assert.equal(result.previous.id, lowerId.id);
  }
});

test("same real event under different primary URLs stays separate keys", () => {
  const first = tryBuildStoryKey("https://example.com/story-a");
  const second = tryBuildStoryKey("https://example.com/story-b");

  assert.ok(first);
  assert.ok(second);
  assert.notEqual(first, second);
});

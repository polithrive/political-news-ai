import assert from "node:assert/strict";
import test from "node:test";

import type { EvidenceSnapshotV1 } from "../db/evidence";
import { diffEvidenceSnapshots } from "./diffEvidenceSnapshots";
import { buildWhatChangedViewModel } from "./whatChangedViewModel";

function source(
  url: string,
  extras?: Partial<EvidenceSnapshotV1["sources"][number]>
): EvidenceSnapshotV1["sources"][number] {
  return {
    url,
    sourceName: extras?.sourceName ?? "Publisher",
    publishedAt: extras?.publishedAt ?? "2026-01-01",
    title: extras?.title ?? "Headline",
    isPrimary: extras?.isPrimary ?? false,
  };
}

function fact(text: string): EvidenceSnapshotV1["facts"][number] {
  return {
    text,
    publishers: ["Publisher"],
    support: [
      {
        url: "https://example.com/a",
        publisher: "Publisher",
        fragment: "fragment",
        field: "title",
      },
    ],
  };
}

function snapshot(
  overrides?: Partial<EvidenceSnapshotV1>
): EvidenceSnapshotV1 {
  return {
    primary: {
      url: "https://example.com/story",
      title: "Story",
      sourceName: "Primary",
      publishedAt: "2026-01-01",
    },
    sources: [
      source("https://example.com/a", { isPrimary: true }),
      source("https://news.example.com/b", { sourceName: "Other Outlet" }),
    ],
    facts: [fact("The committee voted on the bill.")],
    uncertainties: ["The vote margin is unclear."],
    coverageDifferences: [
      { text: "Outlets disagree on the timeline.", publishers: ["Publisher"] },
    ],
    independentSourceCount: 2,
    limitedEvidence: false,
    ...overrides,
  };
}

function view(
  previous: EvidenceSnapshotV1,
  current: EvidenceSnapshotV1,
  capturedAt = "2026-03-01T00:00:00.000Z"
) {
  return buildWhatChangedViewModel({
    previousCapturedAt: capturedAt,
    current,
    diff: diffEvidenceSnapshots(previous, current),
  });
}

test("identical snapshots omit the reader module", () => {
  const previous = snapshot();
  assert.equal(view(previous, snapshot()), null);
});

test("missing-from-newer only is suppressed", () => {
  const previous = snapshot({
    facts: [fact("Kept."), fact("Gone later.")],
  });
  const current = snapshot({
    facts: [fact("Kept.")],
  });
  assert.equal(view(previous, current), null);
});

test("independentSourceCount-only is omitted", () => {
  const previous = snapshot({ independentSourceCount: 2 });
  const current = snapshot({ independentSourceCount: 4 });
  assert.equal(view(previous, current), null);
});

test("new fact is shown expanded with evidence", () => {
  const previous = snapshot();
  const current = snapshot({
    facts: [...previous.facts, fact("A newly corroborated fact.")],
  });
  const result = view(previous, current);

  assert.ok(result);
  assert.equal(result.defaultExpanded, true);
  assert.deepEqual(
    result.facts.map((item) => item.text),
    ["A newly corroborated fact."]
  );
  assert.equal(result.facts[0]?.evidence.length, 1);
  assert.equal(result.previousCapturedAt, "2026-03-01T00:00:00.000Z");
});

test("added named source is shown collapsed", () => {
  const previous = snapshot({
    sources: [source("https://example.com/a", { isPrimary: true })],
  });
  const current = snapshot();
  const result = view(previous, current);

  assert.ok(result);
  assert.equal(result.defaultExpanded, false);
  assert.equal(result.sources.length, 1);
  assert.equal(result.sources[0]?.name.length > 0, true);
});

test("unnamed added source is omitted", () => {
  const previous = snapshot({
    sources: [source("https://example.com/a", { isPrimary: true })],
  });
  const current = snapshot({
    sources: [
      source("https://example.com/a", { isPrimary: true }),
      source("https://blank.example.com/c", { sourceName: "   " }),
    ],
  });
  assert.equal(view(previous, current), null);
});

test("uncertainty and coverage added expand the module", () => {
  const previous = snapshot({
    uncertainties: [],
    coverageDifferences: [],
  });
  const current = snapshot();
  const result = view(previous, current);

  assert.ok(result);
  assert.equal(result.defaultExpanded, true);
  assert.deepEqual(result.uncertainties, ["The vote margin is unclear."]);
  assert.deepEqual(result.coverageDifferences, [
    "Outlets disagree on the timeline.",
  ]);
});

test("limitedEvidence transition shows a note without other items", () => {
  const moreIndependent = view(
    snapshot({ limitedEvidence: true }),
    snapshot({ limitedEvidence: false })
  );
  const moreLimited = view(
    snapshot({ limitedEvidence: false }),
    snapshot({ limitedEvidence: true })
  );

  assert.equal(moreIndependent?.defaultExpanded, false);
  assert.equal(
    moreIndependent?.limitedEvidenceNote,
    "This brief now draws on more independent reporting than the previous saved analysis."
  );
  assert.equal(
    moreLimited?.limitedEvidenceNote,
    "This brief now has more limited independent reporting than the previous saved analysis."
  );
});

test("display order is facts, uncertainties, coverage, sources, and caps from the bottom", () => {
  const previous = snapshot({
    sources: [source("https://example.com/a")],
    facts: [],
    uncertainties: [],
    coverageDifferences: [],
  });
  const current = snapshot({
    sources: [
      source("https://example.com/a"),
      source("https://a.example.com/1", { sourceName: "A" }),
      source("https://b.example.com/2", { sourceName: "B" }),
      source("https://c.example.com/3", { sourceName: "C" }),
      source("https://d.example.com/4", { sourceName: "D" }),
    ],
    facts: [fact("F1"), fact("F2"), fact("F3"), fact("F4")],
    uncertainties: ["U1", "U2", "U3"],
    coverageDifferences: [
      { text: "C1", publishers: ["P"] },
      { text: "C2", publishers: ["P"] },
      { text: "C3", publishers: ["P"] },
    ],
  });
  const result = view(previous, current);

  assert.ok(result);
  assert.equal(result.facts.length, 3);
  assert.equal(result.uncertainties.length, 2);
  assert.equal(result.coverageDifferences.length, 2);
  assert.equal(result.sources.length, 1);
  assert.equal(
    result.facts.length +
      result.uncertainties.length +
      result.coverageDifferences.length +
      result.sources.length,
    8
  );
});

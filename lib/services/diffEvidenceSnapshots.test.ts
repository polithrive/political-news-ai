import assert from "node:assert/strict";
import test from "node:test";

import type { EvidenceSnapshotV1 } from "../db/evidence";
import { tryBuildStoryKey } from "./storyKey";
import { createStorySnapshotFingerprint } from "./storySnapshotFingerprint";
import { diffEvidenceSnapshots } from "./diffEvidenceSnapshots";

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

function fact(
  text: string,
  extras?: Partial<EvidenceSnapshotV1["facts"][number]>
): EvidenceSnapshotV1["facts"][number] {
  return {
    text,
    publishers: extras?.publishers ?? ["Publisher"],
    support: extras?.support ?? [
      {
        url: "https://example.com/a",
        publisher: "Publisher",
        fragment: "fragment",
        field: "title",
      },
    ],
  };
}

function coverage(
  text: string,
  publishers = ["Publisher"]
): EvidenceSnapshotV1["coverageDifferences"][number] {
  return { text, publishers };
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
      source("https://news.example.com/b"),
    ],
    facts: [fact("The committee voted on the bill.")],
    uncertainties: ["The vote margin is unclear."],
    coverageDifferences: [coverage("Outlets disagree on the timeline.")],
    independentSourceCount: 2,
    limitedEvidence: false,
    ...overrides,
  };
}

function emptySets(diff: ReturnType<typeof diffEvidenceSnapshots>) {
  assert.deepEqual(diff.sourcesAdded, []);
  assert.deepEqual(diff.sourcesMissingFromNewer, []);
  assert.deepEqual(diff.factsAdded, []);
  assert.deepEqual(diff.factsMissingFromNewer, []);
  assert.deepEqual(diff.uncertaintiesAdded, []);
  assert.deepEqual(diff.uncertaintiesMissingFromNewer, []);
  assert.deepEqual(diff.coverageDifferencesAdded, []);
  assert.deepEqual(diff.coverageDifferencesMissingFromNewer, []);
}

test("identical snapshots have no material change", () => {
  const previous = snapshot();
  const current = snapshot();
  const diff = diffEvidenceSnapshots(previous, current);

  assert.equal(diff.hasMaterialChange, false);
  emptySets(diff);
  assert.deepEqual(diff.independentSourceCount, { previous: 2, current: 2 });
  assert.deepEqual(diff.limitedEvidence, { previous: false, current: false });
});

test("source URL added only", () => {
  const previous = snapshot();
  const current = snapshot({
    sources: [
      ...previous.sources,
      source("https://other.example.com/c"),
    ],
  });
  const diff = diffEvidenceSnapshots(previous, current);

  assert.equal(diff.hasMaterialChange, true);
  assert.deepEqual(diff.sourcesAdded, [
    { url: tryBuildStoryKey("https://other.example.com/c") },
  ]);
  assert.deepEqual(diff.sourcesMissingFromNewer, []);
  assert.deepEqual(diff.factsAdded, []);
});

test("source URL missing from newer is not a retraction claim", () => {
  const previous = snapshot();
  const current = snapshot({
    sources: [previous.sources[0]],
  });
  const diff = diffEvidenceSnapshots(previous, current);

  assert.equal(diff.hasMaterialChange, true);
  assert.equal(diff.sourcesMissingFromNewer.length, 1);
  assert.deepEqual(diff.sourcesAdded, []);
  assert.equal("sourcesRetracted" in diff, false);
});

test("corroborated fact text added", () => {
  const previous = snapshot();
  const current = snapshot({
    facts: [...previous.facts, fact("A second corroborated fact.")],
  });
  const diff = diffEvidenceSnapshots(previous, current);

  assert.equal(diff.hasMaterialChange, true);
  assert.deepEqual(diff.factsAdded, [{ text: "A second corroborated fact." }]);
  assert.deepEqual(diff.factsMissingFromNewer, []);
});

test("fact missing from newer is not false or retracted", () => {
  const previous = snapshot({
    facts: [fact("Kept fact."), fact("Missing later.")],
  });
  const current = snapshot({
    facts: [fact("Kept fact.")],
  });
  const diff = diffEvidenceSnapshots(previous, current);

  assert.equal(diff.hasMaterialChange, true);
  assert.deepEqual(diff.factsMissingFromNewer, [{ text: "Missing later." }]);
  assert.equal("factsRetracted" in diff, false);
  assert.equal("factsFalse" in diff, false);
});

test("uncertainty added", () => {
  const previous = snapshot();
  const current = snapshot({
    uncertainties: [...previous.uncertainties, "New uncertainty."],
  });
  const diff = diffEvidenceSnapshots(previous, current);

  assert.equal(diff.hasMaterialChange, true);
  assert.deepEqual(diff.uncertaintiesAdded, [{ text: "New uncertainty." }]);
});

test("uncertainty missing from newer is not resolved", () => {
  const previous = snapshot({
    uncertainties: ["Still listed.", "Dropped later."],
  });
  const current = snapshot({
    uncertainties: ["Still listed."],
  });
  const diff = diffEvidenceSnapshots(previous, current);

  assert.equal(diff.hasMaterialChange, true);
  assert.deepEqual(diff.uncertaintiesMissingFromNewer, [
    { text: "Dropped later." },
  ]);
  assert.equal("uncertaintiesResolved" in diff, false);
});

test("coverage difference added and missing from newer", () => {
  const previous = snapshot({
    coverageDifferences: [coverage("Old disagreement.")],
  });
  const added = diffEvidenceSnapshots(
    previous,
    snapshot({
      coverageDifferences: [
        coverage("Old disagreement."),
        coverage("New disagreement."),
      ],
    })
  );
  const removed = diffEvidenceSnapshots(
    snapshot({
      coverageDifferences: [
        coverage("Old disagreement."),
        coverage("New disagreement."),
      ],
    }),
    previous
  );

  assert.deepEqual(added.coverageDifferencesAdded, [
    { text: "New disagreement." },
  ]);
  assert.deepEqual(removed.coverageDifferencesMissingFromNewer, [
    { text: "New disagreement." },
  ]);
});

test("independentSourceCount increase or decrease is material with empty sets", () => {
  const previous = snapshot({ independentSourceCount: 2 });
  const increased = diffEvidenceSnapshots(
    previous,
    snapshot({ independentSourceCount: 3 })
  );
  const decreased = diffEvidenceSnapshots(
    snapshot({ independentSourceCount: 3 }),
    previous
  );

  assert.equal(increased.hasMaterialChange, true);
  emptySets(increased);
  assert.deepEqual(increased.independentSourceCount, {
    previous: 2,
    current: 3,
  });
  assert.equal(decreased.hasMaterialChange, true);
  assert.deepEqual(decreased.independentSourceCount, {
    previous: 3,
    current: 2,
  });
});

test("limitedEvidence true to false and false to true is material", () => {
  const unrestricted = snapshot({ limitedEvidence: false });
  const limited = snapshot({ limitedEvidence: true });

  const toFalse = diffEvidenceSnapshots(limited, unrestricted);
  const toTrue = diffEvidenceSnapshots(unrestricted, limited);

  assert.equal(toFalse.hasMaterialChange, true);
  emptySets(toFalse);
  assert.deepEqual(toFalse.limitedEvidence, { previous: true, current: false });
  assert.equal(toTrue.hasMaterialChange, true);
  assert.deepEqual(toTrue.limitedEvidence, { previous: false, current: true });
});

test("source reordering only is not material", () => {
  const previous = snapshot();
  const current = snapshot({
    sources: [previous.sources[1], previous.sources[0]],
  });
  const diff = diffEvidenceSnapshots(previous, current);

  assert.equal(diff.hasMaterialChange, false);
  emptySets(diff);
});

test("whitespace-only text differences are not material", () => {
  const previous = snapshot({
    facts: [fact("The committee voted on the bill.")],
    uncertainties: ["The vote margin is unclear."],
    coverageDifferences: [coverage("Outlets disagree on the timeline.")],
  });
  const current = snapshot({
    facts: [fact("  The committee   voted on the bill.  ")],
    uncertainties: ["The vote margin is unclear.  "],
    coverageDifferences: [coverage("\nOutlets disagree on the timeline.")],
  });
  const diff = diffEvidenceSnapshots(previous, current);

  assert.equal(diff.hasMaterialChange, false);
  emptySets(diff);
});

test("duplicate source URLs in one snapshot are one URL", () => {
  const previous = snapshot({
    sources: [source("https://example.com/a")],
  });
  const current = snapshot({
    sources: [
      source("https://example.com/a"),
      source("https://www.example.com/a"),
      source("https://example.com/a?utm_source=x"),
    ],
  });
  const diff = diffEvidenceSnapshots(previous, current);

  assert.equal(diff.hasMaterialChange, false);
  emptySets(diff);
});

test("duplicate identical fact strings versus one copy is not material", () => {
  const previous = snapshot({
    facts: [fact("The committee voted on the bill.")],
  });
  const current = snapshot({
    facts: [
      fact("The committee voted on the bill."),
      fact("The committee voted on the bill."),
    ],
  });
  const diff = diffEvidenceSnapshots(previous, current);

  assert.equal(diff.hasMaterialChange, false);
  emptySets(diff);
});

test("publisher, support, title, and isPrimary only are not material", () => {
  const previous = snapshot();
  const current = snapshot({
    primary: {
      ...previous.primary,
      title: "Different primary title",
      sourceName: "Different desk",
    },
    sources: previous.sources.map((item, index) => ({
      ...item,
      sourceName: `Renamed ${index}`,
      title: `Other headline ${index}`,
      publishedAt: "2026-02-02",
      isPrimary: !item.isPrimary,
    })),
    facts: previous.facts.map((item) => ({
      ...item,
      publishers: ["Other publisher"],
      support: [
        {
          url: "https://example.com/a",
          publisher: "Other publisher",
          fragment: "different fragment",
          field: "description" as const,
        },
      ],
    })),
    coverageDifferences: previous.coverageDifferences.map((item) => ({
      ...item,
      publishers: ["Other publisher"],
    })),
  });
  const diff = diffEvidenceSnapshots(previous, current);

  assert.equal(diff.hasMaterialChange, false);
  emptySets(diff);
  assert.equal(
    createStorySnapshotFingerprint(previous),
    createStorySnapshotFingerprint(current)
  );
});

test("same fingerprint-aligned payload is not material", () => {
  const previous = snapshot();
  const current = structuredClone(previous);
  const diff = diffEvidenceSnapshots(previous, current);

  assert.equal(
    createStorySnapshotFingerprint(previous),
    createStorySnapshotFingerprint(current)
  );
  assert.equal(diff.hasMaterialChange, false);
});

test("fingerprint match forbids reporting a material change", () => {
  const previous = snapshot();
  const current = snapshot({
    sources: [previous.sources[1], previous.sources[0]],
    facts: [fact("  The committee voted on the bill.")],
  });

  assert.equal(
    createStorySnapshotFingerprint(previous),
    createStorySnapshotFingerprint(current)
  );
  assert.equal(diffEvidenceSnapshots(previous, current).hasMaterialChange, false);
});

test("material unique-set change also changes fingerprint", () => {
  const previous = snapshot();
  const current = snapshot({
    facts: [...previous.facts, fact("A newly corroborated fact.")],
  });

  assert.notEqual(
    createStorySnapshotFingerprint(previous),
    createStorySnapshotFingerprint(current)
  );
  assert.equal(diffEvidenceSnapshots(previous, current).hasMaterialChange, true);
});

test("duplicate multiplicity can change fingerprint without a material diff", () => {
  const previous = snapshot({
    facts: [fact("The committee voted on the bill.")],
  });
  const current = snapshot({
    facts: [
      fact("The committee voted on the bill."),
      fact("The committee voted on the bill."),
    ],
  });

  assert.notEqual(
    createStorySnapshotFingerprint(previous),
    createStorySnapshotFingerprint(current)
  );
  assert.equal(diffEvidenceSnapshots(previous, current).hasMaterialChange, false);
});

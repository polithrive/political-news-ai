import "server-only";

import { desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { stories, storySnapshots } from "@/lib/db/schema";

import { diffEvidenceSnapshots } from "./diffEvidenceSnapshots";
import {
  interpretLatestSnapshotRows,
  type StorySnapshotPairResult,
  type StorySnapshotRow,
} from "./storySnapshotPair";
import { tryBuildStoryKey } from "./storyKey";

export type { StorySnapshotPairResult, StorySnapshotRow };

export type StorySnapshotDiffLookup =
  | { status: "none" }
  | { status: "single"; current: StorySnapshotRow }
  | {
      status: "pair";
      previous: StorySnapshotRow;
      current: StorySnapshotRow;
      diff: ReturnType<typeof diffEvidenceSnapshots>;
    };

export async function getLatestDistinctSnapshotPair(
  storyKeyInput: string
): Promise<StorySnapshotPairResult> {
  const storyKey = tryBuildStoryKey(storyKeyInput);

  if (!storyKey) {
    return { status: "none" };
  }

  const db = getDb();

  const [story] = await db
    .select({ id: stories.id })
    .from(stories)
    .where(eq(stories.storyKey, storyKey))
    .limit(1);

  if (!story?.id) {
    return { status: "none" };
  }

  const rows = await db
    .select({
      id: storySnapshots.id,
      capturedAt: storySnapshots.capturedAt,
      fingerprint: storySnapshots.fingerprint,
      evidence: storySnapshots.evidence,
    })
    .from(storySnapshots)
    .where(eq(storySnapshots.storyId, story.id))
    .orderBy(desc(storySnapshots.capturedAt), desc(storySnapshots.id))
    .limit(2);

  return interpretLatestSnapshotRows(rows);
}

export async function diffLatestStorySnapshots(
  storyKeyInput: string
): Promise<StorySnapshotDiffLookup> {
  const pair = await getLatestDistinctSnapshotPair(storyKeyInput);

  if (pair.status !== "pair") {
    return pair;
  }

  return {
    status: "pair",
    previous: pair.previous,
    current: pair.current,
    diff: diffEvidenceSnapshots(pair.previous.evidence, pair.current.evidence),
  };
}

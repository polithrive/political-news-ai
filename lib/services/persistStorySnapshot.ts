import "server-only";

import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { stories, storySnapshots } from "@/lib/db/schema";

import { buildEvidenceSnapshot } from "./buildEvidenceSnapshot";
import { createStorySnapshotFingerprint } from "./storySnapshotFingerprint";
import { tryBuildStoryKey } from "./storyKey";
import type { StorySnapshotInput } from "./storySnapshotInput";

export type StorySnapshotPersistStatus = "stored" | "duplicate" | "skipped";

function logPersistResult(
  status: StorySnapshotPersistStatus,
  details: {
    host?: string;
    fingerprint?: string;
    errorName?: string;
  }
) {
  console.info("story-snapshot persist", {
    status,
    host: details.host,
    fingerprintPrefix: details.fingerprint?.slice(0, 12),
    errorName: details.errorName,
  });
}

export async function persistStorySnapshot(
  input: StorySnapshotInput
): Promise<StorySnapshotPersistStatus> {
  const storyKey = tryBuildStoryKey(input.primary.url);

  if (!storyKey) {
    logPersistResult("skipped", { errorName: "invalid_story_key" });
    return "skipped";
  }

  const snapshot = buildEvidenceSnapshot(input);

  if (!snapshot) {
    logPersistResult("skipped", { errorName: "invalid_snapshot" });
    return "skipped";
  }

  const fingerprint = createStorySnapshotFingerprint(snapshot);
  let host = "";

  try {
    host = new URL(storyKey).host;
  } catch {
    host = "";
  }

  try {
    const db = getDb();

    await db
      .insert(stories)
      .values({
        storyKey,
        primaryUrl: snapshot.primary.url,
      })
      .onConflictDoUpdate({
        target: stories.storyKey,
        set: {
          primaryUrl: snapshot.primary.url,
          updatedAt: new Date(),
        },
      });

    const [story] = await db
      .select({ id: stories.id })
      .from(stories)
      .where(eq(stories.storyKey, storyKey))
      .limit(1);

    if (!story?.id) {
      logPersistResult("skipped", { host, fingerprint, errorName: "missing_story" });
      return "skipped";
    }

    const inserted = await db
      .insert(storySnapshots)
      .values({
        storyId: story.id,
        fingerprint,
        schemaVersion: 1,
        evidence: snapshot,
      })
      .onConflictDoNothing({
        target: [storySnapshots.storyId, storySnapshots.fingerprint],
      })
      .returning({ id: storySnapshots.id });

    const status = inserted.length > 0 ? "stored" : "duplicate";

    logPersistResult(status, { host, fingerprint });

    return status;
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "Error";

    logPersistResult("skipped", { host, fingerprint, errorName });

    return "skipped";
  }
}

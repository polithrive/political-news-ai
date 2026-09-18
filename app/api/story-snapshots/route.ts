import { NextResponse } from "next/server";

import {
  STORY_SNAPSHOT_MAX_BODY_BYTES,
  parseStorySnapshotInput,
} from "@/lib/services/parseStorySnapshotInput";
import { persistStorySnapshot } from "@/lib/services/persistStorySnapshot";
import { diffLatestStorySnapshots } from "@/lib/services/getStorySnapshotPair";
import { buildWhatChangedViewModel } from "@/lib/services/whatChangedViewModel";
import { enforcePublicEndpointGuard } from "@/lib/security/guardRequest";
import { RATE_LIMIT_BUCKETS } from "@/lib/security/rateLimit";

/*
 * MVP boundary: snapshot input currently originates from the client because
 * validated EvidenceBrief and full EvidenceSource[] still coexist there after
 * fresh analysis. Treat the body as untrusted. Future work should build and
 * persist snapshots inside the server-side evidence-analysis pipeline instead.
 */
export async function POST(request: Request) {
  const blocked = enforcePublicEndpointGuard(request, {
    bucket: RATE_LIMIT_BUCKETS.snapshotsWrite,
  });

  if (blocked) {
    return blocked;
  }

  try {
    const contentLengthHeader = request.headers.get("content-length");
    const contentLength = Number(contentLengthHeader);

    if (
      !contentLengthHeader ||
      !Number.isFinite(contentLength) ||
      contentLength <= 0 ||
      contentLength > STORY_SNAPSHOT_MAX_BODY_BYTES
    ) {
      return NextResponse.json({ status: "skipped", whatChanged: null });
    }

    const rawBody = await request.text();

    if (rawBody.length > STORY_SNAPSHOT_MAX_BODY_BYTES) {
      return NextResponse.json({ status: "skipped", whatChanged: null });
    }

    let parsedJson: unknown;

    try {
      parsedJson = JSON.parse(rawBody) as unknown;
    } catch {
      return NextResponse.json({ status: "skipped", whatChanged: null });
    }

    const input = parseStorySnapshotInput(parsedJson);

    if (!input) {
      return NextResponse.json({ status: "skipped", whatChanged: null });
    }

    const status = await persistStorySnapshot(input);

    if (status === "skipped") {
      return NextResponse.json({ status, whatChanged: null });
    }

    try {
      const lookup = await diffLatestStorySnapshots(input.primary.url);

      if (lookup.status !== "pair") {
        return NextResponse.json({ status, whatChanged: null });
      }

      return NextResponse.json({
        status,
        whatChanged: buildWhatChangedViewModel({
          previousCapturedAt: lookup.previous.capturedAt,
          current: lookup.current.evidence,
          diff: lookup.diff,
        }),
      });
    } catch {
      return NextResponse.json({ status, whatChanged: null });
    }
  } catch {
    return NextResponse.json({ status: "skipped", whatChanged: null });
  }
}

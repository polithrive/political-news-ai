import { NextResponse } from "next/server";

import {
  STORY_SNAPSHOT_MAX_BODY_BYTES,
  parseStorySnapshotInput,
} from "@/lib/services/parseStorySnapshotInput";
import { persistStorySnapshot } from "@/lib/services/persistStorySnapshot";

/*
 * MVP boundary: snapshot input currently originates from the client because
 * validated EvidenceBrief and full EvidenceSource[] still coexist there after
 * fresh analysis. Treat the body as untrusted. Future work should build and
 * persist snapshots inside the server-side evidence-analysis pipeline instead.
 */
export async function POST(request: Request) {
  try {
    const contentLengthHeader = request.headers.get("content-length");
    const contentLength = Number(contentLengthHeader);

    if (
      !contentLengthHeader ||
      !Number.isFinite(contentLength) ||
      contentLength <= 0 ||
      contentLength > STORY_SNAPSHOT_MAX_BODY_BYTES
    ) {
      return NextResponse.json({ status: "skipped" });
    }

    const rawBody = await request.text();

    if (rawBody.length > STORY_SNAPSHOT_MAX_BODY_BYTES) {
      return NextResponse.json({ status: "skipped" });
    }

    let parsedJson: unknown;

    try {
      parsedJson = JSON.parse(rawBody) as unknown;
    } catch {
      return NextResponse.json({ status: "skipped" });
    }

    const input = parseStorySnapshotInput(parsedJson);

    if (!input) {
      return NextResponse.json({ status: "skipped" });
    }

    const status = await persistStorySnapshot(input);

    return NextResponse.json({ status });
  } catch {
    return NextResponse.json({ status: "skipped" });
  }
}

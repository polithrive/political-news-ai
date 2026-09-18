import { NextResponse } from "next/server";

import { diffLatestStorySnapshots } from "@/lib/services/getStorySnapshotPair";
import { buildWhatChangedViewModel } from "@/lib/services/whatChangedViewModel";

function empty() {
  return NextResponse.json({ whatChanged: null });
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url).searchParams.get("url");

    if (!url) {
      return empty();
    }

    const lookup = await diffLatestStorySnapshots(url);

    if (lookup.status !== "pair") {
      return empty();
    }

    return NextResponse.json({
      whatChanged: buildWhatChangedViewModel({
        previousCapturedAt: lookup.previous.capturedAt,
        current: lookup.current.evidence,
        diff: lookup.diff,
      }),
    });
  } catch {
    return empty();
  }
}

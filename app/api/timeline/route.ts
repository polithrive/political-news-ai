import { NextResponse } from "next/server";
import { getMockTimeline } from "@/lib/ai/timeline";
import { enforcePublicEndpointGuard } from "@/lib/security/guardRequest";
import { RATE_LIMIT_BUCKETS } from "@/lib/security/rateLimit";

export async function POST(request: Request) {
  const blocked = enforcePublicEndpointGuard(request, {
    bucket: RATE_LIMIT_BUCKETS.cheapApi,
  });

  if (blocked) {
    return blocked;
  }

  return NextResponse.json({
    timeline: getMockTimeline(),
  });
}
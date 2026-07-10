import { NextResponse } from "next/server";
import { getMockTimeline } from "@/lib/ai/timeline";

export async function POST() {
  return NextResponse.json({
    timeline: getMockTimeline(),
  });
}
"use client";

import { useState } from "react";

import { ANALYTICS_EVENTS } from "@/lib/analytics/taxonomy";
import { trackEvent } from "@/lib/analytics/track";

type ShareBriefButtonProps = {
  title: string;
  sharePath?: string | null;
  storyRef?: string;
  className?: string;
};

export default function ShareBriefButton({
  title,
  sharePath,
  storyRef = "unknown",
  className,
}: ShareBriefButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">(
    "idle"
  );

  async function shareBrief() {
    const url = sharePath
      ? `${window.location.origin}${sharePath}`
      : `${window.location.origin}${window.location.pathname}${window.location.search}`;
    const text = `${title}\n\nA 60-second brief from The Angle Report\n${url}`;

    const markShared = () => {
      trackEvent(ANALYTICS_EVENTS.shareClicked, {
        surface: "brief",
        detail: storyRef,
      });
    };

    try {
      if (typeof navigator.share === "function") {
        await navigator.share({
          title,
          text: "A 60-second brief from The Angle Report",
          url,
        });
        markShared();
        return;
      }

      await navigator.clipboard.writeText(text);
      markShared();
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      try {
        await navigator.clipboard.writeText(text);
        markShared();
        setStatus("copied");
        window.setTimeout(() => setStatus("idle"), 2000);
      } catch {
        setStatus("error");
        window.setTimeout(() => setStatus("idle"), 2000);
      }
    }
  }

  return (
    <button
      type="button"
      onClick={() => {
        void shareBrief();
      }}
      className={
        className ??
        "text-sm font-semibold text-[#55C8FF] transition hover:text-[#8EDCFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8]"
      }
    >
      {status === "copied"
        ? "Link copied"
        : status === "error"
          ? "Could not share"
          : "Share"}
    </button>
  );
}

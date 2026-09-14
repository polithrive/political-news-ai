"use client";

import { useState } from "react";

type ShareBriefButtonProps = {
  title: string;
};

export default function ShareBriefButton({
  title,
}: ShareBriefButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">(
    "idle"
  );

  async function shareBrief() {
    const url = window.location.href;
    const text = `${title}\n\nA 60-second brief from The Angle Report\n${url}`;

    try {
      if (typeof navigator.share === "function") {
        await navigator.share({
          title,
          text: "A 60-second brief from The Angle Report",
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(text);
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
      className="text-sm font-semibold text-[#55C8FF] transition hover:text-[#8EDCFF]"
    >
      {status === "copied"
        ? "Link copied"
        : status === "error"
          ? "Could not share"
          : "Share this brief"}
    </button>
  );
}

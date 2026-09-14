"use client";

import { useEffect, useState } from "react";

import { relativeTime } from "./storyMeta";

export default function RelativeTime({
  publishedAt,
}: {
  publishedAt: string;
}) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    setLabel(relativeTime(publishedAt));
  }, [publishedAt]);

  if (!label) {
    return null;
  }

  return <span>{label}</span>;
}

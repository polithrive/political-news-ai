import type { Metadata } from "next";

export function intelligenceRobots(
  briefIsResolvable: boolean
): Metadata["robots"] {
  if (briefIsResolvable) {
    return {
      index: false,
      follow: true,
    };
  }

  return {
    index: false,
    follow: false,
  };
}

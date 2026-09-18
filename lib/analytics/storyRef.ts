import { tryBuildStoryKey } from "@/lib/services/storyKey";

function fnv1a32Hex(value: string): string {
  let hash = 0x811c9dc5;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function storyRefFromUrl(url: string | null | undefined): string {
  if (!url) {
    return "unknown";
  }

  const storyKey = tryBuildStoryKey(url);

  if (!storyKey) {
    return "unknown";
  }

  return fnv1a32Hex(storyKey);
}

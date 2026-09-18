import { normalizeArticleUrl } from "./articleExtractor";

const TRACKING_PARAM_KEYS = new Set([
  "fbclid",
  "gclid",
  "mc_cid",
  "mc_eid",
]);

function isTrackingParam(key: string) {
  const normalized = key.toLowerCase();

  return normalized.startsWith("utm_") || TRACKING_PARAM_KEYS.has(normalized);
}

export function buildStoryKey(input: string): string {
  const normalized = normalizeArticleUrl(input);
  const url = new URL(normalized);

  url.hostname = url.hostname.toLowerCase().replace(/^www\./, "");

  const keptParams: Array<[string, string]> = [];

  url.searchParams.forEach((value, key) => {
    if (!isTrackingParam(key)) {
      keptParams.push([key, value]);
    }
  });

  keptParams.sort((left, right) => {
    const keyOrder = left[0].localeCompare(right[0]);

    if (keyOrder !== 0) {
      return keyOrder;
    }

    return left[1].localeCompare(right[1]);
  });

  url.search = "";

  for (const [key, value] of keptParams) {
    url.searchParams.append(key, value);
  }

  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
  }

  return url.toString();
}

export function tryBuildStoryKey(input: string): string | null {
  try {
    const storyKey = buildStoryKey(input).trim();

    return storyKey || null;
  } catch {
    return null;
  }
}

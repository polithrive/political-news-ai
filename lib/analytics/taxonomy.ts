export const ANALYTICS_EVENTS = {
  homepageViewed: "homepage_viewed",
  briefSelected: "brief_selected",
  briefReady: "brief_ready",
  briefFailed: "brief_failed",
  evidenceOpened: "evidence_opened",
  angleInteracted: "angle_interacted",
  whatChangedToggled: "what_changed_toggled",
  askAngleOpened: "ask_angle_opened",
  askAngleSuccess: "ask_angle_success",
  askAngleFailed: "ask_angle_failed",
  analyzeSubmitted: "analyze_submitted",
  analyzeSuccess: "analyze_success",
  analyzeFailed: "analyze_failed",
  shareClicked: "share_clicked",
  readOriginalClicked: "read_original_clicked",
  rateLimited: "rate_limited",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export const ANALYTICS_SURFACES = [
  "home",
  "search",
  "feed",
  "analyze",
  "brief",
  "chat",
  "news",
  "identity",
  "api",
] as const;

export type AnalyticsSurface = (typeof ANALYTICS_SURFACES)[number];

export const ANALYTICS_DETAILS = [
  "unknown",
  "rate_limited",
  "disabled",
  "generation",
  "extract",
  "invalid",
  "network",
  "missing",
  "malformed",
  "empty",
  "abort",
  "ai-expensive",
  "ai-generate",
  "ai-preview",
  "ai-chat",
  "snapshots-write",
  "snapshots-read",
  "news",
  "cheap-api",
] as const;

export type AnalyticsDetail = (typeof ANALYTICS_DETAILS)[number] | string;

export type AnalyticsProperties = {
  surface?: AnalyticsSurface;
  detail?: string;
};

export const MAX_CUSTOM_PROPERTIES = 2;
export const MAX_PROPERTY_VALUE_LENGTH = 64;

const SURFACE_SET = new Set<string>(ANALYTICS_SURFACES);
const DETAIL_SET = new Set<string>(ANALYTICS_DETAILS);

function looksLikeUrlOrSecret(value: string): boolean {
  const lowered = value.toLowerCase();

  return (
    lowered.includes("http:") ||
    lowered.includes("https:") ||
    lowered.includes("://") ||
    lowered.includes("api_key") ||
    lowered.includes("authorization") ||
    lowered.includes("bearer ") ||
    lowered.includes("?") ||
    lowered.includes("/")
  );
}

export function isSafeStoryRef(value: string): boolean {
  return value === "unknown" || /^[a-f0-9]{8}$/.test(value);
}

export function sanitizeAnalyticsValue(value: string): string | null {
  const trimmed = value.trim().slice(0, MAX_PROPERTY_VALUE_LENGTH);

  if (!trimmed || looksLikeUrlOrSecret(trimmed)) {
    return null;
  }

  if (!/^[a-z0-9_-]+$/i.test(trimmed)) {
    return null;
  }

  return trimmed;
}

export function buildEventProperties(
  input: AnalyticsProperties
): Record<string, string> | undefined {
  const properties: Record<string, string> = {};

  if (input.surface) {
    const surface = sanitizeAnalyticsValue(input.surface);

    if (surface && SURFACE_SET.has(surface)) {
      properties.surface = surface;
    }
  }

  if (input.detail) {
    const detail = sanitizeAnalyticsValue(input.detail);

    if (
      detail &&
      (DETAIL_SET.has(detail) ||
        isSafeStoryRef(detail) ||
        /^status_\d{3}$/.test(detail))
    ) {
      properties.detail = detail;
    }
  }

  const keys = Object.keys(properties);

  if (keys.length === 0) {
    return undefined;
  }

  if (keys.length > MAX_CUSTOM_PROPERTIES) {
    return {
      surface: properties.surface,
      detail: properties.detail,
    };
  }

  return properties;
}

export function failureDetailFromHttpStatus(status: number | null): string {
  if (status === 429) {
    return "rate_limited";
  }

  if (status === 503) {
    return "disabled";
  }

  if (status === 422) {
    return "extract";
  }

  if (status === 400) {
    return "invalid";
  }

  if (status === 0) {
    return "network";
  }

  return "generation";
}

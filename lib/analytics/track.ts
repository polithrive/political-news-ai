import {
  ANALYTICS_EVENTS,
  buildEventProperties,
  type AnalyticsEventName,
  type AnalyticsProperties,
  type AnalyticsSurface,
} from "./taxonomy";
import { storyRefFromUrl } from "./storyRef";

type AnalyticsTracker = (
  name: AnalyticsEventName,
  properties?: Record<string, string>
) => void;

let injectedTracker: AnalyticsTracker | null = null;
const firedOnce = new Set<string>();

export function setAnalyticsTrackerForTests(
  tracker: AnalyticsTracker | null
): void {
  injectedTracker = tracker;
}

export function resetAnalyticsOnceKeysForTests(): void {
  firedOnce.clear();
}

function sendEvent(
  name: AnalyticsEventName,
  properties?: Record<string, string>
): void {
  if (injectedTracker) {
    injectedTracker(name, properties);
    return;
  }

  void import("@vercel/analytics")
    .then(({ track }) => {
      if (properties) {
        track(name, properties);
      } else {
        track(name);
      }
    })
    .catch(() => {
      // Analytics must never affect the product.
    });
}

export function trackEvent(
  name: AnalyticsEventName,
  properties: AnalyticsProperties = {},
  options?: { onceKey?: string }
): void {
  try {
    if (options?.onceKey) {
      if (firedOnce.has(options.onceKey)) {
        return;
      }

      firedOnce.add(options.onceKey);
    }

    sendEvent(name, buildEventProperties(properties));
  } catch {
    // Analytics must never affect the product.
  }
}

export function trackBriefSelected(
  articleUrl: string,
  surface: Extract<AnalyticsSurface, "home" | "search">
): void {
  trackEvent(ANALYTICS_EVENTS.briefSelected, {
    surface,
    detail: storyRefFromUrl(articleUrl),
  });
}

export function trackReadOriginal(
  articleUrl: string,
  surface: Extract<AnalyticsSurface, "home" | "brief">
): void {
  trackEvent(ANALYTICS_EVENTS.readOriginalClicked, {
    surface,
    detail: storyRefFromUrl(articleUrl),
  });
}

import assert from "node:assert/strict";
import test from "node:test";

import { redactAnalyticsPageUrl } from "./redactPageUrl";
import { storyRefFromUrl } from "./storyRef";
import {
  ANALYTICS_EVENTS,
  MAX_CUSTOM_PROPERTIES,
  buildEventProperties,
  failureDetailFromHttpStatus,
} from "./taxonomy";
import {
  resetAnalyticsOnceKeysForTests,
  setAnalyticsTrackerForTests,
  trackBriefSelected,
  trackEvent,
} from "./track";

test("event names are a closed funnel set", () => {
  assert.equal(ANALYTICS_EVENTS.homepageViewed, "homepage_viewed");
  assert.equal(ANALYTICS_EVENTS.briefSelected, "brief_selected");
  assert.equal(ANALYTICS_EVENTS.rateLimited, "rate_limited");
});

test("custom properties are capped at two and reject sensitive values", () => {
  const properties = buildEventProperties({
    surface: "brief",
    detail: "https://example.com/secret?token=abc",
  });

  assert.deepEqual(properties, { surface: "brief" });
  assert.ok(properties);
  assert.ok(Object.keys(properties).length <= MAX_CUSTOM_PROPERTIES);

  const questionLeak = buildEventProperties({
    surface: "chat",
    detail: "What did the senator say about taxes?",
  });

  assert.deepEqual(questionLeak, { surface: "chat" });

  const story = buildEventProperties({
    surface: "home",
    detail: "a1b2c3d4",
  });

  assert.deepEqual(story, { surface: "home", detail: "a1b2c3d4" });
});

test("story refs are stable and are not article URLs", () => {
  const url =
    "https://www.example.com/politics/story?utm_source=x&id=12";
  const ref = storyRefFromUrl(url);

  assert.match(ref, /^[a-f0-9]{8}$/);
  assert.equal(ref.includes("http"), false);
  assert.equal(ref.includes("example"), false);
  assert.equal(
    storyRefFromUrl("https://example.com/politics/story?id=12"),
    ref
  );
});

test("pageview redaction strips shareable article URLs from query strings", () => {
  const redacted = redactAnalyticsPageUrl(
    "https://theanglereport.com/intelligence/example-story?u=https://news.example/article?id=9#brief"
  );

  assert.equal(
    redacted,
    "https://theanglereport.com/intelligence/example-story"
  );
  assert.equal(redacted.includes("u="), false);
  assert.equal(redacted.includes("news.example"), false);
});

test("analytics failures and duplicate once-keys do not throw", () => {
  resetAnalyticsOnceKeysForTests();
  setAnalyticsTrackerForTests(() => {
    throw new Error("analytics down");
  });

  try {
    trackEvent(ANALYTICS_EVENTS.homepageViewed);
    trackEvent(
      ANALYTICS_EVENTS.briefReady,
      { surface: "feed", detail: "abcd1234" },
      { onceKey: "ready:abcd1234" }
    );
    trackEvent(
      ANALYTICS_EVENTS.briefReady,
      { surface: "feed", detail: "abcd1234" },
      { onceKey: "ready:abcd1234" }
    );
  } finally {
    setAnalyticsTrackerForTests(null);
    resetAnalyticsOnceKeysForTests();
  }
});

test("duplicate once-keys send a single event", () => {
  resetAnalyticsOnceKeysForTests();
  const sent: Array<{ name: string; properties?: Record<string, string> }> =
    [];

  setAnalyticsTrackerForTests((name, properties) => {
    sent.push({ name, properties });
  });

  try {
    trackEvent(
      ANALYTICS_EVENTS.homepageViewed,
      {},
      { onceKey: "homepage" }
    );
    trackEvent(
      ANALYTICS_EVENTS.homepageViewed,
      {},
      { onceKey: "homepage" }
    );
    trackBriefSelected("https://example.com/a-story", "home");

    assert.equal(sent.length, 2);
    assert.equal(sent[0]?.name, "homepage_viewed");
    assert.equal(sent[1]?.name, "brief_selected");
    assert.equal(sent[1]?.properties?.surface, "home");
    assert.match(sent[1]?.properties?.detail ?? "", /^[a-f0-9]{8}$/);
    assert.equal(JSON.stringify(sent).includes("http"), false);
  } finally {
    setAnalyticsTrackerForTests(null);
    resetAnalyticsOnceKeysForTests();
  }
});

test("HTTP statuses map to closed failure details", () => {
  assert.equal(failureDetailFromHttpStatus(429), "rate_limited");
  assert.equal(failureDetailFromHttpStatus(422), "extract");
  assert.equal(failureDetailFromHttpStatus(503), "disabled");
  assert.equal(failureDetailFromHttpStatus(500), "generation");
});

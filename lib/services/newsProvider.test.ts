import assert from "node:assert/strict";
import test from "node:test";

import {
  GNEWS_MAX_ARTICLES_PER_REQUEST,
  normalizeGNewsArticle,
  resolveNewsProvider,
} from "./newsProvider";

test("normalizeGNewsArticle maps image and source.name into the app model", () => {
  const normalized = normalizeGNewsArticle({
    title: "Senate passes bill",
    description: "Lawmakers voted overnight.",
    url: "https://example.com/story",
    image: "https://example.com/photo.jpg",
    publishedAt: "2026-09-24T12:00:00Z",
    source: { name: "Example News", url: "https://example.com" },
  });

  assert.deepEqual(normalized, {
    title: "Senate passes bill",
    description: "Lawmakers voted overnight.",
    url: "https://example.com/story",
    urlToImage: "https://example.com/photo.jpg",
    publishedAt: "2026-09-24T12:00:00Z",
    source: { name: "Example News" },
    content: null,
  });
});

test("normalizeGNewsArticle drops articles without title or url", () => {
  assert.equal(
    normalizeGNewsArticle({
      title: "",
      url: "https://example.com/story",
      image: "https://example.com/photo.jpg",
    }),
    null
  );
});

test("resolveNewsProvider defaults to newsapi and does not read GNEWS_API_KEY", () => {
  const previousProvider = process.env.NEWS_PROVIDER;
  const previousNews = process.env.NEWS_API_KEY;
  const previousGnews = process.env.GNEWS_API_KEY;

  delete process.env.NEWS_PROVIDER;
  process.env.NEWS_API_KEY = "news-test-key";
  process.env.GNEWS_API_KEY = "gnews-test-key";

  try {
    const resolved = resolveNewsProvider();
    assert.equal(resolved.ok, true);
    if (resolved.ok) {
      assert.equal(resolved.name, "newsapi");
      assert.equal(resolved.apiKey, "news-test-key");
    }
  } finally {
    if (previousProvider === undefined) {
      delete process.env.NEWS_PROVIDER;
    } else {
      process.env.NEWS_PROVIDER = previousProvider;
    }

    if (previousNews === undefined) {
      delete process.env.NEWS_API_KEY;
    } else {
      process.env.NEWS_API_KEY = previousNews;
    }

    if (previousGnews === undefined) {
      delete process.env.GNEWS_API_KEY;
    } else {
      process.env.GNEWS_API_KEY = previousGnews;
    }
  }
});

test("resolveNewsProvider uses GNEWS_API_KEY only when NEWS_PROVIDER is gnews", () => {
  const previousProvider = process.env.NEWS_PROVIDER;
  const previousNews = process.env.NEWS_API_KEY;
  const previousGnews = process.env.GNEWS_API_KEY;

  process.env.NEWS_PROVIDER = "gnews";
  process.env.NEWS_API_KEY = "news-test-key";
  process.env.GNEWS_API_KEY = "gnews-test-key";

  try {
    const resolved = resolveNewsProvider();
    assert.equal(resolved.ok, true);
    if (resolved.ok) {
      assert.equal(resolved.name, "gnews");
      assert.equal(resolved.apiKey, "gnews-test-key");
    }

    assert.equal(GNEWS_MAX_ARTICLES_PER_REQUEST, 25);
  } finally {
    if (previousProvider === undefined) {
      delete process.env.NEWS_PROVIDER;
    } else {
      process.env.NEWS_PROVIDER = previousProvider;
    }

    if (previousNews === undefined) {
      delete process.env.NEWS_API_KEY;
    } else {
      process.env.NEWS_API_KEY = previousNews;
    }

    if (previousGnews === undefined) {
      delete process.env.GNEWS_API_KEY;
    } else {
      process.env.GNEWS_API_KEY = previousGnews;
    }
  }
});

test("resolveNewsProvider rejects unknown providers instead of falling back", () => {
  const previousProvider = process.env.NEWS_PROVIDER;

  process.env.NEWS_PROVIDER = "both";

  try {
    const resolved = resolveNewsProvider();
    assert.equal(resolved.ok, false);
    if (!resolved.ok) {
      assert.equal(resolved.code, "invalidProvider");
    }
  } finally {
    if (previousProvider === undefined) {
      delete process.env.NEWS_PROVIDER;
    } else {
      process.env.NEWS_PROVIDER = previousProvider;
    }
  }
});

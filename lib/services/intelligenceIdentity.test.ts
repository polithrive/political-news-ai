import assert from "node:assert/strict";
import test from "node:test";

import {
  articleUrlsMatch,
  canonicalArticleUrl,
  createIntelligenceHref,
  intelligenceSlug,
  parseIntelligenceArticleUrl,
} from "./intelligenceIdentity";

test("same article produces the same public identifier after tracking params", () => {
  const withTracking =
    "https://www.Example.com/news/story/?utm_source=share&utm_medium=social&fbclid=abc";
  const withoutTracking = "https://example.com/news/story";

  assert.equal(
    canonicalArticleUrl(withTracking),
    canonicalArticleUrl(withoutTracking)
  );

  const hrefA = createIntelligenceHref({
    title: "Fed raises rates",
    url: withTracking,
  });
  const hrefB = createIntelligenceHref({
    title: "Fed raises rates",
    url: withoutTracking,
  });

  assert.ok(hrefA);
  assert.equal(hrefA, hrefB);
  assert.match(hrefA, /^\/intelligence\/fed-raises-rates\?u=/);
});

test("distinct article URLs do not collide", () => {
  const first = createIntelligenceHref({
    title: "Same title",
    url: "https://example.com/a",
  });
  const second = createIntelligenceHref({
    title: "Same title",
    url: "https://example.com/b",
  });

  assert.ok(first);
  assert.ok(second);
  assert.notEqual(first, second);
});

test("punctuation-only titles still get a stable slug", () => {
  assert.equal(intelligenceSlug("!!!"), "story");

  const href = createIntelligenceHref({
    title: "!!!",
    url: "https://example.com/bare",
  });

  assert.equal(
    href,
    `/intelligence/story?u=${encodeURIComponent("https://example.com/bare")}`
  );
});

test("malformed and missing identities fail safely", () => {
  assert.deepEqual(parseIntelligenceArticleUrl(undefined), {
    ok: false,
    reason: "missing",
  });
  assert.deepEqual(parseIntelligenceArticleUrl("   "), {
    ok: false,
    reason: "missing",
  });
  assert.deepEqual(parseIntelligenceArticleUrl("not-a-url"), {
    ok: false,
    reason: "malformed",
  });
  assert.deepEqual(parseIntelligenceArticleUrl("javascript:alert(1)"), {
    ok: false,
    reason: "malformed",
  });
  assert.deepEqual(parseIntelligenceArticleUrl("http://localhost/secret"), {
    ok: false,
    reason: "malformed",
  });
});

test("fresh-browser resolution does not require selectedArticle storage", () => {
  const href = createIntelligenceHref({
    title: "Canada talks",
    url: "https://www.npr.org/2026/01/01/fed-raises",
  });

  assert.ok(href);

  const query = href.split("?")[1] ?? "";
  const parsed = parseIntelligenceArticleUrl(
    new URLSearchParams(query).get("u")
  );

  assert.equal(parsed.ok, true);
  if (parsed.ok) {
    assert.equal(
      parsed.articleUrl,
      "https://npr.org/2026/01/01/fed-raises"
    );
  }
});

test("articleUrlsMatch follows story_key normalization", () => {
  assert.equal(
    articleUrlsMatch(
      "https://WWW.Example.com/path/?utm_campaign=x",
      "https://example.com/path"
    ),
    true
  );
  assert.equal(
    articleUrlsMatch("https://example.com/one", "https://example.com/two"),
    false
  );
});

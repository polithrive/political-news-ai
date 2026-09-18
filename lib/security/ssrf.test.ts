import assert from "node:assert/strict";
import test from "node:test";

import { normalizeArticleUrl } from "../services/articleExtractor";

import { isBlockedHostname } from "./publicUrl";
import { fetchPublicArticleHtml } from "./ssrf";

test("malformed and private URLs are rejected before fetch", () => {
  assert.throws(() => normalizeArticleUrl("not-a-url"));
  assert.throws(() => normalizeArticleUrl("javascript:alert(1)"));
  assert.throws(() => normalizeArticleUrl("ftp://example.com/a"));
  assert.throws(() => normalizeArticleUrl("http://localhost/secret"));
  assert.throws(() => normalizeArticleUrl("http://127.0.0.1/secret"));
  assert.throws(() => normalizeArticleUrl("http://10.0.0.5/secret"));
  assert.throws(() => normalizeArticleUrl("http://192.168.1.8/secret"));
  assert.throws(() => normalizeArticleUrl("http://169.254.169.254/latest"));
  assert.throws(() => normalizeArticleUrl("http://metadata.google.internal/"));
  assert.throws(() => normalizeArticleUrl("http://[::1]/"));
  assert.throws(() => normalizeArticleUrl("http://[fd00::1]/"));
  assert.throws(() => normalizeArticleUrl("https://example.com:8080/news"));
  assert.throws(() =>
    normalizeArticleUrl("https://user:pass@example.com/news")
  );
});

test("legitimate public article URLs remain usable", () => {
  assert.equal(
    normalizeArticleUrl("https://www.npr.org/2026/01/01/story#section"),
    "https://www.npr.org/2026/01/01/story"
  );
  assert.equal(isBlockedHostname("npr.org"), false);
  assert.equal(isBlockedHostname("www.bbc.co.uk"), false);
});

test("redirects cannot bypass SSRF protections", async () => {
  const lookup = async (hostname: string) => {
        if (hostname === "news.example") {
      return ["8.8.8.8"];
    }

    throw new Error("unexpected lookup");
  };

  const fetchImpl: typeof fetch = async (input) => {
    const url = String(input);

    if (url === "https://news.example/article") {
      return new Response(null, {
        status: 302,
        headers: {
          location: "http://169.254.169.254/latest/meta-data/",
        },
      });
    }

    throw new Error(`unexpected fetch ${url}`);
  };

  await assert.rejects(
    () =>
      fetchPublicArticleHtml("https://news.example/article", {
        fetchImpl,
        lookup,
      }),
    /not supported|private/i
  );
});

test("redirects to a public host still fetch the article", async () => {
  const lookup = async (hostname: string) => {
    if (hostname === "news.example" || hostname === "cdn.example") {
      return ["8.8.8.8"];
    }

    throw new Error(`unexpected lookup ${hostname}`);
  };

  const fetchImpl: typeof fetch = async (input) => {
    const url = String(input);

    if (url === "https://news.example/article") {
      return new Response(null, {
        status: 301,
        headers: {
          location: "https://cdn.example/article.html",
        },
      });
    }

    if (url === "https://cdn.example/article.html") {
      return new Response("<html><article>ok</article></html>", {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      });
    }

    throw new Error(`unexpected fetch ${url}`);
  };

  const result = await fetchPublicArticleHtml("https://news.example/article", {
    fetchImpl,
    lookup,
  });

  assert.equal(result.finalUrl, "https://cdn.example/article.html");
  assert.match(result.html, /ok/);
});

test("resolved DNS to a private address is rejected", async () => {
  const lookup = async () => ["10.1.2.3"];
  const fetchImpl: typeof fetch = async () => {
    throw new Error("fetch should not run");
  };

  await assert.rejects(
    () =>
      fetchPublicArticleHtml("https://internal.example/story", {
        fetchImpl,
        lookup,
      }),
    /private/i
  );
});

import assert from "node:assert/strict";
import test from "node:test";

import robots from "../../app/robots";
import sitemap from "../../app/sitemap";
import { intelligenceRobots } from "./intelligenceRobots";
import {
  CANONICAL_ORIGIN,
  getMetadataBase,
} from "./siteUrl";

test("metadataBase falls back to the production apex origin", () => {
  const previous = process.env.NEXT_PUBLIC_APP_URL;
  delete process.env.NEXT_PUBLIC_APP_URL;

  try {
    assert.equal(getMetadataBase().origin, CANONICAL_ORIGIN);
    assert.equal(
      `${getMetadataBase().origin}/about`,
      `${CANONICAL_ORIGIN}/about`
    );
  } finally {
    if (previous === undefined) {
      delete process.env.NEXT_PUBLIC_APP_URL;
    } else {
      process.env.NEXT_PUBLIC_APP_URL = previous;
    }
  }
});

test("metadataBase uses NEXT_PUBLIC_APP_URL when it is a valid http(s) origin", () => {
  const previous = process.env.NEXT_PUBLIC_APP_URL;
  process.env.NEXT_PUBLIC_APP_URL = "https://theanglereport.com/";

  try {
    assert.equal(getMetadataBase().origin, CANONICAL_ORIGIN);
  } finally {
    if (previous === undefined) {
      delete process.env.NEXT_PUBLIC_APP_URL;
    } else {
      process.env.NEXT_PUBLIC_APP_URL = previous;
    }
  }
});

test("sitemap lists only indexable public pages on the canonical origin", () => {
  const previous = process.env.NEXT_PUBLIC_APP_URL;
  delete process.env.NEXT_PUBLIC_APP_URL;

  try {
    const urls = sitemap().map((entry) => entry.url);

    assert.deepEqual(urls, [
      `${CANONICAL_ORIGIN}/`,
      `${CANONICAL_ORIGIN}/about`,
      `${CANONICAL_ORIGIN}/privacy`,
      `${CANONICAL_ORIGIN}/terms`,
      `${CANONICAL_ORIGIN}/contact`,
    ]);
    assert.equal(
      urls.some((url) => url.includes("/intelligence")),
      false
    );
    assert.equal(
      urls.some((url) => url.includes("/polls")),
      false
    );
  } finally {
    if (previous === undefined) {
      delete process.env.NEXT_PUBLIC_APP_URL;
    } else {
      process.env.NEXT_PUBLIC_APP_URL = previous;
    }
  }
});

test("robots includes canonical host, sitemap, and de-scoped disallows", () => {
  const previous = process.env.NEXT_PUBLIC_APP_URL;
  delete process.env.NEXT_PUBLIC_APP_URL;

  try {
    const result = robots();

    assert.equal(result.host, "theanglereport.com");
    assert.equal(result.sitemap, `${CANONICAL_ORIGIN}/sitemap.xml`);
    assert.deepEqual(result.rules, {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/polls",
        "/forecasts",
        "/signin",
        "/saved",
        "/watchlist",
        "/alerts",
        "/premium",
        "/timeline",
        "/perspectives",
        "/article",
      ],
    });
  } finally {
    if (previous === undefined) {
      delete process.env.NEXT_PUBLIC_APP_URL;
    } else {
      process.env.NEXT_PUBLIC_APP_URL = previous;
    }
  }
});

test("shareable intelligence briefs are noindex follow", () => {
  assert.deepEqual(intelligenceRobots(true), {
    index: false,
    follow: true,
  });
});

test("malformed intelligence URLs stay noindex nofollow", () => {
  assert.deepEqual(intelligenceRobots(false), {
    index: false,
    follow: false,
  });
});

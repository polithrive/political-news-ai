import assert from "node:assert/strict";
import test from "node:test";

import {
  consumeRateLimit,
  RATE_LIMIT_BUCKETS,
  resetRateLimitStoreForTests,
} from "./rateLimit";

test("normal requests stay under the limit", () => {
  resetRateLimitStoreForTests();

  const bucket = { name: "test-ok", limit: 3, windowMs: 60_000 };

  assert.equal(consumeRateLimit("ip-a", bucket).ok, true);
  assert.equal(consumeRateLimit("ip-a", bucket).ok, true);
  const third = consumeRateLimit("ip-a", bucket);
  assert.equal(third.ok, true);
  if (third.ok) {
    assert.equal(third.remaining, 0);
  }
});

test("burst requests are rejected after the limit", () => {
  resetRateLimitStoreForTests();

  const bucket = { name: "test-burst", limit: 2, windowMs: 60_000 };

  assert.equal(consumeRateLimit("ip-b", bucket).ok, true);
  assert.equal(consumeRateLimit("ip-b", bucket).ok, true);

  const blocked = consumeRateLimit("ip-b", bucket);
  assert.equal(blocked.ok, false);
  if (!blocked.ok) {
    assert.ok(blocked.retryAfterSeconds >= 1);
  }
});

test("separate buckets do not share counters", () => {
  resetRateLimitStoreForTests();

  const first = { name: "bucket-one", limit: 1, windowMs: 60_000 };
  const second = { name: "bucket-two", limit: 1, windowMs: 60_000 };

  assert.equal(consumeRateLimit("same-ip", first).ok, true);
  assert.equal(consumeRateLimit("same-ip", first).ok, false);
  assert.equal(consumeRateLimit("same-ip", second).ok, true);
});

test("named production buckets stay distinct", () => {
  resetRateLimitStoreForTests();

  assert.notEqual(
    RATE_LIMIT_BUCKETS.aiExpensive.name,
    RATE_LIMIT_BUCKETS.aiChat.name
  );
  assert.ok(
    RATE_LIMIT_BUCKETS.aiExpensive.limit < RATE_LIMIT_BUCKETS.aiChat.limit
  );
  assert.ok(
    RATE_LIMIT_BUCKETS.aiExpensive.limit < RATE_LIMIT_BUCKETS.aiPreview.limit
  );
});

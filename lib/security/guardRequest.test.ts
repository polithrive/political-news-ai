import assert from "node:assert/strict";
import test from "node:test";

import { enforcePublicEndpointGuard } from "./guardRequest";
import {
  RATE_LIMIT_BUCKETS,
  resetRateLimitStoreForTests,
} from "./rateLimit";

function requestWithIp(ip: string) {
  return new Request("http://localhost/api/test", {
    method: "POST",
    headers: {
      "x-forwarded-for": ip,
      "content-type": "application/json",
    },
  });
}

test("kill switch blocks AI generation without a 429", () => {
  resetRateLimitStoreForTests();
  const previousVercel = process.env.VERCEL;
  const previousDisabled = process.env.AI_DISABLED;
  process.env.VERCEL = "1";
  process.env.AI_DISABLED = "1";

  try {
    const response = enforcePublicEndpointGuard(requestWithIp("203.0.113.10"), {
      bucket: RATE_LIMIT_BUCKETS.aiChat,
      ai: true,
    });

    assert.ok(response);
    assert.equal(response.status, 503);
  } finally {
    if (previousVercel === undefined) {
      delete process.env.VERCEL;
    } else {
      process.env.VERCEL = previousVercel;
    }

    if (previousDisabled === undefined) {
      delete process.env.AI_DISABLED;
    } else {
      process.env.AI_DISABLED = previousDisabled;
    }
  }
});

test("guard returns 429 after the bucket is exhausted", () => {
  resetRateLimitStoreForTests();
  const previousVercel = process.env.VERCEL;
  const previousDisabled = process.env.AI_DISABLED;
  process.env.VERCEL = "1";
  delete process.env.AI_DISABLED;

  const tiny = { name: "guard-tiny", limit: 1, windowMs: 60_000 };

  try {
    const allowed = enforcePublicEndpointGuard(requestWithIp("198.51.100.20"), {
      bucket: tiny,
    });
    assert.equal(allowed, null);

    const blocked = enforcePublicEndpointGuard(requestWithIp("198.51.100.20"), {
      bucket: tiny,
    });
    assert.ok(blocked);
    assert.equal(blocked.status, 429);
    assert.equal(blocked.headers.get("Retry-After"), "60");
  } finally {
    if (previousVercel === undefined) {
      delete process.env.VERCEL;
    } else {
      process.env.VERCEL = previousVercel;
    }

    if (previousDisabled === undefined) {
      delete process.env.AI_DISABLED;
    } else {
      process.env.AI_DISABLED = previousDisabled;
    }
  }
});

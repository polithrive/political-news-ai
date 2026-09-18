import assert from "node:assert/strict";
import test from "node:test";

import nextConfig from "../../next.config";

import { POST as analyzeUrlPost } from "../../app/api/analyze-url/route";
import { POST as chatPost } from "../../app/api/chat/route";
import { POST as timelinePost } from "../../app/api/timeline/route";

import { resetRateLimitStoreForTests } from "./rateLimit";

function jsonRequest(path: string, ip: string, body: unknown) {
  return new Request(`http://localhost${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

test("security headers include clickjacking and sniffing protections", async () => {
  assert.ok(nextConfig.headers);
  const headers = await nextConfig.headers();
  const values = Object.fromEntries(
    headers[0].headers.map((header) => [header.key, header.value])
  );

  assert.equal(values["X-Frame-Options"], "DENY");
  assert.equal(values["X-Content-Type-Options"], "nosniff");
  assert.equal(values["Referrer-Policy"], "strict-origin-when-cross-origin");
  assert.match(values["Permissions-Policy"], /camera=\(\)/);
  assert.ok(values["Content-Security-Policy-Report-Only"]);
});

test("analyze-url rejects a private destination without generating", async () => {
  resetRateLimitStoreForTests();
  const previousVercel = process.env.VERCEL;
  const previousDisabled = process.env.AI_DISABLED;
  process.env.VERCEL = "1";
  delete process.env.AI_DISABLED;

  try {
    const response = await analyzeUrlPost(
      jsonRequest("/api/analyze-url", "203.0.113.80", {
        url: "http://127.0.0.1/latest",
      })
    );

    assert.equal(response.status, 400);
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

test("chat kill switch returns 503", async () => {
  resetRateLimitStoreForTests();
  const previousVercel = process.env.VERCEL;
  const previousDisabled = process.env.AI_DISABLED;
  process.env.VERCEL = "1";
  process.env.AI_DISABLED = "true";

  try {
    const response = await chatPost(
      jsonRequest("/api/chat", "203.0.113.81", {
        question: "What happened?",
        reportTitle: "Test",
        reportContext: "Article\nA test.",
      })
    );

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

test("inexpensive timeline route succeeds then 429s on burst", async () => {
  resetRateLimitStoreForTests();
  const previousVercel = process.env.VERCEL;
  process.env.VERCEL = "1";

  try {
    const ip = "203.0.113.82";
    const first = await timelinePost(jsonRequest("/api/timeline", ip, {}));
    assert.equal(first.status, 200);

    let lastStatus = 200;

    for (let i = 0; i < 50; i += 1) {
      const response = await timelinePost(jsonRequest("/api/timeline", ip, {}));
      lastStatus = response.status;

      if (lastStatus === 429) {
        break;
      }
    }

    assert.equal(lastStatus, 429);
  } finally {
    if (previousVercel === undefined) {
      delete process.env.VERCEL;
    } else {
      process.env.VERCEL = previousVercel;
    }
  }
});

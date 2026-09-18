import assert from "node:assert/strict";
import test from "node:test";

import { apiRouteFromRequest, logOps } from "./log";

test("ops logs never include article URLs or secrets", () => {
  const lines: string[] = [];
  const original = console.error;

  console.error = (value: unknown) => {
    lines.push(String(value));
  };

  try {
    logOps("extract_failed", "analyze-url", "extract");
    logOps("newsapi_failed", "news", "status_429");
  } finally {
    console.error = original;
  }

  assert.equal(lines.length, 2);
  assert.equal(lines.join(" ").includes("http"), false);
  assert.equal(lines.join(" ").includes("api_key"), false);
  assert.match(lines[0] ?? "", /extract_failed/);
});

test("api route names are path-only and capped", () => {
  const request = new Request("http://localhost/api/analyze-url?x=1");
  assert.equal(apiRouteFromRequest(request), "analyze-url");
});

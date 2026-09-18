import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("html scrollport offsets the sticky publication header", () => {
  const css = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
  const layout = readFileSync(new URL("../../app/layout.tsx", import.meta.url), "utf8");

  assert.match(
    css,
    /html\s*\{[\s\S]*scroll-padding-top:\s*76px/,
    "Next 16.3 hash/route scrolling skips sticky headers; the html scrollport must pad by the homepage header offset"
  );
  assert.match(
    layout,
    /scroll-pt-\[76px\]/,
    "the root html element must carry the same 76px scroll padding as the sticky publication header"
  );
});

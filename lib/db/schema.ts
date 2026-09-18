import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import type { EvidenceSnapshotV1 } from "./evidence";

export const stories = pgTable("stories", {
  id: uuid("id").defaultRandom().primaryKey(),
  storyKey: text("story_key").notNull().unique(),
  primaryUrl: text("primary_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const storySnapshots = pgTable(
  "story_snapshots",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storyId: uuid("story_id")
      .notNull()
      .references(() => stories.id),
    capturedAt: timestamp("captured_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    fingerprint: text("fingerprint").notNull(),
    schemaVersion: integer("schema_version").notNull().default(1),
    evidence: jsonb("evidence").$type<EvidenceSnapshotV1>().notNull(),
  },
  (table) => [
    unique("story_snapshots_story_id_fingerprint_unique").on(
      table.storyId,
      table.fingerprint
    ),
    index("story_snapshots_story_id_captured_at_idx").on(
      table.storyId,
      table.capturedAt.desc()
    ),
  ]
);

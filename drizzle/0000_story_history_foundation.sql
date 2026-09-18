CREATE TABLE "stories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"story_key" text NOT NULL,
	"primary_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stories_story_key_unique" UNIQUE("story_key")
);
--> statement-breakpoint
CREATE TABLE "story_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"story_id" uuid NOT NULL,
	"captured_at" timestamp with time zone DEFAULT now() NOT NULL,
	"fingerprint" text NOT NULL,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"evidence" jsonb NOT NULL,
	CONSTRAINT "story_snapshots_story_id_fingerprint_unique" UNIQUE("story_id","fingerprint")
);
--> statement-breakpoint
ALTER TABLE "story_snapshots" ADD CONSTRAINT "story_snapshots_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "story_snapshots_story_id_captured_at_idx" ON "story_snapshots" USING btree ("story_id","captured_at" DESC NULLS LAST);
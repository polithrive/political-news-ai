import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }

  return url;
}

export function getDb() {
  return drizzle(neon(requireDatabaseUrl()), { schema });
}

export * from "./evidence";
export * from "./schema";

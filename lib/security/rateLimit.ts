export type RateLimitBucket = {
  name: string;
  limit: number;
  windowMs: number;
};

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSeconds: number };

type WindowEntry = {
  timestamps: number[];
};

const windows = new Map<string, WindowEntry>();

const MAX_KEYS = 20_000;

export const RATE_LIMIT_BUCKETS = {
  aiExpensive: {
    name: "ai-expensive",
    limit: 8,
    windowMs: 10 * 60 * 1000,
  },
  aiGenerate: {
    name: "ai-generate",
    limit: 24,
    windowMs: 10 * 60 * 1000,
  },
  aiPreview: {
    name: "ai-preview",
    limit: 60,
    windowMs: 10 * 60 * 1000,
  },
  aiChat: {
    name: "ai-chat",
    limit: 40,
    windowMs: 10 * 60 * 1000,
  },
  snapshotsWrite: {
    name: "snapshots-write",
    limit: 40,
    windowMs: 10 * 60 * 1000,
  },
  snapshotsRead: {
    name: "snapshots-read",
    limit: 90,
    windowMs: 10 * 60 * 1000,
  },
  news: {
    name: "news",
    limit: 90,
    windowMs: 60 * 1000,
  },
  cheapApi: {
    name: "cheap-api",
    limit: 40,
    windowMs: 10 * 60 * 1000,
  },
} as const satisfies Record<string, RateLimitBucket>;

function prune(entry: WindowEntry, now: number, windowMs: number) {
  const cutoff = now - windowMs;
  entry.timestamps = entry.timestamps.filter((stamp) => stamp > cutoff);
}

export function consumeRateLimit(
  identity: string,
  bucket: RateLimitBucket,
  now = Date.now()
): RateLimitResult {
  const key = `${bucket.name}:${identity}`;
  let entry = windows.get(key);

  if (!entry) {
    if (windows.size >= MAX_KEYS) {
      const oldest = windows.keys().next().value;

      if (oldest) {
        windows.delete(oldest);
      }
    }

    entry = { timestamps: [] };
    windows.set(key, entry);
  }

  prune(entry, now, bucket.windowMs);

  if (entry.timestamps.length >= bucket.limit) {
    const retryAfterMs = entry.timestamps[0] + bucket.windowMs - now;

    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  entry.timestamps.push(now);

  return {
    ok: true,
    remaining: bucket.limit - entry.timestamps.length,
  };
}

export function resetRateLimitStoreForTests() {
  windows.clear();
}

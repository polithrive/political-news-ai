import { isAiDisabled } from "./aiDisabled";
import { getClientIp } from "./clientIp";
import {
  consumeRateLimit,
  type RateLimitBucket,
} from "./rateLimit";

export type GuardOptions = {
  bucket: RateLimitBucket;
  ai?: boolean;
};

export function enforcePublicEndpointGuard(
  request: Request,
  options: GuardOptions
): Response | null {
  if (options.ai && isAiDisabled()) {
    return Response.json(
      {
        error:
          "AI analysis is temporarily unavailable. Please try again later.",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  const identity = getClientIp(request);
  const result = consumeRateLimit(identity, options.bucket);

  if (result.ok) {
    return null;
  }

  return Response.json(
    {
      error: "Too many requests. Please wait and try again.",
      retryAfterSeconds: result.retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(result.retryAfterSeconds),
        "Cache-Control": "no-store",
      },
    }
  );
}

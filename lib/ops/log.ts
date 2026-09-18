export type OpsKind =
  | "rate_limited"
  | "ai_disabled"
  | "ai_failed"
  | "newsapi_failed"
  | "extract_failed"
  | "unexpected";

function sanitizeToken(value: string): string {
  return value.replace(/[^a-z0-9/_-]/gi, "").slice(0, 64) || "unknown";
}

export function logOps(
  kind: OpsKind,
  route: string,
  detail?: string
): void {
  try {
    const payload: Record<string, string> = {
      app: "angle-report",
      kind,
      route: sanitizeToken(route),
    };

    if (detail) {
      payload.detail = sanitizeToken(detail);
    }

    console.error(JSON.stringify(payload));
  } catch {
    // Logging must never affect the product.
  }
}

export function apiRouteFromRequest(request: Request): string {
  try {
    const pathname = new URL(request.url).pathname;

    if (!pathname.startsWith("/api/")) {
      return "unknown";
    }

    return pathname.slice(5).replace(/[^a-z0-9/-]/gi, "").slice(0, 40) || "unknown";
  } catch {
    return "unknown";
  }
}

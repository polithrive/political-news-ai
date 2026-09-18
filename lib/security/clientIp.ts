/*
 * Client identity for rate limiting.
 *
 * On Vercel, the platform sets X-Forwarded-For. The left-most address is the
 * connecting client as presented by Vercel. We only trust forwarded IP headers
 * when VERCEL is set so a self-hosted or local process cannot be spoofed by
 * a client-supplied X-Forwarded-For value.
 *
 * Off-platform, every caller shares the "unknown" bucket. That is stricter
 * than trusting spoofable headers, and is acceptable for local development.
 */

export function getClientIp(request: Request): string {
  if (!process.env.VERCEL) {
    return "unknown";
  }

  const forwarded = request.headers.get("x-forwarded-for");
  const firstForwarded = forwarded?.split(",")[0]?.trim();

  if (firstForwarded) {
    return firstForwarded;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();

  if (realIp) {
    return realIp;
  }

  return "unknown";
}

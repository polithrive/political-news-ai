export const CANONICAL_ORIGIN = "https://theanglereport.com";

export function getMetadataBase(): URL {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configured) {
    try {
      const parsed = new URL(configured);

      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        parsed.hash = "";
        parsed.search = "";

        if (parsed.pathname === "/") {
          parsed.pathname = "";
        }

        return parsed;
      }
    } catch {
      // Fall through to the production origin.
    }
  }

  return new URL(CANONICAL_ORIGIN);
}

export function absoluteUrl(path: string): string {
  const base = getMetadataBase();
  const normalized = path.startsWith("/") ? path : `/${path}`;

  return new URL(normalized, base).toString();
}

export const INDEXABLE_PATHS = [
  "/",
  "/about",
  "/privacy",
  "/terms",
  "/contact",
] as const;

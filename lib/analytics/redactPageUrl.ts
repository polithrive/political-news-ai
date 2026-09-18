export function redactAnalyticsPageUrl(url: string): string {
  const parsed = new URL(url, "https://theanglereport.com");
  parsed.search = "";
  parsed.hash = "";

  if (parsed.username || parsed.password) {
    parsed.username = "";
    parsed.password = "";
  }

  return `${parsed.origin}${parsed.pathname}`;
}

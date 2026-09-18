import { lookup as dnsLookup } from "node:dns/promises";
import { isIP } from "node:net";

import {
  assertSafePublicHttpUrl,
  failPublicUrl,
  isBlockedHostname,
  parseIpv4Octets,
} from "./publicUrl";

const MAX_REDIRECTS = 3;
const MAX_RESPONSE_BYTES = 1_500_000;
const FETCH_TIMEOUT_MS = 10_000;

export type PublicHttpFetchDeps = {
  fetchImpl?: typeof fetch;
  lookup?: (hostname: string) => Promise<string[]>;
};

export type FetchedPublicDocument = {
  finalUrl: string;
  html: string;
};

const USER_AGENT =
  "Mozilla/5.0 (compatible; TheAngleReport/1.0; +https://theanglereport.com)";

function canonicalHostname(hostname: string) {
  return hostname.replace(/^\[/, "").replace(/\]$/, "");
}

async function resolvePublicAddresses(
  hostname: string,
  lookup: NonNullable<PublicHttpFetchDeps["lookup"]>
): Promise<string[]> {
  const host = canonicalHostname(hostname);

  if (isIP(host) || parseIpv4Octets(host)) {
    if (isBlockedHostname(host)) {
      failPublicUrl("Local or private network URLs are not supported.");
    }

    return [host];
  }

  let addresses: string[];

  try {
    addresses = await lookup(host);
  } catch {
    failPublicUrl("This article URL could not be resolved.");
  }

  if (!addresses.length) {
    failPublicUrl("This article URL could not be resolved.");
  }

  for (const address of addresses) {
    if (isBlockedHostname(address)) {
      failPublicUrl("Local or private network URLs are not supported.");
    }
  }

  return addresses;
}

async function defaultLookup(hostname: string): Promise<string[]> {
  const records = await dnsLookup(hostname, { all: true, verbatim: true });

  return records.map((record) => record.address);
}

function resolveRedirectUrl(currentUrl: string, location: string | null): URL {
  if (!location?.trim()) {
    failPublicUrl("This article URL is not supported.");
  }

  try {
    return new URL(location, currentUrl);
  } catch {
    failPublicUrl("This article URL is not supported.");
  }
}

export async function fetchPublicArticleHtml(
  inputUrl: string,
  deps: PublicHttpFetchDeps = {}
): Promise<FetchedPublicDocument> {
  const fetchImpl = deps.fetchImpl ?? fetch;
  const lookup = deps.lookup ?? defaultLookup;

  let current = new URL(inputUrl);
  assertSafePublicHttpUrl(current);
  await resolvePublicAddresses(current.hostname, lookup);

  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    const response = await fetchImpl(current.toString(), {
      method: "GET",
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "user-agent": USER_AGENT,
      },
    });

    if (response.status >= 300 && response.status < 400) {
      if (hop === MAX_REDIRECTS) {
        failPublicUrl("This article URL is not supported.");
      }

      current = resolveRedirectUrl(
        current.toString(),
        response.headers.get("location")
      );
      assertSafePublicHttpUrl(current);
      await resolvePublicAddresses(current.hostname, lookup);
      continue;
    }

    if (!response.ok) {
      failPublicUrl("The article could not be retrieved.");
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (
      contentType &&
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml") &&
      !contentType.includes("text/plain")
    ) {
      failPublicUrl("This URL is not a readable article.");
    }

    const buffer = await response.arrayBuffer();

    if (buffer.byteLength > MAX_RESPONSE_BYTES) {
      failPublicUrl("This article is too large to analyze.");
    }

    const html = new TextDecoder("utf-8", { fatal: false }).decode(buffer);

    return {
      finalUrl: current.toString(),
      html,
    };
  }

  failPublicUrl("This article URL is not supported.");
}

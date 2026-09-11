import { extract } from "@extractus/article-extractor";

export type ExtractedArticle = {
  url: string;
  title: string;
  content: string;
  description: string;
  author: string;
  image: string;
  published: string;
  source: string;
};

function isPrivateOrLocalHostname(hostname: string) {
  const normalized = hostname.toLowerCase();

  if (
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized === "::1" ||
    normalized.endsWith(".localhost") ||
    normalized.endsWith(".local")
  ) {
    return true;
  }

  const ipv4Parts = normalized.split(".");

  if (
    ipv4Parts.length === 4 &&
    ipv4Parts.every((part) => /^\d+$/.test(part))
  ) {
    const octets = ipv4Parts.map(Number);

    if (octets.some((octet) => octet < 0 || octet > 255)) {
      return true;
    }

    const [a, b] = octets;

    if (
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    ) {
      return true;
    }
  }

  return false;
}

export function normalizeArticleUrl(input: string) {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new Error("Article URL is required.");
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(trimmed);
  } catch {
    throw new Error("Please enter a valid article URL.");
  }

  if (
    parsedUrl.protocol !== "https:" &&
    parsedUrl.protocol !== "http:"
  ) {
    throw new Error(
      "Only HTTP and HTTPS article URLs are supported."
    );
  }

  if (isPrivateOrLocalHostname(parsedUrl.hostname)) {
    throw new Error(
      "Local or private network URLs are not supported."
    );
  }

  parsedUrl.hash = "";

  return parsedUrl.toString();
}

function cleanText(value?: string | null) {
  return value?.trim() ?? "";
}

export async function extractArticle(
  inputUrl: string
): Promise<ExtractedArticle | null> {
  const url = normalizeArticleUrl(inputUrl);

  try {
    const article = await extract(
      url,
      {
        contentLengthThreshold: 300,
        descriptionLengthThreshold: 100,
      },
      {
        headers: {
          "user-agent":
            "Mozilla/5.0 (compatible; TheAngleReport/1.0; +https://theanglereport.com)",
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      }
    );

    if (!article) {
      return null;
    }

    const title = cleanText(article.title);
    const content = cleanText(article.content);
    const description = cleanText(article.description);

    if (!title || (!content && !description)) {
      return null;
    }

    const resolvedUrl = cleanText(article.url) || url;

    return {
      url: resolvedUrl,
      title,
      content,
      description,
      author: cleanText(article.author),
      image: cleanText(article.image),
      published: cleanText(article.published),
      source:
        cleanText(article.source) ||
        new URL(resolvedUrl).hostname.replace(/^www\./, ""),
    };
  } catch (error) {
    console.error("Article extraction failed:", {
      url,
      error,
    });

    return null;
  }
}
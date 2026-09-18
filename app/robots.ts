import type { MetadataRoute } from "next";

import { CANONICAL_ORIGIN, absoluteUrl } from "@/lib/seo/siteUrl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/polls",
        "/forecasts",
        "/signin",
        "/saved",
        "/watchlist",
        "/alerts",
        "/premium",
        "/timeline",
        "/perspectives",
        "/article",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: new URL(CANONICAL_ORIGIN).host,
  };
}

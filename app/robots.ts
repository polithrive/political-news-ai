import type { MetadataRoute } from "next";

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
  };
}

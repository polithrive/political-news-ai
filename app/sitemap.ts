import type { MetadataRoute } from "next";

import { INDEXABLE_PATHS, absoluteUrl } from "@/lib/seo/siteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_PATHS.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" ? "hourly" : "monthly",
    priority: path === "/" ? 1 : 0.6,
  }));
}

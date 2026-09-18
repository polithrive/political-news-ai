"use client";

import { Analytics } from "@vercel/analytics/react";

import { redactAnalyticsPageUrl } from "@/lib/analytics/redactPageUrl";

export default function ProductAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        try {
          if (event.type === "pageview") {
            return {
              ...event,
              url: redactAnalyticsPageUrl(event.url),
            };
          }

          return event;
        } catch {
          return null;
        }
      }}
    />
  );
}

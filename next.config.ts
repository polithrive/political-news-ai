import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "off",
  },
  {
    key: "Content-Security-Policy-Report-Only",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Next 16.3.3 draws the DevTools badge at top-left over the brand and
  // rewrites AGENTS.md when it detects an agent. Neither is a product UI.
  agentRules: false,
  devIndicators: false,
  images: {
    formats: ["image/webp"],
  },
  async headers() {
    return [
      {
        source: "/",
        headers: securityHeaders,
      },
      {
        // Keep optimizer-owned CSP on /_next/image; do not stack page CSP on it.
        source: "/((?!_next/image|_next/static).*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

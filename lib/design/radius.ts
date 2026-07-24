export const radius = {
  none: "0",
  sm: "0.375rem",
  md: "0.625rem",
  lg: "0.875rem",
  xl: "1.125rem",
  "2xl": "1.5rem",
  "3xl": "2rem",
  full: "9999px",

  component: {
    button: "0.75rem",
    input: "0.75rem",
    card: "1rem",
    panel: "1.25rem",
    hero: "1.5rem",
    badge: "9999px",
  },
} as const;

export type RadiusTokens = typeof radius;
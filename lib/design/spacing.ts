export const spacing = {
  space: {
    0: "0",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
  },

  container: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1400px",
  },

  section: {
    xs: "2rem",
    sm: "3rem",
    md: "5rem",
    lg: "7rem",
  },

  card: {
    paddingSm: "1rem",
    padding: "1.5rem",
    paddingLg: "2rem",
    gap: "1.5rem",
  },

  grid: {
    gapSm: "1rem",
    gap: "1.5rem",
    gapLg: "2rem",
    gapXl: "3rem",
  },
} as const;

export type SpacingTokens = typeof spacing;
export const typography = {
  fontFamily: {
    sans: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
    mono: "var(--font-geist-mono), Consolas, Monaco, monospace",
  },

  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeight: {
    tight: 1.15,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.7,
    loose: 1.85,
  },

  letterSpacing: {
    tighter: "-0.04em",
    tight: "-0.02em",
    normal: "0",
    wide: "0.04em",
    wider: "0.08em",
    widest: "0.14em",
  },

  styles: {
    eyebrow: {
      fontSize: "0.75rem",
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
    },

    pageTitle: {
      fontSize: "3rem",
      fontWeight: 700,
      lineHeight: 1.08,
      letterSpacing: "-0.035em",
    },

    sectionTitle: {
      fontSize: "1.875rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.025em",
    },

    cardTitle: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.35,
      letterSpacing: "-0.01em",
    },

    bodyLarge: {
      fontSize: "1.125rem",
      fontWeight: 400,
      lineHeight: 1.75,
      letterSpacing: "0",
    },

    body: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.65,
      letterSpacing: "0",
    },

    caption: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: "0",
    },

    metadata: {
      fontSize: "0.75rem",
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "0.04em",
    },
  },
} as const;

export type TypographyTokens = typeof typography;
import type { ReactNode } from "react";

import { colors } from "@/lib/design/theme";

export type AnalysisCardAccent =
  | "primary"
  | "success"
  | "info"
  | "warning";

type AnalysisCardProps = {
  title: string;
  children: ReactNode;
  eyebrow?: string;
  accent?: AnalysisCardAccent;
  className?: string;
};

const accentColors = {
  primary: colors.brand.primary,
  success: colors.status.success,
  info: colors.status.info,
  warning: colors.status.warning,
} as const;

export default function AnalysisCard({
  title,
  children,
  eyebrow,
  accent = "primary",
  className = "",
}: AnalysisCardProps) {
  const accentColor = accentColors[accent];

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-6 ${className}`}
      style={{
        backgroundColor: colors.background.elevated,
        borderColor: colors.border.default,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1"
        style={{
          backgroundColor: accentColor,
        }}
      />

      <div className="pl-2">
        {eyebrow ? (
          <p
            className="text-xs font-semibold uppercase tracking-[0.18em]"
            style={{
              color: accentColor,
            }}
          >
            {eyebrow}
          </p>
        ) : null}

        <h3
          className={`font-semibold ${
            eyebrow
              ? "mt-2 text-xl"
              : "text-xl"
          }`}
          style={{
            color: colors.text.primary,
          }}
        >
          {title}
        </h3>

        <div className="mt-4">
          {children}
        </div>
      </div>
    </article>
  );
}
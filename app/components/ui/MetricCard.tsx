import type { ReactNode } from "react";

import { colors } from "@/lib/design/theme";

type MetricCardProps = {
  label: string;
  value: ReactNode;
  description?: string;
  accent?: "primary" | "success" | "info" | "warning";
};

const accentColors = {
  primary: colors.brand.primary,
  success: colors.status.success,
  info: colors.status.info,
  warning: colors.status.warning,
} as const;

export default function MetricCard({
  label,
  value,
  description,
  accent = "primary",
}: MetricCardProps) {
  return (
    <div
      className="rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        backgroundColor: colors.background.elevated,
        borderColor: colors.border.default,
      }}
    >
      <div
        className="mb-4 h-1 w-12 rounded-full"
        style={{
          backgroundColor: accentColors[accent],
        }}
      />

      <p
        className="text-sm font-medium"
        style={{
          color: colors.text.muted,
        }}
      >
        {label}
      </p>

      <div
        className="mt-2 text-3xl font-bold tracking-tight"
        style={{
          color: colors.text.primary,
        }}
      >
        {value}
      </div>

      {description ? (
        <p
          className="mt-3 text-sm leading-6"
          style={{
            color: colors.text.secondary,
          }}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
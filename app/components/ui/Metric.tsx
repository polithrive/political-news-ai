import type { ReactNode } from "react";

type MetricVariant =
  | "default"
  | "positive"
  | "warning"
  | "critical"
  | "accent";

type MetricProps = {
  label: string;
  value: string;
  description?: string;
  icon?: ReactNode;
  variant?: MetricVariant;
  className?: string;
};

const variantClasses: Record<
  MetricVariant,
  string
> = {
  default:
    "border-slate-800 bg-slate-950/70",

  positive:
    "border-emerald-500/20 bg-emerald-500/5",

  warning:
    "border-amber-500/20 bg-amber-500/5",

  critical:
    "border-red-500/20 bg-red-500/5",

  accent:
    "border-red-500/20 bg-slate-950/70",
};

const valueClasses: Record<
  MetricVariant,
  string
> = {
  default: "text-white",
  positive: "text-emerald-300",
  warning: "text-amber-300",
  critical: "text-red-300",
  accent: "text-red-300",
};

export default function Metric({
  label,
  value,
  description,
  icon,
  variant = "default",
  className = "",
}: MetricProps) {
  return (
    <div
      className={[
        "rounded-2xl border p-4",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {label}
          </p>

          <p
            className={[
              "mt-3 text-2xl font-bold",
              valueClasses[variant],
            ].join(" ")}
          >
            {value}
          </p>
        </div>

        {icon ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300">
            {icon}
          </div>
        ) : null}
      </div>

      {description ? (
        <p className="mt-1 text-sm leading-6 text-slate-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}
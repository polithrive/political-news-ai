import type { ReactNode } from "react";

type CardVariant =
  | "default"
  | "intelligence"
  | "glass"
  | "interactive";

type CardProps = {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
};

const variantClasses: Record<CardVariant, string> = {
  default:
    "border border-slate-800 bg-slate-900",

  intelligence:
    "border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950",

  glass:
    "border border-white/10 bg-white/5 backdrop-blur-xl",

  interactive:
    "border border-slate-800 bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-xl hover:shadow-red-950/20",
};

export default function Card({
  children,
  className = "",
  variant = "default",
}: CardProps) {
  return (
    <div
      className={[
        "rounded-3xl",
        "shadow-lg",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
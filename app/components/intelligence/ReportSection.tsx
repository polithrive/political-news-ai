import { ReactNode } from "react";

type ReportSectionProps = {
  title: string;
  subtitle?: string;
  icon?: string;
  children: ReactNode;
};

export default function ReportSection({
  title,
  subtitle,
  icon,
  children,
}: ReportSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-lg overflow-hidden">
      <div className="border-b border-slate-800 bg-slate-900 px-8 py-5">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-lg">
              {icon}
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-white">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-1 text-sm text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-8">
        {children}
      </div>
    </section>
  );
}
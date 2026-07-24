type ReportProgressProps = {
  completedSections: number;
  totalSections: number;
};

export default function ReportProgress({
  completedSections,
  totalSections,
}: ReportProgressProps) {
  const progress =
    totalSections === 0
      ? 0
      : Math.round(
          (completedSections / totalSections) * 100
        );

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Reading Progress
        </p>

        <p className="text-sm font-semibold text-white">
          {progress}%
        </p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-red-500 transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <p className="mt-3 text-sm text-slate-400">
        {completedSections} of {totalSections} sections viewed
      </p>
    </div>
  );
}
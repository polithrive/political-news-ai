type ReadingTimeProps = {
  minutes: number;
};

export default function ReadingTime({
  minutes,
}: ReadingTimeProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        Estimated Reading
      </p>

      <div className="mt-2 flex items-end gap-2">
        <span className="text-3xl font-bold text-white">
          {minutes}
        </span>

        <span className="pb-1 text-sm text-slate-400">
          min
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-400">
        Based on report size.
      </p>
    </div>
  );
}
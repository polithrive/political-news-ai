export default function BreakingNews() {
  return (
    <div className="border-b border-slate-800 bg-slate-900/70">
      <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-5 py-2.5 sm:px-8">
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-red-300">
          <span className="h-2 w-2 rounded-full bg-red-600" />
          Developing
        </span>
        <p className="truncate text-sm font-medium text-slate-300">
          Senate debates budget • Election updates • Supreme Court decisions • International politics
        </p>
      </div>
    </div>
  );
}

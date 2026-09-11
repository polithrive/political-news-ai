export default function BreakingNews() {
  return (
    <div className="border-b border-[#17446D]/65 bg-[#031126]/94 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1980px] items-center gap-4 px-4 py-2.5 sm:px-6 xl:px-8 2xl:px-10">
        <span className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-[#FF2638]/30 bg-[#FF2638]/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#FF9CA5]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF2638] opacity-40" />

            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF2638] shadow-[0_0_10px_rgba(255,38,56,0.8)]" />
          </span>

          Developing
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-[#C8D5E3]">
            Senate debates budget
            <span className="mx-2 text-[#355675]">•</span>
            Election updates
            <span className="mx-2 text-[#355675]">•</span>
            Supreme Court decisions
            <span className="mx-2 text-[#355675]">•</span>
            International politics
          </p>
        </div>

        <span className="hidden shrink-0 text-[9px] font-black uppercase tracking-[0.2em] text-[#52718F] lg:block">
          The Angle Report
        </span>
      </div>
    </div>
  );
}
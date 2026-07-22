type IntelligenceSectionSkeletonProps = {
  label: string;
  title: string;
  description: string;
  blocks?: number;
};

export default function IntelligenceSectionSkeleton({
  label,
  title,
  description,
  blocks = 3,
}: IntelligenceSectionSkeletonProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
        {label}
      </p>

      <h2 className="mt-2 text-2xl font-bold text-white">
        {title}
      </h2>

      <p className="mt-3 max-w-3xl text-slate-400">
        {description}
      </p>

      <div className="mt-6 space-y-4">
        {Array.from({
          length: blocks,
        }).map((_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-xl bg-slate-800"
          />
        ))}
      </div>
    </section>
  );
}
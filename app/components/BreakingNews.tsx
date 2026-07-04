export default function BreakingNews() {
  return (
    <div className="bg-red-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
        <span className="font-bold">🚨 BREAKING</span>

        <div className="overflow-hidden">
          <p className="whitespace-nowrap animate-pulse">
            Senate debates budget • Election updates • Supreme Court decisions • International politics • AI-powered summaries
          </p>
        </div>
      </div>
    </div>
  );
}
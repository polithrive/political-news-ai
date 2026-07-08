type BiasMeterProps = {
  score: number;
  lean: string;
};

export default function BiasMeter({ score, lean }: BiasMeterProps) {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Left</span>
        <span>Center</span>
        <span>Right</span>
      </div>

      <div className="relative mt-2 h-3 rounded-full bg-gradient-to-r from-blue-500 via-gray-400 to-red-500">
        <div
          className="absolute -top-1 h-5 w-5 rounded-full border-2 border-white bg-slate-950 shadow-lg"
          style={{ left: `calc(${score}% - 10px)` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-gray-200">{lean}</span>
        <span className="text-gray-400">{score}/100</span>
      </div>
    </div>
  );
}
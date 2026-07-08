type PoliticalSpectrumProps = {
  lean: string;
};

const positions: Record<string, number> = {
  "Far Left": 0,
  Left: 25,
  "Center Left": 40,
  Center: 50,
  "Center Right": 60,
  Right: 75,
  "Far Right": 100,
};

export default function PoliticalSpectrum({
  lean,
}: PoliticalSpectrumProps) {
  const position = positions[lean] ?? 50;

  return (
    <div className="rounded-xl bg-slate-800 p-6">
      <div className="flex justify-between text-xs text-slate-400 mb-3">
        <span>Far Left</span>
        <span>Left</span>
        <span>Center</span>
        <span>Right</span>
        <span>Far Right</span>
      </div>

      <div className="relative h-2 rounded-full bg-slate-700">
        <div
          className="absolute -top-2 h-6 w-6 -translate-x-1/2 rounded-full border-4 border-white bg-red-500 shadow-lg transition-all"
          style={{
            left: `${position}%`,
          }}
        />
      </div>

      <p className="mt-5 text-center text-lg font-semibold text-white">
        AI Assessment: {lean}
      </p>
    </div>
  );
}
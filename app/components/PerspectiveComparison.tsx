"use client";

import { useEffect, useState } from "react";
import type { ComparisonResult } from "../../types/comparison";

export default function PerspectiveComparison() {
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);

  useEffect(() => {
    async function getComparison() {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: "border security bill",
        }),
      });

      const data: ComparisonResult = await response.json();
      setComparison(data);
    }

    getComparison();
  }, []);

  if (!comparison) {
    return (
      <section className="max-w-7xl mx-auto px-8 py-16">
        <p className="text-gray-400">
          Generating multi-perspective political analysis...
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
          PoliticalPulse Intelligence
        </p>

        <h2 className="mt-2 text-4xl font-bold">Perspective Intelligence</h2>

        <p className="mt-3 max-w-3xl text-gray-400">
          See how different political viewpoints may frame the same issue, where
          they agree, and where the major differences appear.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm font-semibold text-red-400">TOPIC</p>
        <h3 className="mt-2 text-2xl font-bold capitalize">
          {comparison.topic}
        </h3>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-6">
          <h3 className="text-xl font-bold text-blue-300">
            🔵 Left Perspective
          </h3>
          <p className="mt-4 text-sm leading-6 text-gray-300">
            {comparison.leftPerspective}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-600 bg-slate-800 p-6">
          <h3 className="text-xl font-bold text-gray-200">
            ⚪ Center Perspective
          </h3>
          <p className="mt-4 text-sm leading-6 text-gray-300">
            {comparison.centerPerspective}
          </p>
        </div>

        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <h3 className="text-xl font-bold text-red-300">
            🔴 Right Perspective
          </h3>
          <p className="mt-4 text-sm leading-6 text-gray-300">
            {comparison.rightPerspective}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6">
          <h3 className="text-xl font-bold text-green-300">
            🤝 Common Ground
          </h3>

          <div className="mt-4 space-y-3">
            {comparison.commonGround.map((point, index) => (
              <div
                key={index}
                className="rounded-lg bg-slate-950/60 px-4 py-3 text-sm text-gray-300"
              >
                ✓ {point}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6">
          <h3 className="text-xl font-bold text-yellow-300">
            ⚠ Major Differences
          </h3>

          <div className="mt-4 space-y-3">
            {comparison.majorDifferences.map((point, index) => (
              <div
                key={index}
                className="rounded-lg bg-slate-950/60 px-4 py-3 text-sm text-gray-300"
              >
                • {point}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-red-500/30 bg-slate-900 p-6">
        <h3 className="text-xl font-bold text-red-300">
          🧠 PoliticalPulse Insight
        </h3>

        <p className="mt-4 text-sm leading-6 text-gray-300">
          {comparison.politicalPulseInsight}
        </p>
      </div>
    </section>
  );
}
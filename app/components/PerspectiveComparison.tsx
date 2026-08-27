"use client";

import { useEffect, useState } from "react";
import type { ComparisonResult } from "../types/comparison";

export default function PerspectiveComparison() {
  const [comparison, setComparison] =
    useState<ComparisonResult | null>(null);

  useEffect(() => {
    async function getComparison() {
      const response = await fetch(
        "/api/compare",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            topic: "border security bill",
          }),
        }
      );

      const data: ComparisonResult =
        await response.json();

      setComparison(data);
    }

    void getComparison();
  }, []);

  return (
    <section className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              PoliticalPulse Intelligence
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              See the same issue from more than one angle
            </h2>

            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              PoliticalPulse compares major political
              perspectives, identifies common ground,
              and surfaces where the real disagreement
              remains.
            </p>
          </div>

          {!comparison ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="font-semibold text-slate-600">
                Generating multi-perspective political analysis...
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Current topic
                </p>

                <h3 className="mt-2 text-2xl font-extrabold capitalize text-slate-950">
                  {comparison.topic}
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                  <p className="text-sm font-bold text-blue-700">
                    Progressive
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {comparison.leftPerspective}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-sm font-bold text-slate-700">
                    Centrist
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {comparison.centerPerspective}
                  </p>
                </div>

                <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                  <p className="text-sm font-bold text-red-700">
                    Conservative
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {comparison.rightPerspective}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <p className="text-sm font-bold text-emerald-800">
                    Common ground
                  </p>

                  <div className="mt-3 space-y-2">
                    {comparison.commonGround
                      .slice(0, 3)
                      .map((point, index) => (
                        <p
                          key={index}
                          className="text-sm leading-6 text-slate-700"
                        >
                          ✓ {point}
                        </p>
                      ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <p className="text-sm font-bold text-amber-800">
                    Major differences
                  </p>

                  <div className="mt-3 space-y-2">
                    {comparison.majorDifferences
                      .slice(0, 3)
                      .map((point, index) => (
                        <p
                          key={index}
                          className="text-sm leading-6 text-slate-700"
                        >
                          • {point}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

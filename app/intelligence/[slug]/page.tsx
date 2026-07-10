"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import ConsensusEngine from "@/app/components/intelligence/ConsensusEngine";
import EvidencePanel from "@/app/components/intelligence/EvidencePanel";
import ExecutiveSummary from "@/app/components/intelligence/ExecutiveSummary";
import FactCheck from "@/app/components/intelligence/FactCheck";
import ImpactAnalysis from "@/app/components/intelligence/ImpactAnalysis";
import IntelligenceOverview from "@/app/components/intelligence/IntelligenceOverview";
import KeyFacts from "@/app/components/intelligence/KeyFacts";
import PerspectiveAnalysis from "@/app/components/intelligence/PerspectiveAnalysis";
import ReportHeader from "@/app/components/intelligence/ReportHeader";
import SourceComparison from "@/app/components/intelligence/SourceComparison";
import StoryTimeline from "@/app/components/intelligence/StoryTimeline";

import { getSelectedArticle } from "@/lib/selectedArticle";
import { generateIntelligenceReport } from "@/lib/services/report";

import type { Article } from "../../types/article";
import type { IntelligenceReport } from "../../types/report";

export default function IntelligenceReportPage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [report, setReport] = useState<IntelligenceReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadReport() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const selectedArticle = getSelectedArticle();

        if (!selectedArticle) {
          return;
        }

        setArticle(selectedArticle);

        const generatedReport =
          await generateIntelligenceReport(selectedArticle);

        setReport(generatedReport);
      } catch (error) {
        console.error("Failed to load intelligence report:", error);

        setErrorMessage(
          "PoliticalPulse could not generate this intelligence report. Please return to the homepage and try opening the story again."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadReport();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-6 py-12">
          {article && <ReportHeader article={article} />}

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
              PoliticalPulse Intelligence
            </p>

            <h1 className="mt-4 text-3xl font-bold">
              Generating intelligence report
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              PoliticalPulse AI is analyzing the story, identifying key facts,
              evaluating impact, comparing political perspectives, and
              reviewing areas of agreement and uncertainty.
            </p>

            <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-red-500" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8">
            <p className="font-semibold uppercase tracking-wide text-red-500">
              No article selected
            </p>

            <h1 className="mt-4 text-4xl font-bold">
              Open an Intelligence Report from the PoliticalPulse homepage.
            </h1>

            <p className="mt-4 max-w-2xl text-slate-400">
              PoliticalPulse needs a selected news story before it can generate
              a complete intelligence report.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500"
            >
              Return to homepage
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage || !report) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-6 py-12">
          <ReportHeader article={article} />

          <div className="mt-8 rounded-2xl border border-red-900/60 bg-red-950/20 p-8">
            <p className="font-semibold uppercase tracking-wide text-red-500">
              Report generation failed
            </p>

            <h2 className="mt-4 text-3xl font-bold">
              We could not complete this intelligence report.
            </h2>

            <p className="mt-4 max-w-2xl text-slate-300">
              {errorMessage ??
                "An unexpected error occurred while generating the report."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500"
              >
                Try again
              </button>

              <Link
                href="/"
                className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
              >
                Return to homepage
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <ReportHeader article={article} />

        <div className="mt-8">
          <ExecutiveSummary report={report} />
        </div>

        <div className="mt-8">
          <IntelligenceOverview report={report} />
        </div>

        <div className="mt-8">
          <ImpactAnalysis report={report} />
        </div>

        <div className="mt-8">
          <KeyFacts report={report} />
        </div>

        <div className="mt-8">
          <StoryTimeline article={article} />
        </div>

        <div className="mt-8">
          <PerspectiveAnalysis report={report} />
        </div>

        <div className="mt-8">
          <ConsensusEngine report={report} />
        </div>

        <div className="mt-8">
          <FactCheck report={report} />
        </div>

        <div className="mt-8">
          <SourceComparison />
        </div>

        <div className="mt-8">
          <EvidencePanel report={report} />
        </div>
      </section>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import ReportHeader from "@/app/components/intelligence/ReportHeader";
import ExecutiveSummary from "@/app/components/intelligence/ExecutiveSummary";
import {
  generateIntelligenceReport,
  getMockIntelligenceReport,
} from "@/lib/services/report";
import { getSelectedArticle } from "@/lib/selectedArticle";
import type { Article } from "@/types/article";
import type { IntelligenceReport } from "@/types/report";
import IntelligenceOverview from "@/app/components/intelligence/IntelligenceOverview";
import KeyFacts from "@/app/components/intelligence/KeyFacts";
import PerspectiveAnalysis from "@/app/components/intelligence/PerspectiveAnalysis";
import ConsensusEngine from "@/app/components/intelligence/ConsensusEngine";

export default function IntelligenceReportPage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [report, setReport] = useState<IntelligenceReport>(
    getMockIntelligenceReport()
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      try {
        const selectedArticle = getSelectedArticle();

        if (!selectedArticle) {
          setIsLoading(false);
          return;
        }

        setArticle(selectedArticle);

        const generatedReport =
          await generateIntelligenceReport(selectedArticle);

        setReport(generatedReport);
      } catch (error) {
        console.error("Failed to load intelligence report:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadReport();
  }, []);

  if (!article) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8">
            <p className="font-semibold uppercase text-red-500">
              No article selected
            </p>

            <h1 className="mt-4 text-4xl font-bold">
              Return to the homepage and open an Intelligence Report.
            </h1>
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
  <KeyFacts report={report} />
</div>
<div className="mt-8">
  <PerspectiveAnalysis report={report} />
</div>
<div className="mt-8">
  <ConsensusEngine report={report} />
</div>
        {isLoading && (
          <p className="mt-4 text-sm text-slate-400">
            Generating AI intelligence report...
          </p>
        )}
      </section>
    </main>
  );
}
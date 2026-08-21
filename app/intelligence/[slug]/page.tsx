"use client";

import Link from "next/link";
import {
  useLayoutEffect,
  useState,
} from "react";

import AIChat from "@/app/components/intelligence/AIChat";
import ConsensusEngine from "@/app/components/intelligence/ConsensusEngine";
import DebatePanel from "@/app/components/intelligence/DebatePanel";
import EvidencePanel from "@/app/components/intelligence/EvidencePanel";
import ExecutiveSummary from "@/app/components/intelligence/ExecutiveSummary";
import FactCheck from "@/app/components/intelligence/FactCheck";
import ImpactAnalysis from "@/app/components/intelligence/ImpactAnalysis";
import IntelligenceGraph from "@/app/components/intelligence/IntelligenceGraph";
import IntelligenceOverview from "@/app/components/intelligence/IntelligenceOverview";
import IntelligenceSectionSkeleton from "@/app/components/intelligence/IntelligenceSectionSkeleton";
import KeyFacts from "@/app/components/intelligence/KeyFacts";
import PerspectiveAnalysis from "@/app/components/intelligence/PerspectiveAnalysis";
import ReportBlock from "@/app/components/intelligence/ReportBlock";
import ReportHeader from "@/app/components/intelligence/ReportHeader";
import SourceComparison from "@/app/components/intelligence/SourceComparison";
import StickyReportNavigation from "@/app/components/intelligence/StickyReportNavigation";
import StoryTimeline from "@/app/components/intelligence/StoryTimeline";
import TrustScore from "@/app/components/intelligence/TrustScore";

import { getSelectedArticle } from "@/lib/selectedArticle";
import { buildIntelligenceContext } from "@/lib/services/contextBuilder";
import { generateIntelligenceGraph } from "@/lib/services/intelligenceGraph";
import {
  cacheIntelligenceGraph,
  getCachedIntelligenceGraph,
} from "@/lib/services/intelligenceGraphCache";
import {
  cacheReport,
  getCachedReport,
} from "@/lib/services/reportCache";
import { generateIntelligenceReport } from "@/lib/services/report";

import type { Article } from "../../types/article";
import type { IntelligenceGraph as IntelligenceGraphData } from "../../types/intelligenceGraph";
import type { IntelligenceReport } from "../../types/report";

export default function IntelligenceReportPage() {
  const [article, setArticle] =
    useState<Article | null>(null);

  const [report, setReport] =
    useState<IntelligenceReport | null>(
      null
    );

  const [graph, setGraph] =
    useState<IntelligenceGraphData | null>(
      null
    );

  const [
    isInitializingArticle,
    setIsInitializingArticle,
  ] = useState(true);

  const [
    isReportLoading,
    setIsReportLoading,
  ] = useState(true);

  const [
    isGraphLoading,
    setIsGraphLoading,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  const [
    graphErrorMessage,
    setGraphErrorMessage,
  ] = useState<string | null>(null);

  /*
   * useLayoutEffect is intentional here.
   *
   * The selected article, completed report,
   * and Intelligence Graph may already exist
   * in browser storage.
   *
   * Restoring them during the layout phase
   * allows React to update the page before
   * the browser paints the hydrated client
   * view, reducing unnecessary skeleton
   * flashes for cached reports.
   *
   * We do not initialize useState directly
   * from localStorage because doing so could
   * create a server/client hydration mismatch.
   */
  useLayoutEffect(() => {
    let isCancelled = false;

    async function generateReport(
      selectedArticle: Article
    ) {
      try {
        setIsReportLoading(true);
        setErrorMessage(null);

        const generatedReport =
          await generateIntelligenceReport(
            selectedArticle
          );

        if (isCancelled) {
          return;
        }

        cacheReport(
          selectedArticle,
          generatedReport
        );

        setReport(generatedReport);
      } catch (error) {
        console.error(
          "Failed to generate intelligence report:",
          error
        );

        if (!isCancelled) {
          setErrorMessage(
            "PoliticalPulse could not generate this intelligence report. Please return to the homepage and try opening the story again."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsReportLoading(false);
        }
      }
    }

    async function generateGraph(
      selectedArticle: Article
    ) {
      try {
        setIsGraphLoading(true);
        setGraphErrorMessage(null);

        const generatedGraph =
          await generateIntelligenceGraph(
            selectedArticle
          );

        if (isCancelled) {
          return;
        }

        cacheIntelligenceGraph(
          selectedArticle,
          generatedGraph
        );

        setGraph(generatedGraph);
      } catch (error) {
        console.error(
          "Failed to generate Intelligence Graph:",
          error
        );

        if (!isCancelled) {
          setGraphErrorMessage(
            "PoliticalPulse could not generate connected context for this story."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsGraphLoading(false);
        }
      }
    }

    function initializeIntelligence() {
      /*
       * Restore the selected article first.
       *
       * This is a synchronous browser-storage
       * read and should complete immediately.
       */
      const selectedArticle =
        getSelectedArticle();

      if (isCancelled) {
        return;
      }

      if (!selectedArticle) {
        setIsInitializingArticle(false);
        setIsReportLoading(false);
        setIsGraphLoading(false);

        return;
      }

      setArticle(selectedArticle);

      /*
       * Restore the completed report
       * synchronously when available.
       */
      const cachedReport =
        getCachedReport(
          selectedArticle
        );

      if (cachedReport) {
        setReport(cachedReport);
        setIsReportLoading(false);
      } else {
        setIsReportLoading(true);

        void generateReport(
          selectedArticle
        );
      }

      /*
       * Restore the Intelligence Graph
       * synchronously when available.
       */
      const cachedGraph =
        getCachedIntelligenceGraph(
          selectedArticle
        );

      if (cachedGraph) {
        setGraph(cachedGraph);
        setIsGraphLoading(false);
      } else {
        setIsGraphLoading(true);

        void generateGraph(
          selectedArticle
        );
      }

      /*
       * Initialization is complete only
       * after all available cached state
       * has been restored.
       */
      setIsInitializingArticle(false);
    }

    initializeIntelligence();

    return () => {
      isCancelled = true;
    };
  }, []);

  if (isInitializingArticle) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="h-72 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/70" />
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
              Open an Intelligence Report
              from the PoliticalPulse
              homepage.
            </h1>

            <p className="mt-4 max-w-2xl text-slate-400">
              PoliticalPulse needs a
              selected news story before it
              can generate a complete
              intelligence report.
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

  if (
    !isReportLoading &&
    (errorMessage || !report)
  ) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-6 py-12">
          <ReportHeader
            article={article}
          />

          <ReportBlock>
            <div className="rounded-2xl border border-red-900/60 bg-red-950/20 p-8">
              <p className="font-semibold uppercase tracking-wide text-red-500">
                Report generation failed
              </p>

              <h2 className="mt-4 text-3xl font-bold">
                We could not complete this
                intelligence report.
              </h2>

              <p className="mt-4 max-w-2xl text-slate-300">
                {errorMessage ??
                  "An unexpected error occurred while generating the report."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    window.location.reload()
                  }
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
          </ReportBlock>
        </section>
      </main>
    );
  }

  const reportContext = report
    ? buildIntelligenceContext({
        report,
        intelligenceGraph: graph,
      })
    : null;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <ReportHeader
          article={article}
        />

        <div className="mt-8 grid gap-8 xl:grid-cols-[260px_minmax(0,1fr)]">
          <StickyReportNavigation
            report={report}
          />

          <div className="min-w-0">
            {report ? (
              <>
                <ReportBlock
                  id="trust-score"
                  className="mt-0"
                >
                  <TrustScore
                    trustScore={
                      report.trustScore
                    }
                  />
                </ReportBlock>

                <ReportBlock id="executive-summary">
                  <ExecutiveSummary
                    report={report}
                  />
                </ReportBlock>

                <ReportBlock id="intelligence-overview">
                  <IntelligenceOverview
                    report={report}
                  />
                </ReportBlock>

                <ReportBlock id="impact-analysis">
                  <ImpactAnalysis
                    report={report}
                  />
                </ReportBlock>

                <ReportBlock id="key-facts">
                  <KeyFacts
                    report={report}
                  />
                </ReportBlock>
              </>
            ) : (
              <>
                <ReportBlock
                  id="trust-score"
                  className="mt-0"
                >
                  <IntelligenceSectionSkeleton
                    label="Trust Score"
                    title="Evaluating source confidence"
                    description="PoliticalPulse is reviewing source quality, reporting agreement, and evidence strength."
                    blocks={2}
                  />
                </ReportBlock>

                <ReportBlock id="executive-summary">
                  <IntelligenceSectionSkeleton
                    label="Executive Brief"
                    title="Building the executive summary"
                    description="PoliticalPulse is identifying the central facts, context, and significance of this story."
                    blocks={3}
                  />
                </ReportBlock>

                <ReportBlock id="intelligence-overview">
                  <IntelligenceSectionSkeleton
                    label="Intelligence Overview"
                    title="Assessing the report"
                    description="PoliticalPulse is calculating confidence, category, bias indicators, and source coverage."
                    blocks={2}
                  />
                </ReportBlock>

                <ReportBlock id="impact-analysis">
                  <IntelligenceSectionSkeleton
                    label="Impact Analysis"
                    title="Evaluating potential impact"
                    description="PoliticalPulse is identifying who may be affected and the likely short- and long-term consequences."
                    blocks={3}
                  />
                </ReportBlock>

                <ReportBlock id="key-facts">
                  <IntelligenceSectionSkeleton
                    label="Key Facts"
                    title="Extracting supported facts"
                    description="PoliticalPulse is separating reported claims, established facts, and remaining uncertainties."
                    blocks={3}
                  />
                </ReportBlock>
              </>
            )}

            <ReportBlock id="story-timeline">
              <StoryTimeline
                article={article}
              />
            </ReportBlock>

            <ReportBlock id="intelligence-graph">
              {graph ? (
                <IntelligenceGraph
                  graph={graph}
                />
              ) : isGraphLoading ? (
                <IntelligenceSectionSkeleton
                  label="Intelligence Graph"
                  title="Building connected context"
                  description="PoliticalPulse is identifying the people, organizations, events, and issues connected to this story."
                  blocks={3}
                />
              ) : (
                <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
                  <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
                    Intelligence Graph
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-white">
                    Connected context
                    unavailable
                  </h2>

                  <p className="mt-3 max-w-3xl text-slate-400">
                    {graphErrorMessage ??
                      "PoliticalPulse could not identify reliable story connections from the available article information."}
                  </p>
                </section>
              )}
            </ReportBlock>

            {report ? (
              <>
                <ReportBlock id="perspective-analysis">
                  <PerspectiveAnalysis
                    report={report}
                  />
                </ReportBlock>

                <ReportBlock id="political-debate">
                  <DebatePanel
                    report={report}
                  />
                </ReportBlock>

                <ReportBlock id="consensus">
                  <ConsensusEngine
                    report={report}
                  />
                </ReportBlock>

                <ReportBlock id="fact-check">
                  <FactCheck
                    report={report}
                  />
                </ReportBlock>

                <ReportBlock id="source-comparison">
                  <SourceComparison
                    report={report}
                  />
                </ReportBlock>

                <ReportBlock id="evidence">
                  <EvidencePanel
                    report={report}
                  />
                </ReportBlock>

                {reportContext ? (
                  <ReportBlock id="ask-ai">
                    <AIChat
                      reportTitle={
                        article.title
                      }
                      reportContext={
                        reportContext
                      }
                    />
                  </ReportBlock>
                ) : null}
              </>
            ) : (
              <>
                <ReportBlock id="perspective-analysis">
                  <IntelligenceSectionSkeleton
                    label="Perspective Analysis"
                    title="Comparing political viewpoints"
                    description="PoliticalPulse is evaluating progressive, centrist, and conservative interpretations."
                    blocks={3}
                  />
                </ReportBlock>

                <ReportBlock id="political-debate">
                  <IntelligenceSectionSkeleton
                    label="Political Debate"
                    title="Mapping agreement and disagreement"
                    description="PoliticalPulse is identifying the strongest arguments, primary concerns, and areas of common ground."
                    blocks={3}
                  />
                </ReportBlock>

                <ReportBlock id="evidence">
                  <IntelligenceSectionSkeleton
                    label="Evidence"
                    title="Reviewing supporting information"
                    description="PoliticalPulse is assembling source evidence, methodology, and conflicting reporting."
                    blocks={3}
                  />
                </ReportBlock>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
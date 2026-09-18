"use client";

import Link from "next/link";
import {
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

import DeepAnalysis from "@/app/components/brief/DeepAnalysis";
import SixtySecondBrief from "@/app/components/brief/SixtySecondBrief";
import StoryBriefHeader from "@/app/components/brief/StoryBriefHeader";
import Footer from "@/app/components/Footer";
import SiteShell from "@/app/components/shell/SiteShell";
import AIChat from "@/app/components/intelligence/AIChat";
import ConsensusEngine from "@/app/components/intelligence/ConsensusEngine";
import DebatePanel from "@/app/components/intelligence/DebatePanel";
import EvidencePanel from "@/app/components/intelligence/EvidencePanel";
import FactCheck from "@/app/components/intelligence/FactCheck";
import ImpactAnalysis from "@/app/components/intelligence/ImpactAnalysis";
import IntelligenceGraph from "@/app/components/intelligence/IntelligenceGraph";
import IntelligenceOverview from "@/app/components/intelligence/IntelligenceOverview";
import IntelligenceSectionSkeleton from "@/app/components/intelligence/IntelligenceSectionSkeleton";
import KeyFacts from "@/app/components/intelligence/KeyFacts";
import PerspectiveAnalysis from "@/app/components/intelligence/PerspectiveAnalysis";
import SourceComparison from "@/app/components/intelligence/SourceComparison";
import StoryTimeline from "@/app/components/intelligence/StoryTimeline";
import TrustScore from "@/app/components/intelligence/TrustScore";

import { getSelectedArticle, saveSelectedArticle } from "@/lib/selectedArticle";
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
import {
  generateIntelligenceReportFromUrl,
  isUrlSubmittedArticle,
} from "@/lib/services/urlAnalysisReport";

import type { Article } from "../../types/article";
import type { IntelligenceGraph as IntelligenceGraphData } from "../../types/intelligenceGraph";
import type { IntelligenceReport } from "../../types/report";
import {
  parseWhatChangedViewModel,
  type WhatChangedViewModel,
} from "@/lib/services/whatChangedViewModel";

async function persistStorySnapshotBestEffort(
  snapshotInput: unknown
): Promise<WhatChangedViewModel | null> {
  try {
    const response = await fetch("/api/story-snapshots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      keepalive: true,
      body: JSON.stringify(snapshotInput),
    });
    const payload = (await response.json().catch(() => null)) as {
      whatChanged?: unknown;
    } | null;

    return parseWhatChangedViewModel(payload?.whatChanged);
  } catch {
    return null;
  }
}

async function loadStorySnapshotChanges(
  articleUrl: string
): Promise<WhatChangedViewModel | null> {
  try {
    const response = await fetch(
      `/api/story-snapshot-changes?url=${encodeURIComponent(articleUrl)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    const payload = (await response.json().catch(() => null)) as {
      whatChanged?: unknown;
    } | null;

    return parseWhatChangedViewModel(payload?.whatChanged);
  } catch {
    return null;
  }
}

function StoryPageShell({ children }: { children: ReactNode }) {
  return (
    <SiteShell>
      {children}
      <Footer />
    </SiteShell>
  );
}

export default function IntelligenceReportPage() {
  const [article, setArticle] =
    useState<Article | null>(null);

  const [report, setReport] =
    useState<IntelligenceReport | null>(
      null
    );

  const [whatChanged, setWhatChanged] =
    useState<WhatChangedViewModel | null>(null);

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

  const [
    graphArticle,
    setGraphArticle,
  ] = useState<Article | null>(null);

  useLayoutEffect(() => {
    let isCancelled = false;

    async function generateReport(
      selectedArticle: Article
    ) {
      try {
        setIsReportLoading(true);
        setErrorMessage(null);

        const {
          report: generatedReport,
          snapshotInput,
        } =
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

        try {
          const nextWhatChanged =
            await persistStorySnapshotBestEffort(
              snapshotInput
            );

          if (!isCancelled) {
            setWhatChanged(nextWhatChanged);
          }
        } catch {
          // Snapshot persistence must never fail the brief.
        }
      } catch (error) {
        console.error(
          "Failed to generate intelligence report:",
          error
        );

        if (!isCancelled) {
          setErrorMessage(
            "The Angle Report could not generate this brief. Please return to the homepage and try opening the story again."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsReportLoading(false);
        }
      }
    }

    async function generateUrlReport(
      selectedArticle: Article
    ) {
      try {
        setIsReportLoading(true);
        setErrorMessage(null);

        const {
          article: analyzedArticle,
          report: generatedReport,
          snapshotInput,
        } =
          await generateIntelligenceReportFromUrl(
            selectedArticle.url
          );

        if (isCancelled) {
          return;
        }

        saveSelectedArticle(analyzedArticle);
        cacheReport(
          analyzedArticle,
          generatedReport
        );

        setArticle(analyzedArticle);
        setReport(generatedReport);

        try {
          const nextWhatChanged =
            await persistStorySnapshotBestEffort(
              snapshotInput
            );

          if (!isCancelled) {
            setWhatChanged(nextWhatChanged);
          }
        } catch {
          // Snapshot persistence must never fail the brief.
        }
      } catch (error) {
        console.error(
          "Failed to generate URL intelligence report:",
          error
        );

        if (!isCancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "The Angle Report could not generate this brief from the submitted URL. Please return to the homepage and try again."
          );
          setIsGraphLoading(false);
        }
      } finally {
        if (!isCancelled) {
          setIsReportLoading(false);
        }
      }
    }

    function initializeIntelligence() {
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

      const cachedReport =
        getCachedReport(
          selectedArticle
        );

      if (cachedReport) {
        setReport(cachedReport);
        setIsReportLoading(false);
        void loadStorySnapshotChanges(selectedArticle.url)
          .then((nextWhatChanged) => {
            if (!isCancelled) {
              setWhatChanged(nextWhatChanged);
            }
          })
          .catch(() => {});
      } else if (
        isUrlSubmittedArticle(
          selectedArticle
        )
      ) {
        setIsReportLoading(true);
        setIsGraphLoading(false);
        void generateUrlReport(
          selectedArticle
        );
        setIsInitializingArticle(false);
        return;
      } else {
        setIsReportLoading(true);
        void generateReport(
          selectedArticle
        );
      }

      const cachedGraph =
        getCachedIntelligenceGraph(
          selectedArticle
        );

      if (cachedGraph) {
        setGraph(cachedGraph);
        setIsGraphLoading(false);
      } else {
        setIsGraphLoading(false);
      }

      setIsInitializingArticle(false);
    }

    initializeIntelligence();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!graphArticle || graph) {
      return;
    }

    const selectedArticle = graphArticle;

    const cachedGraph =
      getCachedIntelligenceGraph(
        selectedArticle
      );

    if (cachedGraph) {
      setGraph(cachedGraph);
      setIsGraphLoading(false);
      return;
    }

    let isCancelled = false;

    async function generateGraph() {
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
            "The Angle Report could not generate connected context for this story."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsGraphLoading(false);
        }
      }
    }

    void generateGraph();

    return () => {
      isCancelled = true;
    };
  }, [graph, graphArticle]);

  useEffect(() => {
    if (!report) {
      return;
    }

    const hash =
      window.location.hash.replace("#", "");

    if (!hash) {
      return;
    }

    let attempts = 0;
    let timeoutId: ReturnType<
      typeof setTimeout
    > | null = null;

    const scrollToRequestedSection = () => {
      const target =
        document.getElementById(hash);

      if (target) {
        requestAnimationFrame(() => {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });

        return;
      }

      attempts += 1;

      if (attempts < 10) {
        timeoutId = setTimeout(
          scrollToRequestedSection,
          100
        );
      }
    };

    scrollToRequestedSection();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [report]);

  if (isInitializingArticle) {
    return (
      <StoryPageShell>
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="h-40 animate-pulse rounded-2xl bg-[#06172D]" />
        </section>
      </StoryPageShell>
    );
  }

  if (!article) {
    return (
      <StoryPageShell>
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
            No story selected
          </p>

          <h1 className="mt-4 font-serif text-4xl font-black tracking-[-0.03em]">
            Open a 60-second brief from Today.
          </h1>

          <p className="mt-4 max-w-2xl text-[#9CB0C5]">
            The Angle Report needs a selected story before it can prepare this brief.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-[#FF2638] px-5 py-3 font-semibold text-white transition hover:bg-[#FF4151]"
          >
            Return to Today
          </Link>
        </section>
      </StoryPageShell>
    );
  }

  if (
    !isReportLoading &&
    (errorMessage || !report)
  ) {
    return (
      <StoryPageShell>
        <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
          <StoryBriefHeader
            article={article}
            isUrlArticle={isUrlSubmittedArticle(article)}
          />

          <div className="mt-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#FF7A86]">
              Brief unavailable
            </p>

            <h2 className="mt-3 font-serif text-3xl font-black tracking-[-0.03em]">
              We could not complete this brief.
            </h2>

            <p className="mt-4 max-w-2xl text-[#9CB0C5]">
              {errorMessage ??
                "An unexpected error occurred while preparing this story."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="rounded-xl bg-[#FF2638] px-5 py-3 font-semibold text-white transition hover:bg-[#FF4151]"
              >
                Try again
              </button>

              <Link
                href="/"
                className="rounded-xl px-5 py-3 font-semibold text-[#9CB0C5] transition hover:text-white"
              >
                Return to Today
              </Link>
            </div>
          </div>
        </section>
      </StoryPageShell>
    );
  }

  const reportContext = report
    ? buildIntelligenceContext({
        report,
        intelligenceGraph: graph,
      })
    : null;

  return (
    <StoryPageShell>
      <article className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
          <StoryBriefHeader
            article={article}
            isUrlArticle={isUrlSubmittedArticle(article)}
            isLoading={isReportLoading && !report}
            showReportingUpdated={Boolean(
              whatChanged && whatChanged.previousCapturedAt
            )}
          />

        {report ? (
          <SixtySecondBrief
            article={article}
            report={report}
            whatChanged={whatChanged}
          />
        ) : (
          <div className="mt-10 space-y-5" aria-busy="true" aria-live="polite">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="h-40 animate-pulse rounded-2xl bg-[#06172D]" />
              <div className="h-40 animate-pulse rounded-2xl bg-[#06172D]" />
            </div>
            <div className="h-28 animate-pulse rounded-2xl bg-[#06172D]" />
            <p className="text-sm text-[#8EA3B7]">
              {isUrlSubmittedArticle(article)
                ? "Looking at this article alongside related reporting…"
                : "Preparing the 60-second brief…"}
            </p>
          </div>
        )}

        {report && reportContext ? (
          <section id="ask-about-this-story" className="mt-6 sm:mt-7">
            <AIChat
              variant="compact"
              reportTitle={article.title}
              reportContext={reportContext}
              independentSourceCount={
                report.brief?.independentSourceCount ??
                report.overview.sourcesReviewed
              }
            />
          </section>
        ) : null}

        <div className="mt-6">
          <DeepAnalysis
            onOpen={() => {
              if (article) {
                setGraphArticle(article);
              }
            }}
          >
            {report ? (
              <>
                <TrustScore
                  trustScore={report.trustScore}
                />

                <KeyFacts report={report} />

                <IntelligenceOverview
                  report={report}
                />

                <PerspectiveAnalysis
                  report={report}
                />

                <ImpactAnalysis
                  report={report}
                />

                <FactCheck report={report} />

                <ConsensusEngine
                  report={report}
                />
              </>
            ) : (
              <IntelligenceSectionSkeleton
                label="Deep analysis"
                title="Building the deeper report"
                description="The Angle Report is assembling evidence, perspectives, and verification for this story."
                blocks={3}
              />
            )}

            <StoryTimeline article={article} />

            {graph ? (
              <IntelligenceGraph graph={graph} />
            ) : isGraphLoading ? (
              <IntelligenceSectionSkeleton
                label="Connected context"
                title="Building connected context"
                description="The Angle Report is identifying the people, organizations, events, and issues connected to this story."
                blocks={3}
              />
            ) : (
              <section className="rounded-3xl border border-[#17446D]/70 bg-[#04162C]/95 p-6 md:p-8">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#FF7A86]">
                  Connected context
                </p>

                <h2 className="mt-2 text-2xl font-extrabold text-white">
                  Connected context unavailable
                </h2>

                <p className="mt-3 max-w-3xl text-[#9CB0C5]">
                  {graphErrorMessage ??
                    "The Angle Report could not identify reliable story connections from the available article information."}
                </p>
              </section>
            )}

            {report ? (
              <>
                <DebatePanel report={report} />
                <SourceComparison report={report} />
                <EvidencePanel report={report} />
              </>
            ) : null}
          </DeepAnalysis>
        </div>
      </article>
    </StoryPageShell>
  );
}

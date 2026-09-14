import type { Article } from "@/app/types/article";
import type {
  IntelligenceReport,
  ReportRelatedSource,
} from "@/app/types/report";

import { isUrlSubmittedArticle } from "@/lib/services/urlAnalysisReport";

import {
  BriefSection,
  BulletList,
  usableList,
  usableText,
} from "./briefUi";

type SixtySecondBriefProps = {
  article: Article;
  report: IntelligenceReport;
};

type BriefSource = {
  name: string;
  url?: string;
  isPrimary?: boolean;
  title?: string;
};

function uniqueSources(
  report: IntelligenceReport,
  article: Article
): BriefSource[] {
  const related = report.evidence.relatedSources ?? [];

  if (related.length > 0) {
    const seen = new Set<string>();
    const sources: BriefSource[] = [];

    for (const source of related) {
      const key = source.url || source.sourceName;

      if (!key || seen.has(key)) {
        continue;
      }

      seen.add(key);
      sources.push({
        name: source.sourceName || source.title,
        url: source.url || undefined,
        isPrimary: source.isPrimary,
        title: source.title || undefined,
      });
    }

    return sources;
  }

  const names = usableList(report.evidence.primarySources);
  const originName = article.source?.name?.trim();
  const uniqueNames = originName
    ? Array.from(new Set([originName, ...names]))
    : names;

  return uniqueNames.map((name) => ({ name }));
}

function SourceList({ sources }: { sources: BriefSource[] }) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-3">
      {sources.map((source) => (
        <li key={source.url || source.name}>
          {source.url ? (
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-[#D5E0EC] underline decoration-[#31577A] underline-offset-4 transition hover:text-white"
            >
              {source.name}
            </a>
          ) : (
            <span className="text-sm font-medium text-[#D5E0EC]">
              {source.name}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function OtherCoverageList({
  sources,
}: {
  sources: ReportRelatedSource[];
}) {
  return (
    <ul className="space-y-4">
      {sources.map((source) => {
        const label =
          source.title?.trim() ||
          source.sourceName.trim() ||
          source.url;

        const heading = (
          <span className="text-base leading-7 text-[#E6EDF4]">
            {label}
          </span>
        );

        return (
          <li key={source.url || label}>
            {source.url ? (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-white"
              >
                {heading}
              </a>
            ) : (
              heading
            )}

            {source.sourceName &&
            source.title &&
            source.sourceName !== source.title ? (
              <p className="mt-1 text-sm text-[#7A93AA]">
                {source.sourceName}
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function UrlArticleBrief({
  article,
  report,
}: SixtySecondBriefProps) {
  const whatThisArticleSays = usableText(article.description);
  const broaderPicture = usableText(report.executiveSummary);
  const whyItMatters = usableText(report.whyThisMatters);

  const relatedSources = report.evidence.relatedSources ?? [];
  const otherCoverage = relatedSources.filter(
    (source) => !source.isPrimary
  );

  const angles = [
    { label: "Left", text: usableText(report.perspectives.left) },
    { label: "Center", text: usableText(report.perspectives.center) },
    { label: "Right", text: usableText(report.perspectives.right) },
  ].filter(
    (angle): angle is { label: string; text: string } =>
      Boolean(angle.text)
  );

  const confirmedElsewhere = usableList(
    report.commonGround.length > 0
      ? report.commonGround
      : report.perspectiveAnalysis.areasOfAgreement
  );

  const disputed = usableList(report.evidence.conflictingReporting);
  const disagreements = usableList(
    report.perspectiveAnalysis.mainDisagreements
  );
  const uncertain = usableList(report.unansweredQuestions);
  const disputedOrUncertain = [
    ...disputed,
    ...disagreements.filter((item) => !disputed.includes(item)),
    ...uncertain.filter(
      (item) => !disputed.includes(item) && !disagreements.includes(item)
    ),
  ];

  const sources = uniqueSources(report, article);
  const submittedSources = sources.filter((source) => source.isPrimary);
  const otherSources = sources.filter((source) => !source.isPrimary);
  const hasSourceSplit =
    submittedSources.length > 0 && otherSources.length > 0;

  return (
    <div id="brief" className="divide-y divide-[#17446D]/35">
      {whatThisArticleSays ? (
        <BriefSection title="What this article says">
          <p className="max-w-3xl text-lg leading-8 text-[#E6EDF4]">
            {whatThisArticleSays}
          </p>
        </BriefSection>
      ) : null}

      {broaderPicture &&
      broaderPicture !== whatThisArticleSays ? (
        <BriefSection title="The broader picture">
          <p className="max-w-3xl text-lg leading-8 text-[#E6EDF4]">
            {broaderPicture}
          </p>
        </BriefSection>
      ) : null}

      {whyItMatters ? (
        <BriefSection title="Why it matters">
          <p className="max-w-3xl text-lg leading-8 text-[#E6EDF4]">
            {whyItMatters}
          </p>
        </BriefSection>
      ) : null}

      {otherCoverage.length > 0 ? (
        <BriefSection title="What other coverage adds">
          <OtherCoverageList sources={otherCoverage} />
        </BriefSection>
      ) : (
        <BriefSection title="What other coverage adds">
          <p className="max-w-3xl text-base leading-7 text-[#9CB0C5]">
            Related reporting was thin or unavailable for this piece.
            That is a signal about the coverage landscape, not proof
            that the story is settled.
          </p>
        </BriefSection>
      )}

      {confirmedElsewhere.length > 0 &&
      otherCoverage.length > 0 ? (
        <BriefSection title="What is confirmed elsewhere">
          <BulletList items={confirmedElsewhere} />
        </BriefSection>
      ) : null}

      {angles.length > 0 ? (
        <BriefSection title="Other perspectives">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {angles.map((angle) => (
              <article key={angle.label}>
                <h3 className="text-sm font-semibold tracking-wide text-white">
                  {angle.label}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#B5C3D2]">
                  {angle.text}
                </p>
              </article>
            ))}
          </div>
        </BriefSection>
      ) : null}

      {disputedOrUncertain.length > 0 ? (
        <BriefSection title="What remains uncertain">
          <BulletList items={disputedOrUncertain} />
        </BriefSection>
      ) : null}

      {sources.length > 0 ? (
        <BriefSection title="Sources">
          {hasSourceSplit ? (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-white">
                  The article you submitted
                </p>
                <div className="mt-3">
                  <SourceList sources={submittedSources} />
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Also reviewed
                </p>
                <div className="mt-3">
                  <SourceList sources={otherSources} />
                </div>
              </div>
            </div>
          ) : (
            <SourceList sources={sources} />
          )}
        </BriefSection>
      ) : null}
    </div>
  );
}

function HomepageStoryBrief({
  article,
  report,
}: SixtySecondBriefProps) {
  const whatHappened = usableText(report.executiveSummary);
  const whyItMatters = usableText(report.whyThisMatters);

  const angles = [
    { label: "Left", text: usableText(report.perspectives.left) },
    { label: "Center", text: usableText(report.perspectives.center) },
    { label: "Right", text: usableText(report.perspectives.right) },
  ].filter(
    (angle): angle is { label: string; text: string } =>
      Boolean(angle.text)
  );

  const agreement = usableList(
    report.commonGround.length > 0
      ? report.commonGround
      : report.perspectiveAnalysis.areasOfAgreement
  );

  const disputed = usableList(report.evidence.conflictingReporting);
  const disagreements = usableList(
    report.perspectiveAnalysis.mainDisagreements
  );
  const uncertain = usableList(report.unansweredQuestions);
  const disputedOrUncertain = [
    ...disputed,
    ...disagreements.filter((item) => !disputed.includes(item)),
    ...uncertain.filter(
      (item) => !disputed.includes(item) && !disagreements.includes(item)
    ),
  ];

  const sources = uniqueSources(report, article);

  return (
    <div id="brief" className="divide-y divide-[#17446D]/35">
      {whatHappened ? (
        <BriefSection title="What happened">
          <p className="max-w-3xl text-lg leading-8 text-[#E6EDF4]">
            {whatHappened}
          </p>
        </BriefSection>
      ) : null}

      {whyItMatters ? (
        <BriefSection title="Why it matters">
          <p className="max-w-3xl text-lg leading-8 text-[#E6EDF4]">
            {whyItMatters}
          </p>
        </BriefSection>
      ) : null}

      {angles.length > 0 ? (
        <BriefSection title="The angles">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {angles.map((angle) => (
              <article key={angle.label}>
                <h3 className="text-sm font-semibold tracking-wide text-white">
                  {angle.label}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#B5C3D2]">
                  {angle.text}
                </p>
              </article>
            ))}
          </div>
        </BriefSection>
      ) : null}

      {agreement.length > 0 ? (
        <BriefSection title="What reporting agrees on">
          <BulletList items={agreement} />
        </BriefSection>
      ) : null}

      {disputedOrUncertain.length > 0 ? (
        <BriefSection title="What is disputed or uncertain">
          <BulletList items={disputedOrUncertain} />
        </BriefSection>
      ) : null}

      {sources.length > 0 ? (
        <BriefSection title="Sources">
          <SourceList sources={sources} />
        </BriefSection>
      ) : null}
    </div>
  );
}

export default function SixtySecondBrief({
  article,
  report,
}: SixtySecondBriefProps) {
  if (isUrlSubmittedArticle(article)) {
    return (
      <UrlArticleBrief
        article={article}
        report={report}
      />
    );
  }

  return (
    <HomepageStoryBrief
      article={article}
      report={report}
    />
  );
}

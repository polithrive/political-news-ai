import type { Article } from "@/app/types/article";
import type { IntelligencePreview } from "@/app/types/intelligencePreview";

import StoryBriefLink from "./StoryBriefLink";
import StoryImage from "./StoryImage";
import { storyCategory } from "./storyMeta";

type TheAngleModuleProps = {
  article: Article | null;
  preview?: IntelligencePreview | null;
};

const PREVIEW_UNAVAILABLE_COPY = [
  "The Angle Report could not generate an AI preview for this story.",
  "PoliticalPulse could not generate an AI preview for this story.",
  "The Angle Report could not generate a summary for this story.",
];

const READER_SUMMARY_FALLBACK =
  "Open the original reporting for the full story.";

function whatHappenedCopy(
  article: Article,
  preview?: IntelligencePreview | null
): string {
  const previewSummary = preview?.summary?.trim() || "";
  const usablePreview =
    previewSummary && !PREVIEW_UNAVAILABLE_COPY.includes(previewSummary)
      ? previewSummary
      : "";

  return (
    usablePreview ||
    article.description?.trim() ||
    READER_SUMMARY_FALLBACK
  );
}

export default function TheAngleModule({
  article,
  preview,
}: TheAngleModuleProps) {
  if (!article) {
    return null;
  }

  const whatHappened = whatHappenedCopy(article, preview);
  const whyItMatters = preview?.whyThisMatters?.trim() || "";
  const relatedSources = article.curation?.relatedSources ?? [];
  const clusterSize = article.curation?.clusterSize ?? 0;
  const sourceCount = clusterSize > 1 ? clusterSize : undefined;
  const category = storyCategory(article);
  const sourceNames =
    relatedSources.length > 0
      ? relatedSources
      : article.source?.name
        ? [article.source.name]
        : [];

  return (
    <section id="the-angle" className="scroll-mt-28">
      <div className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
          The Angle
        </p>
        <h2 className="mt-2 font-serif text-2xl font-black tracking-[-0.03em] text-white sm:text-[2rem]">
          One story. Every angle.
        </h2>
      </div>

      <article className="overflow-hidden rounded-xl border border-[#17446D]/55 bg-[#04162C]">
        <div className="grid lg:grid-cols-[minmax(200px,0.62fr)_minmax(0,1.38fr)]">
          <div className="relative min-h-[200px] bg-[#05182E] lg:min-h-full">
            <StoryImage
              src={article.urlToImage}
              category={category}
              sourceCount={sourceCount}
              sizes="(max-width: 1024px) 100vw, 32vw"
              className="object-cover object-center"
            />
          </div>

          <div className="px-5 py-5 sm:px-6 sm:py-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7DD3FC]">
              {category}
            </p>
            <h3 className="mt-2 text-pretty font-serif text-[1.28rem] font-bold leading-[1.22] tracking-[-0.03em] text-white sm:text-[1.45rem] sm:leading-[1.2] lg:text-[1.55rem] lg:leading-[1.18]">
              {article.title}
            </h3>

            {sourceNames.length > 0 ? (
              <p className="mt-3 text-[12px] leading-5 text-[#9CB0C5]">
                {sourceNames.slice(0, 4).join(", ")}
                {sourceNames.length > 4 ? " and others" : ""}
                {sourceCount ? (
                  <>
                    {" "}
                    · {sourceCount}{" "}
                    {sourceCount === 1 ? "source" : "sources"} in this feed
                  </>
                ) : null}
              </p>
            ) : null}

            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55C8FF]">
                What happened
              </p>
              <p className="mt-2 text-[15px] leading-6 text-[#C5D4E8] line-clamp-4">
                {whatHappened}
              </p>
            </div>

            {whyItMatters ? (
              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55C8FF]">
                  Why it matters
                </p>
                <p className="mt-2 text-[15px] leading-6 text-[#C5D4E8] line-clamp-3">
                  {whyItMatters}
                </p>
              </div>
            ) : null}

            <div className="mt-5">
              <StoryBriefLink
                article={article}
                label="60-second brief"
                className="inline-flex items-center rounded-full bg-[#FF2638] px-4 py-2 text-sm font-semibold text-white hover:bg-[#FF4151]"
              />
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

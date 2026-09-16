import type { Article } from "@/app/types/article";
import type { IntelligencePreview } from "@/app/types/intelligencePreview";

import StoryBriefLink from "./StoryBriefLink";
import StoryImage from "./StoryImage";
import { storyCategory } from "./storyMeta";

type TheAngleModuleProps = {
  article: Article | null;
  preview?: IntelligencePreview | null;
};

export default function TheAngleModule({
  article,
  preview,
}: TheAngleModuleProps) {
  if (!article) {
    return null;
  }

  const whatHappened =
    preview?.summary?.trim() || article.description?.trim() || "";
  const whyItMatters = preview?.whyThisMatters?.trim() || "";
  const sourceCount = preview?.sourcesReviewed;
  const category = storyCategory(article);

  return (
    <section id="the-angle" className="scroll-mt-28">
      <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
          The Angle
        </p>
        <h2 className="mt-2 font-serif text-2xl font-black tracking-[-0.03em] text-white sm:text-[2rem]">
          One story. Every angle.
        </h2>
      </div>

      <article className="overflow-hidden rounded-2xl border border-[#17446D]/45 bg-[#04162C]">
        <div className="grid lg:grid-cols-[minmax(260px,0.9fr)_minmax(0,1.15fr)]">
          <div className="relative min-h-[240px] bg-[#05182E] lg:min-h-full">
            <StoryImage
              src={article.urlToImage}
              category={category}
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center"
            />
          </div>

          <div className="px-5 py-6 sm:px-7 sm:py-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7DD3FC]">
              {category}
            </p>
            <h3 className="mt-2 font-serif text-[1.45rem] font-bold leading-snug tracking-[-0.03em] text-white sm:text-[1.7rem]">
              {article.title}
            </h3>

            {whatHappened ? (
              <div className="mt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55C8FF]">
                  What happened
                </p>
                <p className="mt-2 text-[15px] leading-6 text-[#C5D4E8] line-clamp-4">
                  {whatHappened}
                </p>
              </div>
            ) : null}

            {whyItMatters ? (
              <div className="mt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55C8FF]">
                  Why it matters
                </p>
                <p className="mt-2 text-[15px] leading-6 text-[#C5D4E8] line-clamp-3">
                  {whyItMatters}
                </p>
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              {typeof sourceCount === "number" && sourceCount > 0 ? (
                <p className="text-[12px] text-[#7890AC]">
                  Analyzed across {sourceCount}{" "}
                  {sourceCount === 1 ? "source" : "sources"}
                </p>
              ) : (
                <span />
              )}
              <StoryBriefLink
                article={article}
                label="Understand this story"
                className="inline-flex items-center rounded-full bg-[#FF2638] px-4 py-2 text-sm font-semibold text-white hover:bg-[#FF4151]"
              />
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

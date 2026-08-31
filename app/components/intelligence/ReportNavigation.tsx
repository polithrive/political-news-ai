"use client";

import {
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
} from "react";

import { colors } from "@/lib/design/theme";

import ReportProgress from "./ReportProgress";

type NavigationItem = {
  label: string;
  href: string;
};

const navigationItems: NavigationItem[] = [
  {
    label: "Trust Score™",
    href: "#trust-score",
  },
  {
    label: "Executive Brief",
    href: "#executive-summary",
  },
  {
    label: "Key Facts",
    href: "#key-facts",
  },
  {
    label: "Overview",
    href: "#intelligence-overview",
  },
  {
    label: "Perspectives",
    href: "#perspective-analysis",
  },
  {
    label: "Impact",
    href: "#impact-analysis",
  },
  {
    label: "Fact Check",
    href: "#fact-check",
  },
  {
    label: "Consensus",
    href: "#consensus",
  },
  {
    label: "Timeline",
    href: "#story-timeline",
  },
  {
    label: "Intelligence Graph",
    href: "#intelligence-graph",
  },
  {
    label: "Political Debate",
    href: "#political-debate",
  },
  {
    label: "Source Comparison",
    href: "#source-comparison",
  },
  {
    label: "Evidence",
    href: "#evidence",
  },
  {
    label: "Ask AI",
    href: "#ask-ai",
  },
];

const SECTION_ACTIVATION_OFFSET = 280;
const SAME_ROW_TOLERANCE = 12;

function getSectionId(href: string) {
  return href.replace("#", "");
}

function getHashSectionId() {
  return window.location.hash.replace("#", "");
}

export default function ReportNavigation() {
  const sectionIds = useMemo(
    () =>
      navigationItems.map((item) =>
        getSectionId(item.href)
      ),
    []
  );

  const [activeSectionId, setActiveSectionId] =
    useState(sectionIds[0]);

  useEffect(() => {
    let animationFrameId: number | null = null;

    function updateActiveSection() {
      animationFrameId = null;

      const sections = sectionIds
        .map((sectionId) =>
          document.getElementById(sectionId)
        )
        .filter(
          (
            section
          ): section is HTMLElement => section !== null
        );

      if (sections.length === 0) {
        return;
      }

      const isNearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 24;

      if (isNearBottom) {
        const lastSection =
          sections[sections.length - 1];

        setActiveSectionId(lastSection.id);
        return;
      }

      const measurements = sections.map(
        (section) => {
          const rect =
            section.getBoundingClientRect();

          return {
            section,
            top: rect.top,
            bottom: rect.bottom,
          };
        }
      );

      const passedActivationPoint =
        measurements.filter(
          ({ top }) =>
            top <= SECTION_ACTIVATION_OFFSET
        );

      let selectedMeasurement:
        | (typeof measurements)[number]
        | undefined;

      if (passedActivationPoint.length > 0) {
        selectedMeasurement =
          passedActivationPoint.reduce(
            (closest, current) =>
              current.top > closest.top
                ? current
                : closest
          );
      } else {
        selectedMeasurement =
          measurements.reduce(
            (closest, current) =>
              current.top < closest.top
                ? current
                : closest
          );
      }

      if (!selectedMeasurement) {
        return;
      }

      const sameRowSections =
        measurements.filter(
          ({ top }) =>
            Math.abs(
              top - selectedMeasurement.top
            ) <= SAME_ROW_TOLERANCE
        );

      const hashSectionId =
        getHashSectionId();

      const hashSectionOnSameRow =
        sameRowSections.find(
          ({ section }) =>
            section.id === hashSectionId
        );

      if (hashSectionOnSameRow) {
        setActiveSectionId(
          hashSectionOnSameRow.section.id
        );
        return;
      }

      setActiveSectionId(
        selectedMeasurement.section.id
      );
    }

    function requestActiveSectionUpdate() {
      if (animationFrameId !== null) {
        return;
      }

      animationFrameId =
        window.requestAnimationFrame(
          updateActiveSection
        );
    }

    const mutationObserver =
      new MutationObserver(
        requestActiveSectionUpdate
      );

    mutationObserver.observe(
      document.body,
      {
        childList: true,
        subtree: true,
      }
    );

    window.addEventListener(
      "scroll",
      requestActiveSectionUpdate,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      requestActiveSectionUpdate
    );

    window.addEventListener(
      "hashchange",
      requestActiveSectionUpdate
    );

    requestActiveSectionUpdate();

    return () => {
      mutationObserver.disconnect();

      window.removeEventListener(
        "scroll",
        requestActiveSectionUpdate
      );

      window.removeEventListener(
        "resize",
        requestActiveSectionUpdate
      );

      window.removeEventListener(
        "hashchange",
        requestActiveSectionUpdate
      );

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(
          animationFrameId
        );
      }
    };
  }, [sectionIds]);

  function handleNavigationClick(
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    event.preventDefault();

    const sectionId =
      getSectionId(href);

    const section =
      document.getElementById(sectionId);

    if (!section) {
      return;
    }

    setActiveSectionId(sectionId);

    window.history.replaceState(
      null,
      "",
      href
    );

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  const activeSectionIndex =
    Math.max(
      sectionIds.indexOf(activeSectionId),
      0
    );

  const completedSections =
    activeSectionIndex + 1;

  return (
    <nav
      aria-label="Intelligence report sections"
      className="rounded-xl p-3"
      style={{
        backgroundColor:
          colors.background.elevated,
      }}
    >
      <div className="px-2 pt-1">
        <p
          className="text-xs font-bold uppercase tracking-[0.16em]"
          style={{
            color:
              colors.brand.primary,
          }}
        >
          PoliticalPulse
        </p>

        <h2
          className="mt-2 text-lg font-semibold tracking-tight"
          style={{
            color:
              colors.text.primary,
          }}
        >
          Report sections
        </h2>

        <p
          className="mt-1 text-sm leading-5"
          style={{
            color:
              colors.text.muted,
          }}
        >
          Follow the analysis from evidence to conclusions.
        </p>
      </div>

      <div className="mt-5 px-2">
        <ReportProgress
          completedSections={
            completedSections
          }
          totalSections={
            navigationItems.length
          }
        />
      </div>

      <div
        className="my-4 border-t"
        style={{
          borderColor:
            colors.border.subtle,
        }}
      />

      <div className="flex flex-col gap-1">
        {navigationItems.map(
          (item, index) => {
            const sectionId =
              getSectionId(
                item.href
              );

            const isActive =
              activeSectionId ===
              sectionId;

            const isCompleted =
              index <
              activeSectionIndex;

            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={
                  isActive
                    ? "location"
                    : undefined
                }
                onClick={(event) =>
                  handleNavigationClick(
                    event,
                    item.href
                  )
                }
                className={[
                  "group relative flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm transition duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                ].join(" ")}
                style={{
                  backgroundColor:
                    isActive
                      ? colors.brand
                          .primarySoft
                      : "transparent",
                  color:
                    isActive
                      ? colors.text
                          .primary
                      : colors.text
                          .secondary,
                  outlineColor:
                    colors.brand
                      .secondary,
                }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-2 left-0 w-0.5 rounded-full transition-opacity duration-200"
                  style={{
                    backgroundColor:
                      colors.brand
                        .primary,
                    opacity: isActive
                      ? 1
                      : 0,
                  }}
                />

                <span
                  aria-hidden="true"
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition duration-200"
                  style={{
                    backgroundColor:
                      isActive
                        ? colors.brand
                            .primary
                        : isCompleted
                          ? colors
                              .status
                              .successSoft
                          : colors
                              .background
                              .muted,
                    color:
                      isActive
                        ? colors.text
                            .inverse
                        : isCompleted
                          ? colors
                              .status
                              .success
                          : colors.text
                              .subtle,
                  }}
                >
                  {isCompleted
                    ? "✓"
                    : isActive
                      ? "•"
                      : ""}
                </span>

                <span
                  className={[
                    "transition-colors duration-200",
                    isActive
                      ? "font-semibold"
                      : "font-medium group-hover:underline",
                  ].join(" ")}
                >
                  {item.label}
                </span>
              </a>
            );
          }
        )}
      </div>
    </nav>
  );
}
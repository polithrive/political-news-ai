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
    label: "Overview",
    href: "#intelligence-overview",
  },
  {
    label: "Impact",
    href: "#impact-analysis",
  },
  {
    label: "Key Facts",
    href: "#key-facts",
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
    label: "Perspectives",
    href: "#perspective-analysis",
  },
  {
    label: "Political Debate",
    href: "#political-debate",
  },
  {
    label: "Consensus",
    href: "#consensus",
  },
  {
    label: "Fact Check",
    href: "#fact-check",
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

const SECTION_ACTIVATION_OFFSET = 180;

function getSectionId(href: string) {
  return href.replace("#", "");
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

      const availableSections = sectionIds
        .map((sectionId) =>
          document.getElementById(sectionId)
        )
        .filter(
          (
            section
          ): section is HTMLElement => section !== null
        );

      if (availableSections.length === 0) {
        return;
      }

      const activationPoint =
        window.scrollY + SECTION_ACTIVATION_OFFSET;

      let currentSection = availableSections[0];

      for (const section of availableSections) {
        if (section.offsetTop <= activationPoint) {
          currentSection = section;
        } else {
          break;
        }
      }

      const isNearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 24;

      if (isNearBottom) {
        currentSection =
          availableSections[
            availableSections.length - 1
          ];
      }

      setActiveSectionId(currentSection.id);
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

    const mutationObserver = new MutationObserver(
      requestActiveSectionUpdate
    );

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener(
      "scroll",
      requestActiveSectionUpdate,
      { passive: true }
    );

    window.addEventListener(
      "resize",
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

    const sectionId = getSectionId(href);
    const section =
      document.getElementById(sectionId);

    if (!section) {
      return;
    }

    setActiveSectionId(sectionId);

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(
      null,
      "",
      href
    );
  }

  const activeSectionIndex = Math.max(
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
            color: colors.brand.primary,
          }}
        >
          PoliticalPulse
        </p>

        <h2
          className="mt-2 text-lg font-semibold tracking-tight"
          style={{
            color: colors.text.primary,
          }}
        >
          Report sections
        </h2>

        <p
          className="mt-1 text-sm leading-5"
          style={{
            color: colors.text.muted,
          }}
        >
          Follow the analysis from evidence to conclusions.
        </p>
      </div>

      <div className="mt-5 px-2">
        <ReportProgress
          completedSections={completedSections}
          totalSections={navigationItems.length}
        />
      </div>

      <div
        className="my-4 border-t"
        style={{
          borderColor: colors.border.subtle,
        }}
      />

      <div className="flex flex-col gap-1">
        {navigationItems.map((item, index) => {
          const sectionId = getSectionId(
            item.href
          );

          const isActive =
            activeSectionId === sectionId;

          const isCompleted =
            index < activeSectionIndex;

          return (
            <a
              key={item.href}
              href={item.href}
              aria-current={
                isActive ? "location" : undefined
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
                backgroundColor: isActive
                  ? colors.brand.primarySoft
                  : "transparent",
                color: isActive
                  ? colors.text.primary
                  : colors.text.secondary,
                outlineColor:
                  colors.brand.secondary,
              }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-2 left-0 w-0.5 rounded-full transition-opacity duration-200"
                style={{
                  backgroundColor:
                    colors.brand.primary,
                  opacity: isActive ? 1 : 0,
                }}
              />

              <span
                aria-hidden="true"
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition duration-200"
                style={{
                  backgroundColor: isActive
                    ? colors.brand.primary
                    : isCompleted
                      ? colors.status.successSoft
                      : colors.background.muted,
                  color: isActive
                    ? colors.text.inverse
                    : isCompleted
                      ? colors.status.success
                      : colors.text.subtle,
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
        })}
      </div>
    </nav>
  );
}
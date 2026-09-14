"use client";

import { useEffect, useMemo } from "react";

import type { CoverageFraming } from "@/app/lib/coverageFraming";
import {
  COVERAGE_METHODOLOGY_POINTS,
  COVERAGE_METHODOLOGY_SHORT,
  COVERAGE_METHODOLOGY_TITLE,
  shareCoverageText,
} from "@/app/lib/coverageFraming";

type ShareCoverageCardProps = {
  articleTitle: string;
  articlePath?: string;
  coverage: CoverageFraming;
  onClose: () => void;
};

function articleUrl(articlePath?: string) {
  if (typeof window === "undefined") {
    return articlePath ?? "";
  }

  if (articlePath) {
    return new URL(articlePath, window.location.origin).toString();
  }

  return window.location.href;
}

function drawCoverageCard(input: {
  title: string;
  lean: string;
  score: number;
}): string {
  const width = 1200;
  const height = 630;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    return "";
  }

  context.fillStyle = "#020D21";
  context.fillRect(0, 0, width, height);

  context.fillStyle = "#38BDF8";
  context.font = "600 28px sans-serif";
  context.fillText("THE ANGLE REPORT", 72, 88);

  context.fillStyle = "#9CB0C5";
  context.font = "500 22px sans-serif";
  context.fillText("COVERAGE FRAMING", 72, 132);

  context.fillStyle = "#FFFFFF";
  context.font = "700 44px serif";
  wrapText(context, input.title, 72, 210, width - 144, 54);

  const trackX = 72;
  const trackY = 400;
  const trackWidth = width - 144;
  const trackHeight = 18;
  const gradient = context.createLinearGradient(trackX, 0, trackX + trackWidth, 0);
  gradient.addColorStop(0, "#3B82F6");
  gradient.addColorStop(0.5, "#94A3B8");
  gradient.addColorStop(1, "#FF2638");
  context.fillStyle = gradient;
  roundRect(context, trackX, trackY, trackWidth, trackHeight, 9);
  context.fill();

  const markerX = trackX + (trackWidth * input.score) / 100;
  context.fillStyle = "#FFFFFF";
  context.beginPath();
  context.arc(markerX, trackY + trackHeight / 2, 16, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#020D21";
  context.beginPath();
  context.arc(markerX, trackY + trackHeight / 2, 10, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#9CB0C5";
  context.font = "600 20px sans-serif";
  context.fillText("LEFT", trackX, 450);
  context.fillText("CENTER", trackX + trackWidth / 2 - 40, 450);
  context.fillText("RIGHT", trackX + trackWidth - 80, 450);

  context.fillStyle = "#FFFFFF";
  context.font = "700 28px sans-serif";
  context.fillText(`${input.lean} framing · ${input.score}/100`, 72, 520);

  context.fillStyle = "#9CB0C5";
  context.font = "400 20px sans-serif";
  wrapText(context, COVERAGE_METHODOLOGY_SHORT, 72, 568, width - 144, 28);

  return canvas.toDataURL("image/png");
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  let offsetY = y;
  let lines = 0;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (context.measureText(testLine).width > maxWidth && line) {
      context.fillText(line, x, offsetY);
      line = word;
      offsetY += lineHeight;
      lines += 1;
      if (lines >= 3) {
        context.fillText(`${word}…`, x, offsetY);
        return;
      }
    } else {
      line = testLine;
    }
  }

  if (line) {
    context.fillText(line, x, offsetY);
  }
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

export default function ShareCoverageCard({
  articleTitle,
  articlePath,
  coverage,
  onClose,
}: ShareCoverageCardProps) {
  const url = articleUrl(articlePath);
  const text = useMemo(
    () =>
      shareCoverageText({
        title: articleTitle,
        lean: coverage.lean,
        score: coverage.score,
        url,
      }),
    [articleTitle, coverage.lean, coverage.score, url]
  );

  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function copyText() {
    await navigator.clipboard.writeText(text);
  }

  async function downloadCard() {
    const dataUrl = drawCoverageCard({
      title: articleTitle,
      lean: coverage.lean,
      score: coverage.score,
    });
    if (!dataUrl) {
      return;
    }

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "angle-report-coverage-card.png";
    link.click();
  }

  async function nativeShare() {
    if (typeof navigator.share !== "function") {
      await copyText();
      return;
    }

    await navigator.share({
      title: "Coverage framing from The Angle Report",
      text,
      url,
    });
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="coverage-share-title"
        className="w-full max-w-lg rounded-2xl bg-[#04162C] p-5 shadow-2xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#55C8FF]">
          Share coverage card
        </p>
        <h3
          id="coverage-share-title"
          className="mt-2 font-serif text-xl font-bold text-white"
        >
          {articleTitle}
        </h3>

        <div className="relative mt-5 h-2 rounded-full bg-gradient-to-r from-[#3B82F6] via-[#94A3B8] to-[#FF2638]">
          <span
            className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#020D21]"
            style={{ left: `${coverage.score}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px] uppercase tracking-[0.12em] text-[#7890AC]">
          <span>Left</span>
          <span>Center</span>
          <span>Right</span>
        </div>
        <p className="mt-3 text-sm font-semibold text-white">
          {coverage.lean} framing · {coverage.score}/100
        </p>
        {coverage.reasoning ? (
          <p className="mt-2 text-sm leading-6 text-[#9CB0C5]">
            {coverage.reasoning}
          </p>
        ) : null}

        <details className="mt-4 text-sm text-[#9CB0C5]">
          <summary className="cursor-pointer font-semibold text-[#55C8FF]">
            {COVERAGE_METHODOLOGY_TITLE}
          </summary>
          <p className="mt-2">{COVERAGE_METHODOLOGY_SHORT}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {COVERAGE_METHODOLOGY_POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </details>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedText}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-[#05182E] px-3 py-2 text-center text-sm font-semibold text-white hover:text-[#55C8FF]"
          >
            Share on X
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-[#05182E] px-3 py-2 text-center text-sm font-semibold text-white hover:text-[#55C8FF]"
          >
            LinkedIn
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-[#05182E] px-3 py-2 text-center text-sm font-semibold text-white hover:text-[#55C8FF]"
          >
            Facebook
          </a>
          <button
            type="button"
            onClick={() => {
              void nativeShare();
            }}
            className="rounded-lg bg-[#05182E] px-3 py-2 text-sm font-semibold text-white hover:text-[#55C8FF]"
          >
            More
          </button>
          <button
            type="button"
            onClick={() => {
              void copyText();
            }}
            className="rounded-lg bg-[#05182E] px-3 py-2 text-sm font-semibold text-white hover:text-[#55C8FF]"
          >
            Copy text
          </button>
          <button
            type="button"
            onClick={() => {
              void downloadCard();
            }}
            className="rounded-lg bg-[#38BDF8] px-3 py-2 text-sm font-semibold text-[#03111F]"
          >
            Download card
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 text-sm font-semibold text-[#9CB0C5] hover:text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";

import AnalyzeUrlForm from "./AnalyzeUrlForm";

const feedTopics = [
  { label: "Politics", query: "politics" },
  { label: "Economy", query: "economy" },
  { label: "AI", query: "artificial intelligence" },
  { label: "College", query: "college" },
  { label: "Health", query: "health" },
];

const cardClass =
  "flex h-full flex-col rounded-[22px] border border-white/5 bg-[#04162C] p-4 sm:p-5";

const ctaClass =
  "mt-auto inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#1D8CFF] to-[#3CC8FF] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(29,140,255,0.28)] hover:brightness-110";

function TimelineMark() {
  return (
    <svg viewBox="0 0 180 78" className="h-[72px] w-full" aria-hidden="true">
      <path
        d="M8 52 C28 52 34 22 54 22 S82 62 104 54 S132 26 172 30"
        fill="none"
        stroke="#2EA8E8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {[
        [18, 50],
        [54, 22],
        [80, 48],
        [104, 54],
        [138, 32],
        [172, 30],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6" fill="#3CC8FF" />
      ))}
    </svg>
  );
}

function DocumentsMark() {
  return (
    <svg viewBox="0 0 140 78" className="h-[72px] w-full" aria-hidden="true">
      <rect x="12" y="18" width="58" height="48" rx="8" fill="#0B2A4C" stroke="#2EA8E8" />
      <rect x="38" y="10" width="64" height="52" rx="8" fill="#12365C" stroke="#7DD3FC" />
      <rect x="70" y="22" width="52" height="42" rx="8" fill="#0E2F52" stroke="#38BDF8" />
      <path d="M50 28h28M50 36h22M50 44h16" stroke="#9CB0C5" strokeWidth="2" />
    </svg>
  );
}

function GlobeBackdrop() {
  return (
    <svg
      viewBox="0 0 960 220"
      className="pointer-events-none absolute inset-x-0 bottom-[-28%] h-[170%] w-full opacity-80"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="globe-glow" cx="50%" cy="78%" r="58%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.42" />
          <stop offset="55%" stopColor="#0B3A62" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#04162C" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="480" cy="210" rx="430" ry="168" fill="url(#globe-glow)" />
      <ellipse
        cx="480"
        cy="248"
        rx="390"
        ry="150"
        fill="none"
        stroke="#38BDF8"
        strokeOpacity="0.18"
        strokeWidth="2"
      />
      <path
        d="M210 188 C260 150 310 142 360 168 C410 196 470 150 520 158 C580 168 640 210 710 176"
        fill="none"
        stroke="#67E8F9"
        strokeOpacity="0.22"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function HomeFeatureTools() {
  const [followingLoans, setFollowingLoans] = useState(true);

  return (
    <section id="understand-any-article" className="scroll-mt-28 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <article className={cardClass}>
          <h3 className="text-[15px] font-semibold text-white">
            Interactive Timelines
          </h3>
          <p className="mt-2 text-[13px] leading-5 text-[#9CB0C5]">
            See how a story has evolved over time with key events, context, and
            source coverage.
          </p>
          <div className="my-4">
            <TimelineMark />
          </div>
          <Link href="/timeline" className={ctaClass}>
            Try it out →
          </Link>
        </article>

        <article className={cardClass}>
          <h3 className="text-[15px] font-semibold text-white">Topic Deep Dives</h3>
          <p className="mt-2 text-[13px] leading-5 text-[#9CB0C5]">
            Go beyond the headlines with comprehensive explainers on the issues
            that matter.
          </p>
          <div className="my-4">
            <DocumentsMark />
          </div>
          <Link href="/research" className={ctaClass}>
            Explore Topics →
          </Link>
        </article>

        <article className={cardClass}>
          <h3 className="flex items-center gap-2 text-[15px] font-semibold text-white">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#12365C] text-[11px] text-[#7DD3FC]">
              ✓
            </span>
            Bias &amp; Source Checker
          </h3>
          <p className="mt-2 text-[13px] leading-5 text-[#9CB0C5]">
            Instantly analyze any article or source to see credibility, bias,
            and ownership details.
          </p>
          <div className="my-3 flex items-center gap-3 rounded-xl bg-[#0A2544] p-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F4F4F4] text-[10px] font-black text-[#F04E23]">
              R
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Reuters</p>
              <p className="text-[12px] text-[#9CB0C5]">High credibility</p>
              <p className="text-[11px] text-[#7A90A8]">Owned by: Thomson Family</p>
            </div>
          </div>
          <AnalyzeUrlForm compact submitLabel="Check a Source →" />
        </article>

        <article className={cardClass}>
          <h3 className="text-[15px] font-semibold text-white">
            My Personalized Feed
          </h3>
          <p className="mt-2 text-[13px] leading-5 text-[#9CB0C5]">
            Get news tailored to your interests without the noise.
          </p>
          <div className="my-4 flex flex-wrap gap-2">
            {feedTopics.map((topic) => (
              <Link
                key={topic.label}
                href={`/?q=${encodeURIComponent(topic.query)}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0A2544] px-2.5 py-1 text-[11px] font-semibold text-[#D7E4F4] hover:text-white"
              >
                {topic.label}
                <span aria-hidden="true" className="text-[#7A90A8]">
                  ×
                </span>
              </Link>
            ))}
          </div>
          <Link href="/signin" className={ctaClass}>
            Create My Feed →
          </Link>
        </article>

        <article className={cardClass}>
          <h3 className="text-[15px] font-semibold text-white">Save &amp; Follow</h3>
          <p className="mt-2 text-[13px] leading-5 text-[#9CB0C5]">
            Track topics, save articles, and get updates as stories develop.
          </p>
          <div className="my-4 flex items-center justify-between gap-3 rounded-xl bg-[#0A2544] px-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2B6CB0] text-xs font-bold text-white">
                SL
              </span>
              <div>
                <p className="text-[11px] text-[#9CB0C5]">You&apos;re following</p>
                <p className="text-sm font-semibold text-white">Student Loans</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={followingLoans}
              onClick={() => setFollowingLoans((current) => !current)}
              className={`relative h-6 w-11 shrink-0 rounded-full ${
                followingLoans ? "bg-[#38BDF8]" : "bg-[#214B70]"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                  followingLoans ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>
          <Link href="/saved" className={ctaClass}>
            Start Following →
          </Link>
        </article>
      </div>

      <div className="relative overflow-hidden rounded-[22px] bg-[#04162C] px-6 py-12 sm:px-10 sm:py-14">
        <GlobeBackdrop />
        <div className="relative flex flex-col items-center gap-6 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
          <div className="max-w-2xl">
            <h2 className="font-serif text-[1.7rem] font-black tracking-[-0.03em] text-white sm:text-[2.15rem]">
              A more informed world is a stronger world.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#C5D4E8] sm:text-base">
              The Angle Report helps you understand the news, so you can see the
              bigger picture.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/signin"
              className="inline-flex min-w-[168px] items-center justify-center rounded-full bg-gradient-to-r from-[#1D8CFF] to-[#3CC8FF] px-8 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(29,140,255,0.28)] hover:brightness-110"
            >
              Join Now
            </Link>
            <p className="mt-2 text-center text-[12px] text-[#9CB0C5]">
              Free to get started.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

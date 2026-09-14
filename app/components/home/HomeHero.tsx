"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { PlayIcon } from "./HomeIcons";

export default function HomeHero() {
  const [todayLabel, setTodayLabel] = useState("");

  useEffect(() => {
    setTodayLabel(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );
  }, []);

  return (
    <section className="relative overflow-hidden rounded-2xl">
      <div className="absolute inset-0">
        <Image
          src="/polithrive-capitol-bg.png"
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 70vw"
          className="object-cover object-[68%_42%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#020D21_0%,rgba(2,13,33,0.88)_28%,rgba(2,13,33,0.18)_58%,rgba(2,13,33,0.35)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,13,33,0.2)_0%,transparent_45%,rgba(2,13,33,0.55)_100%)]" />
      </div>

      <div className="relative px-5 py-9 sm:px-7 sm:py-11 lg:min-h-[318px] lg:py-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#55C8FF]">
          Good morning
        </p>
        <p
          className="absolute right-[38%] top-9 hidden text-[13px] text-[#9CB0C5] lg:block"
          suppressHydrationWarning
        >
          {todayLabel}
        </p>

        <h1 className="mt-4 max-w-lg font-serif text-[2.35rem] font-black leading-[1.05] tracking-[-0.045em] text-pretty text-white sm:text-[2.85rem] lg:text-[3.15rem]">
          Understand
          <br />
          today&apos;s biggest
          <br />
          stories in minutes.
        </h1>

        <p className="mt-5 max-w-md text-[16px] leading-7 text-[#C5D4E8]">
          Clear. Balanced. Multi-source analysis.
          <br />
          The news, from every angle.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href="#today"
            className="inline-flex items-center rounded-full bg-[#38BDF8] px-5 py-2.5 text-sm font-semibold text-[#03111F] transition hover:bg-[#55C8FF]"
          >
            See today&apos;s top stories →
          </Link>
          <Link
            href="#today"
            className="inline-flex items-center gap-2 rounded-full border border-[#3A6A96] px-4 py-2.5 text-sm font-semibold text-white hover:border-[#55C8FF]"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#38BDF8] text-[#03111F]">
              <PlayIcon className="h-3 w-3" />
            </span>
            Watch 1-minute overview
          </Link>
        </div>

        <p className="pointer-events-none absolute bottom-6 right-7 hidden max-w-[160px] text-right text-[13px] leading-5 text-[#D7E4F4] lg:block">
          Different perspectives.
          <br />
          A clearer picture.
        </p>
      </div>
    </section>
  );
}

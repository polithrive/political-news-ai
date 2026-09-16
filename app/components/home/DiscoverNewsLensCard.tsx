"use client";

import Link from "next/link";

import { useLocalAccount } from "@/app/components/shell/useLocalAccount";

export default function DiscoverNewsLensCard() {
  const account = useLocalAccount();

  if (account) {
    return (
      <section
        id="reading-mix"
        className="rounded-2xl border border-[#17446D]/55 bg-[#04162C] p-4"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55C8FF]">
          Your reading mix
        </p>
        <p className="mt-2 text-[13px] leading-5 text-[#9CB0C5]">
          Your mix will appear here as you save stories, follow topics, and
          open 60-second briefs.
        </p>
        <Link
          href="/saved"
          className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-[#214B70] px-3 py-2 text-sm font-semibold text-white hover:border-[#55C8FF]"
        >
          Open saved stories →
        </Link>
      </section>
    );
  }

  return (
    <section
      id="reading-mix"
      className="rounded-2xl border border-[#17446D]/55 bg-[#04162C] p-4"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55C8FF]">
        Discover your news lens
      </p>
      <p className="mt-2 text-[13px] leading-5 text-[#9CB0C5]">
        See which perspectives you read most, uncover blind spots, and build a
        more balanced news diet.
      </p>
      <p className="mt-3 text-[12px] text-[#7890AC]">
        Track your reading mix, source diversity, and topics over time.
      </p>
      <Link
        href="/signin"
        className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-[#214B70] px-3 py-2 text-sm font-semibold text-white hover:border-[#55C8FF]"
      >
        Create your free profile →
      </Link>
    </section>
  );
}

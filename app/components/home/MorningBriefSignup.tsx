"use client";

import { FormEvent, useState } from "react";

type MorningBriefSignupProps = {
  compact?: boolean;
};

/*
 * Frontend-only newsletter capture. Isolate this component so a real
 * subscription service can be wired later without touching homepage layout.
 */
export default function MorningBriefSignup({
  compact = false,
}: MorningBriefSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      return;
    }

    try {
      window.localStorage.setItem(
        "angle-report-morning-brief-email",
        trimmed
      );
    } catch {
      /* local preview only */
    }

    setStatus("saved");
  }

  if (compact) {
    return (
      <div className="max-w-xl">
        <h2 className="font-serif text-2xl font-black tracking-[-0.03em] text-white">
          Get the Morning Brief
        </h2>
        <p className="mt-1 text-sm text-[#9CB0C5]">
          5 stories. 5 minutes. Every angle.
        </p>
        {status === "saved" ? (
          <p className="mt-4 text-sm text-[#55C8FF]">
            Newsletter signup is not connected yet.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col gap-2 sm:flex-row"
          >
            <label className="sr-only" htmlFor="morning-brief-email">
              Email address
            </label>
            <input
              id="morning-brief-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              suppressHydrationWarning
              className="min-w-0 flex-1 rounded-lg bg-[#05182E] px-4 py-2.5 text-sm text-white outline-none placeholder:text-[#7890AC]"
            />
            <button
              type="submit"
              className="rounded-lg bg-[#38BDF8] px-5 py-2.5 text-sm font-semibold text-[#03111F] hover:bg-[#55C8FF]"
              suppressHydrationWarning
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <section className="py-10">
      <div className="rounded-2xl bg-[#04162C] px-6 py-10 text-center sm:px-10">
        <h2 className="font-serif text-3xl font-black tracking-[-0.03em] text-white">
          Get the Morning Brief
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-[#9CB0C5]">
          5 stories. 5 minutes. Every angle.
        </p>
        {status === "saved" ? (
          <p className="mt-8 text-sm text-[#55C8FF]">
            Newsletter signup is not connected yet.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="min-w-0 flex-1 rounded-lg bg-[#05182E] px-4 py-3.5 text-sm text-white outline-none placeholder:text-[#7890AC]"
            />
            <button
              type="submit"
              className="rounded-lg bg-[#38BDF8] px-6 py-3.5 text-sm font-semibold text-[#03111F] hover:bg-[#55C8FF]"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

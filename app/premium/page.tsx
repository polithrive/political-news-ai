"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import Footer from "@/app/components/Footer";
import SiteShell from "@/app/components/shell/SiteShell";
import { useLocalAccount } from "@/app/components/shell/useLocalAccount";
import {
  getLocalAccount,
  saveLocalAccount,
} from "@/lib/localAccount";

const included = [
  "The same 60-second briefs everyone gets",
  "Priority when we add member-only briefings",
  "A way to support the product without a paywall on Today",
];

export default function PremiumPage() {
  const router = useRouter();
  const account = useLocalAccount();
  const hasTrial = Boolean(account?.trialStartedAt);

  function startTrial() {
    const currentAccount = getLocalAccount();

    if (!currentAccount) {
      router.push("/signin?next=/premium");
      return;
    }

    saveLocalAccount({
      ...currentAccount,
      trialStartedAt: currentAccount.trialStartedAt ?? new Date().toISOString(),
    });
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
          Membership
        </p>

        <h1 className="mt-4 font-serif text-4xl font-black tracking-[-0.03em] sm:text-5xl">
          Try Premium without locking the news.
        </h1>

        <p className="mt-5 leading-8 text-[#9CB0C5]">
          Today stays free. Premium is support for the product — not a
          wall in front of the 60-second brief. Billing is not live yet;
          starting a trial remembers your interest on this device.
        </p>

        <ul className="mt-8 space-y-3 text-[#D7E4F4]">
          {included.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#55C8FF]" />
              {item}
            </li>
          ))}
        </ul>

        {hasTrial ? (
          <p className="mt-10 rounded-xl border border-[#17446D]/70 bg-[#071E38] px-5 py-4 text-[#D7E4F4]">
            Your Premium trial is saved on this device for{" "}
            {account?.email}.
          </p>
        ) : (
          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={startTrial}
              className="rounded-xl bg-[#FF2638] px-5 py-3 font-semibold text-white transition hover:bg-[#FF4151]"
            >
              {account ? "Start free trial" : "Sign in to try Premium"}
            </button>

            <Link
              href="/"
              className="rounded-xl px-5 py-3 font-semibold text-[#9CB0C5] transition hover:text-white"
            >
              Keep reading Today
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </SiteShell>
  );
}

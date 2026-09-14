"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

import Footer from "@/app/components/Footer";
import SiteShell from "@/app/components/shell/SiteShell";
import { useLocalAccount } from "@/app/components/shell/useLocalAccount";
import {
  clearLocalAccount,
  getLocalAccount,
  saveLocalAccount,
} from "@/lib/localAccount";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const existingAccount = useLocalAccount();
  const [email, setEmail] = useState(existingAccount?.email ?? "");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
      setErrorMessage("Enter a valid email address.");
      return;
    }

    const currentAccount = getLocalAccount();
    saveLocalAccount({
      email: nextEmail,
      trialStartedAt: currentAccount?.trialStartedAt,
    });

    const nextPath = searchParams.get("next");
    router.push(
      nextPath?.startsWith("/") ? nextPath : "/"
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
        Account
      </p>

      <h1 className="mt-4 font-serif text-4xl font-black tracking-[-0.03em]">
        Sign in
      </h1>

      <p className="mt-4 leading-7 text-[#9CB0C5]">
        Saved on this device for now. No password yet — billing and
        full accounts come later.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-[#D7E4F4]">
            Email
          </span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrorMessage("");
            }}
            className="mt-2 w-full rounded-xl border border-[#1769A4]/70 bg-[#051831] px-4 py-3 text-white outline-none focus:border-[#38BDF8]"
            placeholder="you@example.com"
          />
        </label>

        {errorMessage ? (
          <p className="text-sm text-[#FF7A86]">{errorMessage}</p>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-xl bg-[#FF2638] px-4 py-3 font-semibold text-white transition hover:bg-[#FF4151]"
        >
          Continue
        </button>
      </form>

      {existingAccount ? (
        <button
          type="button"
          onClick={() => {
            clearLocalAccount();
            setEmail("");
          }}
          className="mt-6 text-sm font-semibold text-[#9CB0C5] hover:text-white"
        >
          Sign out
        </button>
      ) : (
        <p className="mt-6 text-sm text-[#9CB0C5]">
          Want membership?{" "}
          <Link href="/premium" className="font-semibold text-[#55C8FF]">
            Try Premium
          </Link>
        </p>
      )}
    </div>
  );
}

export default function SignInPage() {
  return (
    <SiteShell>
      <Suspense
        fallback={
          <div className="mx-auto max-w-md px-6 py-16 text-[#9CB0C5]">
            Loading...
          </div>
        }
      >
        <SignInForm />
      </Suspense>
      <Footer />
    </SiteShell>
  );
}

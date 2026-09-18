import Link from "next/link";

import Footer from "@/app/components/Footer";
import SiteShell from "@/app/components/shell/SiteShell";

export default function ContactPage() {
  return (
    <SiteShell>
    <main className="bg-[#020D21] text-white">
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
          Contact
        </p>

        <h1 className="mt-5 font-serif text-4xl font-black tracking-tight sm:text-5xl">
          The Angle Report does not publish a public email yet.
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-300">
          We have not listed a monitored inbox for feedback, press, or
          partnerships. Placeholder addresses from earlier product names
          are not in use and should not be emailed.
        </p>

        <p className="mt-4 text-lg leading-8 text-slate-300">
          Until a real address is published here, there is no email
          channel for The Angle Report. You can keep using Today and
          the 60-second brief in the meantime.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/"
            className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500"
          >
            Return to Today
          </Link>

          <Link
            href="/about"
            className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
          >
            About The Angle Report
          </Link>
        </div>
      </section>
    </main>
    <Footer />
    </SiteShell>
  );
}

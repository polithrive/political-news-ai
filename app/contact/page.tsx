import Link from "next/link";

import Footer from "@/app/components/Footer";
import SiteShell from "@/app/components/shell/SiteShell";

const contactOptions = [
  {
    title: "General feedback",
    description:
      "Share what you like, what feels confusing, or what would make PoliticalPulse more useful.",
    action: "Send feedback",
    href: "mailto:feedback@politicalpulse.ai",
  },
  {
    title: "Report a problem",
    description:
      "Let us know about broken pages, inaccurate output, slow performance, or unexpected behavior.",
    action: "Report an issue",
    href: "mailto:support@politicalpulse.ai",
  },
  {
    title: "Partnerships",
    description:
      "Reach out about education, research, media, civic, or technology partnerships.",
    action: "Discuss a partnership",
    href: "mailto:partnerships@politicalpulse.ai",
  },
  {
    title: "Press and media",
    description:
      "Contact PoliticalPulse for interviews, product information, or media inquiries.",
    action: "Contact press",
    href: "mailto:press@politicalpulse.ai",
  },
];

export default function ContactPage() {
  return (
    <SiteShell>
    <main className="bg-[#020D21] text-white">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
          Contact PoliticalPulse
        </p>

        <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Help us build a better way to understand political news.
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          PoliticalPulse is currently in Alpha. Feedback from early users
          is especially valuable as we improve report quality, speed,
          transparency, and usability.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/"
            className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500"
          >
            Return to PoliticalPulse
          </Link>

          <Link
            href="/about"
            className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
          >
            Learn about our mission
          </Link>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-5 md:grid-cols-2">
            {contactOptions.map((option) => (
              <article
                key={option.title}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6"
              >
                <h2 className="text-xl font-bold text-white">
                  {option.title}
                </h2>

                <p className="mt-3 leading-7 text-slate-300">
                  {option.description}
                </p>

                <a
                  href={option.href}
                  className="mt-5 inline-flex text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
                >
                  {option.action}
                  <span className="ml-2" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
              What to include
            </p>

            <h2 className="mt-4 text-3xl font-bold">
              Help us understand your experience.
            </h2>

            <p className="mt-5 leading-8 text-slate-300">
              When reporting a problem or sharing feedback, include the
              page you were using, the article involved, what you expected
              to happen, and what happened instead. Screenshots are also
              helpful when available.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Suggested details
            </p>

            <ul className="mt-4 space-y-3 text-slate-300">
              <li className="flex gap-3">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400"
                  aria-hidden="true"
                />
                <span>Page or feature you were using</span>
              </li>

              <li className="flex gap-3">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400"
                  aria-hidden="true"
                />
                <span>Article title or topic</span>
              </li>

              <li className="flex gap-3">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400"
                  aria-hidden="true"
                />
                <span>Expected result</span>
              </li>

              <li className="flex gap-3">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400"
                  aria-hidden="true"
                />
                <span>Actual result or error message</span>
              </li>

              <li className="flex gap-3">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400"
                  aria-hidden="true"
                />
                <span>Browser and device, when relevant</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="rounded-2xl border border-amber-900/60 bg-amber-950/20 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
              Alpha notice
            </p>

            <p className="mt-3 max-w-4xl leading-7 text-slate-300">
              The email addresses shown on this page are placeholders
              until PoliticalPulse configures its official domain email.
              Replace them with active addresses before inviting external
              users.
            </p>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    </SiteShell>
  );
}
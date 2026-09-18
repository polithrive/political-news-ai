import Link from "next/link";

import Footer from "@/app/components/Footer";
import SiteShell from "@/app/components/shell/SiteShell";

const sections = [
  {
    title: "1. Information we collect",
    paragraphs: [
      "The Angle Report may collect information you provide directly, such as a pasted article URL, a follow-up question about a brief, or other text you submit through the product.",
      "We also store limited information on your device using the browser’s local storage so a brief you just opened can be restored on that same device. We do not operate user accounts in V1 and we do not run a newsletter signup.",
      "Hosting and request logs may include technical details such as IP address, browser type, pages requested, and approximate timing. Product analytics are collected with Vercel Web Analytics. Page paths are recorded without share-query article addresses. Custom events use a short non-reversible story reference and a surface or outcome label, not article bodies, pasted URLs, or Ask The Angle questions.",
    ],
  },
  {
    title: "2. How we use information",
    paragraphs: [
      "We use information to generate 60-second briefs and related analysis, fetch related reporting, operate and secure the site, and improve reliability.",
      "We do not use personal information to determine or infer a user’s political affiliation.",
    ],
  },
  {
    title: "3. AI-generated content",
    paragraphs: [
      "The Angle Report uses artificial intelligence to generate summaries, evidence-grounded briefs, perspective comparisons, and answers to follow-up questions about a story.",
      "Text you submit to those features, including article URLs and questions, may be processed by third-party AI providers. Do not submit confidential, sensitive, or personally identifying information.",
      "AI-generated content may contain errors, omissions, or outdated information. Read original sources before relying on a brief.",
    ],
  },
  {
    title: "4. Third-party services",
    paragraphs: [
      "The Angle Report relies on third-party providers to operate. Current providers include OpenAI (AI generation), NewsAPI (headline and story metadata), Neon (story snapshot storage used for What Changed), Vercel (hosting), and Vercel Web Analytics (page views and product funnel events).",
      "Those providers may process limited information according to their own privacy policies and our contracts with them.",
      "We do not use a separate error-monitoring vendor. Operational failures are recorded in Vercel runtime logs without article bodies, questions, or secrets.",
    ],
  },
  {
    title: "5. Cookies, local storage, and analytics",
    paragraphs: [
      "V1 does not set advertising cookies and does not use fingerprinting for ads.",
      "The product uses browser local storage on your device, including a selected-article key and a report cache, so a brief can be reopened in that browser. Those keys are implementation details of the client app; renaming them is not part of this public policy.",
      "Vercel Web Analytics loads a first-party analytics script on Vercel-hosted pages. It records page views (with query strings stripped, including the public brief `u` parameter) and named funnel events with at most two custom properties. It is used to understand visits, repeat use at the platform’s standard visitor model, and whether core features work. It is not used to build user accounts.",
    ],
  },
  {
    title: "6. Data retention",
    paragraphs: [
      "Device local storage remains until you clear it in your browser.",
      "Story snapshots stored in our database are retained to compare later reporting on the same story URL. They are not a user account profile.",
      "Server logs are retained only as needed to operate, secure, and debug the service.",
    ],
  },
  {
    title: "7. Data security",
    paragraphs: [
      "The Angle Report uses reasonable administrative and technical safeguards intended to protect information from unauthorized access, alteration, loss, or misuse.",
      "No internet service can guarantee absolute security. Do not submit sensitive information that is not necessary to use the product.",
    ],
  },
  {
    title: "8. Information sharing",
    paragraphs: [
      "The Angle Report does not sell personal information.",
      "Information may be shared with the service providers listed above as needed to host the site, generate analysis, fetch news metadata, store story snapshots, and measure product usage.",
      "Information may also be disclosed when required by law, to protect rights or safety, or in connection with a merger, acquisition, financing, or transfer of business assets.",
    ],
  },
  {
    title: "9. Your choices and rights",
    paragraphs: [
      "Depending on where you live, you may have rights to request access to, correction of, or deletion of certain personal information.",
      "You can clear local storage in your browser at any time.",
      "We have not published a public email address yet. Until one is listed on the Contact page, privacy requests cannot be submitted by email.",
    ],
  },
  {
    title: "10. Children’s privacy",
    paragraphs: [
      "The Angle Report is not intended to knowingly collect personal information from children under 13.",
      "If we learn that information from a child under 13 has been collected without appropriate authorization, we will take reasonable steps to delete it.",
    ],
  },
  {
    title: "11. External links",
    paragraphs: [
      "The Angle Report links to third-party news outlets and other external websites.",
      "We are not responsible for the privacy practices, security, availability, or content of those third-party services.",
    ],
  },
  {
    title: "12. Changes to this policy",
    paragraphs: [
      "We may update this Privacy Policy as The Angle Report evolves.",
      "Material changes will be reflected by updating the effective date shown on this page. Continued use of the service after an update means the revised policy applies.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <SiteShell>
    <main className="bg-[#020D21] text-white">
      <section className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
            Legal
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            This policy explains what information The Angle Report may
            collect, how it may be used, and the choices available to
            readers.
          </p>

          <p className="mt-4 text-sm text-slate-500">
            Effective date: September 2026
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="rounded-2xl border border-amber-900/60 bg-amber-950/20 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
            Early product notice
          </p>

          <p className="mt-3 leading-7 text-slate-300">
            The Angle Report is an early public product. This policy is
            a practical description of current V1 behavior and should be
            reviewed by a qualified attorney before broader commercial
            launch or collection of additional personal information.
          </p>
        </div>

        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <article
              key={section.title}
              className="border-b border-slate-800 pb-10 last:border-b-0"
            >
              <h2 className="text-2xl font-bold text-white">
                {section.title}
              </h2>

              <div className="mt-4 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="leading-8 text-slate-300"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
            Contact
          </p>

          <h2 className="mt-3 text-2xl font-bold text-white">
            Questions or privacy requests
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-300">
            Questions about this Privacy Policy may be started from the
            Contact page. A monitored inbox has not been published yet.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500"
            >
              Contact
            </Link>

            <Link
              href="/"
              className="rounded-lg border border-slate-700 bg-slate-950 px-5 py-3 font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
            >
              Return to homepage
            </Link>
          </div>
        </section>
      </section>
    </main>
    <Footer />
    </SiteShell>
  );
}

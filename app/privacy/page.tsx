import Link from "next/link";

const sections = [
  {
    title: "1. Information we collect",
    paragraphs: [
      "PoliticalPulse may collect information you provide directly, such as feedback, support requests, and contact details submitted through the service.",
      "We may also collect limited technical information automatically, including browser type, device type, pages visited, approximate location derived from network information, referral source, and basic usage events.",
    ],
  },
  {
    title: "2. How we use information",
    paragraphs: [
      "We use information to operate, maintain, secure, and improve PoliticalPulse; generate intelligence reports; respond to questions and support requests; measure performance; identify errors; and understand how people use the product.",
      "We do not use personal information to determine or infer a user’s political affiliation.",
    ],
  },
  {
    title: "3. AI-generated content",
    paragraphs: [
      "PoliticalPulse uses artificial intelligence to generate summaries, analysis, political-perspective comparisons, fact-checking context, and other report content.",
      "Information submitted to AI-powered features may be processed by third-party AI service providers. Users should not submit confidential, sensitive, or personally identifying information through AI Chat or other analysis inputs.",
      "AI-generated content may contain errors, omissions, or outdated information and should be reviewed alongside original reporting and primary sources.",
    ],
  },
  {
    title: "4. Third-party services",
    paragraphs: [
      "PoliticalPulse may rely on third-party providers for news data, artificial intelligence, hosting, analytics, error monitoring, and other technical services.",
      "These providers may process limited information according to their own privacy policies and contractual obligations.",
      "Current or anticipated providers may include OpenAI, NewsAPI, Vercel, analytics providers, and error-monitoring services.",
    ],
  },
  {
    title: "5. Cookies and analytics",
    paragraphs: [
      "PoliticalPulse may use cookies, local storage, and similar technologies to remember preferences, maintain application functionality, measure usage, improve performance, and understand product engagement.",
      "Analytics tools may collect aggregated or pseudonymous information about page views, feature usage, device characteristics, and referral sources.",
    ],
  },
  {
    title: "6. Data retention",
    paragraphs: [
      "We retain information only for as long as reasonably necessary to provide the service, improve the product, meet legal obligations, resolve disputes, and protect the security of PoliticalPulse.",
      "Retention periods may vary depending on the type of information and the reason it was collected.",
    ],
  },
  {
    title: "7. Data security",
    paragraphs: [
      "PoliticalPulse uses reasonable administrative and technical safeguards intended to protect information from unauthorized access, alteration, loss, or misuse.",
      "No internet service can guarantee absolute security, and users should avoid submitting sensitive information that is not necessary to use the platform.",
    ],
  },
  {
    title: "8. Information sharing",
    paragraphs: [
      "PoliticalPulse does not sell personal information.",
      "Information may be shared with service providers that support hosting, AI processing, analytics, security, communications, and application operations.",
      "Information may also be disclosed when required by law, to protect rights or safety, or in connection with a merger, acquisition, financing, or transfer of business assets.",
    ],
  },
  {
    title: "9. Your choices and rights",
    paragraphs: [
      "Depending on where you live, you may have rights to request access to, correction of, or deletion of certain personal information.",
      "You may also be able to limit certain analytics technologies through browser controls or privacy settings.",
      "Requests may be submitted through the PoliticalPulse contact page.",
    ],
  },
  {
    title: "10. Children’s privacy",
    paragraphs: [
      "PoliticalPulse is not intended to knowingly collect personal information from children under 13.",
      "If we learn that information from a child under 13 has been collected without appropriate authorization, we will take reasonable steps to delete it.",
    ],
  },
  {
    title: "11. External links",
    paragraphs: [
      "PoliticalPulse links to third-party news outlets and other external websites.",
      "We are not responsible for the privacy practices, security, availability, or content of those third-party services.",
    ],
  },
  {
    title: "12. Changes to this policy",
    paragraphs: [
      "We may update this Privacy Policy as PoliticalPulse evolves.",
      "Material changes will be reflected by updating the effective date shown on this page. Continued use of the service after an update means the revised policy applies.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
            Legal
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            This policy explains what information PoliticalPulse may
            collect, how it may be used, and the choices available to
            users.
          </p>

          <p className="mt-4 text-sm text-slate-500">
            Effective date: July 2026
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="rounded-2xl border border-amber-900/60 bg-amber-950/20 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
            Alpha notice
          </p>

          <p className="mt-3 leading-7 text-slate-300">
            PoliticalPulse is currently an Alpha product. This policy is
            intended as a practical starting point and should be reviewed
            by a qualified attorney before commercial launch or collection
            of sensitive user information.
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
            Questions about this Privacy Policy or requests involving
            personal information may be submitted through the
            PoliticalPulse contact page.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500"
            >
              Contact PoliticalPulse
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
  );
}
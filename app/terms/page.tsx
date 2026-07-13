import Link from "next/link";

const sections = [
  {
    title: "1. Acceptance of these terms",
    paragraphs: [
      "By accessing or using PoliticalPulse, you agree to these Terms of Service. If you do not agree, do not use the service.",
      "PoliticalPulse is currently offered as an Alpha product and may change, experience interruptions, or include incomplete functionality.",
    ],
  },
  {
    title: "2. Description of the service",
    paragraphs: [
      "PoliticalPulse provides AI-powered political intelligence tools, including news summaries, source comparisons, political perspective analysis, Trust Score™ information, timelines, evidence context, and interactive AI features.",
      "The service is intended to help users understand political reporting and public issues. It is not intended to replace original journalism, primary sources, or professional advice.",
    ],
  },
  {
    title: "3. AI-generated content",
    paragraphs: [
      "PoliticalPulse uses artificial intelligence to generate reports, summaries, perspective comparisons, fact-checking context, and other content.",
      "AI-generated content may be inaccurate, incomplete, outdated, or misleading. PoliticalPulse does not guarantee that any AI-generated statement is correct.",
      "Users should review original sources and independently verify important claims before relying on PoliticalPulse content.",
    ],
  },
  {
    title: "4. No professional advice",
    paragraphs: [
      "PoliticalPulse does not provide legal, financial, medical, voting, investment, campaign, or other professional advice.",
      "You are responsible for obtaining qualified professional guidance before making decisions that may affect your rights, finances, health, safety, employment, or civic participation.",
    ],
  },
  {
    title: "5. User responsibilities",
    paragraphs: [
      "You agree to use PoliticalPulse lawfully and responsibly.",
      "You are responsible for the information you submit, the questions you ask, and how you use the content returned by the service.",
      "Do not submit confidential, sensitive, proprietary, or personally identifying information unless it is necessary and you are authorized to provide it.",
    ],
  },
  {
    title: "6. Acceptable use",
    paragraphs: [
      "You may not use PoliticalPulse to violate any law, infringe intellectual property rights, harass or threaten others, spread malicious software, interfere with platform operations, attempt unauthorized access, or misuse AI-generated content.",
      "You may not use automated systems to scrape, overload, reverse engineer, or disrupt the service without written permission.",
      "PoliticalPulse may suspend or restrict access when misuse, security risks, abuse, or violations of these terms are identified.",
    ],
  },
  {
    title: "7. Intellectual property",
    paragraphs: [
      "PoliticalPulse, its branding, interface, software, documentation, product names, and original platform content are owned by PoliticalPulse or its licensors and are protected by applicable intellectual property laws.",
      "Third-party articles, logos, trademarks, and source materials remain the property of their respective owners.",
      "These terms do not transfer ownership of PoliticalPulse technology or third-party content to users.",
    ],
  },
  {
    title: "8. External content and links",
    paragraphs: [
      "PoliticalPulse may display or link to third-party news articles, websites, and services.",
      "PoliticalPulse does not control and is not responsible for the accuracy, availability, security, legality, or privacy practices of external services.",
      "A link or source reference does not mean PoliticalPulse endorses that organization or its views.",
    ],
  },
  {
    title: "9. Service availability",
    paragraphs: [
      "PoliticalPulse may be modified, suspended, limited, or discontinued at any time.",
      "We do not guarantee uninterrupted access, specific response times, continued availability of any feature, or compatibility with every device or browser.",
      "Maintenance, third-party outages, API limits, security concerns, and technical failures may affect availability.",
    ],
  },
  {
    title: "10. Disclaimers",
    paragraphs: [
      "PoliticalPulse is provided on an “as is” and “as available” basis to the fullest extent permitted by law.",
      "PoliticalPulse makes no warranties regarding accuracy, reliability, neutrality, completeness, availability, fitness for a particular purpose, or freedom from errors.",
      "Trust Score™, Source Intelligence™, Debate™, and similar features are analytical tools and should not be treated as definitive judgments about a source, person, institution, or claim.",
    ],
  },
  {
    title: "11. Limitation of liability",
    paragraphs: [
      "To the fullest extent permitted by law, PoliticalPulse and its owners, employees, contractors, partners, and service providers will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages arising from use of the service.",
      "PoliticalPulse is not responsible for decisions, losses, disputes, misunderstandings, reputational effects, or other consequences resulting from reliance on AI-generated content or third-party reporting.",
    ],
  },
  {
    title: "12. Indemnification",
    paragraphs: [
      "You agree to be responsible for claims, damages, losses, and expenses arising from your misuse of PoliticalPulse, your violation of these terms, or your infringement of another person’s rights.",
    ],
  },
  {
    title: "13. Privacy",
    paragraphs: [
      "Use of PoliticalPulse is also governed by the Privacy Policy.",
      "The Privacy Policy explains how information may be collected, processed, retained, and shared.",
    ],
  },
  {
    title: "14. Changes to the service or terms",
    paragraphs: [
      "PoliticalPulse may update the service and these Terms of Service as the product evolves.",
      "Changes become effective when posted unless otherwise stated. Continued use after changes are posted means you accept the revised terms.",
    ],
  },
  {
    title: "15. Governing law",
    paragraphs: [
      "These terms will be governed by the laws applicable in the jurisdiction where PoliticalPulse operates, without regard to conflict-of-law principles.",
      "This section should be reviewed and updated by qualified legal counsel before commercial launch.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
            Legal
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Terms of Service
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            These terms govern access to and use of PoliticalPulse and
            its AI-powered political intelligence features.
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
            PoliticalPulse is currently an Alpha product. These terms
            are a practical starting point and should be reviewed by a
            qualified attorney before commercial launch.
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
            Questions about these terms
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-300">
            Questions about these Terms of Service may be submitted
            through the PoliticalPulse contact page.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500"
            >
              Contact PoliticalPulse
            </Link>

            <Link
              href="/privacy"
              className="rounded-lg border border-slate-700 bg-slate-950 px-5 py-3 font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
            >
              Review Privacy Policy
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
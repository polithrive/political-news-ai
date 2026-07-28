import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-8 py-14 md:flex-row md:justify-between">
        <div className="max-w-md">
          <h2 className="text-2xl font-bold text-white">
            Political<span className="text-red-500">Pulse</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            AI-powered political intelligence designed to help people understand
            the news—not just consume it.
          </p>

          <p className="mt-6 text-sm text-slate-500">
            Independent • Transparent • Nonpartisan AI Analysis
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 text-sm md:grid-cols-3">
          <div>
            <h3 className="mb-4 font-semibold text-white">
              Platform
            </h3>

            <ul className="space-y-3 text-slate-400">
              <li>
                <Link
                  href="/"
                  className="transition hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/news"
                  className="transition hover:text-white"
                >
                  Live News
                </Link>
              </li>

              <li>
                <Link
                  href="/analysis"
                  className="transition hover:text-white"
                >
                  Intelligence Reports
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">
              Resources
            </h3>

            <ul className="space-y-3 text-slate-400">
              <li>
                <Link
                  href="/about"
                  className="transition hover:text-white"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="transition hover:text-white"
                >
                  Privacy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="transition hover:text-white"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">
              Intelligence
            </h3>

            <ul className="space-y-3 text-slate-400">
              <li>Bias Analysis</li>
              <li>Consensus Engine</li>
              <li>AI Intelligence</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-8 py-6 text-sm text-slate-500 md:flex-row">
          <p>
            © {year} PoliticalPulse. All rights reserved.
          </p>

          <p>
            Built with AI to help people understand politics through evidence,
            context, and multiple perspectives.
          </p>
        </div>
      </div>
    </footer>
  );
}
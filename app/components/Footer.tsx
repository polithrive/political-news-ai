import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#17446D]/65 bg-[#020D21]/88 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-12 px-6 py-14 sm:px-8 lg:flex-row lg:justify-between">
        {/* Brand */}
        <div className="max-w-lg">
          <Link
            href="/"
            className="inline-block"
            aria-label="The Angle Report home"
          >
            <div className="font-serif text-[34px] font-black leading-[0.84] tracking-[-0.05em] text-white">
              <span className="block text-[24px] text-[#38BDF8]">
                the
              </span>

              <span className="block">
                angle
              </span>

              <span className="block">
                report
                <span className="text-[#FF2638]">.</span>
              </span>
            </div>
          </Link>

          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.34em] text-[#55C8FF]">
            From every angle.
          </p>

          <p className="mt-6 max-w-md text-sm leading-7 text-[#9CB0C5]">
            Other sites give you more headlines. This one finishes the
            story from every angle.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              "Independent",
              "Transparent",
              "Multi-perspective",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-[#17446D]/70 bg-[#061A31] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8FB4D3]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3 lg:gap-14">
          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-white">
              Explore
            </h3>

            <ul className="space-y-3 text-[#8EA3B7]">
              <li>
                <Link
                  href="/#today"
                  className="transition hover:text-[#55C8FF]"
                >
                  Today
                </Link>
              </li>

              <li>
                <Link
                  href="/#understand-any-article"
                  className="transition hover:text-[#55C8FF]"
                >
                  Understand Any Article
                </Link>
              </li>

              <li>
                <Link
                  href="/#more-stories"
                  className="transition hover:text-[#55C8FF]"
                >
                  More Stories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-white">
              Company
            </h3>

            <ul className="space-y-3 text-[#8EA3B7]">
              <li>
                <Link
                  href="/about"
                  className="transition hover:text-[#55C8FF]"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition hover:text-[#55C8FF]"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="transition hover:text-[#55C8FF]"
                >
                  Privacy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="transition hover:text-[#55C8FF]"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-white">
              Read
            </h3>

            <ul className="space-y-3 text-[#8EA3B7]">
              <li>60-second brief</li>
              <li>What you're missing</li>
              <li>Related reporting</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#17446D]/55">
        <div className="mx-auto flex w-full max-w-[1500px] flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-[#647B92] sm:px-8 md:flex-row">
          <p>
            © 2026 The Angle Report. All rights reserved.
          </p>

          <p className="text-center md:text-right">
            Evidence. Context. Perspectives. Understanding.
          </p>
        </div>
      </div>
    </footer>
  );
}
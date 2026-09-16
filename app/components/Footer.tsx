import Link from "next/link";

import BrandLogo from "@/app/components/home/BrandLogo";
import MorningBriefSignup from "@/app/components/home/MorningBriefSignup";

const footerLinks = [
  { label: "Today", href: "/#today" },
  { label: "Understand Any Article", href: "/#understand-any-article" },
  { label: "Forecasts", href: "/forecasts" },
  { label: "Polls", href: "/polls" },
  { label: "My Angle", href: "/signin" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

function SocialGlyph({ name }: { name: "x" | "in" | "yt" | "ig" }) {
  if (name === "x") {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
        <path d="M17.6 3.5h2.8l-6.1 7 7.2 9.5h-5.6l-4.4-5.8-5 5.8H3.6l6.5-7.5L3 3.5h5.8l4 5.3 4.8-5.3Zm-1 14.8h1.5L6.5 5.1H4.8l11.8 13.2Z" />
      </svg>
    );
  }

  if (name === "in") {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
        <path d="M6.5 9.2H4V20h2.5V9.2ZM5.2 4C4.4 4 3.8 4.6 3.8 5.4S4.4 6.8 5.2 6.8 6.7 6.2 6.7 5.4 6.1 4 5.2 4ZM20 20h-2.5v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20H11V9.2h2.4v1.5h0c.3-.6 1.2-1.8 3.2-1.8 3.4 0 4 2.2 4 5.1V20Z" />
      </svg>
    );
  }

  if (name === "yt") {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
        <path d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6ZM9.8 15.6V8.8l6.2 3.4-6.2 3.4Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
      <path d="M12 7.2A4.8 4.8 0 1 0 16.8 12 4.8 4.8 0 0 0 12 7.2Zm0 7.9A3.1 3.1 0 1 1 15.1 12 3.1 3.1 0 0 1 12 15.1Zm6.3-8.2a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1ZM21.8 12a9.8 9.8 0 0 1-.2 2.2 5.6 5.6 0 0 1-1.5 3.2 5.6 5.6 0 0 1-3.2 1.5 15.7 15.7 0 0 1-4.4.2 15.7 15.7 0 0 1-4.4-.2 5.6 5.6 0 0 1-3.2-1.5 5.6 5.6 0 0 1-1.5-3.2A9.8 9.8 0 0 1 3.2 12a9.8 9.8 0 0 1 .2-2.2 5.6 5.6 0 0 1 1.5-3.2 5.6 5.6 0 0 1 3.2-1.5 15.7 15.7 0 0 1 4.4-.2 15.7 15.7 0 0 1 4.4.2 5.6 5.6 0 0 1 3.2 1.5 5.6 5.6 0 0 1 1.5 3.2 9.8 9.8 0 0 1 .2 2.2Zm-1.8 0a8 8 0 0 0-.2-1.8 3.8 3.8 0 0 0-1-2.1 3.8 3.8 0 0 0-2.1-1 13.9 13.9 0 0 0-3.7-.2 13.9 13.9 0 0 0-3.7.2 3.8 3.8 0 0 0-2.1 1 3.8 3.8 0 0 0-1 2.1 8 8 0 0 0-.2 1.8 8 8 0 0 0 .2 1.8 3.8 3.8 0 0 0 1 2.1 3.8 3.8 0 0 0 2.1 1 13.9 13.9 0 0 0 3.7.2 13.9 13.9 0 0 0 3.7-.2 3.8 3.8 0 0 0 2.1-1 3.8 3.8 0 0 0 1-2.1 8 8 0 0 0 .2-1.8Z" />
    </svg>
  );
}

const socialLinks: { label: string; name: "x" | "in" | "yt" | "ig" }[] = [
  { label: "X", name: "x" },
  { label: "LinkedIn", name: "in" },
  { label: "YouTube", name: "yt" },
  { label: "Instagram", name: "ig" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#17446D]/40 bg-[#020D21]">
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.8fr_1.3fr_0.7fr] lg:items-center lg:px-7">
        <BrandLogo size="footer" />

        <MorningBriefSignup compact />

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9CB0C5]">
            Follow us
          </p>
          <div className="mt-3 flex gap-3 text-[#D7E4F4]">
            {socialLinks.map((item) => (
              <span
                key={item.label}
                aria-label={item.label}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#05182E]"
              >
                <SocialGlyph name={item.name} />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[#17446D]/30">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 py-5 text-[12px] text-[#647B92] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-7">
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {footerLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition hover:text-[#55C8FF]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p>© 2026 The Angle Report. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

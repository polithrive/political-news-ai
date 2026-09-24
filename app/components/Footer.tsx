import Link from "next/link";

import BrandLogo from "@/app/components/home/BrandLogo";

const footerLinks = [
  { label: "Today", href: "/#today" },
  { label: "Understand Any Article", href: "/#understand-any-article" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#17446D]/40 bg-[#020D21]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-7">
        <BrandLogo size="footer" />

        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-[#647B92]">
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
      </div>

      <div className="border-t border-[#17446D]/30">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-4 text-[12px] text-[#647B92] sm:px-6 lg:px-7">
          <p>© 2026 The Angle Report. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

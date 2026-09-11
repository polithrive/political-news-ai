"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type NavbarProps = {
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
};

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Top Stories", href: "/#top-stories" },
  { label: "Explore", href: "/#intelligence" },
  { label: "Compare", href: "/#compare" },
  { label: "Topics", href: "/#topics" },
  { label: "About", href: "/about" },
];

export default function Navbar({
  searchTerm = "",
  setSearchTerm,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#0E4C7D]/60 bg-[#020D21]/95 shadow-[0_12px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[88px] w-full max-w-[1980px] items-center gap-6 px-4 sm:px-6 lg:px-8 2xl:px-10">

        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="The Angle Report home"
        >
          <div className="relative h-[68px] w-[210px] overflow-hidden">
            <Image
              src="/the-angle-report-navbar.png"
              alt="The Angle Report"
              fill
              priority
              sizes="230px"
              className="object-contain object-left"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden shrink-0 items-center gap-1 xl:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group relative rounded-lg px-4 py-3 text-[15px] font-semibold text-[#D7E4F4] transition duration-200 hover:text-[#38BDF8]"
            >
              {item.label}

              <span className="absolute inset-x-4 bottom-1 h-[2px] scale-x-0 rounded-full bg-[#38BDF8] transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div className="hidden min-w-0 flex-1 lg:block">
          <div className="ml-auto flex max-w-[520px] items-center gap-3 rounded-2xl border border-[#1769A4]/70 bg-[#051831]/80 px-4 py-3 shadow-inner transition duration-200 focus-within:border-[#38BDF8] focus-within:bg-[#071D3A]">

            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-[18px] w-[18px] shrink-0 text-[#38BDF8]"
            >
              <circle
                cx="11"
                cy="11"
                r="6"
                stroke="currentColor"
                strokeWidth="2"
              />

              <path
                d="M16 16L21 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm?.(event.target.value)}
              placeholder="Search any topic, person, or issue..."
              className="min-w-0 flex-1 bg-transparent text-[14px] font-medium text-[#F8FAFC] placeholder:text-[#7890AC] outline-none"
            />
          </div>
        </div>

        {/* Profile */}
        <button
          type="button"
          className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#1769A4]/70 bg-[#082B52] text-[#7DD3FC] transition hover:border-[#38BDF8] hover:bg-[#0B3867] hover:text-white xl:flex"
          aria-label="Account"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
          >
            <circle
              cx="12"
              cy="8"
              r="4"
              fill="currentColor"
            />

            <path
              d="M5 21C5 17.134 8.134 14 12 14C15.866 14 19 17.134 19 21"
              fill="currentColor"
            />
          </svg>
        </button>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((value) => !value)}
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#1769A4]/70 bg-[#051831] text-xl text-[#CBD5E1] transition hover:border-[#38BDF8] hover:bg-[#082B52] hover:text-white xl:hidden"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? "×" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen ? (
        <div className="border-t border-[#0E4C7D]/60 bg-[#020D21]/98 px-4 py-5 backdrop-blur-xl xl:hidden">
          <div className="mx-auto w-full max-w-[1980px]">

            {/* Mobile Search */}
            <div className="mb-4 lg:hidden">
              <div className="flex items-center gap-3 rounded-xl border border-[#1769A4]/70 bg-[#051831] px-4 py-3">

                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 shrink-0 text-[#38BDF8]"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  <path
                    d="M16 16L21 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm?.(event.target.value)
                  }
                  placeholder="Search The Angle Report"
                  className="min-w-0 flex-1 bg-transparent text-base font-medium text-[#F8FAFC] placeholder:text-[#7890AC] outline-none"
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="grid gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-semibold text-[#D7E4F4] transition hover:bg-[#082B52] hover:text-[#38BDF8]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
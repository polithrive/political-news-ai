"use client";

import Link from "next/link";
import { useState } from "react";

type NavigationItem = {
  label: string;
  href: string;
};

const navigationItems: NavigationItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Live Intelligence",
    href: "/#live-news",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <nav
        aria-label="Primary navigation"
        className="mx-auto max-w-7xl px-6 sm:px-8"
      >
        <div className="flex min-h-20 items-center justify-between gap-6">
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex shrink-0 items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            aria-label="PoliticalPulse home"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-lg font-bold text-white shadow-lg shadow-red-950/30 transition group-hover:bg-red-500">
              P
            </div>

            <div>
              <p className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                PoliticalPulse
              </p>

              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                AI Political Intelligence
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/#live-news"
              className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Explore Intelligence

              <span
                aria-hidden="true"
                className="ml-2"
              >
                →
              </span>
            </Link>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsMenuOpen(
                (currentValue) =>
                  !currentValue
              )
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={
              isMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-200 transition hover:border-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 lg:hidden"
          >
            {isMenuOpen ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
              >
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
              >
                <path
                  d="M4 7H20M4 12H20M4 17H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div
            id="mobile-navigation"
            className="border-t border-slate-800 py-4 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 text-base font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Link
              href="/#live-news"
              onClick={closeMenu}
              className="mt-4 flex w-full items-center justify-between rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <span>Explore Intelligence</span>

              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
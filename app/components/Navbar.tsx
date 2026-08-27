"use client";

import Link from "next/link";
import { useState } from "react";

type NavbarProps = {
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
};

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Top Stories", href: "/#top-stories" },
  { label: "Intelligence", href: "/#intelligence" },
  { label: "Topics", href: "/#topics" },
];

export default function Navbar({ searchTerm = "", setSearchTerm }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-20 max-w-[1500px] items-center gap-5 px-5 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="PoliticalPulse home">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
              <path d="M3 12h4l2.2-5 3.2 10 2.4-6H21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-xl font-extrabold tracking-tight text-white">
              Political<span className="text-red-500">Pulse</span>
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Political Intelligence
            </p>
          </div>
        </Link>

        <div className="hidden min-w-0 flex-1 md:block">
          <div className="mx-auto flex max-w-xl items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5">
            <span aria-hidden="true" className="text-slate-500">🔎</span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm?.(event.target.value)}
              placeholder="Search politics, policy, people, or events"
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none"
            />
          </div>
        </div>

        <nav className="hidden items-center gap-1 xl:flex">
          {navigationItems.map((item) => (
            <Link key={item.label} href={item.href} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-900 hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setIsMenuOpen((value) => !value)}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 text-slate-300 xl:hidden"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? "×" : "☰"}
        </button>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-slate-800 bg-slate-900/70 px-5 py-4 xl:hidden">
          <div className="mx-auto max-w-[1500px]">
            <div className="mb-3 md:hidden">
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm?.(event.target.value)}
                placeholder="Search PoliticalPulse"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none"
              />
            </div>
            <div className="grid gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-xl px-4 py-3 font-semibold text-slate-300 hover:bg-slate-900"
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

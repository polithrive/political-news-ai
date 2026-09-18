"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import BrandLogo from "@/app/components/home/BrandLogo";
import { SearchIcon } from "@/app/components/home/HomeIcons";

type PublicationNavProps = {
  searchTerm?: string;
  onSearchTermChange?: (value: string) => void;
};

const centerLinks = [
  { label: "Today", href: "/#today" },
  { label: "U.S.", href: "/?q=United%20States" },
  { label: "World", href: "/?q=world" },
  { label: "Politics", href: "/?q=politics" },
  { label: "Economy", href: "/?q=economy" },
  { label: "Technology", href: "/?q=technology" },
  { label: "Health", href: "/?q=health" },
];

export default function PublicationNav({
  searchTerm,
  onSearchTermChange,
}: PublicationNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [draft, setDraft] = useState(searchTerm ?? "");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  useEffect(() => {
    setDraft(searchTerm ?? "");
  }, [searchTerm]);

  const isHome = pathname === "/" && !searchTerm?.trim();

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextValue = draft.trim();
    onSearchTermChange?.(nextValue);

    if (pathname === "/") {
      router.replace(
        nextValue ? `/?q=${encodeURIComponent(nextValue)}` : "/"
      );
      return;
    }

    router.push(nextValue ? `/?q=${encodeURIComponent(nextValue)}` : "/");
  }

  return (
    <header className="border-b border-[#17446D]/35 bg-[#020D21]/92 backdrop-blur-xl">
      <div className="mx-auto grid h-[76px] w-full max-w-[1440px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6 lg:px-7">
        <BrandLogo />

        <nav className="hidden min-w-0 items-center justify-center gap-0.5 lg:flex">
          {centerLinks.map((item) => {
            const isToday = item.label === "Today" && isHome;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`px-2 py-2 text-[13px] font-semibold xl:px-2.5 ${
                  isToday
                    ? "text-[#55C8FF] shadow-[inset_0_-2px_0_#55C8FF]"
                    : "text-[#D7E4F4] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMoreOpen((open) => !open)}
              className="inline-flex items-center gap-1 px-2 py-2 text-[13px] font-semibold text-[#D7E4F4] hover:text-white"
              suppressHydrationWarning
            >
              More
              <span aria-hidden="true" className="text-[10px]">
                ▾
              </span>
            </button>
            {isMoreOpen ? (
              <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl bg-[#04162C] py-2 shadow-xl">
                <Link
                  href="/#understand-any-article"
                  onClick={() => setIsMoreOpen(false)}
                  className="block px-4 py-2 text-sm text-[#D7E4F4] hover:text-white"
                >
                  Understand any article
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMoreOpen(false)}
                  className="block px-4 py-2 text-sm text-[#D7E4F4] hover:text-white"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMoreOpen(false)}
                  className="block px-4 py-2 text-sm text-[#D7E4F4] hover:text-white"
                >
                  Contact
                </Link>
              </div>
            ) : null}
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <form
            onSubmit={submitSearch}
            className="hidden min-w-[220px] md:block lg:min-w-[260px]"
          >
            <label
              className="flex items-center gap-2 rounded-full bg-[#05182E] px-3.5 py-2"
              suppressHydrationWarning
            >
              <SearchIcon className="h-4 w-4 text-[#55C8FF]" />
              <span className="sr-only">Search stories</span>
              <input
                value={draft}
                onChange={(event) => {
                  const value = event.target.value;
                  setDraft(value);
                  if (pathname === "/") {
                    onSearchTermChange?.(value);
                  }
                }}
                placeholder="Search topics, people, or issues..."
                autoComplete="off"
                suppressHydrationWarning
                className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-[#6F879E]"
              />
            </label>
          </form>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex h-8 w-8 items-center justify-center text-[#D7E4F4] lg:hidden"
            aria-label="Open menu"
            suppressHydrationWarning
          >
            {isMenuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-[#17446D]/40 bg-[#020D21] px-4 py-4 lg:hidden">
          <form onSubmit={submitSearch} className="mb-3 md:hidden">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Search topics, people, or issues..."
              className="w-full rounded-full bg-[#05182E] px-4 py-2.5 text-sm text-white outline-none"
            />
          </form>
          <div className="flex flex-wrap gap-2">
            {centerLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-full bg-[#05182E] px-3 py-2 text-sm font-semibold text-[#D7E4F4]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

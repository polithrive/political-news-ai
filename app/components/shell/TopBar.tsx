"use client";

import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type TopBarProps = {
  searchTerm?: string;
  onSearchTermChange?: (value: string) => void;
  onOpenSidebar: () => void;
};

export default function TopBar({
  searchTerm,
  onSearchTermChange,
  onOpenSidebar,
}: TopBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [draft, setDraft] = useState(searchTerm ?? "");

  useEffect(() => {
    setDraft(searchTerm ?? "");
  }, [searchTerm]);

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

    router.push(
      nextValue ? `/?q=${encodeURIComponent(nextValue)}` : "/"
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#0E4C7D]/60 bg-[#020D21]/78 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-5">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1769A4]/60 bg-[#051831] text-[#CBD5E1] transition hover:border-[#38BDF8] hover:text-white lg:hidden"
          aria-label="Open navigation"
        >
          ☰
        </button>

        <form
          onSubmit={submitSearch}
          className="min-w-0 flex-1"
        >
          <label className="flex items-center gap-3 rounded-xl border border-[#1769A4]/60 bg-[#051831]/80 px-3 py-2.5 focus-within:border-[#38BDF8]">
            <span className="sr-only">Search stories</span>
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
              value={draft}
              onChange={(event) => {
                const value = event.target.value;
                setDraft(value);
                if (pathname === "/") {
                  onSearchTermChange?.(value);
                }
              }}
              placeholder="Search topics, people, or issues"
              className="min-w-0 flex-1 bg-transparent text-sm text-[#F8FAFC] placeholder:text-[#7890AC] outline-none"
            />
          </label>
        </form>

      </div>
    </header>
  );
}

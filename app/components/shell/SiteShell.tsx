"use client";

import { type ReactNode } from "react";

import PublicationNav from "./PublicationNav";

type SiteShellProps = {
  children: ReactNode;
  searchTerm?: string;
  onSearchTermChange?: (value: string) => void;
};

export default function SiteShell({
  children,
  searchTerm,
  onSearchTermChange,
}: SiteShellProps) {
  return (
    <div className="relative min-h-screen bg-[#020D21] text-white">
      <div className="sticky top-0 z-50">
        <PublicationNav
          searchTerm={searchTerm}
          onSearchTermChange={onSearchTermChange}
        />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

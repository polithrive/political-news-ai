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
      <PublicationNav
        searchTerm={searchTerm}
        onSearchTermChange={onSearchTermChange}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

"use client";

import { useState, type ReactNode } from "react";

import CapitolBackground from "./CapitolBackground";
import SidebarNav from "./SidebarNav";
import TopBar from "./TopBar";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="relative min-h-screen bg-transparent text-white">
      <CapitolBackground />
      {isSidebarOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[300px] overflow-hidden border-r border-[#0E4C7D]/50 bg-[#031226] transition-transform duration-200 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarNav
          onNavigate={closeSidebar}
          searchTerm={searchTerm}
        />
      </aside>

      <div className="relative z-10 lg:pl-[300px]">
        <TopBar
          searchTerm={searchTerm}
          onSearchTermChange={onSearchTermChange}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />
        {children}
      </div>
    </div>
  );
}

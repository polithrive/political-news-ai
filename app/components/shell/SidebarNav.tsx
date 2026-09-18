"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import NavIcon from "./NavIcon";
import {
  perspectiveNavItems,
  toolNavItems,
  topicHref,
  topicNavItems,
} from "./navConfig";

type SidebarNavProps = {
  onNavigate?: () => void;
  searchTerm?: string;
};

function navClass(active: boolean) {
  return `relative flex items-center gap-3 rounded-lg px-3 py-[7px] text-[14px] leading-none transition ${
    active
      ? "bg-[#123154] font-semibold text-white"
      : "font-medium text-[#C5D4E8] hover:bg-[#0B2340] hover:text-white"
  }`;
}

export default function SidebarNav({
  onNavigate,
  searchTerm = "",
}: SidebarNavProps) {
  const pathname = usePathname();
  const activeQuery = searchTerm.trim().toLowerCase();
  const isHome =
    pathname === "/" && !activeQuery;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Link
        href="/"
        onClick={onNavigate}
        className="shrink-0 border-b border-[#0E4C7D]/50 px-4 py-3.5"
        aria-label="The Angle Report home"
      >
        <div className="font-serif font-black leading-[0.82] tracking-[-0.05em] text-white">
          <span className="block text-[16px] text-[#38BDF8]">
            the
          </span>
          <span className="block text-[28px]">angle</span>
          <span className="block text-[28px]">
            report
            <span className="text-[#FF2638]">.</span>
          </span>
        </div>
      </Link>

      <nav className="min-h-0 flex-1 overflow-hidden px-2.5 py-2">
        <Link
          href="/"
          onClick={onNavigate}
          className={navClass(isHome)}
        >
          {isHome ? (
            <span className="absolute inset-y-1 left-0 w-[3px] rounded-full bg-[#3B82F6]" />
          ) : null}
          <span className="text-[#8AB4FF]">
            <NavIcon name="home" />
          </span>
          Home
        </Link>

        <ul className="space-y-0">
          {topicNavItems.map((item) => {
            const isActive =
              pathname === "/" &&
              activeQuery === item.query.toLowerCase();

            return (
              <li key={item.query}>
                <Link
                  href={topicHref(item.query)}
                  onClick={onNavigate}
                  className={navClass(isActive)}
                >
                  <span className="text-[#8AB4FF]">
                    <NavIcon name={item.icon} />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {perspectiveNavItems.length > 0 ? (
          <>
        <div className="my-2 h-px bg-[#0E4C7D]/50" />

        <ul className="space-y-0">
          {perspectiveNavItems.map((item) => {
            const isActive = pathname === item.href;
            const iconColor =
              item.accent === "red"
                ? "text-[#FF5A6A]"
                : item.accent === "blue"
                  ? "text-[#5B8CFF]"
                  : "text-[#8AB4FF]";

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={navClass(isActive)}
                >
                  <span className={iconColor}>
                    <NavIcon name={item.icon} />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
          </>
        ) : null}

        {toolNavItems.length > 0 ? (
          <>
        <div className="my-2 h-px bg-[#0E4C7D]/50" />

        <ul className="space-y-0">
          {toolNavItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={navClass(isActive)}
                >
                  <span className="text-[#8AB4FF]">
                    <NavIcon name={item.icon} />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
          </>
        ) : null}
      </nav>
    </div>
  );
}

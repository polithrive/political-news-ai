import type { IconName } from "./NavIcon";

export type TopicNavItem = {
  label: string;
  query: string;
  icon: IconName;
};

export type LinkNavItem = {
  label: string;
  href: string;
  icon: IconName;
  accent?: "red" | "blue";
};

export const topicNavItems: TopicNavItem[] = [
  { label: "World Politics", query: "world", icon: "globe" },
  { label: "U.S. Politics", query: "United States", icon: "flag" },
  { label: "Congress", query: "Congress", icon: "landmark" },
  { label: "Elections", query: "election", icon: "vote" },
  { label: "Economy", query: "economy", icon: "chart" },
  { label: "Foreign Affairs", query: "foreign", icon: "globe2" },
  { label: "Supreme Court", query: "Supreme Court", icon: "court" },
  { label: "Policy", query: "policy", icon: "shield" },
];

export const perspectiveNavItems: LinkNavItem[] = [
  {
    label: "Republican Perspective",
    href: "/perspectives/republican",
    icon: "republican",
    accent: "red",
  },
  {
    label: "Democratic Perspective",
    href: "/perspectives/democratic",
    icon: "democratic",
    accent: "blue",
  },
  {
    label: "Side-by-Side Coverage",
    href: "/coverage",
    icon: "scales",
  },
];

export const toolNavItems: LinkNavItem[] = [
  { label: "Saved", href: "/saved", icon: "bookmark" },
  { label: "Watchlist", href: "/watchlist", icon: "heart" },
  { label: "Alerts", href: "/alerts", icon: "bell" },
  { label: "AI Research (Beta)", href: "/research", icon: "spark" },
  { label: "Timeline Tracker", href: "/timeline", icon: "clock" },
];

export function topicHref(query: string) {
  return `/?q=${encodeURIComponent(query)}`;
}

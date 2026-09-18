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

export const perspectiveNavItems: LinkNavItem[] = [];

export const toolNavItems: LinkNavItem[] = [];

export function topicHref(query: string) {
  return `/?q=${encodeURIComponent(query)}`;
}

export type IconName =
  | "home"
  | "globe"
  | "flag"
  | "landmark"
  | "vote"
  | "chart"
  | "globe2"
  | "court"
  | "shield"
  | "republican"
  | "democratic"
  | "scales"
  | "bookmark"
  | "heart"
  | "bell"
  | "spark"
  | "clock";

const paths: Record<IconName, string> = {
  home: "M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4V10.5z",
  globe:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3.6 9h16.8M3.6 15h16.8M12 3c3 3.4 3 14.6 0 18M12 3c-3 3.4-3 14.6 0 18",
  flag: "M5 21V4m0 0h11l-2 4 2 4H5",
  landmark:
    "M4 20h16M6 20V10m4 10V10m4 10V10m4 10V10M3 10h18M12 4 3 10h18L12 4z",
  vote: "M9 11l3 3 8-9M7 21h10a2 2 0 0 0 2-2v-7H5v7a2 2 0 0 0 2 2z",
  chart:
    "M4 19h16M7 16v-5m5 5V8m5 8v-9",
  globe2:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M2 12h20",
  court:
    "M4 20h16M5 10h14M12 4 4 10h16L12 4z M8 10v10m8-10v10",
  shield: "M12 3 5 6v6c0 4.2 3 7.4 7 8.5 4-1.1 7-4.3 7-8.5V6l-7-3z",
  republican: "M7 8h10v3H7zM9 11v6m6-6v6M8 17h8M12 5v3",
  democratic: "M8 20V10c0-3 2-5 4-5s4 2 4 5v10M6 20h12",
  scales:
    "M12 3v18M5 7h14M5 7l-3 6h6L5 7zm14 0 3 6h-6l3-6zM4 21h16",
  bookmark: "M7 4h10v16l-5-3-5 3V4z",
  heart:
    "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10z",
  bell: "M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9zM10 21h4",
  spark:
    "M12 3v4M12 17v4M5 12H3m18 0h-2M6.2 6.2 8.5 8.5m7 7 2.3 2.3M17.8 6.2 15.5 8.5m-7 7-2.3 2.3M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  clock:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2",
};

export default function NavIcon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className ?? "h-4 w-4 shrink-0"}
    >
      <path
        d={paths[name]}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

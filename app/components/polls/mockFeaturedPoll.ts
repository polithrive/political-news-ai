export type PollOption = {
  id: string;
  label: string;
  votes: number;
};

export type Poll = {
  id: string;
  question: string;
  category?: string;
  totalVotes?: number;
  options: PollOption[];
  relatedStoryTitle?: string;
  relatedStoryImage?: string;
  arguments?: { label: string; text: string }[];
  updatedAt?: string;
};

/*
 * TEMPORARY MOCK DATA — frontend-only for homepage presentation.
 * Replace with API-backed poll data later. Do not use these numbers
 * as scientific public-opinion polling.
 */
export const MOCK_FEATURED_POLL: Poll = {
  id: "mock-homepage-featured-poll",
  question:
    "Should Congress require congressional approval before the U.S. launches extended military action abroad?",
  category: "U.S. Politics",
  totalVotes: 4382,
  relatedStoryImage: "/polithrive-capitol-bg.png",
  updatedAt: "Live",
  arguments: [
    {
      label: "Yes",
      text: "This is an important check on executive power.",
    },
    {
      label: "No",
      text: "Speed can matter when a threat is already underway.",
    },
  ],
  options: [
    { id: "yes", label: "Yes", votes: 2542 },
    { id: "no", label: "No", votes: 1358 },
    { id: "unsure", label: "Unsure", votes: 482 },
  ],
};

export const MOCK_POLLS: Poll[] = [
  MOCK_FEATURED_POLL,
  {
    id: "mock-poll-shutdown",
    question:
      "Should Congress pass a clean continuing resolution to avoid a government shutdown?",
    category: "Congress",
    relatedStoryImage: "/polithrive-capitol-bg.png",
    arguments: [
      {
        label: "Yes",
        text: "A shutdown disrupts services and uses the budget as a hostage.",
      },
      {
        label: "No",
        text: "A deadline is sometimes the only leverage for spending limits.",
      },
    ],
    options: [
      { id: "yes", label: "Yes", votes: 1984 },
      { id: "no", label: "No", votes: 1461 },
      { id: "unsure", label: "Unsure", votes: 312 },
    ],
  },
  {
    id: "mock-poll-fed",
    question:
      "Should the Federal Reserve cut interest rates before the end of this year?",
    category: "Economy",
    arguments: [
      {
        label: "Yes",
        text: "Cooling inflation and a weaker job market argue for cheaper credit.",
      },
      {
        label: "No",
        text: "Cutting too soon could restart price pressure.",
      },
    ],
    options: [
      { id: "yes", label: "Yes", votes: 2210 },
      { id: "no", label: "No", votes: 1744 },
      { id: "unsure", label: "Unsure", votes: 401 },
    ],
  },
  {
    id: "mock-poll-college",
    question: "Should the federal government expand relief for student loan borrowers?",
    category: "Education",
    arguments: [
      {
        label: "Yes",
        text: "High balances are delaying homeownership and family decisions.",
      },
      {
        label: "No",
        text: "Broad relief shifts costs onto people who did not take the loans.",
      },
    ],
    options: [
      { id: "yes", label: "Yes", votes: 2675 },
      { id: "no", label: "No", votes: 1888 },
      { id: "unsure", label: "Unsure", votes: 290 },
    ],
  },
  {
    id: "mock-poll-ai",
    question:
      "Should Congress pass new rules for advanced AI models before they are widely deployed?",
    category: "Technology",
    arguments: [
      {
        label: "Yes",
        text: "Safety testing and disclosure should come before scale.",
      },
      {
        label: "No",
        text: "Heavy rules could lock in incumbents and slow useful tools.",
      },
    ],
    options: [
      { id: "yes", label: "Yes", votes: 2418 },
      { id: "no", label: "No", votes: 1290 },
      { id: "unsure", label: "Unsure", votes: 522 },
    ],
  },
  {
    id: "mock-poll-mail-ballots",
    question:
      "Should states keep no-excuse mail-in voting as a permanent option after 2026?",
    category: "Elections",
    arguments: [
      {
        label: "Yes",
        text: "Mail ballots make it easier for working voters and people with disabilities.",
      },
      {
        label: "No",
        text: "Some readers want tighter ID and chain-of-custody rules first.",
      },
    ],
    options: [
      { id: "yes", label: "Yes", votes: 2559 },
      { id: "no", label: "No", votes: 2011 },
      { id: "unsure", label: "Unsure", votes: 368 },
    ],
  },
];

export function pollVoteStorageKey(pollId: string) {
  if (pollId === MOCK_FEATURED_POLL.id) {
    return "angle-report-featured-poll-vote";
  }

  return `angle-report-poll-vote:${pollId}`;
}

export const POLL_BAR_COLORS: Record<string, string> = {
  yes: "bg-[#38BDF8]",
  no: "bg-[#FF2638]",
  unsure: "bg-[#7A93AA]",
};

export function pollPercents(poll: Poll) {
  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );

  return {
    totalVotes,
    options: poll.options.map((option) => ({
      ...option,
      percent:
        totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0,
    })),
  };
}

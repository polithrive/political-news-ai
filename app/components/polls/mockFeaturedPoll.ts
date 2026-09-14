export type PollOption = {
  id: string;
  label: string;
  votes: number;
};

export type Poll = {
  id: string;
  question: string;
  category?: string;
  totalVotes: number;
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

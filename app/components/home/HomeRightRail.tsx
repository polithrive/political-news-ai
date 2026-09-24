import type { Article } from "@/app/types/article";

import HomeRailForecast from "./HomeRailForecast";
import HomeRailPoll from "./HomeRailPoll";
import TrendingStoriesCard from "./TrendingStoriesCard";

type HomeRightRailProps = {
  articles?: Article[];
  isLoading?: boolean;
};

export default function HomeRightRail({
  articles = [],
  isLoading = false,
}: HomeRightRailProps) {
  return (
    <aside className="flex h-full flex-col gap-4">
      <TrendingStoriesCard articles={articles} isLoading={isLoading} />
      <HomeRailPoll />
      <HomeRailForecast />
    </aside>
  );
}

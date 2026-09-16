import type { Article } from "@/app/types/article";

import FeaturedForecastCard from "@/app/components/forecasts/FeaturedForecastCard";
import TopPollCard from "@/app/components/polls/TopPollCard";

import DiscoverNewsLensCard from "./DiscoverNewsLensCard";
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
    <aside className="flex flex-col gap-4">
      <TrendingStoriesCard articles={articles} isLoading={isLoading} />
      <TopPollCard />
      <FeaturedForecastCard />
      <DiscoverNewsLensCard />
    </aside>
  );
}

import type { Article } from "@/app/types/article";

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
    </aside>
  );
}

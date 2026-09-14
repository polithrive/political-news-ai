import FeaturedForecastCard from "@/app/components/forecasts/FeaturedForecastCard";
import ReadingMixCard from "@/app/components/personalization/ReadingMixCard";
import TopPollCard from "@/app/components/polls/TopPollCard";

export default function HomeRightRail() {
  return (
    <aside className="flex flex-col gap-4">
      <TopPollCard />
      <FeaturedForecastCard />
      <ReadingMixCard />
    </aside>
  );
}

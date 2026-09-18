import type { Metadata } from "next";

import UnderstandAnyArticle from "@/app/components/home/UnderstandAnyArticle";
import ShellInfoPage from "@/app/components/shell/ShellInfoPage";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ResearchPage() {
  return (
    <ShellInfoPage
      kicker="AI Research"
      title="Understand any article"
      description="Paste a URL. We'll look at the piece you submitted alongside related reporting so you can see what it says, what others add, and what remains uncertain."
      primaryHref="/"
      primaryLabel="Back to Home"
    >
      <div className="mt-8">
        <UnderstandAnyArticle />
      </div>
    </ShellInfoPage>
  );
}

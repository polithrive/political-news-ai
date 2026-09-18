import type { Metadata } from "next";

import UnderstandAnyArticle from "@/app/components/home/UnderstandAnyArticle";
import ShellInfoPage from "@/app/components/shell/ShellInfoPage";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CoveragePage() {
  return (
    <ShellInfoPage
      kicker="Coverage"
      title="Side-by-side coverage"
      description="Paste any article to see what that piece says, what other reporting adds, and where coverage disagrees. The comparison lives in the brief — not a bias scoreboard."
      primaryHref="/#understand-any-article"
      primaryLabel="Or browse Today"
    >
      <div className="mt-8">
        <UnderstandAnyArticle />
      </div>
    </ShellInfoPage>
  );
}

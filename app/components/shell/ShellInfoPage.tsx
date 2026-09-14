import Link from "next/link";
import type { ReactNode } from "react";

import Footer from "@/app/components/Footer";
import SiteShell from "@/app/components/shell/SiteShell";

type ShellInfoPageProps = {
  kicker: string;
  title: string;
  description: string;
  children?: ReactNode;
  primaryHref?: string;
  primaryLabel?: string;
};

export default function ShellInfoPage({
  kicker,
  title,
  description,
  children,
  primaryHref = "/",
  primaryLabel = "Back to Home",
}: ShellInfoPageProps) {
  return (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
          {kicker}
        </p>
        <h1 className="mt-4 font-serif text-4xl font-black tracking-[-0.03em]">
          {title}
        </h1>
        <p className="mt-5 leading-8 text-[#9CB0C5]">
          {description}
        </p>
        {children}
        <Link
          href={primaryHref}
          className="mt-10 inline-flex rounded-xl bg-[#FF2638] px-5 py-3 font-semibold text-white transition hover:bg-[#FF4151]"
        >
          {primaryLabel}
        </Link>
      </div>
      <Footer />
    </SiteShell>
  );
}

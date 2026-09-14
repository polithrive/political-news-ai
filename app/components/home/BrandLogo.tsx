import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  size?: "nav" | "footer";
};

export default function BrandLogo({
  href = "/",
  size = "nav",
}: BrandLogoProps) {
  const isFooter = size === "footer";

  return (
    <Link href={href} aria-label="The Angle Report home" className="shrink-0">
      <span
        className={`block font-serif font-black leading-[0.82] tracking-[-0.05em] text-white ${
          isFooter ? "text-[28px]" : "text-[20px]"
        }`}
      >
        <span className={`block text-[#38BDF8] ${isFooter ? "text-[12px]" : "text-[11px]"}`}>
          the
        </span>
        angle report
        <span className="text-[#FF2638]">.</span>
      </span>
      <span
        className={`mt-1 block font-sans font-semibold uppercase tracking-[0.16em] text-[#55C8FF] ${
          isFooter ? "text-[9px]" : "text-[8px]"
        }`}
      >
        Ideas from every side.
      </span>
    </Link>
  );
}

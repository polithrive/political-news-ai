"use client";

import { useState } from "react";
import Image from "next/image";

type StoryImageProps = {
  src?: string | null;
  sizes: string;
  priority?: boolean;
  className?: string;
  category?: string;
  sourceCount?: number;
};

function BrandFallback({
  category,
  sourceCount,
}: {
  category?: string;
  sourceCount?: number;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(155deg,#04162C_0%,#073056_46%,#020D21_100%)]">
      <svg
        viewBox="0 0 160 100"
        className="absolute inset-0 h-full w-full opacity-[0.34]"
        aria-hidden="true"
      >
        <path
          d="M18 78 L62 22 L78 22 L34 78 Z"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="1.6"
        />
        <path
          d="M48 78 L92 22 L108 22 L64 78 Z"
          fill="none"
          stroke="#67E8F9"
          strokeWidth="1.4"
          opacity="0.85"
        />
        <path
          d="M78 78 L122 22 L138 22 L94 78 Z"
          fill="none"
          stroke="#7DD3FC"
          strokeWidth="1.2"
          opacity="0.7"
        />
      </svg>
      <div className="relative flex h-full flex-col justify-between px-3 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7DD3FC]">
          {category || "The Angle Report"}
        </p>
        <div>
          <p className="font-serif text-[13px] font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-sm">
            THE
            <br />
            ANGLE
            <br />
            REPORT
            <span className="text-[#FF2638]">.</span>
          </p>
          {typeof sourceCount === "number" && sourceCount > 1 ? (
            <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9CB0C5]">
              {sourceCount} sources
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function StoryImage({
  src,
  sizes,
  priority = false,
  className = "object-cover object-center",
  category,
  sourceCount,
}: StoryImageProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasUsableImage = Boolean(src) && !imageFailed;

  if (!hasUsableImage) {
    return <BrandFallback category={category} sourceCount={sourceCount} />;
  }

  return (
    <Image
      src={src as string}
      alt=""
      fill
      priority={priority}
      unoptimized
      sizes={sizes}
      className={className}
      onError={() => setImageFailed(true)}
    />
  );
}

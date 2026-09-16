"use client";

import { useState } from "react";
import Image from "next/image";

type StoryImageProps = {
  src?: string | null;
  sizes: string;
  priority?: boolean;
  className?: string;
  category?: string;
};

function BrandFallback({ category }: { category?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between bg-[linear-gradient(160deg,#04162C_0%,#062444_52%,#020D21_100%)] px-3 py-3">
      <span className="h-px w-8 bg-[#38BDF8]/70" />
      <div>
        {category ? (
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7DD3FC]">
            {category}
          </p>
        ) : null}
        <p className="mt-1 font-serif text-sm font-black tracking-[-0.04em] text-white">
          the angle report
          <span className="text-[#FF2638]">.</span>
        </p>
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
}: StoryImageProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasUsableImage = Boolean(src) && !imageFailed;

  if (!hasUsableImage) {
    return <BrandFallback category={category} />;
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
